import React, { useRef } from "react"

export const Lights = () => {
  const box = useRef()

  return (
    <>
      <ambientLight intensity={0.3} />

      <directionalLight positison={[10, 10, 5]} intensity={0.1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={0.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        target={box.current}
      />
      {/* Spotlight Large overhead light */}
      {/* <spotLight intensity={1} position={[1000, 0, 0]d} castShadow /> */}
    </>
  )
}
