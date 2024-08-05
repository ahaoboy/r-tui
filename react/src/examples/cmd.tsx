import React, { useEffect, useMemo, useState } from "react"
import { Box } from "../"
import { useReadLine } from "../hook/input"
import { spawn } from "node:child_process"

export default function App() {
  const data = useReadLine()
  const [output, setOutput] = useState("")

  useEffect(() => {
    if (!data) {
      return
    }
    const list = data.split(" ")
    const [exe, ...args] = list
    const cmd = spawn(exe, args)
    cmd.stdout.on("data", (s) => {
      setOutput(s.toString().trim())
    })
  }, [data])

  return (
    <Box
      id="cmd-main"
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="row"
    >
      {!!data?.length && <Box id="cmd" color="green" text={`cmd: ${data}`} />}
      {!!output?.length && (
        <Box id="output" color="yellow" text={`output:\n${output}`} />
      )}
      <Box id="enter" color="red" text={"enter: "} />
    </Box>
  )
}
