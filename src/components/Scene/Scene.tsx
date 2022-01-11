import React from "react"

import { OrbitControls, useGLTF } from "@react-three/drei"
import { Lights } from "./Scene.lights"
import { Model } from "./Scene.model"

const Scene = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <Lights />

      {/* <Model url="/models/armchairYellow.gltf" /> */}

      <Model url="/models/ground.gltf" />

      {/* <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial color={"hotpink"} />
      </mesh> */}
    </>
  )
}

export default Scene
