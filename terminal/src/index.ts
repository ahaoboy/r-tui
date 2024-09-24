import { Shape } from "@r-tui/share"
export function getTerminalShape(defaultShape = { width: 256, height: 128 }): Shape {
  if (typeof process === 'undefined' || process.stdout?.columns === undefined) {
    return defaultShape
  }
  const width = process.stdout.columns || 0
  const height = process.stdout.rows || 0
  return { width, height }
}
