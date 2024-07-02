import process from "node:process"
import { stringLength } from "./ansi/ansi-length"
export type Shape = {
  width: number
  height: number
}
export function getTerminalShape(): Shape {
  const width = process.stdout.columns
  const height = process.stdout.rows
  return { width, height }
}

export function getStringShape(s: string): Shape {
  let width = 0
  const lines = s.split("\n")
  const height = lines.length
  for (const line of lines) {
    width = Math.max(stringLength(line), width)
  }
  return { width, height }
}
