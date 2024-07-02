import { type Canvas, Pixel } from "@r-tui/canvas"
import type { TDom } from "../render/flex"

export function drawNode(canvas: Canvas, node: TDom, x: number, y: number) {
  let px = x
  let py = y
  const w = canvas.shape.width
  const h = canvas.shape.height

  for (const c of node.attributes.text || "") {
    if (px < 0 || py < 0 || px >= w || py >= h) {
      continue
    }

    const p = new Pixel(
      c,
      px,
      py,
      node.attributes.zIndex,
      node.attributes.color,
      node.attributes.backgroundColor,
      // node.attributes.bold
    )
    canvas.pixels[py][px].push(p)
    if (px + 1 === w) {
      px = 0
      py++
    } else {
      px++
    }
  }
}
