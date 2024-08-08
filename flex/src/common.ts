import { type BaseDom, setAttribute, setProp } from "./dom"
export const attributesToSkip = {
  children: true,
  ref: true,
  key: true,
  style: true,
  forwardedRef: true,
  unstable_applyCache: true,
  unstable_applyDrawHitFromCache: true,
  className: true,
}

export function readAttr(node: BaseDom<any, any, any>, attrName: string) {
  while (node && typeof node.attributes[attrName] === "undefined") {
    if (node.parentNode) {
      node = node.parentNode
    } else {
      return undefined
    }
  }
  return node.attributes[attrName]
}

export function applyAttributes<
  D extends BaseDom<any, any, any>,
  K extends keyof D["attributes"],
>(node: D, attributes: Record<K, any>) {
  for (const name in attributes) {
    if (!attributesToSkip[name as keyof typeof attributesToSkip])
      setAttribute(node, name, attributes[name])
  }
}

export function applyProps<
  D extends BaseDom<any, any, any>,
  K extends keyof D["props"],
>(node: D, props: Record<K, any>) {
  for (const name in props) {
    setProp(node, name, props[name])
  }
}
