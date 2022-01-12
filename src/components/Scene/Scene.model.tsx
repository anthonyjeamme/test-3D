import React, { useEffect, useRef } from "react"

import * as THREE from "three"

import { useLoader } from "@react-three/fiber"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useAnimations } from "@react-three/drei"
import { TextureLoader } from "three"
import { getPlayerData } from "./Scene"

export const Model = ({ url, castShadow = false, receiveShadow = false }) => {
  const gltf = useLoader(GLTFLoader, url)

  const instanceRef = useRef(null)

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })
  }, [gltf])

  return (
    <primitive
      object={gltf.scene.clone()}
      dispose={null}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
    />
  )
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
      console.log("KEY UP")
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
  }, [])

  useEffect(() => {
    const idleAnimation = actions["idle"]

    idleAnimation.play()
  }, [])

  return (
    <group ref={group} scale={(1.115 * 1.75) / 2}>
      <primitive object={gltf} dispose={null} />
    </group>
  )
}

export const TranspText = () => {
  const colorMap = useLoader(TextureLoader, "/grass.png")

  const factor = 50

  return (
    <group>
      {Array.from(new Array(200)).map((_, i) => (
        <mesh
          scale={0.2}
          position={[Math.random() * 5 - 5, 0.75, 0.1 * i - 4]}
          rotation={[-0.2, 0, 0]}
        >
          {/* Width and height segments for displacementMap */}
          <planeBufferGeometry
            attach="geometry"
            args={[1601 / factor, 378 / factor]}
          />
          <meshStandardMaterial
            scale={[0.2, 0.2 * (i % 2 === 0 ? -1 : 1), 0.2]}
            map={colorMap}
            transparent={true}
          />
        </mesh>
      ))}
    </group>
  )
}

export const SVGTexture = () => {
  const colorMap = useLoader(TextureLoader, "/test.svg")

  const factor = 50

  return (
    <group>
      <mesh position={[0, 1, 0]} scale={1} rotation={[-Math.PI / 2, 0, 0]}>
        {/* Width and height segments for displacementMap */}
        <planeBufferGeometry attach="geometry" args={[2, 2]} />
        <meshStandardMaterial map={colorMap} />
      </mesh>
    </group>
  )
}
