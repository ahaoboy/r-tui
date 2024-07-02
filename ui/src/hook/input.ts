import { useEffect, useState } from "react"

let init = false
const inputHandleSet = new Set<(s: string) => void>()

export const Enter = "\x0d"
export const CtrlC = "\x03"
export const Left = "\u001b[D"
export const Up = "\u001b[A"
export const Right = "\u001b[C"
export const Down = "\u001b[B"
export const Tab = "\t"

function initMode() {
  if (init) return
  init = true
  process.stdin.setRawMode(true)
  function handleReadable() {
    let s: string | null
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    while ((s = process.stdin.read()) !== null) {
      const str = s.toString()
      if (str === CtrlC) {
        process.exit()
      }
      for (const fn of inputHandleSet) {
        fn(str)
      }
    }
  }
  process.stdin.addListener("readable", handleReadable)
}

export function onInput(handle: (s: string) => void) {
  initMode()
  inputHandleSet.add(handle)
}
export function offInput(handle: (s: string) => void) {
  initMode()
  inputHandleSet.delete(handle)
}
export function useInput() {
  initMode()
  const [key, setKey] = useState<string | undefined>()
  useEffect(() => {
    onInput(setKey)
  }, [])
  return key
}
