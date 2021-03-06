/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Mihail Burmistrov (https://sketchfab.com/mishkin79)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
source: https://sketchfab.com/3d-models/earrings-45b264dcf8d54ecb8b5d89856f86fc41
title: Earrings
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

function Model({ ...props }) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/model/earring/earring/scene.gltf')
  return (
    <group ref={group} {...props} dispose={null}>
      <group position={[0.685, -0.068, -0.22]} rotation={[0, 0, 0]} scale={0.0065}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.defaultMat} />
      </group>

      <group position={[-0.685, -0.068, -0.22]} rotation={[0, 0, 0]} scale={0.0065}>
        <mesh geometry={nodes.Object_2.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_3.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_4.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_5.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_6.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_7.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_8.geometry} material={materials.defaultMat} />
        <mesh geometry={nodes.Object_9.geometry} material={materials.defaultMat} />
      </group>

    </group>
  )
}

useGLTF.preload('/model/earring/earring/scene.gltf')

export {Model}
