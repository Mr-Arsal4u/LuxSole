/**
 * Procedural Shoe Geometry Generators
 * 
 * Creates different shoe styles with varying levels of detail for LOD system:
 * - High-top: Tall ankle support, basketball/street style
 * - Low-top: Classic sneaker profile
 * - Running shoe: Streamlined athletic design
 */

import * as THREE from "three";

export type ShoeType = "high-top" | "low-top" | "running";
export type LODLevel = "high" | "medium" | "low";

export interface ShoeGeometries {
  body: THREE.BufferGeometry;
  toe: THREE.BufferGeometry;
  heel: THREE.BufferGeometry;
  sole: THREE.BufferGeometry;
  midsole: THREE.BufferGeometry;
  laceArea: THREE.BufferGeometry;
  tongue: THREE.BufferGeometry;
  heelTab: THREE.BufferGeometry;
  collar?: THREE.BufferGeometry; // High-top only
  sidePanel?: THREE.BufferGeometry; // Low-top/Running
}

/**
 * Create high-top basketball/street shoe geometry
 */
export function createHighTopGeometry(lodLevel: LODLevel): ShoeGeometries {
  const detail = lodLevel === "high" ? 32 : lodLevel === "medium" ? 16 : 8;
  
  // Taller main body for ankle support
  const bodyGeometry = new THREE.CapsuleGeometry(0.45, 1.6, detail / 2, detail);
  bodyGeometry.rotateZ(Math.PI / 2);
  bodyGeometry.translate(0, 0.5, 0);
  
  // Rounded toe
  const toeGeometry = new THREE.SphereGeometry(0.35, detail, detail / 2, 0, Math.PI);
  toeGeometry.rotateY(Math.PI / 2);
  toeGeometry.scale(1, 0.8, 1.2);
  toeGeometry.translate(0.8, 0.25, 0);
  
  // Prominent heel counter
  const heelGeometry = new THREE.SphereGeometry(0.35, detail, detail / 2, Math.PI, Math.PI);
  heelGeometry.rotateY(-Math.PI / 2);
  heelGeometry.scale(0.9, 1.2, 1.1);
  heelGeometry.translate(-0.8, 0.35, 0);
  
  // Thick sole for basketball style
  const soleGeometry = new THREE.BoxGeometry(1.6, 0.2, 0.65, lodLevel === "high" ? 4 : 2, 1, lodLevel === "high" ? 2 : 1);
  soleGeometry.translate(0, 0.1, 0);
  
  // Midsole accent
  const midsoleGeometry = new THREE.BoxGeometry(1.5, 0.12, 0.6, lodLevel === "high" ? 4 : 2, 1, lodLevel === "high" ? 2 : 1);
  midsoleGeometry.translate(0, 0.26, 0);
  
  // Extended lace area
  const laceAreaGeometry = new THREE.BoxGeometry(0.9, 0.6, 0.35, lodLevel === "high" ? 3 : 1, lodLevel === "high" ? 3 : 1, 1);
  laceAreaGeometry.translate(0.1, 0.7, 0);
  
  // Padded tongue
  const tongueGeometry = new THREE.BoxGeometry(0.45, 0.5, 0.12, lodLevel === "high" ? 2 : 1, lodLevel === "high" ? 3 : 1, 1);
  tongueGeometry.rotateX(Math.PI / 12);
  tongueGeometry.translate(0.1, 0.85, 0);
  
  // Tall heel tab/pull tab
  const heelTabGeometry = new THREE.BoxGeometry(0.18, 0.5, 0.35, 1, lodLevel === "high" ? 2 : 1, 1);
  heelTabGeometry.translate(-0.9, 0.7, 0);
  
  // Ankle collar (high-top specific)
  const collarGeometry = new THREE.TorusGeometry(0.42, 0.08, detail / 4, detail, Math.PI * 2);
  collarGeometry.rotateY(Math.PI / 2);
  collarGeometry.translate(0, 1.1, 0);
  
  return {
    body: bodyGeometry,
    toe: toeGeometry,
    heel: heelGeometry,
    sole: soleGeometry,
    midsole: midsoleGeometry,
    laceArea: laceAreaGeometry,
    tongue: tongueGeometry,
    heelTab: heelTabGeometry,
    collar: collarGeometry,
  };
}

/**
 * Create low-top classic sneaker geometry
 */
