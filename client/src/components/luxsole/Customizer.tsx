/**
 * Material Customizer Modal
 * 
 * Live material and color customization with smooth transitions
 */

import { useEffect, useRef } from "react";
import { useLuxSole, type MaterialType } from "@/lib/stores/useLuxSole";
import { X, Check } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import ShoeModel from "@/models/ShoeModel";
import gsap from "gsap";

const MATERIALS: { type: MaterialType; label: string; description: string }[] = [
  { type: "leather", label: "Premium Leather", description: "Classic luxury finish" },
  { type: "nubuck", label: "Soft Nubuck", description: "Velvety texture" },
  { type: "glint", label: "Metallic Glint", description: "Reflective elegance" },
  { type: "knit", label: "Technical Knit", description: "Modern performance" },
];

const COLOR_PRESETS = [
  { name: "Emerald", base: "#1FA07A", accent: "#E1B75A" },
  { name: "Forest", base: "#0F3F2B", accent: "#1FA07A" },
  { name: "Gold", base: "#E1B75A", accent: "#072A1E" },
  { name: "Midnight", base: "#072A1E", accent: "#E1B75A" },
  { name: "Pure", base: "#FFFFFF", accent: "#1FA07A" },
  { name: "Shadow", base: "#1a1a1a", accent: "#E1B75A" },
];

export default function Customizer() {
  const {
    isCustomizerOpen,
    setCustomizerOpen,
    customMaterial,
    setCustomMaterial,
    customBaseColor,
    setCustomBaseColor,
    customAccentColor,
    setCustomAccentColor,
    selectedShoe,
    addToCart,
    useAdvancedShaders,
  } = useLuxSole();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isCustomizerOpen && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }
  }, [isCustomizerOpen]);
  
  const handleClose = () => {
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => setCustomizerOpen(false),
      });
    }
  };
  
  const handleAddToCart = () => {
    if (selectedShoe) {
      const customShoe = {
        ...selectedShoe,
        baseColor: customBaseColor,
        accentColor: customAccentColor,
        material: customMaterial,
      };
      addToCart(customShoe);
      
      // Success animation
      gsap.to(contentRef.current, {
        scale: 1.05,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
      
      setTimeout(handleClose, 600);
    }
  };
  
  if (!isCustomizerOpen || !selectedShoe) return null;
  
  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === modalRef.current) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-title"
    >
      <div
        ref={contentRef}
        className="w-full max-w-6xl bg-luxsole-forest rounded-2xl overflow-hidden shadow-2xl border border-luxsole-emerald/30"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-luxsole-emerald/20">
          <div>
            <h2 id="customizer-title" className="text-2xl font-bold text-luxsole-gradient">
              Customize Finish
            </h2>
            <p className="text-gray-400 text-sm mt-1">{selectedShoe.name}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-luxsole-emerald/20 rounded-lg transition-colors"
            aria-label="Close customizer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* 3D Preview */}
          <div className="h-[400px] lg:h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-luxsole-dark-green to-luxsole-neutral">
            <Canvas shadows dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} angle={0.3} intensity={2} castShadow />
              <spotLight position={[-5, 3, -3]} angle={0.4} intensity={1} color="#1FA07A" />
              
              <Environment preset="studio" />
              
              <ShoeModel
                baseColor={customBaseColor}
                accentColor={customAccentColor}
                material={customMaterial}
                shoeType={selectedShoe?.shoeType || "low-top"}
                scale={2.5}
                useAdvancedShaders={useAdvancedShaders}
              />
              
              <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} />
            </Canvas>
          </div>
          
          {/* Controls */}
          <div className="space-y-6">
            {/* Material Selection */}
            <div>
              <label className="block text-sm font-medium text-luxsole-emerald mb-3">
                Material Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.type}
                    onClick={() => setCustomMaterial(mat.type)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      customMaterial === mat.type
                        ? "border-luxsole-gold bg-luxsole-gold/10"
                        : "border-luxsole-forest hover:border-luxsole-emerald/50 bg-luxsole-neutral"
                    }`}
                    aria-pressed={customMaterial === mat.type}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-white text-sm">{mat.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{mat.description}</div>
                      </div>
                      {customMaterial === mat.type && (
                        <Check className="w-5 h-5 text-luxsole-gold flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-luxsole-emerald mb-3">
                Color Preset
              </label>
              <div className="grid grid-cols-3 gap-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setCustomBaseColor(preset.base);
                      setCustomAccentColor(preset.accent);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                      customBaseColor === preset.base && customAccentColor === preset.accent
                        ? "border-luxsole-gold"
                        : "border-transparent hover:border-luxsole-emerald/50"
                    }`}
                    aria-label={`${preset.name} color preset`}
                  >
                    <div className="flex gap-2 mb-2">
                      <div
                        className="w-full h-8 rounded"
                        style={{ backgroundColor: preset.base }}
                      />
                      <div
                        className="w-full h-8 rounded"
                        style={{ backgroundColor: preset.accent }}
                      />
                    </div>
                    <div className="text-xs text-center text-gray-300">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="base-color" className="block text-sm font-medium text-gray-300 mb-2">
                  Base Color
                </label>
                <input
                  id="base-color"
                  type="color"
                  value={customBaseColor}
                  onChange={(e) => setCustomBaseColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer border-2 border-luxsole-forest hover:border-luxsole-emerald/50 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="accent-color" className="block text-sm font-medium text-gray-300 mb-2">
                  Accent Color
                </label>
                <input
                  id="accent-color"
                  type="color"
                  value={customAccentColor}
                  onChange={(e) => setCustomAccentColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer border-2 border-luxsole-forest hover:border-luxsole-emerald/50 transition-colors"
                />
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-luxsole-gold hover:bg-luxsole-emerald text-luxsole-forest font-bold rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-gold-pulse"
            >
              Add to Collection — ${selectedShoe.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
