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
 * Enhanced lighting with ring-based illumination and dramatic spot lights
 */
function SceneLighting() {
  return (
    <>
      {/* Ambient light for base illumination */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main directional light from above */}
      <directionalLight
        position={[0, 10, 0]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Ring lighting - spot lights positioned around the rings */}
      <spotLight
        position={[2, 1, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={1.5}
        color="#E1B75A"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        position={[-2, 1, 0]}
        angle={0.4}
        penumbra={0.3}
        intensity={1.5}
        color="#1FA07A"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        position={[0, 1, 2]}
        angle={0.4}
        penumbra={0.3}
        intensity={1.5}
        color="#ffffff"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      <spotLight
        position={[0, 1, -2]}
        angle={0.4}
        penumbra={0.3}
        intensity={1.5}
        color="#E1B75A"
        castShadow
        target-position={[0, 0, 0]}
      />
      
      {/* Additional rim lighting */}
      <pointLight
        position={[3, 2, 3]}
        intensity={0.8}
        color="#E1B75A"
        distance={10}
        decay={2}
      />
      
      <pointLight
        position={[-3, 2, -3]}
        intensity={0.8}
        color="#1FA07A"
        distance={10}
        decay={2}
      />
      
      {/* Spotlight from ring center up to shoe sole */}
      <spotLight
        position={[0, 0.15, 0]}
        angle={0.25}
        penumbra={0.4}
        intensity={3.0}
        color="#ffffff"
        castShadow
        target-position={[0, 1.5, 0]}
        distance={2}
        decay={2}
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
  const shoeRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (shoeRef.current) {
      const time = state.clock.elapsedTime;
      
      // Gentle floating animation
      const floatY = Math.sin(time * 0.3) * 0.08 + Math.sin(time * 0.7) * 0.03;
      const floatX = Math.sin(time * 0.4) * 0.02 + Math.sin(time * 0.6) * 0.01;
      const floatZ = Math.sin(time * 0.5) * 0.015;
      
      shoeRef.current.position.y = floatY + 1.5; // Move to top of right side
      shoeRef.current.position.x = floatX;
      shoeRef.current.position.z = floatZ;
      
      // Slow self-rotation around Y-axis
      shoeRef.current.rotation.y += delta * 0.2;
      
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
 * UFO-Style Spotlight Beam Component
 * Vertical cone with pale teal-to-white gradient, volumetric fog, particles, and rim highlights
 */

// Custom shader for gradient beam (teal to white, strong center, soft edges)
const beamVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragmentShader = `
  uniform vec3 tealColor;
  uniform vec3 whiteColor;
  uniform float opacity;
  uniform float time;
  
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  
  void main() {
    // Calculate distance from center (0.0 to 1.0)
    vec2 center = vec2(0.5, 0.5);
    float distFromCenter = length(vUv - center);
    
    // Vertical gradient (bottom teal, top white)
    // vUv.y goes from 0 (bottom) to 1 (top) in the cone
    float verticalGradient = vUv.y; // Higher values = more white (top)
    
    // Strong center, soft edges using falloff
    float centerIntensity = 1.0 - smoothstep(0.0, 0.8, distFromCenter);
    float edgeFalloff = 1.0 - smoothstep(0.6, 1.0, distFromCenter);
    
    // Mix teal to white based on vertical position
    // Smooth transition from teal (bottom) to white (top)
    vec3 gradientColor = mix(tealColor, whiteColor, smoothstep(0.0, 1.0, verticalGradient));
    
    // Combine center intensity with edge falloff
    float finalAlpha = (centerIntensity * 0.8 + edgeFalloff * 0.2) * opacity;
    
    // Add subtle noise for volumetric feel
    float noise = fract(sin(dot(vUv.xy, vec2(12.9898, 78.233)) + time) * 43758.5453);
    finalAlpha *= (0.95 + noise * 0.1);
    
    gl_FragColor = vec4(gradientColor, finalAlpha);
  }
`;

function SpotlightBeam() {
  const beamRef = useRef<THREE.Mesh>(null);
  const beamHeight = 1.0; // Distance from ring center (0.1) - stops before shoe
  const bottomRadius = 0.05; // Narrow at ring center
  const topRadius = 0.18; // Wider at top
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        tealColor: { value: new THREE.Color("#88D4C4") }, // Pale teal
        whiteColor: { value: new THREE.Color("#FFFFFF") },
        opacity: { value: 0.6 },
        time: { value: 0 },
      },
      vertexShader: beamVertexShader,
      fragmentShader: beamFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.MultiplyBlending, // Soft multiply blend
      depthWrite: false,
    });
  }, []);
  
  useFrame((state) => {
    if (beamRef.current && shaderMaterial.uniforms) {
      const time = state.clock.elapsedTime;
      shaderMaterial.uniforms.time.value = time * 0.5;
    }
  });
  
  return (
    <mesh 
      ref={beamRef} 
      position={[0, 0.1 + beamHeight / 2, 0]}
    >
      <coneGeometry args={[topRadius, bottomRadius, beamHeight, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

/**
 * Circular Light Base at Ring Level
 * Visible circular cone-shaped light source emitting from ring center
 */
function CircularLightBase() {
  const lightRef = useRef<THREE.Group>(null);
  const ringHeight = 0.02; // Height of the circular base
  const baseRadius = 0.1; // Radius of the circular base at ring center
  
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.elapsedTime;
      // Gentle pulsing glow
      const pulse = 0.8 + Math.sin(time * 2) * 0.1;
      lightRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshBasicMaterial;
          if (material.opacity !== undefined) {
            material.opacity = pulse * 0.7;
          }
        }
      });
    }
  });
  
  return (
    <group ref={lightRef} position={[0, 0.1, 0]}>
      {/* Circular base disc - glowing ring at center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[baseRadius, baseRadius, ringHeight, 32]} />
        <meshBasicMaterial
          color="#88D4C4"
          transparent={true}
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Outer glow ring - larger circular glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[baseRadius * 0.8, baseRadius * 1.2, 32]} />
        <meshBasicMaterial
          color="#B8E8E0"
          transparent={true}
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner bright center */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[baseRadius * 0.5, baseRadius * 0.5, ringHeight * 1.5, 32]} />
        <meshBasicMaterial
          color="#FFFFFF"
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Short cone section - connects circular base to main beam */}
      {/* This creates the visible cone shape between ring and shoe */}
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.05, baseRadius, 0.1, 32]} />
        <meshBasicMaterial
          color="#88D4C4"
          transparent={true}
          opacity={0.7}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Soft outer glow cone */}
      <mesh position={[0, 0.12, 0]}>
        <coneGeometry args={[0.07, baseRadius * 1.2, 0.15, 32]} />
        <meshBasicMaterial
          color="#B8E8E0"
          transparent={true}
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Realistic Torch/Spotlight Beam
 * Volumetric cone with bright center, soft edges, and natural blending
 */