export function createLowTopGeometry(lodLevel: LODLevel): ShoeGeometries {
  const detail = lodLevel === "high" ? 32 : lodLevel === "medium" ? 16 : 8;
  
  // Standard sneaker body
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
  
  // Classic sole
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
  
  // Side panel reinforcement
  const sidePanelGeometry = new THREE.BoxGeometry(0.7, 0.35, 0.02, lodLevel === "high" ? 2 : 1, lodLevel === "high" ? 2 : 1, 1);
  sidePanelGeometry.translate(0, 0.4, 0.32);
  
  return {
    body: bodyGeometry,
    toe: toeGeometry,
    heel: heelGeometry,
    sole: soleGeometry,
    midsole: midsoleGeometry,
    laceArea: laceAreaGeometry,
    tongue: tongueGeometry,
    heelTab: heelTabGeometry,
    sidePanel: sidePanelGeometry,
  };
}

/**
 * Create streamlined running shoe geometry
 */
export function createRunningShoeGeometry(lodLevel: LODLevel): ShoeGeometries {
  const detail = lodLevel === "high" ? 32 : lodLevel === "medium" ? 16 : 8;
  
  // Streamlined, aerodynamic body
  const bodyGeometry = new THREE.CapsuleGeometry(0.38, 1.3, detail / 2, detail);
  bodyGeometry.rotateZ(Math.PI / 2);
  bodyGeometry.scale(1, 0.9, 0.95); // Narrower profile
  bodyGeometry.translate(0, 0.28, 0);
  
  // Sleek toe with upward curve
  const toeGeometry = new THREE.SphereGeometry(0.33, detail, detail / 2, 0, Math.PI);
  toeGeometry.rotateY(Math.PI / 2);
  toeGeometry.scale(1.1, 0.75, 1.15);
  toeGeometry.translate(0.65, 0.22, 0);
  
  // Minimal heel counter
  const heelGeometry = new THREE.SphereGeometry(0.28, detail, detail / 2, Math.PI, Math.PI);
  heelGeometry.rotateY(-Math.PI / 2);
  heelGeometry.scale(0.75, 0.95, 0.95);
  heelGeometry.translate(-0.65, 0.24, 0);
  
  // Performance sole with forefoot cushioning
  const soleGeometry = new THREE.BoxGeometry(1.5, 0.18, 0.55, lodLevel === "high" ? 4 : 2, 1, lodLevel === "high" ? 2 : 1);
  soleGeometry.scale(1, 1, 0.95);
  soleGeometry.translate(0.05, 0.09, 0);
  
  // Visible air/foam midsole
  const midsoleGeometry = new THREE.CapsuleGeometry(0.25, 1.1, lodLevel === "high" ? 2 : 1, detail);
  midsoleGeometry.rotateZ(Math.PI / 2);
  midsoleGeometry.scale(1, 0.5, 0.9);
  midsoleGeometry.translate(0, 0.22, 0);
  
  // Minimal lace area (often one-piece upper)
  const laceAreaGeometry = new THREE.BoxGeometry(0.85, 0.18, 0.28, lodLevel === "high" ? 3 : 1, 1, 1);
  laceAreaGeometry.translate(0.12, 0.48, 0);
  
  // Minimal tongue
  const tongueGeometry = new THREE.BoxGeometry(0.38, 0.25, 0.08, lodLevel === "high" ? 2 : 1, lodLevel === "high" ? 2 : 1, 1);
  tongueGeometry.rotateX(Math.PI / 16);
  tongueGeometry.translate(0.12, 0.58, 0);
  
  // Small heel tab
  const heelTabGeometry = new THREE.BoxGeometry(0.12, 0.35, 0.28, 1, lodLevel === "high" ? 2 : 1, 1);
  heelTabGeometry.translate(-0.75, 0.48, 0);
  
  // Side mesh panel
  const sidePanelGeometry = new THREE.BoxGeometry(0.75, 0.3, 0.02, lodLevel === "high" ? 3 : 1, lodLevel === "high" ? 2 : 1, 1);
  sidePanelGeometry.translate(0.05, 0.38, 0.3);
  
  return {
    body: bodyGeometry,
    toe: toeGeometry,
    heel: heelGeometry,
    sole: soleGeometry,
    midsole: midsoleGeometry,
    laceArea: laceAreaGeometry,
    tongue: tongueGeometry,
    heelTab: heelTabGeometry,
    sidePanel: sidePanelGeometry,
  };
}

/**
 * Main geometry factory - creates appropriate shoe geometry based on type
 */
export function createShoeGeometries(shoeType: ShoeType, lodLevel: LODLevel): ShoeGeometries {
  switch (shoeType) {
    case "high-top":
      return createHighTopGeometry(lodLevel);
    case "low-top":
      return createLowTopGeometry(lodLevel);
    case "running":
      return createRunningShoeGeometry(lodLevel);
    default:
      return createLowTopGeometry(lodLevel);
  }
}
