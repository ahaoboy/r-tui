import React, { useEffect, useState } from "react"
import { Box } from "../"
import { getTerminalShape } from "@r-tui/terminal"

export default function FillBox() {
  const { width, height } = getTerminalShape()
  const [count, setCount] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCount((c) => c + 1)
    }, 1000)
  }, [])

  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      {Array(width * height)
        .fill(0)
        .map((_, k) => {
          const x = k % width
          const y = ((k - x) / width) | 0
          const text = (x + y) & 1 ? " " : "█"
          return (
            <Box
              position="absolute"
              x={x}
              y={y}
              key={k}
              color={count & 1 ? "green" : "blue"}
              zIndex={10}
              text={text}
            />
          )
        })}
    </Box>
  )
}
