import React, { useEffect, useState } from "react"
import { Box } from "../"
import { getTerminalShape } from "@r-tui/terminal"

export default function App() {
  const { width, height } = getTerminalShape()
  const [blue, setBlue] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setBlue((c) => (c + 5) % 255)
    }, 100)
  }, [])

  return new Array(width * height).fill(0).map((_, i) => {
    const x = (i / width) | 0
    const y = i % width
    const r = (((x / height) * 255) | 0).toString(16).padStart(2, "0")
    const g = (((y / width) * 255) | 0).toString(16).padStart(2, "0")
    const b = blue.toString(16).padStart(2, "0")
    const c = `#${r}${g}${b}`
    return <Box id={i} key={i} color={c} text="█" />
  })
}
