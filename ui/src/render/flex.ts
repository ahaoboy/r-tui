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

export const BoxName = "@r-tui/box"
export const RootName = "@r-tui/root"

export interface TDomAttrs {
  color?: Color
  backgroundColor?: Color
}

export interface TDomProps {
  nodeName: string
}

const DefaultFps = 30
export interface TDom extends BaseDom<TDomAttrs, {}, TDomProps> {}

export function createTDom(nodeName = BoxName): TDom {
  return {
    attributes: {},
    layoutNode: new LayoutNode(),
    parentNode: undefined,
    childNodes: [],
    props: { nodeName },
  }
}
export class TFlex extends Flex<TDomAttrs, {}, TDomProps> {
  customCreateMouseEvent(
    node: BaseDom<TDomAttrs, {}, TDomProps> | undefined,
    x: number,
    y: number,
  ): BaseMouseEvent<TDomAttrs, {}, TDomProps> {
    return {
      target: node,
      x,
      y,
      bubbles: true,
      defaultPrevented: false,
      offsetX: 0,
      offsetY: 0,
      stopPropagation() {},
      preventDefault() {},
      clientX: 0,
      clientY: 0,
    }
  }
  canvas = new Canvas(getTerminalShape())
  renderToConsole: () => void = throttle(
    () => {
      console.clear()
      this.canvas.clear()
      this.rerender()
      const s = this.canvas.toAnsi()
      process.stdout.write(s)
    },
    1000 / DefaultFps,
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
  customRenderNode(node: TDom, currentRenderCount: number, deep: number): void {
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
