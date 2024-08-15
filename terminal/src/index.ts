import { Shape } from "@r-tui/share"
export function getTerminalShape(): Shape {
  const width = process.stdout.columns || 0
  const height = process.stdout.rows || 0
  return { width, height }
}
