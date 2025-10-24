/**
 * Procedurally Generated Shoe Model with LOD System & Type Variations
 * 
 * This component generates photorealistic placeholder shoes using
 * procedural geometry and PBR materials with Level of Detail (LOD) support.
 * 
 * SHOE TYPES:
 * - high-top: Tall ankle support, basketball/street style
 * - low-top: Classic sneaker profile  
 * - running: Streamlined athletic design
 * 
 * LOD LEVELS:
 * - LOD 0 (High): Full detail for close viewing (< 5 units)
 * - LOD 1 (Medium): Reduced detail for medium distance (5-10 units)
 * - LOD 2 (Low): Simplified geometry for far viewing (> 10 units)
 * 
 * TODO: Replace this procedural model with production GLB files
 * Production models should be placed in /client/public/models/
 * and loaded via useGLTF hook from @react-three/drei
 * 
 * Example production usage:
 * const { scene } = useGLTF('/models/luxsole-shoe.glb')
 * return <primitive object={scene.clone()} />
 */

import { useMemo, useRef, forwardRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MaterialType, ShoeType } from "@/lib/stores/useLuxSole";
import { createShoeMaterial } from "@/utils/three/materials";
import { createAdvancedShoeMaterial } from "@/utils/three/advancedMaterials";
import { createShoeGeometries } from "@/utils/three/shoeGeometries";

interface ShoeModelProps {
  baseColor: string;
  accentColor: string;
  material: MaterialType;
  shoeType?: ShoeType;
  envMap?: THREE.Texture | null;
  scale?: number;
  useAdvancedShaders?: boolean;
}

