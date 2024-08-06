import Base from "./base"
import Counter from "./counter"
import Echo from "./echo"
import Cmd from "./cmd"
import FillBox from "./fill-box"
import Fill from "./fill"
import Flex from "./flex"
import Input from "./input"
import Life from "./life"
import Readline from "./readline"
import Move from "./move"
import MoveBox from "./move-box"
import Snake from "./snake"
import Ls from "./ls"

export const Example = {
  Base,
  Counter,
  Echo,
  Cmd,
  FillBox,
  Fill,
  Flex,
  Input,
  Life,
  Readline,
  Move,
  MoveBox,
  Snake,
  Ls,
}

import { render, Box, TDom, createTDom, effect } from "@r-tui/solid"
render(() => <MoveBox />, {
  write: (s) => {
    console.log(s.trimEnd())
  },
})
