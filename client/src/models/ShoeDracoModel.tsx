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
      {/* All shoe parts in white */}
      <mesh
        geometry={(nodes as any).shoe?.geometry}
        material={materials.laces}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_1?.geometry}
        material={materials.mesh}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_2?.geometry}
        material={materials.caps}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_3?.geometry}
        material={materials.inner}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_4?.geometry}
        material={materials.sole}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_5?.geometry}
        material={materials.stripes}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_6?.geometry}
        material={materials.band}
        material-color="#ffffff"
      />
      <mesh
        geometry={(nodes as any).shoe_7?.geometry}
        material={materials.patch}
        material-color="#ffffff"
      />
    </group>
  );
});

ShoeDracoModel.displayName = "ShoeDracoModel";

export default ShoeDracoModel;

