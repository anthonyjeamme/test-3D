export type TInputContext = {
  actionIsActive: (action: TAction) => boolean
  addActionListener: (action: TAction, callback: () => void) => void
  removeActionListener: (action: TAction, callback: () => void) => void
}

export type TAction =
  | "GO_UP"
  | "GO_DOWN"
  | "GO_LEFT"
  | "GO_RIGHT"
  | "INTERACT"
  | "RUN"
  | "SIT"
  | "JUMP"

export type TKeyBinding = {
  GO_UP: string[]
  GO_DOWN: string[]
  GO_LEFT: string[]
  GO_RIGHT: string[]
  INTERACT: string[]
  RUN: string[]
  SIT: string[]
  JUMP: string[]
}

export type TListeners = {
  GO_UP: TListenerCallback[]
  GO_DOWN: TListenerCallback[]
  GO_LEFT: TListenerCallback[]
  GO_RIGHT: TListenerCallback[]
  INTERACT: TListenerCallback[]
  RUN: TListenerCallback[]
  SIT: TListenerCallback[]
  JUMP: TListenerCallback[]
}

type TListenerCallback = () => void
