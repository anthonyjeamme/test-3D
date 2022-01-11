import React, { useEffect, useRef } from "react"

import { Lights } from "./Scene.lights"
import { Model, AnimatedModel, TranspText } from "./Scene.model"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { TextureLoader } from "three"

const Scene = () => {
  const reducedWallHeight = 1.2

  return (
    <>
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      {/* <group position={[0, 0, 0]}>
        <group scale={0.25}>
          <Model url="/models/ground.gltf" receiveShadow />
        </group>
      </group> */}

      <Ground />

      <group
        scale={[0.1, 0.1, 0.15]}
        position={[4.2, 0, 0.35]}
        rotation={[0, Math.PI, 0]}
      >
        <Model url="/models/sofa.gltf" receiveShadow />
      </group>

      {/* <TranspText /> */}

      <Player />

      <Wall direction="h" length={9.7} y={-4.5} x={0.3} />
      <Wall
        direction="h"
        length={4.8}
        y={4.5}
        height={reducedWallHeight}
        x={-2.2}
      />

      <Wall
        direction="h"
        length={4}
        y={4.5}
        height={reducedWallHeight}
        x={3.2}
      />

      <Wall
        direction="h"
        length={4.2}
        y={4.5 - 2.9}
        x={-2.3}
        height={reducedWallHeight}
        width={0.1}
      />

      <Wall
        direction="h"
        length={4.2}
        y={4.5 - 2.9 - 2.8}
        x={-2.3}
        height={reducedWallHeight}
        width={0.1}
      />

      <Wall
        direction="h"
        length={0.3}
        y={4.5 - 2.9 - 2.8 - 1.1}
        x={-0.5}
        height={reducedWallHeight}
        width={0.1}
      />

      <Wall
        direction="h"
        length={1}
        y={4.5 - 2.9 - 2.8 - 1.1}
        x={1.4}
        height={reducedWallHeight}
        width={0.1}
      />

      <Wall
        direction="v"
        height={reducedWallHeight}
        length={1.9}
        x={-0.7}
        y={-3.35}
        width={0.1}
      />

      {/* Wall bed 1 */}
      <Wall
        direction="v"
        height={reducedWallHeight}
        length={2}
        x={-0.2}
        y={0.65}
        width={0.1}
      />

      {/* Toilets */}

      <Wall
        direction="v"
        height={reducedWallHeight}
        length={0.8}
        x={-0.2}
        y={4.2}
        width={0.1}
      />
      <Wall
        direction="hs"
        height={reducedWallHeight}
        length={0.9}
        x={-0.6}
        y={3}
        width={0.1}
      />

      <Wall
        direction="v"
        height={reducedWallHeight}
        length={1.55}
        x={-1}
        y={3.8}
        width={0.1}
      />

      <Wall
        direction="v"
        height={reducedWallHeight}
        length={1.9}
        x={-0.7 + 2.57}
        y={-3.35}
        width={0.1}
      />

      <Wall
        direction="h"
        length={4.4}
        y={4.5 - 2.9 - 2.8}
        x={3.2}
        height={reducedWallHeight}
        width={0.1}
      />

      <Wall direction="v" length={9} x={-4.5} />
      <Wall direction="v" length={9} x={5.2} />

      {/* <Wall direction="v" length={9 * 2} x={9} /> */}
      {/* <Wall direction="h" length={9 * 2} y={-9} />
      <Wall direction="h" length={9 * 2} y={9} />

      <Wall direction="h" length={7} y={4} x={-5.5} />
      <Wall direction="h" length={7} y={-2} x={-5.5} />

      <Wall direction="h" length={7} y={-2} x={5.5} /> */}

      {/* <Wall direction="v" length={4} x={2} />

      <Wall direction="h" length={4} y={-2} />

      <Wall direction="h" length={4} y={2} x={4} /> */}

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

const Wall = ({
  height = 2.5,
  direction = "h",
  length,
  x = 0,
  y = 0,
  width = 0.2,
}) => {
  return (
    <group
      position={[0 + x, height / 2, y]}
      rotation={[0, direction === "v" ? Math.PI / 2 : 0, 0]}
    >
      <mesh>
        <boxGeometry args={[length, height, width]} />

        <meshStandardMaterial color={"#e9d7ce"} />
      </mesh>
    </group>
  )
}

const Ground = () => {
  const colorMap = useLoader(TextureLoader, "/models/texture/plancher.jpg")

  return (
    <group>
      {Array.from(new Array(5)).map((_, y) =>
        Array.from(new Array(5)).map((_, x) => (
          <mesh
            scale={0.2}
            position={[y * 4 - 7, 0, x * 4 - 7]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            {/* Width and height segments for displacementMap */}
            <planeBufferGeometry attach="geometry" args={[20, 20]} />
            <meshStandardMaterial
              scale={[0.2, 0.2, 0.2]}
              map={colorMap}
              transparent={true}
            />
          </mesh>
        ))
      )}
    </group>
  )
}
