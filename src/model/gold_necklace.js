/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Mckai (https://sketchfab.com/Mckai)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/gold-necklace-chain-8bb2ebea4fbd4a3a9b21cba9f5d5fdc8
title: Gold necklace / chain
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/model/necklace/gold_necklace__chain/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0.0, -0.35, -0.70]} rotation={[0, 0, 0]} scale={[7, 5.5, 5]}>
        <mesh geometry={nodes.Neclace_Silver_0.geometry} material={materials.Silver} />
      </group>
    </group>
  )
}

useGLTF.preload('/model/necklace/gold_necklace__chain/scene.gltf')

export {Model}
