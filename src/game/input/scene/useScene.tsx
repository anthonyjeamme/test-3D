import React from "react"

const sceneContext = React.createContext<TSceneContext>({
  getPlayer: () => null,
})

export const useScene = () => React.useContext<TSceneContext>(sceneContext)

export const SceneContext = ({ children }) => {
  const playerRef = React.useRef({
    position: {
      x: 10,
      y: 0,
      z: 10,
    },
    rotation: 0,
    speed: 0,
    jumping: false,
    sitting: false,
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

type TSceneContext = {
  getPlayer: () => any
}
