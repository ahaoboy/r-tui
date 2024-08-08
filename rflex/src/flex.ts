import { Canvas } from "@r-tui/canvas"
import { type BaseDom, Flex, LayoutNode, BaseMouseEvent } from "@r-tui/flex"
import { Color, getStringShape, type Shape } from "@r-tui/share"
import { drawNode } from "./canvas"
import throttle from "lodash-es/throttle"
import { getTerminalShape } from "@r-tui/terminal"

export const DefaultFPS = 30
export const BoxName = "@r-tui/box"
export const RootName = "@r-tui/root"
export const TextName = "@r-tui/text"

export interface TDomAttrs {
  color?: Color
  backgroundColor?: Color
}

export interface TDomProps {
  nodeName: string
}

export interface TDom extends BaseDom<TDomAttrs, TDomProps, {}> {}

export type RenderConfig = {
  enableMouseMoveEvent: boolean
  fps: number
  trim: boolean
  shape: Shape
  write: (s: string) => void
}

export function createTDom(nodeName = BoxName): TDom {
  return {
    attributes: {},
    layoutNode: new LayoutNode(),
    parentNode: undefined,
    childNodes: [],
    props: { nodeName },
    dirty: false,
  }
}

export class TFlex extends Flex<TDomAttrs, TDomProps, {}> {
  customRenderRoot(node: BaseDom<TDomAttrs, TDomProps, {}>): void {
    for (const c of node.childNodes) {
      this.customRenderRoot(c)
    }
    const {
      props: { nodeName } = {},
    } = node
    if (nodeName === RootName) {
      return
    }
    const { x, y } = node.layoutNode
    drawNode(this.canvas, node, x | 0, y | 0)
  }
  fps = 0
  canvas: Canvas
  write: (s: string) => void
  shape: Shape
  constructor(config: Partial<RenderConfig> = {}) {
    super()
    const {
      fps = DefaultFPS,
      shape = getTerminalShape(),
      write = (s) => {
        console.clear()
        process.stdout.write(s)
      },
    } = config
    this.fps = fps
    this.shape = shape
    this.canvas = new Canvas(shape)
    this.write = write
  }
  customCreateMouseEvent(
    node: BaseDom<TDomAttrs, TDomProps, {}> | undefined,
    x: number,
    y: number,
    hover: boolean,
    event: {},
  ): BaseMouseEvent<TDomAttrs, TDomProps, {}> {
    throw new Error("Method not implemented.")
  }
  customIsWheelDown(e: BaseMouseEvent<TDomAttrs, TDomProps, {}>): boolean {
    throw new Error("Method not implemented.")
  }
  customIsWheelUp(e: BaseMouseEvent<TDomAttrs, TDomProps, {}>): boolean {
    throw new Error("Method not implemented.")
  }
  customIsMousePress(e: BaseMouseEvent<TDomAttrs, TDomProps, {}>): boolean {
    throw new Error("Method not implemented.")
  }
  customIsMouseDown(e: BaseMouseEvent<TDomAttrs, TDomProps, {}>): boolean {
    throw new Error("Method not implemented.")
  }
  customIsMouseUp(e: BaseMouseEvent<TDomAttrs, TDomProps, {}>): boolean {
    throw new Error("Method not implemented.")
  }
  renderToConsole: () => void = throttle(
    () => {
      this.canvas.clear()
      // const t1 = Date.now()
      this.renderRoot()
      // const t2 = Date.now()
      const s = this.canvas.toAnsi()
      // console.log('renderToConsole: ', s.length, t2 - t1, this.canvas.shape)
      this.write(s)
    },
    1000 / DefaultFPS,
    {
      trailing: true,
      leading: true,
    },
  )
  customIsRootNode(node: TDom): boolean {
    return node.props?.nodeName === RootName
  }
  customCreateRootNode(): TDom {
    return createTDom(RootName)
  }
  customMeasureNode(node: TDom): Shape {
    const text = node.attributes.text || ""
    return getStringShape(text)
  }
  customComputeZIndex(node: TDom, zIndex: number): void {}
}
