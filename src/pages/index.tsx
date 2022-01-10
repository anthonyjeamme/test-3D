import React, { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree, Camera } from "@react-three/fiber"

import * as THREE from "three"

import { Plane, Box } from "@react-three/drei"

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader"
import { TextureLoader } from "three/src/loaders/TextureLoader"

import { useLoader } from "@react-three/fiber"

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

const IndexPage = () => {
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

  const [colorMap, displacementMap, normalMap, roughnessMap, aoMap] = useLoader(
    TextureLoader,
    [
      "texture/PavingStones092_1K_Color.jpg",
      "texture/PavingStones092_1K_Displacement.jpg",
      "texture/PavingStones092_1K_NormalDX.jpg",
      "texture/PavingStones092_1K_Roughness.jpg",
      "texture/PavingStones092_1K_AmbientOcclusion.jpg",
    ]
  )

  const BasicMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#ff0000"),
  })

  const RedMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color("#ff0000"),
  })

  const GreenMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color("#00ff00"),
  })

  const { gl, camera } = useThree()
  gl.setPixelRatio(1)

  useEffect(() => {
    console.log((camera.rotation.x = -Math.PI / 3.5))

    camera.position.y = 8
  }, [])

  let TreeMat = useLoader(MTLLoader, "/obj/tree/Trees.mtl")

  let tt = useLoader(OBJLoader, "/obj/tree/Trees.obj", loader => {
    TreeMat.preload()
  })

  useFrame((state, delta) => {
    // console.log(camera)

    // if (keyMap.LEFT) position.x -= delta * 8
    // if (keyMap.RIGHT) position.x += delta * 8

    if (keyMap.LEFT) position.rotation += delta * 3
    if (keyMap.RIGHT) position.rotation -= delta * 3

    // if (keyMap.UP) position.z -= delta * 8
    // if (keyMap.DOWN) position.z += delta * 8

    if (keyMap.UP) {
      position.z -= Math.cos(position.rotation) * delta * 6
      position.x -= Math.sin(position.rotation) * delta * 6
    }

    if (keyMap.DOWN) {
      position.z += Math.cos(position.rotation) * delta * 6
      position.x += Math.sin(position.rotation) * delta * 6
    }

    camera.position.x = position.x
    camera.position.z = position.z + 4
  })

  const ref = useRef()

  return (
    <>
      {/* @ts-ignore */}
      {/* <OrbitControls makeDefault /> */}
      <pointLight
        intensity={0.5}
        castShadow
        position={[0, 100, 0]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      {/* {[new Array(10)].map((_, x) =>
        [new Array(10)].map((_, y) => (
          <mesh
            key={`${x}-${y}`}
            ref={ref}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[x * 10, 0, y * 10]}
            receiveShadow
          >
            <planeBufferGeometry attach="geometry" args={[10, 10]} />
            <meshStandardMaterial
              side={THREE.DoubleSide}
              displacementScale={0.2}
              map={colorMap}
              displacementMap={displacementMap}
              normalMap={normalMap}
              roughnessMap={roughnessMap}
              aoMap={aoMap}
            />
          </mesh>
        ))
      )} */}

      <mesh position={[2, 1, 0]} castShadow ref={ref}>
        <sphereGeometry args={[1, 64, 64]} />

        <meshPhongMaterial color="royalblue" />
      </mesh>

      {/* {Array.from(new Array(10)).map((_, y) =>
        Array.from(new Array(10)).map((_, index) => (
          <mesh
            ref={ref}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[index * 10 - 20, 0, y * 10]}
          >
            <mesh receiveShadow>
              <planeBufferGeometry attach="geometry" args={[10, 10]} />
              <meshStandardMaterial
                displacementScale={0.2}
                map={colorMap}
                displacementMap={displacementMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                aoMap={aoMap}
              />
            </mesh>
          </mesh>
        ))
      )} */}

      {/* 
      <mesh>
        <primitive object={gltf.scene} dispose={null} position={[0, 0, 0]} />
      </mesh> */}

      {Array.from(new Array(1)).map((_, i) => {
        const o = tt.clone()

        o.castShadow = true
        o.receiveShadow = true

        return (
          <mesh castShadow receiveShadow>
            <primitive
              object={o}
              position={[i * 5 - 1, 0, -3]}
              castShadow
              receiveShadow
            />
          </mesh>
        )
      })}

      {/* <primitive object={fbx} position={[0, 0, 5]} material={[BasicMaterial]} /> */}

      <Player position={[0, 1.5, 0]} />

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
        <planeBufferGeometry attach="geometry" args={[100, 100]} />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>
    </>
  )
}

function Player(props) {
  // This reference gives us direct access to the THREE.Mesh object

  const mewTwoMat = useLoader(
    MTLLoader,
    "/obj/tree/obj/Mew two.mtl",
    materials => {
      console.log(materials)

      // obj =
    }
  )

  let obj = useLoader(OBJLoader, "/obj/tree/obj/Mew two.obj", loader => {
    console.log(loader)
    // mewTwoMat.preload()
    // loader.materials = mewTwoMat
  })
  const BasicMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color("#ff0000"),
  })

  obj.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true
      child.receiveShadow = true
      child.material = BasicMaterial
    }
  })

  // obj.castShadow = true
  // obj.receiveShadow = true

  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX

  useFrame((state, delta) => {
    ref.current.rotation.y = position.rotation
    ref.current.position.x = position.x
    ref.current.position.z = position.z
  })

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={event => click(!clicked)}
      onPointerOver={event => hover(true)}
      onPointerOut={event => hover(false)}
      castShadow
      receiveShadow
    >
      <primitive
        object={obj}
        dispose={null}
        position={[1.3, -1.5, 2.1]}
        rotation={[0, Math.PI, 0]}
        scale={0.03}
        castShadow
        receiveShadow
      />

      <meshStandardMaterial color={"hotpink"} />
    </mesh>
  )
}

const IndexPageContainer = () =>
  isBrowser() ? (
    <Suspense fallback={null}>
      <Canvas
        colorManagement
        shadows
        style={{
          height: "100vh",
        }}
      >
        <IndexPage />
      </Canvas>
    </Suspense>
  ) : null

export default IndexPageContainer

const isBrowser = () => ![typeof window, typeof document].includes("undefined")
