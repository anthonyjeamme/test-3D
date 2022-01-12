import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"

import { useAnimations } from "@react-three/drei"
import { useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { useScene } from "../../../../game/input/scene/useScene"
import { useInput } from "../../../../game/input/useInput/useInput"

export const HumanoidModel = ({
  url,
  castShadow = false,
  receiveShadow = false,
}) => {
  const group = useRef()
  const gltf = useLoader(GLTFLoader, url)
  const currentAnimationRef = useRef("idle")
  const { actions, mixer } = useAnimations(gltf.animations, group)
  const currentActionRef = useRef(actions["idle"])

  const scene = useScene()

  const input = useInput()

  useEffect(() => {
    const handleSit = () => {
      if (scene.getPlayer().jumping) return

      if (scene.getPlayer().sitting) {
        changeToAction("idle")
        fadeToActionOnce("sit-to-stand", 0.2)
      } else {
        scene.getPlayer().sitting = true

        changeToAction("sit-idle")
        fadeToActionOnce("stand-to-sit", 0.2)
      }
    }

    const handleJump = () => {}

    input.addActionListener("SIT", handleSit)
    input.addActionListener("JUMP", handleJump)
    mixer.addEventListener("finished", event => {
      console.log(event.action._clip.name)

      const action = event.action._clip.name

      if (action === "stand-to-sit") {
        group.current.position.z = -0.5
        changeToAction("sit-idle")
      } else if (action === "sit-to-stand") {
        scene.getPlayer().sitting = false
        group.current.position.z = 0
        changeToAction("idle")
      }
    })

    return () => {
      input.removeActionListener("SIT", handleSit)
      input.removeActionListener("JUMP", handleJump)
    }
  }, [])

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

  function changeToAction(name) {
    const previousAction = currentActionRef.current
    currentActionRef.current = actions[name]

    previousAction?.stop()

    currentActionRef.current
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .play()
  }

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

  function fadeToActionOnce(name, duration) {
    const previousAction = currentActionRef.current
    currentActionRef.current = actions[name]

    if (previousAction !== currentActionRef.current) {
      previousAction?.fadeOut(duration)
    }

    return currentActionRef.current
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .setLoop(THREE.LoopOnce, 1)
      .play()
  }

  useFrame(() => {
    const player = scene.getPlayer()

    if (player.speed === 1) {
      if (currentAnimationRef.current !== "walk") {
        currentAnimationRef.current = "walk"
        fadeToAction("walk", 0.2)
      }
    } else if (player.speed === 3) {
      if (currentAnimationRef.current !== "run") {
        currentAnimationRef.current = "run"
        fadeToAction("run", 0.2)
      }
    } else {
      if (currentAnimationRef.current !== "idle") {
        currentAnimationRef.current = "idle"

        fadeToAction("idle", 0.2)
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
    <group ref={group} scale={(1.115 * 1.75) / 2} position={[0, 0, 0]}>
      <primitive object={gltf.scene} dispose={null} />
    </group>
  )
}
