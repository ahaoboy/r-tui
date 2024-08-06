import { Box } from "@r-tui/solid"
import { createSignal } from "solid-js"

export default function App() {
  const [count, setCount] = createSignal(0)
  setInterval(() => {
    setCount((c) => ++c)
  }, 100)

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        position="absolute"
        x={count()}
        color="red"
        text={count().toString()}
      />
    </Box>
  )
}
