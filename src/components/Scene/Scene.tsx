import React, { useEffect, useRef } from "react"

import { OrbitControls, useGLTF } from "@react-three/drei"
import { Lights } from "./Scene.lights"
import { Model, AnimatedModel } from "./Scene.model"
import { useFrame, useThree } from "@react-three/fiber"

const Scene = () => {
  return (
    <>
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      <group scale={0.5}>
        <Model url="/models/ground.gltf" receiveShadow />
      </group>

      <Player />

      {/* <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial color={"hotpink"} />
      </mesh> */}
    </>
  )
}

export default Scene

const Cube = () => {
  return (
    <>
      <mesh position={[0, 1, 0]} castShadow>
        <boxBufferGeometry args={[1, 1, 1]} attach="geometry" />
        <meshPhongMaterial color={"#ff0000"} attach="material" />
      </mesh>
    </>
  )
}

const keyMap = {
  UP: false,
  DOWN: false,
  LEFT: false,
  RIGHT: false,
}

const position = {
  x: 0.2,
  y: 0,
  z: 0,
  rotation: 0,
}

const Player = () => {
  useKeyHandling()

  const groupRef = useRef()

  useFrame((_, delta) => {
    if (keyMap.LEFT) position.rotation += delta * 3
    if (keyMap.RIGHT) position.rotation -= delta * 3

    if (keyMap.UP) {
      position.z += Math.cos(position.rotation) * delta * 2
      position.x += Math.sin(position.rotation) * delta * 2
    }

    if (keyMap.DOWN) {
      position.z -= Math.cos(position.rotation) * delta * 2
      position.x -= Math.sin(position.rotation) * delta * 2
    }
  })

  useFrame((state, delta) => {
    groupRef.current.rotation.y = position.rotation
    groupRef.current.position.x = position.x
    groupRef.current.position.z = position.z
  })

  const { camera } = useThree()

  useEffect(() => {
    camera.position.y = 2
    camera.rotation.x = -Math.PI / 3.5
  }, [])

  useFrame(() => {
    camera.position.x = position.x
    camera.position.z = position.z + 4
    camera.position.y = position.y + 6
  })

  return (
    <group ref={groupRef}>
      <AnimatedModel url="/models/bot.gltf" castShadow />
    </group>
  )
}

const useKeyHandling = () => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "ArrowUp") {
        keyMap.UP = true
      }
      if (e.key === "ArrowDown") {
        keyMap.DOWN = true
      }
      if (e.key === "ArrowLeft") {
        keyMap.LEFT = true
      }
      if (e.key === "ArrowRight") {
        keyMap.RIGHT = true
      }
    }
    const handleKeyUp = e => {
      if (e.key === "ArrowUp") {
        keyMap.UP = false
      }
      if (e.key === "ArrowDown") {
        keyMap.DOWN = false
      }
      if (e.key === "ArrowLeft") {
        keyMap.LEFT = false
      }
      if (e.key === "ArrowRight") {
        keyMap.RIGHT = false
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])
}
