import {
  AnsiBgColor,
  AnsiColor,
  type Color,
  type Theme,
  type Shape,
} from "@r-tui/share"
import { Rgb } from "e-color/dist"

function getAnsiColor(colorName: string | undefined, isBg: boolean): string {
  const colors: Record<string, number> = isBg ? AnsiBgColor : AnsiColor

  if (!colorName) {
    return (`\x1b[${colors["default"]}m`)
  }

  if (colors[colorName]) {
    return (`\x1b[${colors[colorName]}m`)
  }

  if (colorName.startsWith("#") && colorName.length === 7) {
    const r = parseInt(colorName.slice(1, 3), 16)
    const g = parseInt(colorName.slice(3, 5), 16)
    const b = parseInt(colorName.slice(5, 7), 16)
    const prefix = isBg ? 48 : 38
    return `\x1b[${prefix};2;${r};${g};${b}m`
  }

  throw new Error(`not support color: ${colorName}`)
}

export class Pixel {
  constructor(
    public char = "",
    public x = 0,
    public y = 0,
    public zIndex = 0,
    public color?: Color,
    public backgroundColor?: Color,
    public bold = false,
  ) { }

  toAnsi(): string {
    const s: string[] = []
    if (
      !this.char.length &&
      (this.backgroundColor === "default" || this.backgroundColor === undefined)
    ) {
      return ''
    }

    s.push(getAnsiColor(this.color, false))
    s.push(getAnsiColor(this.backgroundColor, true))

    s.push(this.char)
    s.push(`\x1b[${AnsiColor.default}m`)
    s.push(`\x1b[${AnsiBgColor.default}m`)
    return s.join('')
  }
}

export class Canvas {
  pixels: Pixel[][][]
  constructor(public shape: Shape) {
    this.pixels = new Array(shape.height)
      .fill(0)
      .map(() => new Array(shape.width).fill(0).map(() => new Array()))
  }

  clear() {
    this.pixels = new Array(this.shape.height)
      .fill(0)
      .map(() => new Array(this.shape.width).fill(0).map(() => new Array()))
  }

  setPixel(x: number, y: number, pixel: Pixel) {
    this.pixels[y][x].push(pixel)
  }

  getPixel(x: number, y: number): Pixel | undefined {
    const list = this.pixels[y][x]
    let p = list[0]
    for (const i of list) {
      if (p.zIndex <= i.zIndex) {
        p = i
      }
    }
    return p
  }

  toAnsi(): string {
    const list: string[] = []
    const h = this.shape.height
    const w = this.shape.width
    for (let y = 0; y < h; y++) {
      const lines = this.pixels[y]
      for (let x = 0; x < lines.length; x++) {
        const p = this.getPixel(x, y)
        if (!p) {
          list.push(" ")
          continue
        }
        list.push(p.toAnsi())
      }
      // list.push('\x1B[0G')
      // list.push('\n')
    }
    const s = list.join("")
    return s
  }

  toHtml(theme: Theme = "vscode") { }
}
