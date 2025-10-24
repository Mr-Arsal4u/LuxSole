/**
 * Procedurally Generated Shoe Model with LOD System
 * 
 * This component generates a photorealistic placeholder shoe using
 * procedural geometry and PBR materials with Level of Detail (LOD) support.
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

import { useMemo, useRef, forwardRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { MaterialType } from "@/lib/stores/useLuxSole";
import { createShoeMaterial } from "@/utils/three/materials";
import { createAdvancedShoeMaterial } from "@/utils/three/advancedMaterials";

interface ShoeModelProps {
  baseColor: string;
  accentColor: string;
  material: MaterialType;
  envMap?: THREE.Texture | null;
  scale?: number;
  useAdvancedShaders?: boolean;
}

/**
 * Generate shoe geometry at different LOD levels
 */
function createShoeGeometries(lodLevel: "high" | "medium" | "low") {
  const detail = lodLevel === "high" ? 32 : lodLevel === "medium" ? 16 : 8;
  
  // Main body (upper part of shoe)
  const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, detail / 2, detail);
  bodyGeometry.rotateZ(Math.PI / 2);
  bodyGeometry.translate(0, 0.3, 0);
  
  // Toe cap
  const toeGeometry = new THREE.SphereGeometry(0.35, detail, detail / 2, 0, Math.PI);
  toeGeometry.rotateY(Math.PI / 2);
  toeGeometry.scale(1, 0.8, 1.2);
  toeGeometry.translate(0.6, 0.2, 0);
  
  // Heel counter
  const heelGeometry = new THREE.SphereGeometry(0.3, detail, detail / 2, Math.PI, Math.PI);
  heelGeometry.rotateY(-Math.PI / 2);
  heelGeometry.scale(0.8, 1, 1);
  heelGeometry.translate(-0.6, 0.25, 0);
  
  // Sole (bottom)
  const soleGeometry = new THREE.BoxGeometry(1.4, 0.15, 0.6, lodLevel === "high" ? 4 : 2, 1, lodLevel === "high" ? 2 : 1);
  soleGeometry.translate(0, 0.075, 0);
  
  // Midsole accent
  const midsoleGeometry = new THREE.BoxGeometry(1.3, 0.1, 0.55, lodLevel === "high" ? 4 : 2, 1, lodLevel === "high" ? 2 : 1);
  midsoleGeometry.translate(0, 0.2, 0);
  
  // Lace area
  const laceAreaGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.3, lodLevel === "high" ? 3 : 1, 1, 1);
  laceAreaGeometry.translate(0.1, 0.5, 0);
  
  // Tongue
  const tongueGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.1, lodLevel === "high" ? 2 : 1, lodLevel === "high" ? 2 : 1, 1);
  tongueGeometry.rotateX(Math.PI / 12);
  tongueGeometry.translate(0.1, 0.6, 0);
  
  // Heel tab
  const heelTabGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.3, 1, lodLevel === "high" ? 2 : 1, 1);
  heelTabGeometry.translate(-0.7, 0.5, 0);
  
  return {
    body: bodyGeometry,
    toe: toeGeometry,
    heel: heelGeometry,
    sole: soleGeometry,
    midsole: midsoleGeometry,
    laceArea: laceAreaGeometry,
    tongue: tongueGeometry,
    heelTab: heelTabGeometry,
  };
}

const ShoeModel = forwardRef<THREE.Group, ShoeModelProps>(({
  baseColor,
  accentColor,
  material,
  envMap = null,
  scale = 1,
  useAdvancedShaders = true,
}, ref) => {
  const groupRef = useRef<THREE.Group>(null!);
  const lodRef = useRef<THREE.LOD>(null);
  
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
  
  // Create LOD levels once
  const lodGroup = useMemo(() => {
    const lod = new THREE.LOD();
    
    // High detail level (0-5 units)
    const highDetail = new THREE.Group();
    const highGeoms = createShoeGeometries("high");
    
    highDetail.add(new THREE.Mesh(highGeoms.body, baseMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.toe, baseMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.heel, baseMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.sole, soleMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.midsole, accentMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.laceArea, accentMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.tongue, baseMaterial));
    highDetail.add(new THREE.Mesh(highGeoms.heelTab, accentMaterial));
    
    // Add lace details for high LOD
    for (let i = 0; i < 5; i++) {
      const laceGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 8);
      laceGeom.rotateZ(Math.PI / 2);
      laceGeom.translate(i * 0.15 - 0.2, 0.45 + i * 0.05, 0);
      const laceMesh = new THREE.Mesh(laceGeom, laceMaterial);
      laceMesh.castShadow = true;
      highDetail.add(laceMesh);
    }
    
    // Add logo
    const logoMesh1 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.01), logoMaterial);
    logoMesh1.position.set(0.5, 0.35, 0.31);
    logoMesh1.castShadow = true;
    highDetail.add(logoMesh1);
    
    // Enable shadows for all meshes
    highDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    lod.addLevel(highDetail, 0);
    
    // Medium detail level (5-10 units)
    const mediumDetail = new THREE.Group();
    const medGeoms = createShoeGeometries("medium");
    
    mediumDetail.add(new THREE.Mesh(medGeoms.body, baseMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.toe, baseMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.heel, baseMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.sole, soleMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.midsole, accentMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.laceArea, accentMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.tongue, baseMaterial));
    mediumDetail.add(new THREE.Mesh(medGeoms.heelTab, accentMaterial));
    
    const logoMesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.01), logoMaterial);
    logoMesh2.position.set(0.5, 0.35, 0.31);
    logoMesh2.castShadow = true;
    mediumDetail.add(logoMesh2);
    
    mediumDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    lod.addLevel(mediumDetail, 5);
    
    // Low detail level (>10 units)
    const lowDetail = new THREE.Group();
    const lowGeoms = createShoeGeometries("low");
    
    lowDetail.add(new THREE.Mesh(lowGeoms.body, baseMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.toe, baseMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.heel, baseMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.sole, soleMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.midsole, accentMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.laceArea, accentMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.tongue, baseMaterial));
    lowDetail.add(new THREE.Mesh(lowGeoms.heelTab, accentMaterial));
    
    lowDetail.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    lod.addLevel(lowDetail, 10);
    
    return lod;
  }, [baseMaterial, accentMaterial, soleMaterial, laceMaterial, logoMaterial]);
  
  // Update LOD based on camera distance and dynamic lighting
  const lightPosRef = useRef(new THREE.Vector3(5, 8, 5));
  const cameraPosRef = useRef(new THREE.Vector3(0, 0, 5));
  
  useFrame(({ camera, scene }) => {
    if (lodRef.current) {
      lodRef.current.update(camera);
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
