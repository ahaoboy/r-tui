import React from "react"
import { Box, render } from "../src"
import { getTerminalShape } from "@r-tui/share"

export default function App() {
  const { width, height } = getTerminalShape()
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
          return (
            <Box
              position="absolute"
              x={x}
              y={y}
              key={k}
              backgroundColor={"blue"}
              zIndex={10}
              text="+"
            />
          )
        })}
    </Box>
  )
}
