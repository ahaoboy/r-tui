import React, { useEffect, useMemo, useState } from "react"
import { Box } from "../"
import { useReadLine } from "../hook/input"
import cp from "node:child_process"

export default function App() {
  const data = useReadLine()
  const output = useMemo(() => {
    if (!data?.length) {
      return ""
    }
    const output = cp.execSync(data).toString().trim()
    return output
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
