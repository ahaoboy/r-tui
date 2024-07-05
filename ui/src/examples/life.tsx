import { getTerminalShape } from "@r-tui/terminal"
import React, { useEffect, useRef, useState } from "react"
import { Box } from "../ui"

const dir = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function getCells(
  width: number,
  height: number,
  fill: () => boolean,
): boolean[][] {
  const v = new Array(height)
    .fill(0)
    .map(() => new Array(width).fill(0).map(fill))
  return v
}

export default function Life() {
  const { width, height } = getTerminalShape()
  const [cells, setCells] = useState(
    getCells(width, height, () => Math.random() > 0.9),
  )

  const h = useRef<() => void>()
  h.current = () => {
    const newCells: boolean[][] = JSON.parse(JSON.stringify(cells))

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let n = 0
        const v = cells[y][x]

        for (const [dx, dy] of dir) {
          const nx = x + dx
          const ny = y + dy

          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            continue
          }

          if (cells[ny][nx]) {
            n++
          }
        }

        if (v) {
          if (n < 2) {
            newCells[y][x] = false
          } else if (n <= 3) {
            newCells[y][x] = true
          } else if (n > 3) {
            newCells[y][x] = false
          } else {
            newCells[y][x] = false
          }
        } else {
          if (n === 3) {
            newCells[y][x] = true
          } else {
            newCells[y][x] = false
          }
        }
      }
    }

    setCells(newCells)
  }
  useEffect(() => {
    setInterval(() => h.current?.(), 1000)
  }, [])
  return (
    <Box width={width} height={height}>
      {new Array(width * height).fill(0).map((_, k) => {
        const x = k % width
        const y = (k - x) / width
        const char = cells[y][x] ? "█" : ""
        return <Box position="absolute" x={x} y={y} key={k} text={char} />
      })}
    </Box>
  )
}
