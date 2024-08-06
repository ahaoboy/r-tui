import { Box } from "@r-tui/solid"
import { useReadLine } from "../hook"

export default function App() {
  const data = useReadLine()
  return (
    <Box width={"100%"} height={"100%"} display="flex" flexDirection="row">
      {!!data()?.length && <Box color="green" text={`echo: ${data()}`} />}
      <Box color="red" text={"enter: "} />
    </Box>
  )
}
