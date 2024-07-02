import type { Color } from "@r-tui/share"
import type { MouseEvent } from "./dom"

export type Len = number | string

export type MouseCb = (event: MouseEvent) => void

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

export type BaseElementProps = {
  id: string | number
  position: Position
  ref: any
  x: Len
  y: Len
  width: Len
  height: Len
  left: Len
  right: Len
  top: Len
  bottom: Len
  backgroundColor: Color
  borderSize: Len
  borderColor: string
  borderRadius: Len
  font: string
  fontBorderColor: string
  fontBorderSize: number
  fontSize: Len
  textAlign: TextAlign
  text: string
  flexDirection: FlexDirection
  flexWrap: FlexWrap
  justifyContent: AlignType
  alignItems: AlignType
  padding: Len
  onClick: MouseCb
  onMouseDown: MouseCb
  onMouseUp: MouseCb
  onMouseMove: MouseCb
  onMousePress: MouseCb
  onMouseEnter: MouseCb
  onMouseLeave: MouseCb
  onWheelDown: MouseCb
  onWheelUp: MouseCb
  onBlur: MouseCb
  onFocus: MouseCb
  color: Color
  zIndex: number
  hide: boolean
  display: "flex" | "none"
  alignContent: AlignContent
  title: string
  pointerEvents: "none"
  backgroundImage: string
  backgroundImageFormat: "rgba" | "bgra"
}
