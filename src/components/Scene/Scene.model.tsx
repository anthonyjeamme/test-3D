import React from "react"

import { useLoader } from "@react-three/fiber"

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

export const Model = ({ url }) => {
  const gltf = useLoader(GLTFLoader, url)

  return <primitive object={gltf.scene} dispose={null} />
}
