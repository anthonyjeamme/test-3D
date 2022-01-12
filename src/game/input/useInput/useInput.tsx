import React, { useRef, useEffect } from "react"
import {
  TAction,
  TInputContext,
  TKeyBinding,
  TListeners,
} from "./useInput.types"

const inputContext = React.createContext<TInputContext>({
  actionIsActive: () => false,
  addActionListener: () => {},
  removeActionListener: () => {},
})

const defaultKeyBinding: TKeyBinding = {
  GO_UP: ["z", "Z"],
  GO_DOWN: ["s", "S"],
  GO_LEFT: ["q", "Q"],
  GO_RIGHT: ["d", "D"],
  INTERACT: ["e", "E"],
  SIT: ["f", "F"],
  RUN: ["Shift"],
  JUMP: [" "],
}

export const useInput = () => React.useContext(inputContext)

export const InputContext = ({ children }) => {
  const keyStatesRef = useRef<TKeyStates>({})
  const keyBindingRef = useRef<TKeyBinding>(defaultKeyBinding)

  const listenersRef = useRef<TListeners>({
    GO_UP: [],
    GO_DOWN: [],
    GO_LEFT: [],
    GO_RIGHT: [],
    INTERACT: [],
    RUN: [],
    JUMP: [],
    SIT: [],
  })

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault()

    keyStatesRef.current[e.key] = true

    const keyAction = getKeyAction(e.key)

    if (keyAction) {
      callActionCallbacks(keyAction)
    }
  }

  const callActionCallbacks = (action: TAction) => {
    listenersRef.current[action].forEach(callback => {
      callback()
    })
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault()
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

  const getKeyAction = (key: string): TAction | null => {
    const entries = Object.entries(keyBindingRef.current) as [
      TAction,
      string[]
    ][]

    for (const [action, keys] of entries) {
      if (keys.includes(key)) return action
    }

    return null
  }

  const keyIsPressed = (key: string) => {
    return keyStatesRef.current[key] === true
  }

  const actionIsActive = (action: TAction) => {
    const actionKeys = keyBindingRef.current[action]
    return actionKeys.find(keyIsPressed) !== undefined
  }

  const addActionListener = (action: TAction, callback: () => void) => {
    listenersRef.current[action].push(callback)
  }

  const removeActionListener = (action: TAction, callback: () => void) => {
    listenersRef.current[action] = listenersRef.current[action].filter(
      _ => _ !== callback
    )
  }

  return (
    <inputContext.Provider
      value={{
        actionIsActive,
        addActionListener,
        removeActionListener,
      }}
    >
      {children}
    </inputContext.Provider>
  )
}

type TKeyStates = {
  [key: string]: boolean
}
