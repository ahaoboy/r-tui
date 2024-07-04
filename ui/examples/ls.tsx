import React, { useEffect, useRef, useState } from "react"
import { Box, render } from "../src"
import child_process from "node:child_process"
import { Down, Enter, Tab, Up, offInput, onInput } from "../src/hook/input"

type Info = {
  name: string
  dir: boolean
}
function getDirInfo(path = "."): Info[] {
  const s = child_process.execFileSync("ls", ["-p", path]).toString().trim()
  const list = s.split("\n").map((name) => {
    const dir = name.endsWith("/")
    return {
      name: name.replace("/", ""),
      dir,
    }
  })
  return list
}

export default function App() {
  const [root, setRoot] = useState(["."])
  const currentPath = root.join("/")
  const [select, setSelect] = useState(0)
  const [dirInfo, setDirInfo] = useState<Info[]>([])
  const [fileInfo, setFileInfo] = useState<Info[]>([])
  const handleRef = useRef<(s: string) => void>()
  const line = "-".repeat(
    [...dirInfo, ...fileInfo]
      .map((i) => i.name.length)
      .reduce((a, b) => Math.max(a, b), 0),
  )
  function init(root: string[]) {
    setRoot(root)
    const currentPath = root.join("/")
    const info = getDirInfo(currentPath)
    setDirInfo([{ name: "..", dir: true }, ...info.filter((i) => i.dir)])
    setFileInfo(info.filter((i) => !i.dir))
  }
  handleRef.current = (key: string) => {
    if (!dirInfo.length) {
      return
    }
    switch (key) {
      case "w":
      case Up: {
        setSelect((select - 1 + dirInfo.length) % dirInfo.length)
        break
      }
      case "s":
      case Tab:
      case Down: {
        setSelect((select + 1) % dirInfo.length)
        break
      }
      case " ":
      case Enter: {
        const name = dirInfo[select].name
        if (name === "..") {
          if (root.length > 1) {
            root.pop()
          }
        } else {
          root.push(dirInfo[select].name)
        }
        init([...root])
        setSelect(0)
        break
      }
    }
  }
  useEffect(() => {
    init(root)

    const h = (s: string) => handleRef.current?.(s)
    onInput(h)

    return () => offInput(h)
  }, [])

  return (
    <Box width={"100%"} height={"100%"} display="flex" flexDirection="row">
      <Box color="yellow" text={currentPath} />
      <Box color="yellow" text={line} />
      {dirInfo.map((i, k) => (
        <Box
          key={i.name}
          text={i.name}
          color={k === select ? "red" : "green"}
        />
      ))}
      {fileInfo.map((i) => (
        <Box key={i.name} text={i.name} />
      ))}
    </Box>
  )
}

render(<App />)
