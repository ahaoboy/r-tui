import { Rect } from "@r-tui/share"
import type { BaseElementProps } from "./type"

export class MouseEvent {
  private _x: number
  private _y: number
  private _target: DOMElement | undefined
  bubbles = true
  defaultPrevented = false
  constructor(node: DOMElement | undefined, x: number, y: number) {
    this._target = node
    this._x = x
    this._y = y
  }

  preventDefault() {
    this.defaultPrevented = true
  }

  get target(): DOMElement {
    return this._target!
  }
  set target(node: DOMElement | undefined) {
    this._target = node
  }

  get x() {
    return this._x
  }

  get y() {
    return this._y
  }

  get clientX() {
    return this._x
  }

  get clientY() {
    return this._y
  }

  get offsetX() {
    return this.x - this.target.layoutNode.x
  }

  get offsetY() {
    return this.y - this.target.layoutNode.y
  }

  stopPropagation() {
    this.bubbles = false
  }
}

export class BoxNode {
  parentNode: BoxNode | undefined = undefined
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
export interface DOMElement {
  attributes: Partial<BaseElementProps>
  childNodes: this[]
  parentNode: this | undefined
  layoutNode: LayoutNode
}

export type DOMNodeAttribute = boolean | string | number

export function appendChildNode<D extends DOMElement>(
  node: D,
  childNode: D,
): void {
  if (childNode.parentNode) {
    removeChildNode(childNode.parentNode, childNode)
  }

  childNode.parentNode = node
  node.childNodes.push(childNode)
}

export function insertBeforeNode<D extends DOMElement>(
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

export function removeChildNode<D extends DOMElement>(
  node: D,
  removeNode: D,
): void {
  removeNode.parentNode = undefined

  const index = node.childNodes.indexOf(removeNode)
  if (index >= 0) {
    node.childNodes.splice(index, 1)
  }
}

export function setAttribute<D extends DOMElement>(
  node: D,
  key: string,
  value: DOMNodeAttribute,
): void {
  // @ts-ignore
  node.attributes[key] = value
}
