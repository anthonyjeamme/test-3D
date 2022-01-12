import React from "react"

const sceneContext = React.createContext({})

export const useScene = () => React.useContext(sceneContext)

export const SceneContext = ({ children }) => {
  const playerRef = React.useRef({
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
    rotation: 0,
    speed: 0,
  })

  return (
    <sceneContext.Provider
      value={{
        getPlayer: () => playerRef.current,
      }}
    >
      {children}
    </sceneContext.Provider>
  )
}
