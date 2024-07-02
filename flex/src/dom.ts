import { Rect } from "@r-tui/share"
import type {
  AlignContent,
  AlignType,
  BaseDomProps,
  FlexDirection,
  FlexWrap,
  Len,
  Position,
  TextAlign,
} from "./type"

export interface BaseMouseEvent<
  A extends {} = {},
  E extends {} = {},
  P extends {} = {},
> {
  target?: BaseDom<A, E, P>
  bubbles: boolean
  x: number
  y: number
  defaultPrevented: boolean
  offsetX: number
  offsetY: number
  stopPropagation(): void
  clientY: number
  clientX: number
  preventDefault(): void
}
// export class BaseMouseEvent<T extends BaseDom> {
//   private _x: number
//   private _y: number
//   private _target: T | undefined
//   bubbles = true
//   defaultPrevented = false
//   constructor(node: T | undefined, x: number, y: number) {
//     this._target = node
//     this._x = x
//     this._y = y
//   }

//   preventDefault() {
//     this.defaultPrevented = true
//   }

//   get target(): T {
//     return this._target!
//   }
//   set target(node: T | undefined) {
//     this._target = node
//   }

//   get x() {
//     return this._x
//   }

//   get y() {
//     return this._y
//   }

//   get clientX() {
//     return this._x
//   }

//   get clientY() {
//     return this._y
//   }

//   get offsetX() {
//     return this.x - this.target.layoutNode.x
//   }

//   get offsetY() {
//     return this.y - this.target.layoutNode.y
//   }

//   stopPropagation() {
//     this.bubbles = false
//   }
// }

export class LayoutNode extends Rect {
  constructor(
    public x = 0,
    public y = 0,
    public width = 0,
    public height = 0,
    public padding = 0,
    public border = 0,
    public hide = false,
    public textRect = new Rect(0, 0, 0, 0),
    public computedSizeCount = 0,
    public computedLayoutCount = 0,
    public _hideCache = false,
    public _renderCache = false,
    public _mouseDown = false,
    public _mouseUp = false,
    public _mouseIn = false,
    public _focus = false,
  ) {
    super(x, y, width, height)
  }
}

export const EventName = [
  "onClick",
  "onMouseDown",
  "onMouseUp",
  "onMouseMove",
  "onMousePress",
  "onMouseEnter",
  "onMouseLeave",
  "onWheelDown",
  "onWheelUp",
  "onBlur",
  "onFocus",
] as const

export interface BaseDom<
  A extends {} = {},
  E extends {} = {},
  P extends {} = {},
> {
  attributes: Partial<
    {
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
      zIndex: number
      hide: boolean
      display: "flex" | "none"
      alignContent: AlignContent
      pointerEvents: "none"
      onClick?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMouseDown?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMouseUp?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMouseMove?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMousePress?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMouseEnter?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onMouseLeave?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onWheelDown?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onWheelUp?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onBlur?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
      onFocus?: (e: BaseMouseEvent<BaseDom<A, E, P>>) => void
    } & A
  >
  childNodes: this[]
  parentNode: this | undefined
  layoutNode: LayoutNode
  props: P
}

export type DOMNodeAttribute = boolean | string | number

export function appendChildNode<D extends BaseDom>(
  node: D,
  childNode: D,
): void {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode)
  }

  childNode.parentNode = node
  node.childNodes.push(childNode)
}

export function insertBeforeNode<D extends BaseDom>(
  node: D,
  newChildNode: D,
  beforeChildNode: D,
): void {
  if (newChildNode.parentNode) {
    removeChildNode(newChildNode.parentNode, newChildNode)
  }

  newChildNode.parentNode = node

  const index = node.childNodes.indexOf(beforeChildNode)
  if (index >= 0) {
    node.childNodes.splice(index, 0, newChildNode)
    return
  }

  node.childNodes.push(newChildNode)
}

export function removeChildNode<D extends BaseDom>(
  node: D,
  removeNode: D,
): void {
  removeNode.parentNode = undefined

  const index = node.childNodes.indexOf(removeNode)
  if (index >= 0) {
    node.childNodes.splice(index, 1)
  }
}

export function setAttribute<D extends BaseDom>(
  node: D,
  key: string,
  value: DOMNodeAttribute,
): void {
  // @ts-ignore
  node.attributes[key] = value
}
