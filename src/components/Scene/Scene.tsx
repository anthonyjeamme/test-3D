import React, { useEffect, useRef, useState } from "react"
import { Physics, usePlane, useBox, useSpring } from "@react-three/cannon"

import { Lights } from "./Scene.lights"
import { Model, AnimatedModel, TranspText, SVGTexture } from "./Scene.model"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { TextureLoader } from "three"
import { HumanoidModel } from "../Renderers/WorldRenderer/Models/HumanoidModel"
import { useInput } from "../../game/input/useInput/useInput"
import { useScene } from "../../game/input/scene/useScene"

const getMatrix = (name, size) => {
  const data = localStorage.getItem(name)

  if (!data)
    return Array.from(new Array(size)).map(() =>
      Array.from(new Array(size)).map(() => 0)
    )

  return JSON.parse(data)
}

const store = (name, data) => {
  localStorage.setItem(name, JSON.stringify(data))
  return data
}

const Scene = ({ constructionMode }) => {
  const constructibleZoneSize = 30

  const [objects, setObjects] = useState(
    getMatrix("obj", constructibleZoneSize)
  )

  const [hwalls, setHwalls] = useState(
    getMatrix("hwall", constructibleZoneSize)
  )

  const [vwalls, setVwalls] = useState(
    getMatrix("vwall", constructibleZoneSize)
  )

  const handleConstructHWall = (x, y, n) => {
    setHwalls(
      store(
        "hwall",
        hwalls.map((_, i) => (i === x ? _.map((_, j) => (j === y ? n : _)) : _))
      )
    )
  }

  const handleConstructVWall = (x, y, n) => {
    setVwalls(
      store(
        "vwall",
        vwalls.map((_, i) => (i === x ? _.map((_, j) => (j === y ? n : _)) : _))
      )
    )
  }

  const handleConstructAt = (x, y, what) => {
    setObjects(
      store(
        "obj",
        objects.map((_, i) =>
          i === x ? _.map((_, j) => (j === y ? what : _)) : _
        )
      )
    )
  }

  return (
    <>
      <Lights />

      {/* <group position={[0, 0, 0]}>
        <group scale={0.25}>
          <Model url="/models/ground.gltf" receiveShadow />
        </group>
      </group>  */}

      <ConstructionPlots
        objects={objects}
        handleConstructAt={handleConstructAt}
        constructibleZoneSize={constructibleZoneSize}
        constructionMode={constructionMode}
        hwalls={hwalls}
        vwalls={vwalls}
        handleConstructHWall={handleConstructHWall}
        handleConstructVWall={handleConstructVWall}
      />

      <Ground />

      {/* 
      <group
        scale={[0.07, 0.1, 0.1]}
        position={[4.3, 0, 0.6]}
        rotation={[0, Math.PI, 0]}
      >
        <Model url="/models/sofa.gltf" receiveShadow />
      </group> */}
      {/* 
      <group scale={0.2} position={[0, 0, 0]}>
        <Model url="/models/table.gltf" castShadow />
      </group>

      <group scale={0.2} position={[0, 0.8, 1.5]}>
        <Model url="/models/pot-fleurs.gltf" castShadow />
      </group> */}

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

const HWall = ({ handleClick }) => (
  <group
    rotation={[0, 0, 0]}
    position={[0.5, 1, 0]}
    scale={[0.7, 1, 1]}
    onContextMenu={handleClick}
  >
    <Model url="/models/thewall.gltf" castShadow receiveShadow />
  </group>
)

const VWall = ({ handleClick }) => (
  <group
    rotation={[0, Math.PI / 2, 0]}
    position={[0.5, 1, 0]}
    scale={[0.7, 1, 1]}
    onContextMenu={handleClick}
  >
    <Model url="/models/thewall.gltf" castShadow />
  </group>
)

const Player = () => {
  const scene = useScene()
  const { actionIsActive } = useInput()

  const groupRef = useRef()

  const speed = 2

  // useFrame((_, delta) => {
  //   let dx = 0,
  //     dz = 0

  //   const player = scene.getPlayer()

  //   const canMove = !player.sitting && !player.jumping

  //   if (canMove && actionIsActive("GO_LEFT")) dx -= 1
  //   if (canMove && actionIsActive("GO_RIGHT")) dx += 1
  //   if (canMove && actionIsActive("GO_UP")) dz -= 1
  //   if (canMove && actionIsActive("GO_DOWN")) dz += 1

  //   const { position } = player

  //   player.speed = Math.sqrt(dx * dx + dz * dz) ? 1 : 0

  //   if (actionIsActive("RUN")) {
  //     player.speed *= 3
  //   }

  //   if (player.speed) {
  //     const ang = Math.atan2(dx, dz)
  //     if (player.rotation !== Math.atan2(dx, dz)) {
  //       let delta_rad = Math.atan2(dx, dz) - player.rotation

  //       if (delta_rad > Math.PI) {
  //         delta_rad -= Math.PI * 2
  //       }

  //       if (delta_rad < -Math.PI) {
  //         delta_rad += Math.PI * 2
  //       }

  //       const sign = Math.sign(delta_rad)

  //       const abs = Math.abs(delta_rad)

  //       const add = Math.min(delta * 10 * (abs > Math.PI / 2 ? 2 : 1), abs)

  //       player.rotation += add * sign
  //     }

  //     position.x += Math.sin(ang) * delta * speed * player.speed * 0.7 * 2
  //     position.z += Math.cos(ang) * delta * speed * player.speed * 0.7 * 2
  //   }

  //   groupRef.current.rotation.y = player.rotation
  //   groupRef.current.position.x = position.x
  //   groupRef.current.position.z = position.z
  // })

  useFrame((_, delta) => {
    let dx = 0,
      dz = 0

    const player = scene.getPlayer()

    const canMove = !player.sitting && !player.jumping

    if (canMove && actionIsActive("GO_LEFT")) player.rotation += delta * 3
    if (canMove && actionIsActive("GO_RIGHT")) player.rotation -= delta * 3
    if (canMove && actionIsActive("GO_UP")) dz -= 1
    if (canMove && actionIsActive("GO_DOWN")) dz += 1

    const { position } = player

    player.speed = Math.sqrt(dx * dx + dz * dz) ? 1 : 0

    if (actionIsActive("RUN")) {
      player.speed *= 3
    }

    // if (player.speed) {
    //   const ang = Math.atan2(dx, dz)
    //   if (player.rotation !== Math.atan2(dx, dz)) {
    //     let delta_rad = Math.atan2(dx, dz) - player.rotation

    //     if (delta_rad > Math.PI) {
    //       delta_rad -= Math.PI * 2
    //     }

    //     if (delta_rad < -Math.PI) {
    //       delta_rad += Math.PI * 2
    //     }

    //     const sign = Math.sign(delta_rad)

    //     const abs = Math.abs(delta_rad)

    //     const add = Math.min(delta * 10 * (abs > Math.PI / 2 ? 2 : 1), abs)

    //     player.rotation += add * sign
    //   }

    position.x +=
      Math.sin(player.rotation) * delta * speed * player.speed * 0.7 * 2 * -dz
    position.z +=
      Math.cos(player.rotation) * delta * speed * player.speed * 0.7 * 2 * -dz
    // }

    groupRef.current.rotation.y = player.rotation
    groupRef.current.position.x = position.x
    groupRef.current.position.z = position.z
  })

  const { camera } = useThree()

  useEffect(() => {
    const { position, rotation } = scene.getPlayer()

    camera.position.y = 2
    camera.rotation.x = 0 // -Math.PI / 5
  }, [])

  useFrame(() => {
    const { position, rotation } = scene.getPlayer()
    const distance = 4

    camera.position.x = position.x - Math.sin(rotation) * distance
    camera.position.z = position.z - Math.cos(rotation) * distance
    camera.position.y = position.y + 3

    camera.rotation.y = rotation + Math.PI
  })

  return (
    <group ref={groupRef} scale={2}>
      <mesh>
        <HumanoidModel url="/models/bot/ybot.gltf" castShadow />
      </mesh>
    </group>
  )
}

const ConstructionPlots = ({
  objects,
  handleConstructAt,
  constructibleZoneSize,
  constructionMode,

  hwalls,
  vwalls,
  handleConstructHWall,
  handleConstructVWall,
}) => {
  return (
    <group>
      {Array.from(new Array(constructibleZoneSize)).map((_, y) =>
        Array.from(new Array(constructibleZoneSize)).map(
          (_, x) =>
            objects[x][y] !== 0 ? (
              <group position={[x, 0, y]}>
                {Array.from(new Array(objects[x][y])).map((_, z) => (
                  <group key={z} position={[0, z, 0]}>
                    <TheCube
                      handleClick={() => {
                        if (constructionMode !== "box") return
                        handleConstructAt(x, y, objects[x][y] + 1)
                      }}
                      handleRightClick={() => {
                        if (constructionMode !== "box") return
                        handleConstructAt(x, y, Math.max(0, objects[x][y] - 1))
                      }}
                    />
                  </group>
                ))}
              </group>
            ) : constructionMode === "box" ? (
              <ConstructionPlot
                position={[x, 0, y]}
                handleClick={() => {
                  handleConstructAt(x, y, 1)
                }}
              />
            ) : null // /> //   }} //     handleConstructAt(x, y, 1) //   handleClick={() => { //   position={[x, 0, y]} // <ConstructionPlot
        )
      )}

      {Array.from(new Array(constructibleZoneSize)).map((_, y) =>
        Array.from(new Array(constructibleZoneSize)).map((_, x) => (
          <group position={[x, 0, y]}>
            {vwalls[x][y] === 0 ? (
              constructionMode === "wall" ? (
                <group scale={[0.25, 1, 1]} position={[-0.5, 0, 0]}>
                  <ConstructionPlot
                    position={[0, 0, 0]}
                    handleClick={() => {
                      handleConstructVWall(x, y, 1)
                    }}
                  />
                </group>
              ) : null
            ) : (
              <VWall
                handleClick={() => {
                  if (constructionMode !== "wall") return

                  handleConstructVWall(x, y, 0)
                }}
              />
            )}
          </group>
        ))
      )}

      {Array.from(new Array(constructibleZoneSize)).map((_, y) =>
        Array.from(new Array(constructibleZoneSize)).map((_, x) => (
          <group position={[x - 0.5, 0, y + 0.5]}>
            {hwalls[x][y] === 0 ? (
              constructionMode === "wall" ? (
                <group scale={[1, 1, 0.25]} position={[0.5, 0, -1]}>
                  <ConstructionPlot
                    position={[0, 0, 0]}
                    handleClick={() => {
                      handleConstructHWall(x, y, 1)
                    }}
                  />
                </group>
              ) : null
            ) : (
              <HWall
                handleClick={() => {
                  if (constructionMode !== "wall") return
                  handleConstructHWall(x, y, 0)
                }}
              />
            )}
          </group>
        ))
      )}
    </group>
  )
}

const TheCube = ({ handleClick, handleRightClick }) => (
  <group
    scale={0.5}
    position={[0, 0.5, 0]}
    onClick={handleClick}
    onContextMenu={handleRightClick}
  >
    <Model url="/models/thecube.gltf" receiveShadow castShadow />
  </group>
)

const ConstructionPlot = ({ handleClick, position }) => {
  const [isOver, setIsOver] = useState(false)

  return (
    <mesh
      position={position}
      scale={0.9}
      onClick={() => {
        handleClick()
      }}
      onPointerEnter={() => {
        setIsOver(true)
      }}
      onPointerLeave={() => {
        setIsOver(false)
      }}
    >
      <boxGeometry args={[1, 0.2, 1]} />
      {isOver ? (
        <meshLambertMaterial color={"#ee0000"} />
      ) : (
        <meshLambertMaterial color={"#eeeeee"} />
      )}
    </mesh>
  )
}

const Ground = () => {
  const colorMap = useLoader(TextureLoader, "/models/texture/plancher.jpg")

  return (
    <group>
      {Array.from(new Array(10)).map((_, y) =>
        Array.from(new Array(10)).map((_, x) => (
          <mesh
            scale={0.4}
            position={[y * 8 + 1, 0, x * 8 + 1]}
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
