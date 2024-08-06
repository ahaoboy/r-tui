import {
  appendChildNode,
  getNextSibling,
  insertBeforeNode,
  removeChildNode,
} from "@r-tui/flex"
import { RenderConfig, TFlex, TextName, createTDom } from "./flex"
import { createRenderer } from "solid-js/universal"
import { TDom } from "./flex"
import fs from "node:fs"
import { Shape } from "@r-tui/share"
import { JSXElement } from "solid-js"

const log = (...args: any[]) => {
  // console.log(`[RENDERER] `, ...args)
}

// const flex = new TFlex({
//   write: s => {
//     // console.log(s.slice(100))
//     fs.writeFileSync("./a.log", s)
//     process.stdout.write(s)
//   }
// })

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
    log("creating element", nodeName)
    return createTDom(nodeName)
  },
  createTextNode(value: string): any {
    log("createTextNode")
    throw new Error("not support text node")
  },
  replaceText(textNode: TDom, value: string) {
    log("replaceText", value)
    textNode.attributes.text = value
  },
  setProperty(node: TDom, name: string, value: any) {
    log("setProperty", node.attributes.id, name, value)
    // @ts-ignore
    node.attributes[name] = value
    flex.renderToConsole()
  },
  insertNode(parent: TDom, node: TDom, anchor: TDom) {
    log(
      "insertNode",
      parent.attributes.id,
      node.attributes.id,
      node.childNodes[0]?.attributes?.id,
    )
    insertBeforeNode(parent, node, anchor)
  },
  isTextNode(node: TDom) {
    log("isTextNode")
    return node.props.nodeName === TextName
  },
  removeNode(parent: TDom, node: TDom) {
    log("removeNode", node)
    removeChildNode(parent, node)
  },
  getParentNode(node: TDom) {
    log("getParentNode", node)
    return node.parentNode
  },
  getFirstChild(node: TDom) {
    log("getFirstChild", node)
    return node.childNodes[0]
  },
  getNextSibling(node: TDom) {
    log("getNextSibling", node)
    return getNextSibling(node) as TDom
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
  const { attributes, layoutNode } = flex.rootNode
  const { width, height } = flex.canvas.shape
  attributes.id = "@rtui-root"
  attributes.width = width
  attributes.height = height
  attributes.position = "relative"
  attributes.color = undefined
  attributes.backgroundColor = undefined
  attributes.display = "flex"
  attributes.padding = 0
  attributes.borderSize = 0
  attributes.x = 0
  attributes.y = 0
  attributes.zIndex = 0
  layoutNode.x = 0
  layoutNode.y = 0
  layoutNode.width = width
  layoutNode.height = height
  layoutNode.padding = 0
  layoutNode.border = 0

  _render(code, flex.rootNode)
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
