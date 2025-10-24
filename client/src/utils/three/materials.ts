import * as THREE from "three";
import type { MaterialType } from "@/lib/stores/useLuxSole";

/**
 * Material configurations for different shoe materials
 * Each material has unique PBR properties for realistic rendering
 */

export interface MaterialConfig {
  roughness: number;
  metalness: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: THREE.Color;
  anisotropy?: number;
}

export const MATERIAL_CONFIGS: Record<MaterialType, MaterialConfig> = {
  // Leather: Low metalness, medium roughness, subtle clearcoat
  leather: {
    roughness: 0.4,
    metalness: 0.1,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
  },
  
  // Nubuck: High roughness, no metalness, soft appearance
  nubuck: {
    roughness: 0.9,
    metalness: 0.0,
    sheen: 0.5,
    sheenRoughness: 0.8,
    sheenColor: new THREE.Color(0.9, 0.9, 0.9),
  },
  
  // Glint: Metallic with anisotropic reflections
  glint: {
    roughness: 0.2,
    metalness: 0.8,
    clearcoat: 0.5,
    clearcoatRoughness: 0.1,
    anisotropy: 0.7,
  },
  
  // Knit: Fabric-like with sheen
  knit: {
    roughness: 0.7,
    metalness: 0.0,
    sheen: 0.8,
    sheenRoughness: 0.6,
    sheenColor: new THREE.Color(0.95, 0.95, 0.95),
  },
};

/**
 * Create a PBR material for shoe rendering
 * @param materialType - Type of material (leather, nubuck, glint, knit)
 * @param baseColor - Base color of the material
 * @param envMap - Environment map for reflections
 */
export function createShoeMaterial(
  materialType: MaterialType,
  baseColor: string | THREE.Color,
  envMap?: THREE.Texture | null
): THREE.MeshPhysicalMaterial {
  const config = MATERIAL_CONFIGS[materialType];
  const color = typeof baseColor === "string" ? new THREE.Color(baseColor) : baseColor;
  
  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: config.roughness,
    metalness: config.metalness,
    envMap: envMap || null,
    envMapIntensity: 1.5,
  });
  
  // Apply clearcoat for glossy materials
  if (config.clearcoat !== undefined) {
    material.clearcoat = config.clearcoat;
    material.clearcoatRoughness = config.clearcoatRoughness || 0;
  }
  
  // Apply sheen for fabric-like materials
  if (config.sheen !== undefined) {
    material.sheen = config.sheen;
    material.sheenRoughness = config.sheenRoughness || 0.5;
    if (config.sheenColor) {
      material.sheenColor = config.sheenColor;
    }
  }
  
  return material;
}

/**
 * Lerp between two materials for smooth transitions
 * @param mat1 - First material
 * @param mat2 - Second material
 * @param alpha - Interpolation factor (0-1)
 */
export function lerpMaterials(
  mat1: THREE.MeshPhysicalMaterial,
  mat2: THREE.MeshPhysicalMaterial,
  alpha: number
): void {
  mat1.roughness = THREE.MathUtils.lerp(mat1.roughness, mat2.roughness, alpha);
  mat1.metalness = THREE.MathUtils.lerp(mat1.metalness, mat2.metalness, alpha);
  
  if (mat1.clearcoat !== undefined && mat2.clearcoat !== undefined) {
    mat1.clearcoat = THREE.MathUtils.lerp(mat1.clearcoat, mat2.clearcoat, alpha);
  }
  
  if (mat1.sheen !== undefined && mat2.sheen !== undefined) {
    mat1.sheen = THREE.MathUtils.lerp(mat1.sheen, mat2.sheen, alpha);
  }
  
  mat1.color.lerp(mat2.color, alpha);
}

/**
 * Environment map URLs
 * TODO: Replace with actual HDR environment maps for production
 */
export const ENVIRONMENT_MAPS = {
  studio: "/environments/studio.hdr",
  runway: "/environments/runway.hdr",
  dusk: "/environments/dusk.hdr",
};
