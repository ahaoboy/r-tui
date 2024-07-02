import { Canvas } from "@r-tui/canvas"
import {
  type DOMElement,
  Flex,
  type BaseElementProps,
  LayoutNode,
} from "@r-tui/flex"
import { getStringShape, getTerminalShape, type Shape } from "@r-tui/share"
import { drawNode } from "./canvas"
import throttle from "lodash-es/throttle"

export const BoxName = "@r-tui/box"
export const RootName = "@r-tui/root"
export class TDom implements DOMElement {
  nodeName = BoxName
  attributes: Partial<BaseElementProps> = {}
  childNodes: this[] = []
  parentNode: this | undefined
  layoutNode: LayoutNode = new LayoutNode()
}

export const RootNode = new TDom()

export class TFlex extends Flex<TDom> {
  canvas = new Canvas(getTerminalShape())
  renderToConsole: () => void = throttle(
    () => {
      console.clear()
      this.canvas.clear()
      this.rerender()
      const s = this.canvas.toAnsi()
      process.stdout.write(s)
    },
    32,
    {
      trailing: true,
      leading: true,
    },
  )
  customIsRootNode(node: TDom): boolean {
    return node.nodeName === RootName
  }
  customCreateNode(): TDom {
    return new TDom()
  }
  customCreateRootNode(): TDom {
    const root = new TDom()
    root.nodeName = RootName
    return root
  }
  customRenderNode(node: TDom, currentRenderCount: number, deep: number): void {
    const { nodeName } = node
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
