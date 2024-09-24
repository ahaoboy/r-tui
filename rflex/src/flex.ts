import { Canvas } from "@r-tui/canvas"
import {
  type BaseDom,
  Flex,
  LayoutNode,
  BaseMouseEvent,
  markClean,
} from "@r-tui/flex"
import { Color, getStringShape, type Shape } from "@r-tui/share"
import { drawNode } from "./canvas"
import throttle from "lodash-es/throttle"
import { getTerminalShape } from "@r-tui/terminal"

export const DefaultFPS = 30
export const BoxName = "@r-tui/box"
export const RootName = "@r-tui/root"
export const TextName = "@r-tui/text"

export interface TDomAttrs {
  color?: Color | (string & Object)
  backgroundColor?: Color
}

export interface TDomProps {
  nodeName: string
}

export interface TDom extends BaseDom<TDomAttrs, TDomProps, {}> {}

export type RenderConfig = {
  fps: number
  shape: Shape
  write: (s: string) => void
  beforeRenderRoot: (node: BaseDom<TDomAttrs, TDomProps, {}>) => void
  afterRenderRoot: (node: BaseDom<TDomAttrs, TDomProps, {}>) => void
  trailing: boolean
  leading: boolean
  nweLine: boolean
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
    markClean(node)
  }
  fps = 0
  canvas: Canvas
  write: (s: string) => void
  shape: Shape
  beforeRenderRoot?: (node: BaseDom<TDomAttrs, TDomProps, {}>) => void
  afterRenderRoot?: (node: BaseDom<TDomAttrs, TDomProps, {}>) => void
  renderToConsole: () => void

  constructor(config: Partial<RenderConfig> = {}) {
    super()
    const {
      fps = DefaultFPS,
      shape = getTerminalShape(),
      write = (s) => {
        console.clear()
        process.stdout.write(s)
      },
      beforeRenderRoot,
      afterRenderRoot,
      trailing = true,
      leading = false,
      nweLine = true,
    } = config
    this.fps = fps
    this.shape = shape
    this.canvas = new Canvas(shape)
    this.write = write
    this.beforeRenderRoot = beforeRenderRoot
    this.afterRenderRoot = afterRenderRoot
    this.renderToConsole = throttle(
      () => {
        // const t1 = Date.now()
        this.beforeRenderRoot?.(this.rootNode)
        this.renderRoot()
        this.afterRenderRoot?.(this.rootNode)
        // const t2 = Date.now()
        const s = this.canvas.toAnsi(nweLine)
        // console.log('renderToConsole: ', s.length, t2 - t1, this.canvas.shape)
        this.write(s)
      },
      1000 / fps,
      {
        trailing,
        leading,
      },
    )
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
