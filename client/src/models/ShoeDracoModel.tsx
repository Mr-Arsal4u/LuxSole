/**
 * Simple White Shoe Model Component
 * 
 * Just loads and displays the shoe-draco.glb model in white
 */

import { forwardRef } from "react";
import { useGLTF } from "@react-three/drei";

interface ShoeDracoModelProps {
  scale?: number;
}

const ShoeDracoModel = forwardRef<THREE.Group, ShoeDracoModelProps>(({
  scale = 1,
}, ref) => {
  const { nodes, materials } = useGLTF("/shoe-draco.glb");

  return (
    <group ref={ref} scale={scale} dispose={null}>
      {/* Laces - Soft charcoal that complements green */}
      <mesh
        geometry={(nodes as any).shoe?.geometry}
        material={materials.laces}
        material-color="#374151"
        material-emissive="#000000"
        material-emissiveIntensity={0.05}
        material-roughness={0.3}
        material-metalness={0.1}
      />
      
      {/* Main upper mesh - Light gray-blue that complements green */}
      <mesh
        geometry={(nodes as any).shoe_1?.geometry}
        material={materials.mesh}
        material-color="#6b7280"
        material-emissive="#000000"
        material-emissiveIntensity={0.02}
        material-roughness={0.4}
        material-metalness={0.0}
        material-clearcoat={0.3}
        material-clearcoatRoughness={0.2}
      />
      
      {/* Caps/Toe cap - Matching light gray-blue */}
      <mesh
        geometry={(nodes as any).shoe_2?.geometry}
        material={materials.caps}
        material-color="#6b7280"
        material-emissive="#000000"
        material-emissiveIntensity={0.02}
        material-roughness={0.3}
        material-metalness={0.0}
      />
      
      {/* Inner lining - Soft gray */}
      <mesh
        geometry={(nodes as any).shoe_3?.geometry}
        material={materials.inner}
        material-color="#9ca3af"
        material-emissive="#000000"
        material-emissiveIntensity={0.01}
        material-roughness={0.5}
        material-metalness={0.0}
      />
      
      {/* Sole - Warm white that complements green theme */}
      <mesh
        geometry={(nodes as any).shoe_4?.geometry}
        material={materials.sole}
        material-color="#f7f7f7"
        material-emissive="#000000"
        material-emissiveIntensity={0.0}
        material-roughness={0.7}
        material-metalness={0.0}
      />
      
      {/* Stripes - LuxSole gold with metallic finish */}
      <mesh
        geometry={(nodes as any).shoe_5?.geometry}
        material={materials.stripes}
        material-color="#E1B75A"
        material-emissive="#E1B75A"
        material-emissiveIntensity={0.3}
        material-roughness={0.2}
        material-metalness={0.8}
      />
      
      {/* Band - Matching light gray-blue */}
      <mesh
        geometry={(nodes as any).shoe_6?.geometry}
        material={materials.band}
        material-color="#6b7280"
        material-emissive="#000000"
        material-emissiveIntensity={0.02}
        material-roughness={0.4}
        material-metalness={0.0}
        material-clearcoat={0.3}
        material-clearcoatRoughness={0.2}
      />
      
      {/* Patch/Logo - LuxSole gold with high shine */}
      <mesh
        geometry={(nodes as any).shoe_7?.geometry}
        material={materials.patch}
        material-color="#E1B75A"
        material-emissive="#E1B75A"
        material-emissiveIntensity={0.4}
        material-roughness={0.1}
        material-metalness={0.9}
      />
    </group>
  );
});

ShoeDracoModel.displayName = "ShoeDracoModel";

export default ShoeDracoModel;

