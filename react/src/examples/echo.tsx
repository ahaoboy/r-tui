import React from "react"
import { Box } from "../"
import { useReadLine } from "../hook/input"

export default function App() {
  const data = useReadLine()
  return (
    <Box width={"100%"} height={"100%"} display="flex" flexDirection="row">
      {!!data?.length && <Box color="green" text={`echo: ${data}`} />}
      <Box color="red" text={"enter: "} />
    </Box>
  )
}
