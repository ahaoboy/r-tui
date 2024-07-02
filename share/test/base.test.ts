import { test, expect } from "vitest"
import { getStringShape } from "../src/index.js"

test("base", () => {
  expect(getStringShape("a")).toEqual({
    width: 1,
    height: 1,
  })

  expect(getStringShape("abcd\nqw")).toEqual({
    width: 4,
    height: 2,
  })
})
