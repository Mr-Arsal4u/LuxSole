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
  
  return (
    <group ref={combinedRef} scale={scale}>
      <primitive ref={lodRef} object={lodGroup} />
    </group>
  );
});

ShoeModel.displayName = "ShoeModel";

export default ShoeModel;
