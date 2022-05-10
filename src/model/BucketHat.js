import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function Model(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/model/hat/bucket_hat/scene.gltf')
    return (
      <group ref={group} {...props} dispose={null} rotation={[0, -Math.PI, 0]} position={[0, 0.58, -0.275]} scale={[2.7, 2.5, 2.5]} renderOrder={2}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.Object_4.geometry} material={materials.Cubo} />
            <mesh geometry={nodes.Object_5.geometry} material={materials.Cubo} />
          </group>
        </group>
      </group>
    )
}

useGLTF.preload('/model/hat/bucket_hat/scene.gltf');

export {Model};