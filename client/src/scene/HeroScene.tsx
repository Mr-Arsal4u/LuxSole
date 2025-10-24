/**
 * Hero Scene Component
 * 
 * Main 3D scene for the landing hero section with:
 * - Interactive rotating shoe with orbit controls
 * - Dramatic PBR lighting and HDR environment
 * - Volumetric fog and contact shadows
 * - Keyboard navigation support (Arrow keys/WASD to rotate, +/- to zoom)
 */

import { useRef, useEffect, Suspense } from "react";
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
import { useLuxSole } from "@/lib/stores/useLuxSole";

/**
 * Scene Lighting Component
 * Dramatic rim lighting with studio-style setup
 */
function SceneLighting() {
  return (
    <>
      {/* Key light */}
      <SpotLight
        position={[5, 8, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        color="#ffffff"
      />
      
      {/* Rim light (emerald) */}
      <SpotLight
        position={[-5, 5, -5]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#1FA07A"
      />
      
      {/* Gold accent light */}
      <spotLight
        position={[0, 10, -10]}
        angle={0.5}
        penumbra={1}
        intensity={0.8}
        color="#E1B75A"
      />
      
      {/* Ambient light */}
      <ambientLight intensity={0.3} color="#0F3F2B" />
      
      {/* Hemisphere light for subtle fill */}
      <hemisphereLight
        intensity={0.4}
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
  const { camera } = useThree();
  
  useFrame((state, delta) => {
    if (!controlsRef.current) return;
    
    const controls = get();
    const rotationSpeed = 2 * delta;
    const zoomSpeed = 2 * delta;
    
    // Get current spherical coordinates
    const offset = new THREE.Vector3();
    offset.copy(camera.position).sub(controlsRef.current.target);
    
    const spherical = new THREE.Spherical();
    spherical.setFromVector3(offset);
    
    // Rotation via spherical coordinates
    if (controls.rotateLeft) {
      spherical.theta -= rotationSpeed;
    }
    if (controls.rotateRight) {
      spherical.theta += rotationSpeed;
    }
    if (controls.rotateUp) {
      spherical.phi = Math.max(
        Math.PI / 4,
        spherical.phi - rotationSpeed
      );
    }
    if (controls.rotateDown) {
      spherical.phi = Math.min(
        Math.PI / 2,
        spherical.phi + rotationSpeed
      );
    }
    
    // Apply rotation changes
    if (controls.rotateLeft || controls.rotateRight || controls.rotateUp || controls.rotateDown) {
      offset.setFromSpherical(spherical);
      camera.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
    
    // Zoom
    if (controls.zoomIn) {
      spherical.radius = Math.max(3, spherical.radius - zoomSpeed);
      offset.setFromSpherical(spherical);
      camera.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
    if (controls.zoomOut) {
      spherical.radius = Math.min(8, spherical.radius + zoomSpeed);
      offset.setFromSpherical(spherical);
      camera.position.copy(controlsRef.current.target).add(offset);
      controlsRef.current.update();
    }
  });
  
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
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
      // Auto-rotation in demo mode
      if (isDemoMode) {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0.3, 0.05);
      } else {
        rotationSpeed.current = THREE.MathUtils.lerp(rotationSpeed.current, 0, 0.05);
      }
      
      shoeRef.current.rotation.y += rotationSpeed.current * delta;
      
      // Subtle floating animation
      shoeRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
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
  
  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Tab" && canvasRef.current) {
        e.preventDefault();
        canvasRef.current.focus();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);
  
  return (
    <div className="w-full h-full" role="img" aria-label="Interactive 3D shoe display">
      <Canvas
        ref={canvasRef}
        shadows
        dpr={[1, 2]} // Limit pixel ratio for performance
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        tabIndex={0}
        aria-label="3D canvas - use arrow keys or WASD to rotate, +/- to zoom"
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
