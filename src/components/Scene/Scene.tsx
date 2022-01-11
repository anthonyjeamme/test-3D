import React, { useEffect, useRef } from "react"

import { OrbitControls, useGLTF } from "@react-three/drei"
import { Lights } from "./Scene.lights"
import { Model, AnimatedModel, TranspText } from "./Scene.model"
import { useFrame, useThree } from "@react-three/fiber"

const Scene = () => {
  return (
    <>
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      <group position={[0, 0, 0]}>
        <group scale={0.25}>
          <Model url="/models/ground.gltf" receiveShadow />
        </group>
      </group>

      <TranspText />

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

  const speed = 4

  useFrame((_, delta) => {
    if (keyMap.LEFT) position.rotation += delta * 3
    if (keyMap.RIGHT) position.rotation -= delta * 3

    if (keyMap.UP) {
      position.z += Math.cos(position.rotation) * delta * speed
      position.x += Math.sin(position.rotation) * delta * speed
    }

    if (keyMap.DOWN) {
      position.z -= Math.cos(position.rotation) * delta * speed
      position.x -= Math.sin(position.rotation) * delta * speed
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
      <AnimatedModel url="/models/cool.gltf" castShadow />
    </group>
  )
}

const useKeyHandling = () => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === "z") {
        keyMap.UP = true
      }
      if (e.key === "s") {
        keyMap.DOWN = true
      }
      if (e.key === "q") {
        keyMap.LEFT = true
      }
      if (e.key === "d") {
        keyMap.RIGHT = true
      }
    }
    const handleKeyUp = e => {
      if (e.key === "z") {
        keyMap.UP = false
      }
      if (e.key === "s") {
        keyMap.DOWN = false
      }
      if (e.key === "q") {
        keyMap.LEFT = false
      }
      if (e.key === "d") {
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
