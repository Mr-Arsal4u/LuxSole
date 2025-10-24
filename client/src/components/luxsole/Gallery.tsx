/**
 * Product Gallery Component
 * 
 * Grid of 3D shoe previews with hover micro-interactions
 * and animated reveals
 */

import { useRef, useEffect } from "react";
import { useLuxSole, DEFAULT_SHOES } from "@/lib/stores/useLuxSole";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import ShoeModel from "@/models/ShoeModel";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItemProps {
  shoe: typeof DEFAULT_SHOES[0];
  index: number;
}

function GalleryItem({ shoe, index }: GalleryItemProps) {
  const { setSelectedShoe, setCustomizerOpen } = useLuxSole();
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Staggered reveal animation
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, [index]);
  
  const handleCustomize = () => {
    setSelectedShoe(shoe);
    setCustomizerOpen(true);
  };
  
  const handleHover = (isHovering: boolean) => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: isHovering ? -10 : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
    
    if (canvasContainerRef.current) {
      gsap.to(canvasContainerRef.current, {
        scale: isHovering ? 1.05 : 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };
  
  return (
    <div
      ref={cardRef}
      className="glass-effect rounded-2xl overflow-hidden cursor-pointer group"
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onClick={handleCustomize}
      role="button"
      tabIndex={0}
      aria-label={`View ${shoe.name}`}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCustomize();
        }
      }}
    >
      {/* 3D Preview */}
      <div
        ref={canvasContainerRef}
        className="w-full h-64 relative overflow-hidden bg-gradient-to-br from-luxsole-forest to-luxsole-dark-green"
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true }}
        >
          <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[5, 5, 5]}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            castShadow
          />
          <Environment preset="studio" />
          
          <ShoeModel
            baseColor={shoe.baseColor}
            accentColor={shoe.accentColor}
            material={shoe.material}
            scale={2}
          />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={2}
          />
        </Canvas>
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-luxsole-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      
      {/* Info Section */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-white group-hover:text-luxsole-emerald transition-colors duration-300">
            {shoe.name}
          </h3>
          <p className="text-sm text-gray-400 capitalize mt-1">
            {shoe.material} Finish
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-luxsole-gold">
            ${shoe.price}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCustomize();
            }}
            className="px-4 py-2 bg-luxsole-emerald hover:bg-luxsole-gold text-luxsole-forest font-medium rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label={`Customize ${shoe.name}`}
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.querySelector("h2"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top center+=100",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);
  
  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-luxsole-neutral"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-luxsole-gradient mb-4">
            The Collection
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore the Craft
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {DEFAULT_SHOES.map((shoe, index) => (
            <GalleryItem key={shoe.id} shoe={shoe} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
