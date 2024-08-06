import { Box } from "@r-tui/solid"
import child_process from "node:child_process"
import { Down, Enter, Tab, Up, offInput, onInput } from "../hook"
import { createSignal } from "solid-js"

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
  const [root, setRoot] = createSignal(["."])
  const currentPath = root().join("/")
  const [select, setSelect] = createSignal(0)
  const [dirInfo, setDirInfo] = createSignal<Info[]>([])
  const [fileInfo, setFileInfo] = createSignal<Info[]>([])
  const line = "-".repeat(
    [...dirInfo(), ...fileInfo()]
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
  const update = (key: string) => {
    if (!dirInfo().length) {
      return
    }
    switch (key) {
      case "w":
      case Up: {
        setSelect((select() - 1 + dirInfo().length) % dirInfo().length)
        break
      }
      case "s":
      case Tab:
      case Down: {
        setSelect((select() + 1) % dirInfo().length)
        break
      }
      case " ":
      case Enter: {
        const name = dirInfo()[select()].name
        if (name === "..") {
          if (root.length > 1) {
            root().pop()
          }
        } else {
          root().push(dirInfo()[select()].name)
        }
        init([...root()])
        setSelect(0)
        break
      }
    }
  }
  init(root())
  onInput(update)

  return (
    <Box width={"100%"} height={"100%"} display="flex" flexDirection="row">
      <Box color="yellow" text={currentPath} />
      <Box color="yellow" text={line} />
      {dirInfo().map((i, k) => (
        <Box
          // @ts-ignore
          key={i.name}
          text={i.name}
          color={k === select() ? "red" : "green"}
        />
      ))}
      {fileInfo().map((i) => (
        <Box
          // @ts-ignore
          key={i.name}
          text={i.name}
        />
      ))}
    </Box>
  )
}
