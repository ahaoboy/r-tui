// tjs polyfill
// import "txiki-node-polyfill"

import React from "react"
import App from "../src/examples/fill-box"
import { render } from "../src/render"
render(<App />, {
  shape: {
    width: 5,
    height: 5,
  },
  write: (s) => {
    console.clear()
    console.log(s.length)
  },
})
