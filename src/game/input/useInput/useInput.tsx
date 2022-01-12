import React, { useRef, useEffect } from "react"

type TInputContext = {
  actionIsActive: (action: TAction) => boolean
}

const inputContext = React.createContext<TInputContext>({
  actionIsActive: () => false,
})

const keyBinding = {
  GO_UP: ["z"],
  GO_DOWN: ["s"],
  GO_LEFT: ["q"],
  GO_RIGHT: ["d"],
  INTERACT: ["e"],
  RUN: ["Shift"],
}

type TAction = "GO_UP" | "GO_DOWN" | "GO_LEFT" | "GO_RIGHT" | "INTERACT" | "RUN"

export const useInput = () => React.useContext(inputContext)

export const InputContext = ({ children }) => {
  const keyStatesRef = useRef<TKeyStates>({})

  const handleKeyDown = (e: KeyboardEvent) => {
    keyStatesRef.current[e.key] = true
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    delete keyStatesRef.current[e.key]
  }

  const handleBlur = () => {
    keyStatesRef.current = {}
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    window.addEventListener("blur", handleBlur)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      window.removeEventListener("blur", handleBlur)
    }
  }, [])

  const keyIsPressed = (key: string) => {
    return keyStatesRef.current[key] === true
  }

  const actionIsActive = (action: TAction) => {
    const actionKeys = keyBinding[action]

    return actionKeys.find(keyIsPressed) !== undefined
  }

  return (
    <inputContext.Provider
      value={{
        actionIsActive,
      }}
    >
      {children}
    </inputContext.Provider>
  )
}

type TKeyStates = {
  [key: string]: boolean
}
