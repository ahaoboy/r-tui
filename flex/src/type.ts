import { BaseDom } from "./dom"

export type Len = number | string

export type KeyEvent = { key: string } & {
  event: "up" | "down" | "press"
  is_mouse: boolean
  key_name?:
    | "WHEEL_DOWN"
    | "WHEEL_UP"
    | "MBTN_LEFT"
    | "MBTN_RIGHT"
    | (string & {})
}
export type MousePos = {
  // mouse in video or toolbar
  hover: boolean
  x: number
  y: number
}

export type KeyCb = (event: KeyEvent) => void

export type TextAlign = "center" | "left" | "right"

export type FlexDirection = "row" | "column"

export type Position = "relative" | "absolute"
export type AlignType = "center" | "start" | "end" | "space-between"

export type AlignContent = "stretch"
export type FlexWrap = "wrap" | "nowrap"

export type BaseDomProps<T extends BaseDom> = T["attributes"]
