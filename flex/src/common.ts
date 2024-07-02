import { type DOMElement, setAttribute } from "./dom"
export const propsToSkip = {
  children: true,
  ref: true,
  key: true,
  style: true,
  forwardedRef: true,
  unstable_applyCache: true,
  unstable_applyDrawHitFromCache: true,
  className: true,
}

export function readAttr(node: any, attrName: string) {
  while (node && typeof node.attributes[attrName] === "undefined") {
    if (node.parentNode) {
      node = node.parentNode
    } else {
      return undefined
    }
  }
  return node.attributes[attrName]
}
export function isEvent(name: string) {
  return name[0] === "o" && name[1] === "n"
}
export function applyProps<D extends DOMElement>(node: D, props: any) {
  for (const name in props) {
    if (!propsToSkip[name as keyof typeof propsToSkip])
      setAttribute(node, name, props[name])
  }
}
