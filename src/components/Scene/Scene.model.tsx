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
  const currentAnimationRef = useRef(null)

  const { actions } = useAnimations(gltf.animations, group)

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })

    const handleKeyUp = e => {
      const walkAnimation = actions["run"]
      const idleAnimation = actions["idle"]

      if (e.key === "z") {
        walkAnimation.stop()
        idleAnimation.play()
      } else if (e.key === "s") {
        walkAnimation.stop()
        idleAnimation.play()
      }
    }

    const handleKeyDown = e => {
      const idleAnimation = actions["idle"]
      const walkAnimation = actions["run"]

      if (e.key === "z") {
        idleAnimation.stop()
        walkAnimation.timeScale = 1
        walkAnimation.play()
        walkAnimation.paused = false
      } else if (e.key === "s") {
        idleAnimation.stop()
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

  useEffect(() => {
    const idleAnimation = actions["idle"]

    idleAnimation.play()
  }, [])

  return (
    <group ref={group}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}
