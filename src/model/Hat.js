/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Andrea Spognetta (Spogna) (https://sketchfab.com/spogna)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/hat-01-rawscan-bbed960e1cfd4ede8d0cf4755532865b
title: Hat 01  .::RAWscan::.
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/model/hat_01/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null} position={[-0.1, 1, -0.28]} scale={[0.8, 0.8, 0.8]}>
      <group rotation={[-Math.PI, 0, 0]}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.material_0} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.material_0} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.material_0} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.material_0} />
      </group>
    </group>
  )
}

useGLTF.preload('/model/hat_01/scene.gltf')

export {Model}
