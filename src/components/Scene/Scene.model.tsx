import React, { useEffect, useRef } from "react"

import * as THREE from "three"

import { useLoader } from "@react-three/fiber"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useAnimations } from "@react-three/drei"

export const Model = ({ url, castShadow = false, receiveShadow = false }) => {
  const gltf = useLoader(GLTFLoader, url)

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })
  }, [gltf])

  return <primitive object={gltf.scene} dispose={null} />
}

export const AnimatedModel = ({
  url,
  castShadow = false,
  receiveShadow = false,
}) => {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, url)

  const { actions } = useAnimations(gltf.animations, group)

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })

    actions["Armature.001|mixamo.com|Layer0"].play()
  }, [gltf])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}