const ShoeModel = forwardRef<THREE.Group, ShoeModelProps>(({
  baseColor,
  accentColor,
  material,
  shoeType = "low-top",
  envMap = null,
  scale = 1,
  useAdvancedShaders = true,
}, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  const lodRef = useRef<THREE.LOD>(null);
  const [currentShoeType, setCurrentShoeType] = useState(shoeType);
  const transitionRef = useRef({ progress: 1, from: shoeType, to: shoeType });
  
  
  // Create materials with optional advanced shaders
  const baseMaterial = useMemo(
    () => {
      if (useAdvancedShaders) {
        return createAdvancedShoeMaterial(material, baseColor, envMap, true);
      }
      return createShoeMaterial(material, baseColor, envMap);
    },
    [material, baseColor, envMap, useAdvancedShaders]
  );
  
  const accentMaterial = useMemo(
    () => {
      if (useAdvancedShaders) {
        return createAdvancedShoeMaterial(material, accentColor, envMap, true);
      }
      return createShoeMaterial(material, accentColor, envMap);
    },
    [material, accentColor, envMap, useAdvancedShaders]
  );
  
  // Sole material (always rubber-like)
  const soleMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1a1a1a"),
      roughness: 0.8,
      metalness: 0.1,
    }),
    []
  );
  
  // Lace material (high detail only)
  const laceMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: new THREE.Color("#e8e8e8"),
      roughness: 0.6,
      metalness: 0.0,
    }),
    []
  );
  
  // Logo material
  const logoMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: "#E1B75A",
      metalness: 0.9,
      roughness: 0.2,
      emissive: "#E1B75A",
      emissiveIntensity: 0.2,
    }),
    []
  );
  
  // Handle shoe type transitions with smooth animation
  useEffect(() => {
    if (shoeType !== currentShoeType) {
      transitionRef.current = {
        progress: 0,
        from: currentShoeType,
        to: shoeType,
      };
    }
  }, [shoeType, currentShoeType]);
  
  // Create LOD levels based on current shoe type
  const lodGroup = useMemo(() => {
    const lod = new THREE.LOD();
    
    // Helper to build a LOD level
    const buildLODLevel = (lodLevel: "high" | "medium" | "low", addDetails: boolean) => {
      const group = new THREE.Group();
      const geoms = createShoeGeometries(currentShoeType, lodLevel);
      
      // Main shoe parts
      group.add(new THREE.Mesh(geoms.body, baseMaterial));
      group.add(new THREE.Mesh(geoms.toe, baseMaterial));
      group.add(new THREE.Mesh(geoms.heel, baseMaterial));
      group.add(new THREE.Mesh(geoms.sole, soleMaterial));
      group.add(new THREE.Mesh(geoms.midsole, accentMaterial));
      group.add(new THREE.Mesh(geoms.laceArea, accentMaterial));
      group.add(new THREE.Mesh(geoms.tongue, baseMaterial));
      group.add(new THREE.Mesh(geoms.heelTab, accentMaterial));
      
      // Optional parts (high-top collar, side panels)
      if (geoms.collar) {
        group.add(new THREE.Mesh(geoms.collar, accentMaterial));
      }
      if (geoms.sidePanel) {
        const sidePanelL = new THREE.Mesh(geoms.sidePanel, baseMaterial);
        group.add(sidePanelL);
        
        // Mirror for right side
        const sidePanelR = sidePanelL.clone();
        sidePanelR.position.z = -sidePanelL.position.z;
        sidePanelR.scale.z = -1;
        group.add(sidePanelR);
      }
      
      // Add lace details for high LOD
      if (addDetails) {
        const laceCount = currentShoeType === "high-top" ? 7 : currentShoeType === "running" ? 4 : 5;
        const laceYStart = currentShoeType === "high-top" ? 0.55 : currentShoeType === "running" ? 0.42 : 0.45;
        
        for (let i = 0; i < laceCount; i++) {
          const laceGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
          laceGeom.rotateZ(Math.PI / 2);
          laceGeom.translate(i * 0.15 - 0.2, laceYStart + i * 0.05, 0);
          const laceMesh = new THREE.Mesh(laceGeom, laceMaterial);
          laceMesh.castShadow = true;
          group.add(laceMesh);
        }
      }
      
      // Add logo
      if (addDetails || lodLevel === "medium") {
        const logoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.01), logoMaterial);
        const logoY = currentShoeType === "high-top" ? 0.5 : 0.35;
        logoMesh.position.set(0.5, logoY, 0.31);
        logoMesh.castShadow = true;
        group.add(logoMesh);
      }
      
      // Enable shadows for all meshes
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      return group;
    };
    
    // Build LOD levels
    lod.addLevel(buildLODLevel("high", true), 0);
    lod.addLevel(buildLODLevel("medium", false), 5);
    lod.addLevel(buildLODLevel("low", false), 10);
    
    return lod;
  }, [currentShoeType, baseMaterial, accentMaterial, soleMaterial, laceMaterial, logoMaterial]);
  
  // Update LOD, handle transitions, and update dynamic lighting
  const lightPosRef = useRef(new THREE.Vector3(5, 8, 5));
  const cameraPosRef = useRef(new THREE.Vector3(0, 0, 5));
  
  useFrame(({ camera, scene }, delta) => {
    if (lodRef.current) {
      lodRef.current.update(camera);
    }
    
    // Handle shoe type transition animation
    if (transitionRef.current.progress < 1) {
      transitionRef.current.progress = Math.min(1, transitionRef.current.progress + delta * 2);
      
      // Smooth crossfade using opacity
      if (groupRef.current) {
        const opacity = 1 - Math.abs(transitionRef.current.progress - 0.5) * 2;
        groupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.Material) {
            child.material.opacity = opacity;
            child.material.transparent = opacity < 1;
          }
        });
        
        // Switch shoe type at midpoint
        if (transitionRef.current.progress >= 0.5 && currentShoeType !== transitionRef.current.to) {
          setCurrentShoeType(transitionRef.current.to);
        }
      }
    }
    
    // Update lighting and camera for advanced shaders
    if (useAdvancedShaders) {
      // Get camera world position
      camera.getWorldPosition(cameraPosRef.current);
      
      // Find the brightest spot light
      let brightestLight: (THREE.SpotLight | THREE.DirectionalLight) | null = null;
      let maxIntensity = 0;
      
      scene.traverse((obj) => {
        if (obj instanceof THREE.SpotLight || obj instanceof THREE.DirectionalLight) {
          if (obj.intensity > maxIntensity) {
            maxIntensity = obj.intensity;
            brightestLight = obj as (THREE.SpotLight | THREE.DirectionalLight);
          }
        }
      });
      
      if (brightestLight) {
        (brightestLight as THREE.Object3D).getWorldPosition(lightPosRef.current);
      }
      
      // Update shader uniforms
      [baseMaterial, accentMaterial].forEach((mat) => {
        if (mat instanceof THREE.ShaderMaterial && mat.uniforms) {
          if (mat.uniforms.lightPosition) {
            mat.uniforms.lightPosition.value.copy(lightPosRef.current);
          }
          if (mat.uniforms.viewPosition) {
            mat.uniforms.viewPosition.value.copy(cameraPosRef.current);
          }
        }
      });
    }
  });
  
  // Combine refs
  const combinedRef = (node: THREE.Group) => {
    groupRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };
  
  // Modern sneaker model for development
  if (process.env.NODE_ENV === 'development') {
    return (
      <group ref={combinedRef} scale={scale}>
        {/* Main sneaker body - athletic silhouette */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.3, 0.8, 10, 16]} />
          <meshStandardMaterial 
            color={baseColor} 
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
            clearcoat={material === 'leather' ? 0.3 : 0}
            clearcoatRoughness={material === 'leather' ? 0.3 : 0}
          />
        </mesh>
        
        {/* Toe cap - classic sneaker front */}
        <mesh position={[0.4, 0, 0]}>
          <sphereGeometry args={[0.25, 12, 8, 0, Math.PI]} />
          <meshStandardMaterial 
            color={baseColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Heel counter - athletic back support */}
        <mesh position={[-0.4, 0.1, 0]}>
          <sphereGeometry args={[0.2, 10, 6, Math.PI, Math.PI]} />
          <meshStandardMaterial 
            color={baseColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Upper - sneaker upper section */}
        <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.25, 0.6, 6, 12]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
            clearcoat={material === 'leather' ? 0.3 : 0}
          />
        </mesh>
        
        {/* Side panels - sneaker side design */}
        <mesh position={[0.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        <mesh position={[-0.2, 0, 0]}>
          <boxGeometry args={[0.06, 0.3, 0.2]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Tongue - sneaker tongue */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[0.3, 0.2, 0.06]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Athletic sole system */}
        <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.35, 0.15, 10, 16]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        
        {/* Midsole - athletic midsole */}
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.32, 0.08, 10, 16]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        
        {/* Sneaker lacing system */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={i} position={[i * 0.1 - 0.2, 0.3, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.2, 6]} />
            <meshStandardMaterial 
              color="#f0f0f0" 
              roughness={0.6}
              metalness={0.0}
            />
          </mesh>
        ))}
        
        {/* Eyelets - sneaker eyelets */}
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={`eyelets-${i}`} position={[i * 0.1 - 0.2, 0.3, 0.1]}>
            <cylinderGeometry args={[0.012, 0.012, 0.015, 6]} />
            <meshStandardMaterial 
              color="#E1B75A" 
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
        ))}
        
        {/* Sneaker logo/branding */}
        <mesh position={[0.2, 0.15, 0.15]}>
          <boxGeometry args={[0.1, 0.05, 0.008]} />
          <meshStandardMaterial 
            color="#E1B75A" 
            roughness={0.2}
            metalness={0.9}
            emissive="#E1B75A"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Heel tab - sneaker heel tab */}
        <mesh position={[-0.3, 0.35, 0]}>
          <boxGeometry args={[0.1, 0.1, 0.04]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Sneaker stitching */}
        {Array.from({ length: 6 }, (_, i) => (
          <mesh key={`stitch-${i}`} position={[0.25, 0.05 + i * 0.04, 0.12]}>
            <cylinderGeometry args={[0.001, 0.001, 0.12, 4]} />
            <meshStandardMaterial 
              color="#E1B75A" 
              roughness={0.8}
              metalness={0.0}
            />
          </mesh>
        ))}
        
        {/* Toe bumper - sneaker toe protection */}
        <mesh position={[0.35, -0.05, 0]}>
          <boxGeometry args={[0.15, 0.05, 0.2]} />
          <meshStandardMaterial 
            color={baseColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Side stripes - athletic design element */}
        <mesh position={[0.15, 0.1, 0]}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        <mesh position={[-0.15, 0.1, 0]}>
          <boxGeometry args={[0.02, 0.15, 0.01]} />
          <meshStandardMaterial 
            color={accentColor}
            roughness={material === 'leather' ? 0.4 : material === 'nubuck' ? 0.9 : 0.3}
            metalness={material === 'glint' ? 0.8 : 0.1}
          />
        </mesh>
        
        {/* Ventilation mesh (for knit material) */}
        {material === 'knit' && Array.from({ length: 8 }, (_, i) => (
          <mesh key={`mesh-${i}`} position={[0.1, 0.05 + i * 0.04, 0.1]}>
            <boxGeometry args={[0.015, 0.008, 0.008]} />
            <meshStandardMaterial 
              color={accentColor}
              roughness={0.7}
              metalness={0.0}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group ref={combinedRef} scale={scale}>
      <primitive ref={lodRef} object={lodGroup} />
    </group>
  );
});

ShoeModel.displayName = "ShoeModel";

export default ShoeModel;
