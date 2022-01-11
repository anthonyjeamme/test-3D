import React from "react"

import { OrbitControls, useGLTF } from "@react-three/drei"
import { Lights } from "./Scene.lights"
import { Model, AnimatedModel } from "./Scene.model"

const Scene = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      <Model url="/models/ground.gltf" receiveShadow />
      <AnimatedModel url="/models/bot.gltf" castShadow />

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
