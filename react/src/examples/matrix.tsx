import React, { useEffect, useRef, useState } from "react"
import { Box } from "../"
import { getTerminalShape } from "@r-tui/terminal"

const CHARS =
  'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ012345789Z:."=*+-<>¦╌ç'

function randomInt(n: number) {
  return (Math.random() * n) | 0
}

function choice(s: string) {
  return s[randomInt(s.length)]
}

const LIVE_COLOR = [
  "#808080",
  "#708070",
  "#608060",
  "#508050",
  "#408040",
  "#308030",
  "#208020",
  "#108010",
  "#008000",
  "#00FF00",
]

export function Column({ height, id }: { id: number; height: number }) {
  const [y, setY] = useState(randomInt(height))
  const update = useRef<() => void>()
  const handle = useRef<number>(0)
  const [history, setHistory] = useState<
    {
      char: string
      live: number
    }[]
  >([])

  function getColor(i: number) {
    return LIVE_COLOR[history[i]?.live || 0]
  }
  function getText(i: number) {
    return history[i]?.char || " "
  }

  update.current = () => {
    for (const i of history) {
      if (i) {
        i.live = Math.max(i.live - 1, 0)
      }
    }
    const c = choice(CHARS)
    let newY = (y + 1) % height
    if (Math.random() < 0.01) {
      newY = 0
    }
    if (newY === 0) {
      const speed = (randomInt(5) + 1) * 30
      clearInterval(handle.current)
      handle.current = +setInterval(() => {
        update.current?.()
      }, speed)
    }
    setY(newY)
    history[newY] = { char: c, live: LIVE_COLOR.length - 1 }
    setHistory([...history])
  }

  useEffect(() => {
    const speed = (randomInt(5) + 1) * 50
    handle.current = +setInterval(() => {
      update.current?.()
    }, speed)
  }, [])

  return (
    <Box width={1} height={height} display="flex" flexDirection="column">
      {Array(height)
        .fill(0)
        .map((_, i) => (
          <Box
            backgroundColor="black"
            color={getColor(i)}
            key={i}
            text={getText(i)}
          />
        ))}
    </Box>
  )
}

export function Matrix() {
  const { width, height } = getTerminalShape()
  return Array(width)
    .fill(0)
    .map((_, i) => <Column key={i} height={height} id={i} />)
}

export default Matrix
