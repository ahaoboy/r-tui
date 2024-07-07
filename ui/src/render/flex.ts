import { Canvas } from "@r-tui/canvas"
import {
  type BaseDom,
  Flex,
  type BaseDomProps,
  LayoutNode,
  BaseMouseEvent,
} from "@r-tui/flex"
import { Color, getStringShape, type Shape } from "@r-tui/share"
import { drawNode } from "./canvas"
import throttle from "lodash-es/throttle"
import { getTerminalShape } from "@r-tui/terminal"
import { defaultFPS } from "./reconciler"

export const BoxName = "@r-tui/box"
export const RootName = "@r-tui/root"

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
}

export function createTDom(nodeName = BoxName): TDom {
  return {
    attributes: {},
    layoutNode: new LayoutNode(),
    parentNode: undefined,
    childNodes: [],
    props: { nodeName },
  }
}
export class TFlex extends Flex<TDomAttrs, TDomProps, {}> {
  fps = 0
  trim = false
  constructor(config: Partial<RenderConfig> = {}) {
    super()
    const { fps = defaultFPS, trim = false } = config
    this.fps = fps
    this.trim = trim
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
  canvas = new Canvas(getTerminalShape())
  renderToConsole: () => void = throttle(
    () => {
      console.clear()
      this.canvas.clear()
      this.rerender()
      const s = this.canvas.toAnsi(this.trim)
      process.stdout.write(s)
    },
    1000 / defaultFPS,
    {
      trailing: true,
      leading: true,
    },
  )
  customIsRootNode(node: TDom): boolean {
    return node.props?.nodeName === RootName
  }
  customCreateNode(): TDom {
    return createTDom()
  }
  customCreateRootNode(): TDom {
    return createTDom(RootName)
  }
  customRenderNode(node: TDom): void {
    const {
      props: { nodeName } = {},
    } = node
    if (nodeName === RootName) {
      return
    }
    const { x, y } = node.layoutNode
    drawNode(this.canvas, node, x | 0, y | 0)
  }
  customMeasureNode(node: TDom): Shape {
    const text = node.attributes.text || ""
    return getStringShape(text)
  }
  customComputeZIndex(
    node: TDom,
    zIndex: number,
    currentRenderCount: number,
    deep: number,
  ): void {}
}
