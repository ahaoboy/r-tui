import { Rect } from "@r-tui/share"
import type {
  AlignContent,
  AlignType,
  FlexDirection,
  FlexWrap,
  Len,
  Position,
  TextAlign,
} from "./type"

export class BaseMouseEvent<
  A extends {} = {},
  P extends {} = {},
  E extends {} = {},
> {
  event: E
  x: number
  y: number
  // Whether the mouse moves out of the window
  hover: boolean
  target: BaseDom<A, P, E> | undefined
  bubbles = true
  defaultPrevented = false
  source: BaseDom<A, P, E> | undefined
  constructor(
    source: BaseDom<A, P, E> | undefined,
    x: number,
    y: number,
    hover: boolean,
    event: E,
  ) {
    this.source = source
    this.x = x
    this.y = y
    this.event = event
    this.hover = hover
  }

  preventDefault() {
    this.defaultPrevented = true
  }

  get clientX() {
    return this.x
  }

  get clientY() {
    return this.y
  }

  get offsetX() {
    return this.x - (this.target?.layoutNode.x || 0)
  }

  get offsetY() {
    return this.y - (this.target?.layoutNode.y || 0)
  }

  stopPropagation() {
    this.bubbles = false
  }
}

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

export const EventNameList = [
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

export type EventName = (typeof EventNameList)[number]

export interface BaseDom<
  A extends {} = {},
  P extends {} = {},
  E extends {} = {},
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
      onClick?: (e: BaseMouseEvent<A, P, E>) => void
      onMouseDown?: (e: BaseMouseEvent<A, P, E>) => void
      onMouseUp?: (e: BaseMouseEvent<A, P, E>) => void
      onMouseMove?: (e: BaseMouseEvent<A, P, E>) => void
      onMousePress?: (e: BaseMouseEvent<A, P, E>) => void
      onMouseEnter?: (e: BaseMouseEvent<A, P, E>) => void
      onMouseLeave?: (e: BaseMouseEvent<A, P, E>) => void
      onWheelDown?: (e: BaseMouseEvent<A, P, E>) => void
      onWheelUp?: (e: BaseMouseEvent<A, P, E>) => void
      onBlur?: (e: BaseMouseEvent<A, P, E>) => void
      onFocus?: (e: BaseMouseEvent<A, P, E>) => void
    } & A
  >
  childNodes: BaseDom<A, P, E>[]
  parentNode: BaseDom<A, P, E> | undefined
  layoutNode: LayoutNode
  dirty: boolean
  props: P
}

export type DOMNodeAttribute = boolean | string | number

export function appendChildNode<D extends BaseDom<any, any, any>>(
  node: D,
  childNode: D,
): void {
  markDirty(childNode)

  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode)
  }

  childNode.parentNode = node
  node.childNodes.push(childNode)
}

export function insertBeforeNode<D extends BaseDom<any, any, any>>(
  parent: D,
  node: D,
  anchor: D,
): void {
  markDirty(node)
  if (node.parentNode) {
    removeChildNode(node.parentNode, node)
  }

  node.parentNode = parent

  const index = parent.childNodes.indexOf(anchor)
  if (index >= 0) {
    parent.childNodes.splice(index, 0, node)
    return
  }

  parent.childNodes.push(node)
}

export function removeChildNode<D extends BaseDom<any, any, any>>(
  node: D,
  removeNode: D,
): void {
  markDirty(removeNode)
  removeNode.parentNode = undefined

  const index = node.childNodes.indexOf(removeNode)
  if (index >= 0) {
    node.childNodes.splice(index, 1)
  }
}

export function setAttribute<
  D extends BaseDom<any, any, any>,
  K extends keyof D["attributes"],
>(node: D, key: K, value: D["attributes"][K]): void {
  if (node.attributes[key] !== value) {
    markDirty(node)
  }
  node.attributes[key] = value
}

export function setLayoutNode<
  D extends BaseDom<any, any, any>,
  K extends keyof D["layoutNode"],
>(node: D, key: K, value: D["layoutNode"][K]): void {
  // @ts-ignore
  node.layoutNode[key] = value
}

export function getAttribute<D extends BaseDom<any, any, any>, R = any>(
  node: D,
  key: string,
): R | undefined {
  return node.attributes[key] as any
}

export function setProp<
  D extends BaseDom<any, any, any>,
  K extends keyof D["props"],
>(node: D, key: K, value: D["props"][K]): void {
  node.props[key] = value
}

export function getProp<D extends BaseDom<any, any, any>, R = any>(
  node: D,
  key: string,
): R | undefined {
  return node.props[key] as any
}

export function getNextSibling<D extends BaseDom<any, any, any>>(
  node: D,
): D | undefined {
  if (!node || !node.parentNode) return
  const childNodes = node.parentNode.childNodes
  const i = childNodes.indexOf(node)
  if (i < 0 || i >= childNodes.length) return
  return childNodes[i + 1] as D
}

export function getFirstChild<D extends BaseDom<any, any, any>>(
  node: D,
): D | undefined {
  return node.childNodes[0] as D
}

export function getParentNode<D extends BaseDom<any, any, any>>(
  node: D,
): D | undefined {
  return node.parentNode as D
}

export function markDirty<D extends BaseDom<any, any, any>>(node: D): void {
  node.dirty = true
  if (node.attributes.position !== "absolute") {
    while ((node = node.parentNode as D)) {
      node.dirty = true
    }
  }
}

export function markClean<D extends BaseDom<any, any, any>>(node: D): void {
  node.dirty = false
}

export function isDirty<D extends BaseDom<any, any, any>>(node: D): boolean {
  while (node) {
    if (node.dirty) return true
    node = node.parentNode as D
  }
  return false
}
