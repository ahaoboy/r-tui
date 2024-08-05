import React from "react"
import { Box } from "../"

export default function App() {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box color="red" text={"hello"} />
      <Box color="green" text={"♥"} />
      <Box color="blue" text={"world"} />
    </Box>
  )
}
