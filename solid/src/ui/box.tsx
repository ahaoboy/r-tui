import type { TDom } from "../render/flex"
import { type Component, type JSX, JSXElement } from "solid-js"

export const Box = (
  props: Partial<TDom["attributes"]> & {
    children?: any
  },
) => {
  // @ts-ignore
  return props.display !== "none" && <tui-box {...props} />
}
