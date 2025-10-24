/**
 * Story/Lookbook Component
 * 
 * Scroll-driven cinematic storytelling section with
 * environment transitions and camera animations
 */

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, OrbitControls } from "@react-three/drei";
import ShoeModel from "@/models/ShoeModel";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLuxSole, DEFAULT_SHOES } from "@/lib/stores/useLuxSole";

gsap.registerPlugin(ScrollTrigger);

interface StorySceneProps {
  scrollProgress: number;
}

function StoryScene({ scrollProgress }: StorySceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const shoeRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (cameraRef.current && shoeRef.current) {
      // Camera path based on scroll
      const angle = scrollProgress * Math.PI * 2;
      const radius = 5 - scrollProgress * 2;
      const height = 1 + Math.sin(scrollProgress * Math.PI) * 1.5;
      
      cameraRef.current.position.x = Math.sin(angle) * radius;
      cameraRef.current.position.y = height;
      cameraRef.current.position.z = Math.cos(angle) * radius;
      cameraRef.current.lookAt(0, 0.5, 0);
      
      // Shoe rotation
      shoeRef.current.rotation.y = scrollProgress * Math.PI * 4;
    }
  });
  
  // Determine environment based on scroll progress
  const preset = scrollProgress < 0.33 ? "studio" : scrollProgress < 0.66 ? "sunset" : "night";
  
  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[5, 1, 5]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <spotLight
        position={[5, 8, 5]}
        angle={0.3}
        intensity={2}
        castShadow
        color={scrollProgress < 0.33 ? "#ffffff" : scrollProgress < 0.66 ? "#ff8844" : "#4488ff"}
      />
      
      <Environment preset={preset} background={false} />
      
      <ShoeModel
        ref={shoeRef}
        baseColor={DEFAULT_SHOES[0].baseColor}
        accentColor={DEFAULT_SHOES[0].accentColor}
        material={DEFAULT_SHOES[0].material}
        scale={2.5}
      />
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={scrollProgress < 0.33 ? "#0F3F2B" : scrollProgress < 0.66 ? "#1a0a00" : "#000a1a"}
          roughness={0.8}
        />
      </mesh>
    </>
  );
}

const STORY_SECTIONS = [
  {
    title: "Studio Precision",
    subtitle: "Where Craft Meets Vision",
    description: "Every detail refined under the perfect light, where precision and artistry unite.",
    environment: "studio",
  },
  {
    title: "Runway Ready",
    subtitle: "Born to Perform",
    description: "From concept to catwalk, designed to make a statement with every step.",
    environment: "runway",
  },
  {
    title: "Urban Dusk",
    subtitle: "The City Awaits",
    description: "As day turns to night, your journey is just beginning. Step into the evening.",
    environment: "dusk",
  },
];

export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    if (containerRef.current && canvasContainerRef.current) {
      const sections = containerRef.current.querySelectorAll(".story-section");
      
      // Animate each section text
      sections.forEach((section, index) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top center+=100",
              end: "bottom center-=100",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
      
      // Pin the canvas and track scroll progress
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: canvasContainerRef.current,
        pinSpacing: false,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }
    
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
  
  return (
    <section id="story" ref={containerRef} className="relative bg-luxsole-neutral">
      {/* Fixed Canvas */}
      <div
        ref={canvasContainerRef}
        className="sticky top-0 w-full h-screen z-10"
      >
        <Canvas shadows dpr={[1, 2]}>
          <StoryScene scrollProgress={scrollProgress} />
        </Canvas>
      </div>
      
      {/* Scrollable Content */}
      <div className="relative z-20 pointer-events-none">
        {STORY_SECTIONS.map((story, index) => (
          <div
            key={index}
            className="story-section h-screen flex items-center justify-end px-4 sm:px-6 lg:px-8"
          >
            <div className="max-w-xl w-full pointer-events-auto">
              <div className="glass-effect p-8 rounded-2xl">
                <div className="text-sm text-luxsole-emerald font-medium mb-2 uppercase tracking-wider">
                  {story.subtitle}
                </div>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {story.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {story.description}
                </p>
                
                {/* Progress indicator */}
                <div className="mt-6 flex items-center gap-2">
                  {STORY_SECTIONS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === index ? "w-12 bg-luxsole-gold" : "w-6 bg-luxsole-forest"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
