import { choice, Color } from "@r-tui/share"
import React, { useEffect, useRef, useState } from "react"
import { Box } from "../ui"
import { onInput } from "../hook/input"
import { getTerminalShape } from "@r-tui/terminal"

const initSnakeLen = 10
const speed = 100

const snakeColor = "yellow"
const snakeHeadColor = "red"
const foodColor = "green"

const keyMap = [
  ["w", 0],
  ["a", 1],
  ["s", 2],
  ["d", 3],
  ["UP", 0],
  ["LEFT", 1],
  ["DOWN", 2],
  ["RIGHT", 3],
] as const

const directionMap = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
] as const

type SnakeBody = { x: number; y: number; type: "head" | "body" }[]
class Snake {
  body: SnakeBody = []
  // 0 top, 1 left, 2 down, 3 right
  direction = 0
  grow = 0

  addHead(x: number, y: number) {
    this.body.push({ x, y, type: "head" })
  }

  addBody(x: number, y: number) {
    this.body.push({ x, y, type: "body" })
  }

  move(): boolean {
    const newBody: SnakeBody = []

    const [dx, dy] = directionMap[this.direction]

    const newHead = {
      x: this.body[0]!.x + dx,
      y: this.body[0].y + dy,
      type: "head",
    } as const

    newBody.push(newHead)

    for (const { x, y } of this.body.slice(0, -1)) {
      if (x === newHead.x && y === newHead.y) {
        return false
      }

      newBody.push({
        x,
        y,
        type: "body",
      })
    }

    const tail = this.body[this.body.length - 1]
    if (this.grow > 0) {
      this.grow--
      newBody.push({
        x: tail.x,
        y: tail.y,
        type: "body",
      })

      if (tail.x === newHead.x && tail.y === newHead.y) {
        return false
      }
    }

    this.body = newBody
    return true
  }
}

const snake = new Snake()

export default function SnakeGame() {
  const { width: w, height: h } = getTerminalShape()
  const [body, setBody] = useState(snake.body)

  const [food, setFood] = useState({ x: -1, y: -1 })
  const cellSize = 1
  const yCount = (h / cellSize) | 0
  const xCount = (w / cellSize) | 0
  const offsetX = (w - xCount * cellSize) / 2

  const createFood = () => {
    const list: { x: number; y: number }[] = []
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        if (body.findIndex((i) => i.x === x && i.y === y) >= 0) {
          continue
        }
        list.push({ x, y })
      }
    }
    setFood(choice(list)!)
  }

  const update = () => {
    const safe = snake.move()

    if (snake.body[0].x === food.x && snake.body[0].y === food.y) {
      snake.grow++
      createFood()
    }

    if (safe) {
      setBody([...snake.body])
    } else {
      // console.log("you lose")
    }
  }

  const updateRef = useRef(update)
  updateRef.current = update

  useEffect(() => {
    snake.body = []
    snake.direction = 3
    snake.grow = 0
    snake.addHead(initSnakeLen - 1, 0)

    for (let i = initSnakeLen - 2; i >= 0; i--) {
      snake.addBody(i, 0)
    }

    onInput((key) => {
      if (!key) return

      const d = keyMap.find((i) => i[0] === key)

      if (d) {
        snake.direction = d[1]
      }
    })

    const handle = setInterval(() => {
      updateRef.current()
    }, speed)

    createFood()
    setBody(snake.body)

    return () => clearInterval(handle)
  }, [])

  return (
    <Box
      position="relative"
      width={"100%"}
      height={"100%"}
      backgroundColor="default"
      alignItems="center"
    >
      {Array(xCount * yCount)
        .fill(0)
        .map((_, k) => {
          const x = k % xCount
          const y = (k / xCount) | 0
          let color: Color = "default"
          if (body.length) {
            if (x === body[0].x && y === body[0].y) {
              color = snakeHeadColor
            } else if (body.find((i) => i.x === x && i.y === y)) {
              color = snakeColor
            } else if (x === food.x && y === food.y) {
              color = foodColor
            }
          }

          return (
            <Box
              position="absolute"
              x={x * cellSize + offsetX}
              y={y * cellSize}
              key={k}
              color={color}
              zIndex={10}
              text={color === "default" ? "" : "█"}
            />
          )
        })}
    </Box>
  )
}
