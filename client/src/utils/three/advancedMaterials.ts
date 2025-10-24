/**
 * Advanced Material System with Custom Shaders
 * 
 * Provides materials with advanced visual effects:
 * - Iridescent sheen for metallic surfaces
 * - Subsurface scattering for foam and laces
 * - Anisotropic specular for brushed finishes
 */

import * as THREE from "three";
import type { MaterialType } from "@/lib/stores/useLuxSole";

// Import shaders (Vite will handle these with vite-plugin-glsl)
import iridescentVertexShader from "@/shaders/iridescent.vert.glsl?raw";
import iridescentFragmentShader from "@/shaders/iridescent.frag.glsl?raw";
import subsurfaceVertexShader from "@/shaders/subsurface.vert.glsl?raw";
import subsurfaceFragmentShader from "@/shaders/subsurface.frag.glsl?raw";
import anisotropicVertexShader from "@/shaders/anisotropic.vert.glsl?raw";
import anisotropicFragmentShader from "@/shaders/anisotropic.frag.glsl?raw";

/**
 * Create iridescent material with rainbow sheen effect
 */
export function createIridescentMaterial(
  baseColor: string | THREE.Color,
  options: {
    intensity?: number;
    scale?: number;
    metalness?: number;
    roughness?: number;
  } = {}
): THREE.ShaderMaterial {
  const color = typeof baseColor === "string" ? new THREE.Color(baseColor) : baseColor;
  
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: color },
      iridescentIntensity: { value: options.intensity ?? 0.5 },
      iridescentScale: { value: options.scale ?? 2.0 },
      metalness: { value: options.metalness ?? 0.8 },
      roughness: { value: options.roughness ?? 0.3 },
      viewPosition: { value: new THREE.Vector3(0, 0, 5) },
    },
    vertexShader: iridescentVertexShader,
    fragmentShader: iridescentFragmentShader,
    side: THREE.DoubleSide,
  });
}

/**
 * Create subsurface scattering material for translucent surfaces
 */
export function createSubsurfaceMaterial(
  baseColor: string | THREE.Color,
  options: {
    subsurfaceColor?: THREE.Color;
    intensity?: number;
    thickness?: number;
    lightPosition?: THREE.Vector3;
    distortion?: number;
    power?: number;
    scale?: number;
  } = {}
): THREE.ShaderMaterial {
  const color = typeof baseColor === "string" ? new THREE.Color(baseColor) : baseColor;
  
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: color },
      subsurfaceColor: { value: options.subsurfaceColor ?? new THREE.Color("#ffccaa") },
      subsurfaceIntensity: { value: options.intensity ?? 0.7 },
      thickness: { value: options.thickness ?? 0.5 },
      lightPosition: { value: options.lightPosition ?? new THREE.Vector3(5, 8, 5) },
      viewPosition: { value: new THREE.Vector3(0, 0, 5) },
      distortion: { value: options.distortion ?? 0.3 },
      power: { value: options.power ?? 2.0 },
      scale: { value: options.scale ?? 1.0 },
    },
    vertexShader: subsurfaceVertexShader,
    fragmentShader: subsurfaceFragmentShader,
    side: THREE.DoubleSide,
  });
}

/**
 * Create anisotropic specular material for brushed surfaces
 */
export function createAnisotropicMaterial(
  baseColor: string | THREE.Color,
  options: {
    specularColor?: THREE.Color;
    roughnessX?: number;
    roughnessY?: number;
    intensity?: number;
    lightPosition?: THREE.Vector3;
    rotation?: number;
  } = {}
): THREE.ShaderMaterial {
  const color = typeof baseColor === "string" ? new THREE.Color(baseColor) : baseColor;
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: color },
      specularColor: { value: options.specularColor ?? new THREE.Color("#ffffff") },
      roughnessX: { value: options.roughnessX ?? 0.3 },
      roughnessY: { value: options.roughnessY ?? 0.6 },
      specularIntensity: { value: options.intensity ?? 1.0 },
      lightPosition: { value: options.lightPosition ?? new THREE.Vector3(5, 8, 5) },
      viewPosition: { value: new THREE.Vector3(0, 0, 5) },
      anisotropicRotation: { value: options.rotation ?? 0.0 },
    },
    vertexShader: anisotropicVertexShader,
    fragmentShader: anisotropicFragmentShader,
    side: THREE.DoubleSide,
  });
  
  return material;
}

/**
 * Enhanced material creator with shader effects
 */
export function createAdvancedShoeMaterial(
  materialType: MaterialType,
  color: string,
  envMap?: THREE.Texture | null,
  useAdvancedShaders = true
): THREE.Material {
  if (!useAdvancedShaders) {
    // Fallback to standard materials
    return createStandardMaterial(materialType, color, envMap);
  }
  
  const baseColor = new THREE.Color(color);
  
  switch (materialType) {
    case "leather":
      // Leather with subtle anisotropic highlights
      return createAnisotropicMaterial(baseColor, {
        roughnessX: 0.4,
        roughnessY: 0.6,
        intensity: 0.5,
        rotation: 0.25,
      });
      
    case "nubuck":
      // Nubuck with soft subsurface scattering
      return createSubsurfaceMaterial(baseColor, {
        subsurfaceColor: baseColor.clone().multiplyScalar(1.2),
        intensity: 0.4,
        thickness: 0.3,
        power: 1.5,
      });
      
    case "glint":
      // Metallic with iridescent sheen
      return createIridescentMaterial(baseColor, {
        intensity: 0.7,
        scale: 3.0,
        metalness: 0.9,
        roughness: 0.2,
      });
      
    case "knit":
      // Technical knit with anisotropic fiber pattern
      return createAnisotropicMaterial(baseColor, {
        roughnessX: 0.6,
        roughnessY: 0.2,
        intensity: 0.3,
        rotation: 0.5,
      });
      
    default:
      return createStandardMaterial(materialType, color, envMap);
  }
}

/**
 * Standard material fallback (from original materials.ts)
 */
function createStandardMaterial(
  materialType: MaterialType,
  color: string,
  envMap?: THREE.Texture | null
): THREE.MeshStandardMaterial {
  const baseColor = new THREE.Color(color);
  
  const materialConfigs: Record<MaterialType, Partial<THREE.MeshStandardMaterialParameters>> = {
    leather: {
      color: baseColor,
      roughness: 0.6,
      metalness: 0.1,
      envMapIntensity: 0.4,
    },
    nubuck: {
      color: baseColor,
      roughness: 0.9,
      metalness: 0.0,
      envMapIntensity: 0.2,
    },
    glint: {
      color: baseColor,
      roughness: 0.2,
      metalness: 0.9,
      envMapIntensity: 1.0,
    },
    knit: {
      color: baseColor,
      roughness: 0.7,
      metalness: 0.0,
      envMapIntensity: 0.3,
    },
  };
  
  const config = materialConfigs[materialType];
  
  return new THREE.MeshStandardMaterial({
    ...config,
    envMap: envMap ?? null,
  });
}

/**
 * Update shader material uniforms (for animation/interaction)
 */
export function updateShaderUniforms(
  material: THREE.ShaderMaterial,
  updates: Record<string, any>
): void {
  Object.keys(updates).forEach((key) => {
    if (material.uniforms[key]) {
      material.uniforms[key].value = updates[key];
    }
  });
}
