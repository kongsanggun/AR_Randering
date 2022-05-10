import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function Model(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/model/hat/christmas_hat2/scene.gltf')
    return (
      <group ref={group} {...props} dispose={null}>
      <group rotation={[-1.2, -0.04, 0]} position={[0.3, 1.08, -0.30]} scale={[0.09, 0.09, 0.09]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.material} />
      </group>
    </group>
    )
}

useGLTF.preload('/model/hat/christmas_hat2/scene.gltf');

export {Model};