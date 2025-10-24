/**
 * Hero Scene Component
 * 
 * Main 3D scene for the landing hero section with:
 * - Interactive rotating shoe with orbit controls
 * - Dramatic PBR lighting and HDR environment
 * - Volumetric fog and contact shadows
 * - Keyboard navigation support (Arrow keys/WASD to rotate, +/- to zoom)
 */

import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  SpotLight,
  useKeyboardControls,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import ShoeModel from "@/models/ShoeModel";
import ImageShoe from "@/components/luxsole/ImageShoe";
import { useLuxSole } from "@/lib/stores/useLuxSole";

/**
 * Scene Lighting Component
 * Dramatic rim lighting with studio-style setup
 */
function SceneLighting() {
  return (
    <>
      {/* Main key light - dramatic studio lighting */}
      <SpotLight
        position={[4, 6, 4]}
        angle={0.25}
        penumbra={0.3}
        intensity={3}
        castShadow
        shadow-mapSize={[4096, 4096]}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />
      
      {/* Rim light (emerald) - luxury accent */}
      <SpotLight
        position={[-4, 4, -4]}
        angle={0.35}
        penumbra={0.6}
        intensity={2}
        color="#1FA07A"
        target-position={[0, 0, 0]}
      />
      
      {/* Gold accent light - premium highlight */}
      <spotLight
        position={[2, 8, -6]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.2}
        color="#E1B75A"
        target-position={[0, 0, 0]}
      />
      
      {/* Fill light - soft illumination */}
      <spotLight
        position={[0, 3, 6]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#0F3F2B"
        target-position={[0, 0, 0]}
      />
      
      {/* Ambient light - subtle base illumination */}
      <ambientLight intensity={0.2} color="#0F3F2B" />
      
      {/* Hemisphere light for premium fill */}
      <hemisphereLight
        intensity={0.3}
        color="#1FA07A"
        groundColor="#072A1E"
      />
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
  const { selectedShoe, customMaterial, customBaseColor, customAccentColor, isDemoMode, useAdvancedShaders } =
    useLuxSole();
  const shoeRef = useRef<THREE.Group>(null);
  const rotationSpeed = useRef(0);
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      // Smooth auto-rotation in demo mode
      if (isDemoMode) {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0.2, 0.03);
      } else {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0, 0.03);
      }
      
      // Smooth rotation
      shoeRef.current.rotation.y += rotationSpeed.current * delta;
      
      // Premium floating animation with subtle sway
      const time = state.clock.elapsedTime;
      shoeRef.current.position.y = Math.sin(time * 0.3) * 0.08 + Math.sin(time * 0.7) * 0.03;
      shoeRef.current.position.x = Math.sin(time * 0.4) * 0.02;
      
      // Subtle scale breathing effect
      const scale = 1 + Math.sin(time * 0.6) * 0.02;
      shoeRef.current.scale.setScalar(scale);
    }
  });
  
  if (!selectedShoe) return null;
  
  return (
    <ShoeModel
      ref={shoeRef}
      baseColor={customBaseColor}
      accentColor={customAccentColor}
      material={customMaterial}
      shoeType={selectedShoe.shoeType}
      scale={2.5}
      useAdvancedShaders={useAdvancedShaders}
    />
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
 * Main Hero Scene Component
 */
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [threeError, setThreeError] = useState(false);
  
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
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luxsole-dark-green to-luxsole-neutral">
        <div className="relative w-full h-full max-w-2xl max-h-2xl">
          <ImageShoe className="w-full h-full" />
          
          {/* Fallback indicator */}
          <div className="absolute top-4 right-4 bg-luxsole-emerald/20 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-luxsole-emerald">
            High-Quality Image Mode
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" role="img" aria-label="Interactive 3D shoe display">
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
        }}
        tabIndex={0}
        aria-label="3D canvas - use arrow keys or WASD to rotate, +/- to zoom"
        onError={(error) => {
          console.warn('Canvas error, switching to image fallback:', error);
          setUseImageFallback(true);
        }}
      >
        <Fog />
        
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={50} />
        
        {/* Lighting */}
        <SceneLighting />
        
        {/* HDR Environment */}
        <Suspense fallback={null}>
          <Environment
            preset="studio"
            background={false}
            blur={0.8}
          />
        </Suspense>
        
        {/* Main Shoe Model with LOD */}
        <Suspense fallback={null}>
          <AnimatedShoe />
        </Suspense>
        
        {/* Ground and Shadows */}
        <ContactShadows
          position={[0, -0.5, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
          color="#072A1E"
        />
        
        {/* Orbit Controls with keyboard support */}
        <KeyboardCamera />
        
        {/* Post-processing */}
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}