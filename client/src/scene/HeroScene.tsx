/**
 * Hero Scene Component
 * 
 * Main 3D scene for the landing hero section with:
 * - Interactive rotating shoe with orbit controls
 * - Dramatic PBR lighting and HDR environment
 * - Volumetric fog and contact shadows
 * - Keyboard navigation support (Arrow keys/WASD to rotate, +/- to zoom)
 */

import { useRef, useEffect, Suspense, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  ContactShadows,
  SpotLight,
  useKeyboardControls,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import ShoeDracoModel from "@/models/ShoeDracoModel";
import { useLuxSole } from "@/lib/stores/useLuxSole";

/**
 * Scene Lighting Component
 * Subtle soft lighting optimized for white shoe on dark green background
 */
function SceneLighting() {
  return (
    <>
      {/* Minimal ambient light only */}
      <ambientLight intensity={0.2} color="#ffffff" />
    </>
  );
}

/**
 * Keyboard-controlled Camera Component
 * Handles keyboard input for camera rotation and zoom via OrbitControls
 */
function KeyboardCamera() {
  const controlsRef = useRef<any>(null);
  const [, get] = useKeyboardControls();
  
  useFrame(() => {
    if (controlsRef.current) {
      const { rotateLeft, rotateRight, rotateUp, rotateDown, zoomIn, zoomOut } = get();
      
      // Apply keyboard controls to orbit controls
      if (rotateLeft) controlsRef.current.rotateLeft();
      if (rotateRight) controlsRef.current.rotateRight();
      if (rotateUp) controlsRef.current.rotateUp();
      if (rotateDown) controlsRef.current.rotateDown();
      if (zoomIn) controlsRef.current.zoomIn();
      if (zoomOut) controlsRef.current.zoomOut();
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={8}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      autoRotate={false}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      rotateSpeed={0.5}
      zoomSpeed={0.8}
      makeDefault
    />
  );
}

/**
 * Animated Shoe Component
 * Handles shoe rotation and material transitions
 */
function AnimatedShoe() {
  const shoeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (shoeRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle floating animation
      const floatY = Math.sin(time * 0.3) * 0.08 + Math.sin(time * 0.7) * 0.03;
      const floatX = Math.sin(time * 0.4) * 0.02 + Math.sin(time * 0.6) * 0.01;
      const floatZ = Math.sin(time * 0.5) * 0.015;
      
      shoeRef.current.position.y = floatY + 1.2; // Move to top of right side
      shoeRef.current.position.x = floatX;
      shoeRef.current.position.z = floatZ;
      
      // Gentle breathing effect
      const baseScale = 1 + Math.sin(time * 0.6) * 0.02;
      shoeRef.current.scale.setScalar(baseScale);
    }
  });
  
  // Always render shoe (no need to check selectedShoe)
  return (
    <ShoeDracoModel ref={shoeRef} scale={1.8} />
  );
}

/**
 * Volumetric Fog Effect
 */
function Fog() {
  return (
    <fog attach="fog" args={["#072A1E", 8, 20]} />
  );
}

/**
 * Luxury Particle System
 * Floating particles around the shoe for premium feel
 */
function LuxuryParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 150;
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate particles around the shoe
      particlesRef.current.rotation.y = time * 0.1;
      particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      
      // Animate particle positions
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + i * 0.1) * 0.001; // Y movement
        positions[i3 + 0] += Math.cos(time + i * 0.1) * 0.0005; // X movement
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  // Create particle geometry
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions in a sphere around the shoe
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi);
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      
      // Gold and emerald colors
      const colorChoice = Math.random();
      if (colorChoice < 0.6) {
        colors[i3] = 0.88; // Gold R
        colors[i3 + 1] = 0.72; // Gold G
        colors[i3 + 2] = 0.35; // Gold B
      } else {
        colors[i3] = 0.12; // Emerald R
        colors[i3 + 1] = 0.63; // Emerald G
        colors[i3 + 2] = 0.48; // Emerald B
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);
  
  return (
    <points ref={particlesRef} geometry={particlesGeometry}>
      <pointsMaterial
        size={0.02}
        transparent={true}
        opacity={0.6}
        vertexColors={true}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
      />
    </points>
  );
}

/**
 * Circular Globe Platform
 * A rotating circular platform with globe underneath the shoe
 */
