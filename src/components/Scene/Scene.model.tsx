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

  console.log(Object.keys(actions))

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })

    const handleKeyUp = e => {
      const walkAnimation = actions["Armature|mixamo.com|Layer0.002"]
      if (e.key === "ArrowUp") {
        walkAnimation.paused = true
      } else if (e.key === "ArrowDown") {
        walkAnimation.paused = true
      }
    }

    const handleKeyDown = e => {
      const walkAnimation = actions["Armature|mixamo.com|Layer0.002"]

      if (e.key === "ArrowUp") {
        walkAnimation.timeScale = 1
        walkAnimation.play()
        walkAnimation.paused = false
      } else if (e.key === "ArrowDown") {
        walkAnimation.timeScale = -1
        walkAnimation.play()
        walkAnimation.paused = false
      }
    }

    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [gltf])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}
