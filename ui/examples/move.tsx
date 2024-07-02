import React, { useEffect, useState } from "react"
import { Box } from "../src"

export default function App() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCount((c) => ++c)
    }, 100)
  }, [])

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="absolute"
        left={count}
        color="red"
        text={count.toString()}
      />
    </Box>
  )
}
