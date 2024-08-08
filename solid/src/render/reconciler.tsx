import {
  getFirstChild,
  getNextSibling,
  getParentNode,
  insertBeforeNode,
  removeChildNode,
  setAttribute,
  setLayoutNode,
} from "@r-tui/flex"
import {
  RenderConfig,
  RootName,
  TFlex,
  TextName,
  createTDom,
} from "@r-tui/rflex"
import { createRenderer } from "solid-js/universal"
import { TDom } from "@r-tui/rflex"

let flex: TFlex

const {
  render: _render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
} = createRenderer<TDom>({
  createElement(nodeName: string): any {
    return createTDom(nodeName)
  },
  createTextNode(value: string): any {
    throw new Error("not support text node")
  },
  replaceText(textNode: TDom, value: string) {
    setAttribute(textNode, "text", value)
    flex.renderToConsole()
  },
  setProperty(node: TDom, name: string, value: any) {
    setAttribute(node, name, value)
    flex.renderToConsole()
  },
  insertNode(parent: TDom, node: TDom, anchor: TDom) {
    insertBeforeNode(parent, node, anchor)
    flex.renderToConsole()
  },
  isTextNode(node: TDom) {
    return node.props.nodeName === TextName
  },
  removeNode(parent: TDom, node: TDom) {
    removeChildNode(parent, node)
    flex.renderToConsole()
  },
  getParentNode(node: TDom) {
    return getParentNode(node)
  },
  getFirstChild(node: TDom) {
    return getFirstChild(node)
  },
  getNextSibling(node: TDom) {
    return getNextSibling(node)
  },
})

// Forward Solid control flow
export {
  For,
  Show,
  Suspense,
  SuspenseList,
  Switch,
  Match,
  Index,
  ErrorBoundary,
} from "solid-js"

export const defaultFPS = 30

function render(code: () => any, config: Partial<RenderConfig> = {}) {
  flex = new TFlex(config)
  const { width, height } = flex.canvas.shape
  setAttribute(flex.rootNode, "id", RootName)
  setAttribute(flex.rootNode, "width", width)
  setAttribute(flex.rootNode, "height", height)
  setAttribute(flex.rootNode, "position", "relative")
  setAttribute(flex.rootNode, "color", undefined)
  setAttribute(flex.rootNode, "backgroundColor", undefined)
  setAttribute(flex.rootNode, "display", "flex")
  setAttribute(flex.rootNode, "padding", 0)
  setAttribute(flex.rootNode, "borderSize", 0)
  setAttribute(flex.rootNode, "x", 0)
  setAttribute(flex.rootNode, "y", 0)
  setAttribute(flex.rootNode, "zIndex", 0)

  setLayoutNode(flex.rootNode, "x", 0)
  setLayoutNode(flex.rootNode, "y", 0)
  setLayoutNode(flex.rootNode, "width", width)
  setLayoutNode(flex.rootNode, "height", height)
  setLayoutNode(flex.rootNode, "padding", 0)
  setLayoutNode(flex.rootNode, "border", 0)

  _render(code, flex.rootNode)
  flex.renderToConsole()
}

export {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insertNode,
  insert,
  spread,
  setProp,
  mergeProps,
}
