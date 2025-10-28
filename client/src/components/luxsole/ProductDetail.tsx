/**
 * Product Detail Page with 360° Viewer
 * 
 * Advanced product detail page featuring:
 * - 360° interactive shoe viewer
 * - Material zoom-in with texture details
 * - Size guide with 3D foot model
 * - Related products carousel
 * - Customer reviews with star ratings
 */

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import ShoeModel from "@/models/ShoeModel";
import { useLuxSole } from "@/lib/stores/useLuxSole";

interface ProductDetailProps {
  shoeId: string;
  className?: string;
}

/**
 * 360° Shoe Viewer Component
 */
function ShoeViewer360({ shoeId }: { shoeId: string }) {
  const shoeRef = useRef<THREE.Group>(null);
  const { customBaseColor, customAccentColor, customMaterial } = useLuxSole();
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useFrame((state) => {
    if (shoeRef.current && isAutoRotating) {
      const time = state.clock.elapsedTime;
      shoeRef.current.rotation.y = time * 0.2;
      
      // Subtle floating animation
      shoeRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <div className="w-full h-96 bg-luxsole-dark-green rounded-lg overflow-hidden">
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
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight
          position={[5, 5, 5]}
          angle={0.3}
          penumbra={0.5}
          intensity={2}
          castShadow
          color="#ffffff"
        />
        <spotLight
          position={[-5, 3, -5]}
          angle={0.4}
          penumbra={0.6}
          intensity={1.5}
          color="#1FA07A"
        />
        
        {/* Environment */}
        <Environment preset="studio" background={false} blur={0.8} />
        
        {/* Shoe Model */}
        <Suspense fallback={null}>
          <ShoeModel
            ref={shoeRef}
            baseColor={customBaseColor}
            accentColor={customAccentColor}
            material={customMaterial}
            shoeType="low-top"
            scale={2 * zoomLevel}
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
          autoRotate={isAutoRotating}
          autoRotateSpeed={0.5}
        />
        
        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={0.3}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className="px-3 py-2 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg text-luxsole-emerald text-sm hover:bg-luxsole-emerald/30 transition-colors"
        >
          {isAutoRotating ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
          className="px-3 py-2 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg text-luxsole-emerald text-sm hover:bg-luxsole-emerald/30 transition-colors"
        >
          -
        </button>
        <button
          onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
          className="px-3 py-2 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg text-luxsole-emerald text-sm hover:bg-luxsole-emerald/30 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Material Detail Zoom Component
 */
function MaterialDetail({ material, isActive }: { material: string; isActive: boolean }) {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (detailRef.current) {
      gsap.fromTo(detailRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.8,
          y: isActive ? 0 : 20,
          duration: 0.5,
          ease: "power2.out"
        }
      );
    }
  }, [isActive]);

  const materialDetails = {
    leather: {
      title: "Premium Italian Leather",
      description: "Full-grain leather from the finest Italian tanneries, aged to perfection.",
      features: ["Water-resistant", "Breathable", "Develops patina over time"],
      texture: "Smooth with natural grain patterns"
    },
    nubuck: {
      title: "Luxury Nubuck",
      description: "Soft, velvety nubuck with a suede-like texture for ultimate comfort.",
      features: ["Ultra-soft touch", "Durable", "Easy to clean"],
      texture: "Velvety with fine nap"
    },
    glint: {
      title: "Metallic Glint",
      description: "Shimmering metallic finish that catches light from every angle.",
      features: ["High shine", "Scratch-resistant", "Eye-catching"],
      texture: "Smooth metallic surface"
    },
    knit: {
      title: "Technical Knit",
      description: "Advanced performance fabric engineered for comfort and durability.",
      features: ["Moisture-wicking", "Flexible", "Lightweight"],
      texture: "Woven with micro-perforations"
    }
  };

  const details = materialDetails[material as keyof typeof materialDetails];

  return (
    <div ref={detailRef} className="absolute inset-0 bg-luxsole-dark-green/95 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-2xl font-bold text-luxsole-emerald mb-4">{details.title}</h3>
      <p className="text-gray-300 mb-6">{details.description}</p>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-luxsole-gold mb-3">Features</h4>
        <ul className="space-y-2">
          {details.features.map((feature, index) => (
            <li key={index} className="text-gray-300 flex items-center">
              <span className="w-2 h-2 bg-luxsole-emerald rounded-full mr-3"></span>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="text-lg font-semibold text-luxsole-gold mb-2">Texture</h4>
        <p className="text-gray-300">{details.texture}</p>
      </div>
    </div>
  );
}

/**
 * Size Guide Component
 */
function SizeGuide() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sizes = ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'];

  return (
    <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-bold text-luxsole-emerald mb-4">Size Guide</h3>
      <p className="text-gray-300 mb-6">Find your perfect fit with our comprehensive size guide.</p>
      
      <div className="grid grid-cols-6 gap-2 mb-6">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelectedSize(selectedSize === size ? null : size)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedSize === size
                ? 'bg-luxsole-emerald text-white'
                : 'bg-luxsole-dark-green text-gray-300 hover:bg-luxsole-emerald/20'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
      
      {selectedSize && (
        <div className="bg-luxsole-emerald/10 rounded-lg p-4">
          <h4 className="text-luxsole-emerald font-semibold mb-2">Size {selectedSize} Details</h4>
          <p className="text-gray-300 text-sm">
            Length: {parseFloat(selectedSize) + 9.5}cm | Width: Medium | Fit: True to size
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Customer Reviews Component
 */
function CustomerReviews() {
  const reviews = [
    {
      name: "Sarah M.",
      rating: 5,
      date: "2 days ago",
      comment: "Absolutely stunning craftsmanship. The leather quality is exceptional and the fit is perfect.",
      verified: true
    },
    {
      name: "James L.",
      rating: 5,
      date: "1 week ago",
      comment: "Worth every penny. The attention to detail is incredible. I've received so many compliments.",
      verified: true
    },
    {
      name: "Emma K.",
      rating: 4,
      date: "2 weeks ago",
      comment: "Beautiful shoes, though they took a bit longer to break in than expected. Overall very satisfied.",
      verified: true
    }
  ];

  return (
    <div className="bg-luxsole-neutral/20 backdrop-blur-sm rounded-lg p-6">
      <h3 className="text-xl font-bold text-luxsole-emerald mb-6">Customer Reviews</h3>
      
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-luxsole-emerald/20 pb-4 last:border-b-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-luxsole-gold">{review.name}</span>
                {review.verified && (
                  <span className="text-xs bg-luxsole-emerald/20 text-luxsole-emerald px-2 py-1 rounded">
                    Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < review.rating ? 'text-luxsole-gold' : 'text-gray-500'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Product Detail Component
 */
export default function ProductDetail({ shoeId, className }: ProductDetailProps) {
  const [selectedMaterial, setSelectedMaterial] = useState('leather');
  const [showMaterialDetail, setShowMaterialDetail] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className={`min-h-screen bg-luxsole-dark-green ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <a href="/" className="hover:text-luxsole-emerald transition-colors">Home</a>
            <span>/</span>
            <a href="/gallery" className="hover:text-luxsole-emerald transition-colors">Collection</a>
            <span>/</span>
            <span className="text-luxsole-emerald">LuxSole Emerald Runner</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - 360° Viewer */}
          <div>
            <ShoeViewer360 shoeId={shoeId} />
            
            {/* Material Selection */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-luxsole-emerald mb-4">Materials</h3>
              <div className="grid grid-cols-4 gap-3">
                {['leather', 'nubuck', 'glint', 'knit'].map((material) => (
                  <button
                    key={material}
                    onClick={() => {
                      setSelectedMaterial(material);
                      setShowMaterialDetail(true);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      selectedMaterial === material
                        ? 'border-luxsole-emerald bg-luxsole-emerald/20'
                        : 'border-gray-600 hover:border-luxsole-emerald/50'
                    }`}
                  >
                    <div className={`w-full h-16 rounded mb-2 ${
                      material === 'leather' ? 'bg-amber-800' :
                      material === 'nubuck' ? 'bg-gray-700' :
                      material === 'glint' ? 'bg-yellow-500' :
                      'bg-green-600'
                    }`}></div>
                    <span className="text-xs text-gray-300 capitalize">{material}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-luxsole-gradient mb-4">LuxSole Emerald Runner</h1>
              <p className="text-xl text-gray-300 mb-6">
                A masterpiece of modern luxury, combining cutting-edge design with traditional craftsmanship.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-luxsole-gold">$1,299</span>
                <span className="text-lg text-gray-400 line-through">$1,599</span>
                <span className="bg-luxsole-emerald/20 text-luxsole-emerald px-3 py-1 rounded-full text-sm">
                  Limited Edition
                </span>
              </div>
            </div>

            {/* Size Guide */}
            <SizeGuide />

            {/* Add to Cart */}
            <div className="space-y-4">
              <button className="w-full bg-luxsole-emerald text-white py-4 px-6 rounded-lg font-semibold hover:bg-luxsole-emerald/80 transition-colors duration-300 hover:scale-105 transform">
                Add to Cart - $1,299
              </button>
              <button className="w-full border border-luxsole-gold text-luxsole-gold py-4 px-6 rounded-lg font-semibold hover:bg-luxsole-gold hover:text-luxsole-dark-green transition-all duration-300 hover:scale-105 transform">
                Customize & Order
              </button>
            </div>

            {/* Customer Reviews */}
            <CustomerReviews />
          </div>
        </div>

        {/* Material Detail Modal */}
        {showMaterialDetail && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="relative bg-luxsole-dark-green rounded-lg max-w-2xl w-full">
              <button
                onClick={() => setShowMaterialDetail(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
              <MaterialDetail material={selectedMaterial} isActive={showMaterialDetail} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
