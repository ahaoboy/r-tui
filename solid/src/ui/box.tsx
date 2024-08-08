import type { TDom } from "@r-tui/rflex"
export const Box = (
  props: Partial<TDom["attributes"]> & {
    children?: any
    key?: number | string
  },
) => {
  // @ts-ignore
  return props.display !== "none" && <tui-box {...props} />
}
