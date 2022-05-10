// @ts-nocheck
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Paulina (https://sketchfab.com/Byakko)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
.com/3d-models/wizards-hat-68a9fb2dbd8442a5bacf9c0141320308source: https://sketchfab
title: Wizard's hat
*/

import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

function Model(props) {
    const group = useRef()
    const { nodes, materials } = useGLTF('/model/hat/wizards_hat/scene.gltf')
    return (
      <group ref={group} {...props} dispose={null} rotation={[0, -Math.PI, 0]} position={[0, 1.825, 0]} scale={[1.65, 1.65, 1.65]} renderOrder={2}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.defaultMaterial.geometry} material={materials.lambert21} />
            <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.lambert21} />
            <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.lambert21} />
            <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.lambert21} />
            <mesh geometry={nodes.defaultMaterial_4.geometry} material={materials.lambert21} />
            <mesh geometry={nodes.defaultMaterial_5.geometry} material={materials.lambert21} />
          </group>
        </group>
      </group>
    )
}

useGLTF.preload('/model/hat/wizards_hat/scene.gltf');

export {Model};