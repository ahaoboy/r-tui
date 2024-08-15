export const VscodeTheme = {}

export const UbuntuTheme = {}

export type Theme = "vscode" | "ubuntu"

export const Cursor = {
  hide: "\x1b[?25l",
  show: "\x1b[?25h",
}

export const AnsiColor = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,

  // Bright color
  blackBright: 90,
  gray: 90, // Alias of `blackBright`
  grey: 90, // Alias of `blackBright`
  redBright: 91,
  greenBright: 92,
  yellowBright: 93,
  blueBright: 94,
  magentaBright: 95,
  cyanBright: 96,
  whiteBright: 97,

  default: 39,
}

export const AnsiBgColor = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,

  // Bright color
  blackBright: 100,
  gray: 100, // Alias of `bgBlackBright`
  grey: 100, // Alias of `bgBlackBright`
  redBright: 101,
  greenBright: 102,
  yellowBright: 103,
  blueBright: 104,
  magentaBright: 105,
  cyanBright: 106,
  whiteBright: 107,

  default: 49,
}
// export const DefaultColor = 39
export type Color = keyof typeof AnsiColor | (string & Object)
