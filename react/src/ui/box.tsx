import React from "react"
import { forwardRef } from "react"
import type { TDom } from "../render/flex"

export const Box = forwardRef<
  TDom,
  Partial<TDom["attributes"] & { children?: React.ReactNode }>
>((props, ref) => {
  // @ts-ignore
  return props.display !== "none" && <tui-box ref={ref} {...props} />
})