// Custom shader for realistic torchlight beam with screen blend simulation
const torchVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vRadialDistance;
  
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    // Calculate radial distance from center (0 = center, 1 = edge)
    vec2 center = vec2(0.5, 0.0); // Center at bottom of UV
    vRadialDistance = length(vec2(vUv.x - 0.5, vUv.y));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const torchFragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform float centerBrightness;
  uniform float edgeSoftness;
  
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vRadialDistance;
  
  // Screen blend mode
  vec3 screenBlend(vec3 base, vec3 blend) {
    return 1.0 - (1.0 - base) * (1.0 - blend);
  }
  
  // Overlay blend mode
  float overlayBlend(float base, float blend) {
    return base < 0.5 ? 2.0 * base * blend : 1.0 - 2.0 * (1.0 - base) * (1.0 - blend);
  }
  
  void main() {
    // Vertical position (0 = bottom/ring, 1 = top/shoe)
    float verticalPos = vUv.y;
    
    // Radial falloff - bright center, fade to edge
    // Very sharp center, very soft edges
    float centerFalloff = 1.0 - smoothstep(0.0, 0.15, vRadialDistance);
    float edgeFalloff = 1.0 - smoothstep(0.3, 1.0, vRadialDistance);
    
    // Combine center and edge for smooth volumetric look
    float radialAlpha = centerFalloff * centerBrightness + edgeFalloff * (1.0 - centerFalloff) * edgeSoftness;
    
    // Vertical gradient - slightly brighter near shoe (top)
    float verticalGradient = 0.7 + verticalPos * 0.3;
    radialAlpha *= verticalGradient;
    
    // Add subtle volumetric noise/fog
    float noise1 = fract(sin(dot(vUv.xy, vec2(12.9898, 78.233)) + time * 0.3) * 43758.5453);
    float noise2 = fract(sin(dot(vUv.xy * 2.0, vec2(23.1406, 58.4785)) + time * 0.5) * 43758.5453);
    float fog = mix(noise1, noise2, 0.5);
    radialAlpha *= (0.92 + fog * 0.08);
    
    // White color with screen/overlay blend
    vec3 whiteColor = vec3(1.0, 1.0, 1.0);
    
    // Apply intensity
    vec3 finalColor = whiteColor * intensity * radialAlpha;
    float finalAlpha = radialAlpha * intensity;
    
    // Screen blend with background (simulated)
    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`;

function TorchLight() {
  const torchRef = useRef<THREE.Mesh>(null);
  const torchHeight = 1.4; // From ring (0.1) to shoe sole (1.5)
  const bottomRadius = 0.06; // Start from ring center (narrow)
  const topRadius = 0.28; // Wider at shoe sole
  
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0.75 },
        centerBrightness: { value: 1.2 },
        edgeSoftness: { value: 0.4 },
      },
      vertexShader: torchVertexShader,
      fragmentShader: torchFragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending, // Natural blending that works well with screen-like shader
      depthWrite: false,
    });
  }, []);
  
  useFrame((state) => {
    if (torchRef.current && shaderMaterial.uniforms) {
      const time = state.clock.elapsedTime;
      shaderMaterial.uniforms.time.value = time;
      
      // Subtle intensity pulse
      const pulse = 1.0 + Math.sin(time * 2.5) * 0.05;
      shaderMaterial.uniforms.intensity.value = 0.75 * pulse;
    }
  });
  
  return (
    <mesh 
      ref={torchRef} 
      position={[0, 0.1 + torchHeight / 2, 0]}
    >
      <coneGeometry args={[topRadius, bottomRadius, torchHeight, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

/**
 * Torch Light Outer Glow Layer
 * Soft outer halo for volumetric diffusion
 */
function TorchLightGlow() {
  const torchHeight = 1.4;
  const bottomRadius = 0.06;
  const topRadius = 0.32; // Even wider for soft glow
  
  return (
    <mesh position={[0, 0.1 + torchHeight / 2, 0]}>
      <coneGeometry args={[topRadius, bottomRadius, torchHeight, 64]} />
      <meshBasicMaterial
        color="#FFFFFF"
        transparent={true}
        opacity={0.25}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Volumetric Fog Layer for Beam
 * Soft gaussian-blurred outer layer
 */
function BeamVolumetricLayer() {
  const beamHeight = 1.0;
  const bottomRadius = 0.05;
  const topRadius = 0.22; // Wider for soft edges
  
  return (
    <mesh position={[0, 0.1 + beamHeight / 2, 0]}>
      <coneGeometry args={[topRadius, bottomRadius, beamHeight, 32]} />
      <meshBasicMaterial
        color="#88D4C4"
        transparent={true}
        opacity={0.15}
        side={THREE.DoubleSide}
        blending={THREE.MultiplyBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Particle Specks in Beam
 * Subtle floating particles within the light beam
 */
function BeamParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 40;
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.elapsedTime;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      // Animate particles floating upward with slight drift
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const particleTime = time * 0.3 + i * 0.1;
        
        // Vertical position cycles from bottom (0.1) to top of beam
        positions[i3 + 1] = 0.1 + (Math.sin(particleTime) * 0.5 + 0.5) * 1.0;
        
        // Small horizontal drift
        positions[i3] = Math.cos(particleTime * 0.5 + i) * 0.08;
        positions[i3 + 2] = Math.sin(particleTime * 0.5 + i) * 0.08;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Random positions within beam volume
      const heightRatio = Math.random();
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (0.05 + heightRatio * 0.15);
      
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = 0.1 + heightRatio * 1.0;
      positions[i3 + 2] = Math.sin(angle) * radius;
      
      sizes[i] = 0.02 + Math.random() * 0.03;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, []);
  
  return (
    <points ref={particlesRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.025}
        transparent={true}
        opacity={0.4}
        color="#B8E8E0"
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Shoe Rim Light
 * Subtle point light below shoe for rim highlight effect
 */
function ShoeRimLight() {
  return (
    <>
      <pointLight
        position={[0, 1.6, 0]}
        intensity={0.3}
        color="#88D4C4"
        distance={1}
        decay={2}
      />
      <pointLight
        position={[0, 1.2, 0]}
        intensity={0.2}
        color="#88D4C4"
        distance={0.8}
        decay={2}
      />
      {/* Additional spotlight from below to simulate beam glow on shoe underside */}
      <spotLight
        position={[0, 1.45, 0]}
        angle={0.4}
        penumbra={0.6}
        intensity={1.5}
        color="#FFFFFF"
        distance={0.5}
        decay={2}
        target-position={[0, 1.5, 0]}
      />
    </>
  );
}

/**
 * Circular Globe Platform
 * A rotating circular platform with enhanced lighting rings underneath the shoe
 */
function GlobePlatform() {
  const platformRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const middleRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (platformRef.current) {
      const time = state.clock.elapsedTime;
      
      // Rotate the rings in place (clockwise around their own axis)
      platformRef.current.rotation.y = time * 1.2;
      
      // Dynamic emissive intensity pulsing with teal rim highlight
      const tealColor = new THREE.Color("#88D4C4");
      
      if (outerRingRef.current) {
        const outerMaterial = outerRingRef.current.material as THREE.MeshStandardMaterial;
        outerMaterial.emissiveIntensity = 0.8 + Math.sin(time * 2) * 0.3;
        // Add faint teal rim highlight
        const baseEmissive = new THREE.Color("#E1B75A");
        outerMaterial.emissive.lerpColors(baseEmissive, tealColor, 0.12);
      }
      
      if (middleRingRef.current) {
        const middleMaterial = middleRingRef.current.material as THREE.MeshStandardMaterial;
        middleMaterial.emissiveIntensity = 0.6 + Math.sin(time * 2.5) * 0.2;
        // Add faint teal rim highlight
        const baseEmissive = new THREE.Color("#1FA07A");
        middleMaterial.emissive.lerpColors(baseEmissive, tealColor, 0.15);
      }
      
      if (innerRingRef.current) {
        const innerMaterial = innerRingRef.current.material as THREE.MeshStandardMaterial;
        innerMaterial.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.2;
        // Add faint teal rim highlight
        const baseEmissive = new THREE.Color("#ffffff");
        innerMaterial.emissive.lerpColors(baseEmissive, tealColor, 0.1);
      }
    }
  });
  
  return (
    <group ref={platformRef} position={[0, 0.1, 0]} scale={0.6}>
      {/* Outer circular ring - Gold */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.8, 0.08, 12, 24]} />
        <meshStandardMaterial
          color="#E1B75A"
          metalness={0.9}
          roughness={0.2}
          emissive="#E1B75A"
          emissiveIntensity={0.8}
        />
      </mesh>
      
      {/* Middle decorative ring - Emerald */}
      <mesh ref={middleRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.6, 0.05, 12, 24]} />
        <meshStandardMaterial
          color="#1FA07A"
          metalness={0.7}
          roughness={0.3}
          emissive="#1FA07A"
          emissiveIntensity={0.6}
        />
      </mesh>
      
      {/* Inner decorative ring - White */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow castShadow>
        <torusGeometry args={[0.4, 0.04, 12, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={0.5}
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
        
        {/* UFO-Style Spotlight Beam System */}
        {/* Circular light base at ring level */}
        <CircularLightBase />
        
        {/* Volumetric fog layer (outer soft layer) */}
        <BeamVolumetricLayer />
        
        {/* Main gradient beam */}
        <SpotlightBeam />
        
        {/* Particle specks within beam */}
        <BeamParticles />
        
        {/* Realistic Torch/Spotlight Beam - from ring to shoe sole */}
        <TorchLightGlow />
        <TorchLight />
        
        {/* Rim lights for shoe and ring */}
        <ShoeRimLight />
        
        {/* Contact Shadows removed */}
        
        
        {/* Orbit Controls disabled in hero section */}
        {/* <KeyboardCamera /> */}
        
        {/* Post-processing removed to eliminate white glow */}
      </Canvas>
    </div>
  );
}