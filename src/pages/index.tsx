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
import Scene from "../components/Scene/Scene"

import "./style.scss"
import { InputContext } from "../game/input/useInput/useInput"
import { SceneContext } from "../game/input/scene/useScene"

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

const IndexPageContainer = () => {
  const [constructionMode, setConstructionMode] = useState(false)

  return isBrowser() ? (
    <div
      onContextMenu={e => {
        e.preventDefault()
      }}
    >
      <UI
        constructionMode={constructionMode}
        handleToggleConstructionMode={mode => {
          setConstructionMode(mode === constructionMode ? null : mode)
        }}
      />
      <Suspense fallback={null}>
        <Canvas
          concurrent
          colorManagement
          shadows
          style={{
            height: "100vh",
          }}
        >
          <InputContext>
            <SceneContext>
              <Scene constructionMode={constructionMode} />
            </SceneContext>
          </InputContext>
        </Canvas>
      </Suspense>
    </div>
  ) : null
}

export default IndexPageContainer

const isBrowser = () => ![typeof window, typeof document].includes("undefined")

const UI = ({ handleToggleConstructionMode, constructionMode }) => {
  return (
    <div className="UI">
      <div className="bottom-right">
        <button
          style={{ opacity: constructionMode === "wall" ? 1 : 0.7 }}
          className="green-button"
          onClick={() => {
            handleToggleConstructionMode("wall")
          }}
        >
          Murs
        </button>

        <button
          style={{ opacity: constructionMode === "box" ? 1 : 0.7 }}
          className="green-button"
          onClick={() => {
            handleToggleConstructionMode("box")
          }}
        >
          Boites
        </button>
      </div>
    </div>
  )
}

const GreenBG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 374.97 151.46"
    style={{
      height: 60,
    }}
  >
    <polygon
      points="374.97 36.4 369.11 39.74 372.88 41.63 367.44 80.17 365.97 90.58 367.44 105.01 369.53 125.52 373.3 134.31 368.69 149.16 363.88 151.46 346.52 147.9 297.35 145.18 266.18 149.16 237.34 142.97 163.91 142.97 115.14 146.86 87.52 144.97 70.99 148.74 30.41 144.56 11.79 150.41 3 145.6 6.35 133.89 5.1 126.77 11.79 115.65 11.79 54.46 7.81 30.33 10.95 28.66 7.81 20.71 6.77 11.59 14.09 4.39 36.89 9.2 49.24 6.27 117.44 9.62 133.21 11.59 231.22 11.59 250.7 9.83 267.19 11.59 292.51 11.59 316.39 7.95 357.4 9.83 365.56 5.64 374.97 9.62 369.95 22.17 374.97 36.4"
      fill="#183a1f"
    />
    <polygon
      fill="#40a058"
      points="371.97 32.01 366.11 35.35 369.88 37.24 364.44 75.78 362.97 86.19 364.44 100.62 366.53 121.13 370.3 129.92 365.69 144.77 360.88 147.07 343.52 143.51 294.35 140.79 263.18 144.77 234.34 138.58 160.91 138.58 112.14 142.47 84.52 140.58 67.99 144.35 27.41 140.17 8.79 146.02 0 141.21 3.35 129.5 2.1 122.38 8.79 111.26 8.79 50.07 4.81 25.94 7.95 24.27 4.81 16.32 3.77 7.2 11.09 0 33.89 4.81 46.24 1.88 114.44 5.23 130.21 7.2 228.22 7.2 247.7 5.44 264.19 7.2 289.51 7.2 313.39 3.56 354.4 5.44 362.56 1.25 371.97 5.23 366.95 17.78 371.97 32.01"
    />
  </svg>
)
