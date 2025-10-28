/**
 * Customization Studio Component
 * 
 * Advanced customization interface featuring:
 * - Real-time material and color preview
 * - Pattern and texture overlays
 * - Personalization options (monogramming, custom logos)
 * - Save/load custom designs
 * - 3D preview with multiple angles
 */

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import ShoeModel from "@/models/ShoeModel";
import { useLuxSole } from "@/lib/stores/useLuxSole";

interface CustomizationStudioProps {
  className?: string;
}

/**
 * Real-time Customization Preview
 */
function CustomizationPreview({ 
  baseColor, 
  accentColor, 
  material, 
  pattern, 
  monogram 
}: {
  baseColor: string;
  accentColor: string;
  material: string;
  pattern: string;
  monogram: string;
}) {
  const shoeRef = useRef<THREE.Group>(null);
  const [cameraAngle, setCameraAngle] = useState(0);

  useFrame((state) => {
    if (shoeRef.current) {
      const time = state.clock.elapsedTime;
      
      // Smooth rotation for preview
      shoeRef.current.rotation.y = time * 0.1 + cameraAngle;
      
      // Subtle floating
      shoeRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <div className="w-full h-96 bg-luxsole-dark-green rounded-lg overflow-hidden relative">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        
        {/* Enhanced Lighting for Customization */}
        <ambientLight intensity={0.6} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={0.5}
          intensity={3}
          castShadow
          color="#ffffff"
        />
        <spotLight
          position={[-5, 3, -5]}
          angle={0.4}
          penumbra={0.6}
          intensity={2}
          color="#1FA07A"
        />
        <spotLight
          position={[0, 8, 0]}
          angle={0.5}
          penumbra={0.8}
          intensity={1.5}
          color="#E1B75A"
        />
        
        {/* Environment */}
        <Environment preset="studio" background={false} blur={0.8} />
        
        {/* Customized Shoe Model */}
        <Suspense fallback={null}>
          <ShoeModel
            ref={shoeRef}
            baseColor={baseColor}
            accentColor={accentColor}
            material={material}
            shoeType="low-top"
            scale={2.5}
            useAdvancedShaders={true}
          />
        </Suspense>
        
        {/* Shadows */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
          color="#072A1E"
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
        />
        
        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Camera Angle Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, index) => (
          <button
            key={index}
            onClick={() => setCameraAngle(angle)}
            className="w-8 h-8 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg text-luxsole-emerald text-sm hover:bg-luxsole-emerald/30 transition-colors flex items-center justify-center"
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Color Picker Component
 */
function ColorPicker({ 
  label, 
  color, 
  onChange 
}: { 
  label: string; 
  color: string; 
  onChange: (color: string) => void; 
}) {
  const colors = [
    '#0B1220', '#1FA07A', '#E1B75A', '#072A1E',
    '#2D1B69', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-luxsole-emerald">{label}</label>
      <div className="grid grid-cols-6 gap-2">
        {colors.map((colorOption) => (
          <button
            key={colorOption}
            onClick={() => onChange(colorOption)}
            className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
              color === colorOption
                ? 'border-luxsole-gold scale-110'
                : 'border-gray-600 hover:border-luxsole-emerald'
            }`}
            style={{ backgroundColor: colorOption }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
        />
        <span className="text-xs text-gray-400">Custom</span>
      </div>
    </div>
  );
}

/**
 * Material Selector Component
 */
function MaterialSelector({ 
  material, 
  onChange 
}: { 
  material: string; 
  onChange: (material: string) => void; 
}) {
  const materials = [
    { id: 'leather', name: 'Leather', icon: '🐄', description: 'Premium Italian leather' },
    { id: 'nubuck', name: 'Nubuck', icon: '🦌', description: 'Soft suede-like texture' },
    { id: 'glint', name: 'Metallic', icon: '✨', description: 'Shimmering metallic finish' },
    { id: 'knit', name: 'Knit', icon: '🧶', description: 'Technical performance fabric' }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-luxsole-emerald">Material</label>
      <div className="grid grid-cols-2 gap-3">
        {materials.map((mat) => (
          <button
            key={mat.id}
            onClick={() => onChange(mat.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
              material === mat.id
                ? 'border-luxsole-emerald bg-luxsole-emerald/20'
                : 'border-gray-600 hover:border-luxsole-emerald/50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{mat.icon}</span>
              <span className="font-medium text-white">{mat.name}</span>
            </div>
            <p className="text-xs text-gray-400">{mat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Pattern Selector Component
 */
function PatternSelector({ 
  pattern, 
  onChange 
}: { 
  pattern: string; 
  onChange: (pattern: string) => void; 
}) {
  const patterns = [
    { id: 'none', name: 'Solid', preview: '⬜' },
    { id: 'stripes', name: 'Stripes', preview: '〰️' },
    { id: 'dots', name: 'Dots', preview: '⚫' },
    { id: 'geometric', name: 'Geometric', preview: '🔷' },
    { id: 'floral', name: 'Floral', preview: '🌸' },
    { id: 'abstract', name: 'Abstract', preview: '🎨' }
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-luxsole-emerald">Pattern</label>
      <div className="grid grid-cols-3 gap-2">
        {patterns.map((pat) => (
          <button
            key={pat.id}
            onClick={() => onChange(pat.id)}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-center ${
              pattern === pat.id
                ? 'border-luxsole-emerald bg-luxsole-emerald/20'
                : 'border-gray-600 hover:border-luxsole-emerald/50'
            }`}
          >
            <div className="text-2xl mb-1">{pat.preview}</div>
            <div className="text-xs text-gray-300">{pat.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Monogramming Component
 */
function Monogramming({ 
  monogram, 
  onChange 
}: { 
  monogram: string; 
  onChange: (monogram: string) => void; 
}) {
  const fonts = ['serif', 'sans-serif', 'script', 'monospace'];
  const [selectedFont, setSelectedFont] = useState('serif');

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-luxsole-emerald">Personalization</label>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Monogram (max 3 characters)</label>
          <input
            type="text"
            value={monogram}
            onChange={(e) => onChange(e.target.value.slice(0, 3).toUpperCase())}
            placeholder="ABC"
            className="w-full px-3 py-2 bg-luxsole-dark-green border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-luxsole-emerald focus:outline-none"
            style={{ fontFamily: selectedFont }}
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Font Style</label>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((font) => (
              <button
                key={font}
                onClick={() => setSelectedFont(font)}
                className={`p-2 rounded border text-xs transition-all duration-200 ${
                  selectedFont === font
                    ? 'border-luxsole-emerald bg-luxsole-emerald/20 text-luxsole-emerald'
                    : 'border-gray-600 text-gray-300 hover:border-luxsole-emerald/50'
                }`}
                style={{ fontFamily: font }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Save/Load Designs Component
 */
function DesignManager({ 
  onSave, 
  onLoad, 
  designs 
}: { 
  onSave: () => void; 
  onLoad: (design: any) => void; 
  designs: any[]; 
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-luxsole-emerald">Designs</label>
      
      <div className="space-y-2">
        <button
          onClick={onSave}
          className="w-full py-2 px-4 bg-luxsole-emerald text-white rounded-lg hover:bg-luxsole-emerald/80 transition-colors duration-200"
        >
          Save Current Design
        </button>
        
        {designs.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Load Saved Design</label>
            {designs.map((design, index) => (
              <button
                key={index}
                onClick={() => onLoad(design)}
                className="w-full py-2 px-3 bg-luxsole-dark-green border border-gray-600 rounded-lg text-left hover:border-luxsole-emerald transition-colors duration-200"
              >
                <div className="text-sm text-white">{design.name}</div>
                <div className="text-xs text-gray-400">{design.date}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Main Customization Studio Component
 */
export default function CustomizationStudio({ className }: CustomizationStudioProps) {
  const [baseColor, setBaseColor] = useState('#0B1220');
  const [accentColor, setAccentColor] = useState('#1FA07A');
  const [material, setMaterial] = useState('leather');
  const [pattern, setPattern] = useState('none');
  const [monogram, setMonogram] = useState('');
  const [savedDesigns, setSavedDesigns] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  const handleSaveDesign = () => {
    const newDesign = {
      name: `Design ${savedDesigns.length + 1}`,
      date: new Date().toLocaleDateString(),
      baseColor,
      accentColor,
      material,
      pattern,
      monogram
    };
    setSavedDesigns([...savedDesigns, newDesign]);
  };

  const handleLoadDesign = (design: any) => {
    setBaseColor(design.baseColor);
    setAccentColor(design.accentColor);
    setMaterial(design.material);
    setPattern(design.pattern);
    setMonogram(design.monogram);
  };

  return (
    <div ref={containerRef} className={`min-h-screen bg-luxsole-dark-green ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-luxsole-gradient mb-4">Customization Studio</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create your perfect pair with our advanced customization tools. 
            See your changes in real-time with our 3D preview.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 3D Preview */}
          <div className="lg:col-span-2">
            <CustomizationPreview
              baseColor={baseColor}
              accentColor={accentColor}
              material={material}
              pattern={pattern}
              monogram={monogram}
            />
            
            {/* Preview Controls */}
            <div className="mt-6 bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold text-luxsole-emerald mb-4">Preview Controls</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-2 px-4 bg-luxsole-emerald/20 text-luxsole-emerald rounded-lg hover:bg-luxsole-emerald/30 transition-colors">
                  Take Screenshot
                </button>
                <button className="py-2 px-4 bg-luxsole-gold/20 text-luxsole-gold rounded-lg hover:bg-luxsole-gold/30 transition-colors">
                  Share Design
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Customization Controls */}
          <div className="space-y-6">
            {/* Colors */}
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-luxsole-emerald mb-4">Colors</h3>
              <div className="space-y-6">
                <ColorPicker
                  label="Base Color"
                  color={baseColor}
                  onChange={setBaseColor}
                />
                <ColorPicker
                  label="Accent Color"
                  color={accentColor}
                  onChange={setAccentColor}
                />
              </div>
            </div>

            {/* Material */}
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
              <MaterialSelector
                material={material}
                onChange={setMaterial}
              />
            </div>

            {/* Pattern */}
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
              <PatternSelector
                pattern={pattern}
                onChange={setPattern}
              />
            </div>

            {/* Personalization */}
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
              <Monogramming
                monogram={monogram}
                onChange={setMonogram}
              />
            </div>

            {/* Design Management */}
            <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
              <DesignManager
                onSave={handleSaveDesign}
                onLoad={handleLoadDesign}
                designs={savedDesigns}
              />
            </div>

            {/* Order Button */}
            <div className="bg-luxsole-gold/10 border border-luxsole-gold/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-luxsole-gold mb-4">Ready to Order?</h3>
              <p className="text-gray-300 text-sm mb-4">
                Your custom design will be handcrafted by our master artisans.
              </p>
              <button className="w-full py-3 px-6 bg-luxsole-gold text-luxsole-dark-green rounded-lg font-semibold hover:bg-luxsole-gold/80 transition-colors duration-300 hover:scale-105 transform">
                Order Custom Design - $1,499
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
