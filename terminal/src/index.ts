import { Shape } from "@r-tui/share"
export function getTerminalShape(): Shape {
  const width = process.stdout.columns
  const height = process.stdout.rows
  return { width, height }
}