function GlobePlatform() {
  const platformRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (platformRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate the rings in place (clockwise around their own axis)
      platformRef.current.rotation.y = time * 1.2;
    }
  });
  
  return (
    <group ref={platformRef} position={[0, 0.1, 0]} scale={0.6}>
      {/* Outer circular ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[0.8, 0.08, 12, 24]} />
        <meshStandardMaterial
          color="#E1B75A"
          metalness={0.9}
          roughness={0.2}
          emissive="#E1B75A"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Middle decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <torusGeometry args={[0.6, 0.05, 12, 24]} />
        <meshStandardMaterial
          color="#1FA07A"
          metalness={0.7}
          roughness={0.3}
          emissive="#1FA07A"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Inner decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <torusGeometry args={[0.4, 0.04, 12, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>
      
    </group>
  );
}

/**
 * Main Hero Scene Component
 */
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [threeError, setThreeError] = useState(false);
  
  // Hero section background color (dark green)
  const heroBackgroundColor = '#234737';
  
  // Check for WebGL support and 3D capabilities
  useEffect(() => {
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          console.warn('WebGL not supported, using image fallback');
          setUseImageFallback(true);
          return;
        }
        
        // Check for specific WebGL features
        if (gl && 'getExtension' in gl) {
          const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
          if (debugInfo) {
            const renderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            console.log('WebGL Renderer:', renderer);
          }
        }
        
      } catch (error) {
        console.warn('WebGL check failed, using image fallback:', error);
        setUseImageFallback(true);
      }
    };
    
    // Check after a short delay to ensure DOM is ready
    const timer = setTimeout(checkWebGLSupport, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Handle 3D errors
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('WebGL') || error.message.includes('three')) {
        console.warn('3D rendering error, switching to image fallback:', error);
        setThreeError(true);
        setUseImageFallback(true);
      }
    };
    
    // Only add event listener if window is available
    if (typeof window !== 'undefined') {
      try {
        window.addEventListener('error', handleError);
        return () => {
          try {
            window.removeEventListener('error', handleError);
          } catch (error) {
            console.warn('Error removing error event listener:', error);
          }
        };
      } catch (error) {
        console.warn('Error adding error event listener:', error);
      }
    }
  }, []);
  
  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Tab" && canvasRef.current) {
        e.preventDefault();
        canvasRef.current.focus();
      }
    };
    
    // Only add event listener if window is available and we're in the browser
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      try {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
          try {
            if (typeof window !== 'undefined') {
              window.removeEventListener("keydown", handleKeyPress);
            }
          } catch (error) {
            console.warn('Error removing event listener:', error);
          }
        };
      } catch (error) {
        console.warn('Error adding event listener:', error);
      }
    }
  }, []);
  
   // Use image fallback if WebGL is not supported or 3D fails
   if (useImageFallback || threeError) {
     return (
       <div className="w-full h-full flex items-center justify-center bg-black">
         <div className="relative w-full h-full bg-black">
           <img
             src="/SNEK-hero.jpg"
             alt="SNEK Hero Sneaker"
             className="w-full h-full object-cover drop-shadow-2xl"
             style={{
               animation: 'float 6s ease-in-out infinite, glow 4s ease-in-out infinite',
               backgroundColor: 'black',
               imageRendering: 'auto',
               WebkitBackfaceVisibility: 'hidden',
               backfaceVisibility: 'hidden',
               transform: 'translateZ(0)',
               willChange: 'transform',
             }}
           />
           
           {/* Fallback indicator */}
           <div className="absolute top-4 right-4 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-luxsole-emerald">
             High-Quality Image Mode
           </div>
           
           {/* CSS Animations */}
           <style>{`
             @keyframes float {
               0%, 100% { transform: translateY(0px) rotateY(0deg); }
               50% { transform: translateY(-10px) rotateY(2deg); }
             }

             @keyframes glow {
               0%, 100% { 
                 filter: brightness(1) drop-shadow(0 0 20px #1FA07A40); 
               }
               50% { 
                 filter: brightness(1.1) drop-shadow(0 0 30px #1FA07A60); 
               }
             }
             
             /* Ensure black background and ultra HD quality */
             img {
               background: black !important;
               background-color: black !important;
               image-rendering: -webkit-optimize-contrast;
               image-rendering: crisp-edges;
               image-rendering: high-quality;
               -webkit-backface-visibility: hidden;
               backface-visibility: hidden;
               transform: translateZ(0);
               will-change: transform;
             }
           `}</style>
         </div>
       </div>
     );
   }

  return (
    <div className="w-full h-full" style={{ backgroundColor: heroBackgroundColor }} role="img" aria-label="Interactive 3D shoe display">
      <Canvas
        ref={(canvas) => {
          try {
            if (canvas && typeof canvas === 'object') {
              (canvasRef as any).current = canvas;
            }
          } catch (error) {
            console.warn('Error setting canvas ref:', error);
          }
        }}
        shadows
        dpr={[1, 2]} // Limit pixel ratio for performance
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          alpha: false, // Disable transparency for consistent background
        }}
        tabIndex={0}
        aria-label="3D canvas - use arrow keys or WASD to rotate, +/- to zoom"
        onError={(error) => {
          console.warn('Canvas error, switching to image fallback:', error);
          setUseImageFallback(true);
        }}
      >
        {/* Fog removed for clear background */}
        
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        
        {/* Scene background color - dark green to match hero section */}
        <color attach="background" args={[heroBackgroundColor]} />
        
        {/* Lighting */}
        <SceneLighting />
        
        {/* Animated Shoe Model */}
        <Suspense fallback={null}>
          <AnimatedShoe />
        </Suspense>
        
        {/* Globe Platform */}
        <GlobePlatform />
        
        {/* Contact Shadows removed */}
        
        
        {/* Orbit Controls disabled in hero section */}
        {/* <KeyboardCamera /> */}
        
        {/* Post-processing removed to eliminate white glow */}
      </Canvas>
    </div>
  );
}