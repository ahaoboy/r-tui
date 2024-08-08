import {
  AnsiBgColor,
  AnsiColor,
  type Color,
  type Theme,
  type Shape,
} from "@r-tui/share"

export class Pixel {
  constructor(
    public char = "",
    public x = 0,
    public y = 0,
    public zIndex = 0,
    public color?: Color,
    public backgroundColor?: Color,
    public bold = false,
  ) {}

  toAnsi(): string {
    let s = ""
    if (
      !this.char.length &&
      (this.backgroundColor === "default" || this.backgroundColor === undefined)
    ) {
      return s
    }

    s += `\x1b[${AnsiColor[this.color ?? "default"]}m`
    s += `\x1b[${AnsiBgColor[this.backgroundColor ?? "default"]}m`
    s += this.char
    s += `\x1b[${AnsiColor.default}m`
    s += `\x1b[${AnsiBgColor.default}m`
    return s
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

  toHtml(theme: Theme = "vscode") {}
}
