import React, { useEffect, useRef } from "react"
import * as THREE from "three"

import { useAnimations } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useScene } from "../../../../game/input/scene/useScene"

export const HumanoidModel = ({
  url,
  castShadow = false,
  receiveShadow = false,
}) => {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, url)
  const currentAnimationRef = useRef("idle")
  const { actions } = useAnimations(gltf.animations, group)
  const currentActionRef = useRef(actions["idle"])

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "p") {
        fadeToAction("run", 1000)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const scene = useScene()

  function fadeToAction(name, duration) {
    const previousAction = currentActionRef.current
    currentActionRef.current = actions[name]

    if (previousAction !== currentActionRef.current) {
      previousAction?.fadeOut(duration)
    }

    currentActionRef.current
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play()
  }

  useFrame(() => {
    const player = scene.getPlayer()

    const walkAnimation = actions["run"]
    const idleAnimation = actions["idle"]

    if (player.speed) {
      if (currentAnimationRef.current !== "run") {
        currentAnimationRef.current = "run"

        fadeToAction("run", 0.2)

        // idleAnimation.stop()
        // walkAnimation.play()
      }
    } else {
      if (currentAnimationRef.current !== "idle") {
        currentAnimationRef.current = "idle"

        fadeToAction("idle", 0.2)

        // walkAnimation.stop()
        // idleAnimation.play()
      }
    }
  })

  useEffect(() => {
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = castShadow
        child.receiveShadow = receiveShadow
      }
    })
  }, [gltf])

  useEffect(() => {
    const idleAnimation = actions["idle"]

    idleAnimation.play()
  }, [])

  return (
    <group ref={group} scale={(1.115 * 1.75) / 2}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}
