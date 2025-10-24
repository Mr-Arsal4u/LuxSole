/**
 * Dynamic Lighting Hook
 * 
 * Updates shader uniforms with current scene lighting information
 */

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

interface LightingUniforms {
  lightPosition: { value: THREE.Vector3 };
}

/**
 * Hook to update shader materials with dynamic lighting
 * Tracks the main directional/spot light position
 */
export function useDynamicLighting(material: THREE.Material | null) {
  const lightPosRef = useRef(new THREE.Vector3(5, 8, 5));
  
  useFrame(({ scene }) => {
    if (!material || !(material instanceof THREE.ShaderMaterial)) {
      return;
    }
    
    // Find the brightest spot/directional light in the scene
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
    
    // Update shader uniform if it exists
    if (material.uniforms && material.uniforms.lightPosition) {
      material.uniforms.lightPosition.value.copy(lightPosRef.current);
    }
  });
  
  return lightPosRef.current;
}

/**
 * Update light position for a group of materials
 */
export function updateMaterialsLighting(
  materials: THREE.Material[],
  lightPosition: THREE.Vector3
): void {
  materials.forEach((mat) => {
    if (mat instanceof THREE.ShaderMaterial && mat.uniforms?.lightPosition) {
      mat.uniforms.lightPosition.value.copy(lightPosition);
    }
  });
}
