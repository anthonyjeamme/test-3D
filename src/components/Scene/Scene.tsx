import React, { useEffect, useRef } from "react"
import { Physics, usePlane, useBox, useSpring } from "@react-three/cannon"

import { Lights } from "./Scene.lights"
import { Model, AnimatedModel, TranspText, SVGTexture } from "./Scene.model"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { TextureLoader } from "three"
import { HumanoidModel } from "../Renderers/WorldRenderer/Models/HumanoidModel"
import { useInput } from "../../game/input/useInput/useInput"
import { useScene } from "../../game/input/scene/useScene"

const Scene = () => {
  const reducedWallHeight = 2.5

  return (
    <>
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      {/* <group position={[0, 0, 0]}>
        <group scale={0.25}>
          <Model url="/models/ground.gltf" receiveShadow />
        </group>
      </group>  */}

      <Ground />
      {/* 
      <group
        scale={[0.07, 0.1, 0.1]}
        position={[4.3, 0, 0.6]}
        rotation={[0, Math.PI, 0]}
      >
        <Model url="/models/sofa.gltf" receiveShadow />
      </group> */}

      <group scale={0.2} position={[0, 0, 0]}>
        <Model url="/models/table.gltf" castShadow />
      </group>

      <group scale={0.2} position={[0, 0.8, 1.5]}>
        <Model url="/models/pot-fleurs.gltf" castShadow />
      </group>

      {/* 
      <group scale={0.2} position={[0, 0, 1.4]}>
        <Model url="/models/table.gltf" castShadow />
      </group> */}

      {/* <TranspText /> */}

      <Player />

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

const PCube = props => {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0.4, 0.2, 0.5],
    ...props,
  }))
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <boxGeometry />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  )
}

const PPlane = props => {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <shadowMaterial color="#FF0000" transparent opacity={0.4} />
      <meshLambertMaterial color="hotpink" />
    </mesh>
  )
}

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
// const position = {
//   x: 0.2,
//   y: 0,
//   z: 0,
//   speed: 0,
//   rotation: 0,
// }

export const getPlayerData = () => {
  return position
}

const Player = () => {
  const scene = useScene()
  const { actionIsActive } = useInput()

  const groupRef = useRef()

  const speed = 2

  useFrame((_, delta) => {
    let dx = 0,
      dz = 0

    if (actionIsActive("GO_LEFT")) dx -= 1
    if (actionIsActive("GO_RIGHT")) dx += 1
    if (actionIsActive("GO_UP")) dz -= 1
    if (actionIsActive("GO_DOWN")) dz += 1

    const player = scene.getPlayer()

    const { position } = player

    player.speed = Math.sqrt(dx * dx + dz * dz) ? 1 : 0

    if (actionIsActive("RUN") || true) {
      player.speed *= 2
    }

    if (player.speed) {
      position.rotation = Math.atan2(dx, dz)
      position.x += Math.sin(position.rotation) * delta * speed * player.speed
      position.z += Math.cos(position.rotation) * delta * speed * player.speed
    }

    groupRef.current.rotation.y = position.rotation
    groupRef.current.position.x = position.x
    groupRef.current.position.z = position.z
  })

  const { camera } = useThree()

  useEffect(() => {
    camera.position.y = 2
    camera.rotation.x = -Math.PI / 3
  }, [])

  useFrame(() => {
    const { position } = scene.getPlayer()
    camera.position.x = position.x
    camera.position.z = position.z + 2.5
    camera.position.y = position.y + 4.5
  })

  return (
    <group ref={groupRef} scale={0.9}>
      <mesh>
        <HumanoidModel url="/models/cool.gltf" castShadow />
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
