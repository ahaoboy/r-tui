import { Box } from "@r-tui/solid"
import { useInput } from "../hook"

export default function App() {
  const key = useInput()
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box color="red" text={"key"} />
      <Box color="green" text={":"} />
      <Box color="blue" text={`${key()}`} />
    </Box>
  )
}
