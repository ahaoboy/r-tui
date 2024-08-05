import React from "react"
import { forwardRef } from "react"
import type { TDom, TDomProps } from "../render/flex"
import type { BaseDomProps } from "@r-tui/flex"

export const Box = forwardRef<
  TDom,
  Partial<TDom["attributes"] & { children?: React.ReactNode }>
>((props, ref) => {
  // @ts-ignore
  return props.display !== "none" && <tui-box ref={ref} {...props} />
})
