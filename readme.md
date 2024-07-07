## r-tui (react terminal UI)
A simplified version of [ink](https://github.com/vadimdemedes/ink)

```tsx
export default function App() {
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
    >
      <Box color="red" text={"hello"} />
      <Box color="green" text={"♥"} />
      <Box color="blue" text={"world"} />
    </Box>
  )
}

```
![flex](./assets/flex.svg)

## example

### [cmd](./ui/src/examples/cmd.tsx)
![cmd](./assets/cmd.gif)

### [snake](./ui/src/examples/snake.tsx)
![snake](./assets/snake.gif)

### [ls](./ui/src/examples/ls.tsx)
![ls](./assets/ls.gif)


### [life game](./ui/src/examples/life.tsx)
![life game](./assets/life.gif)





## todo
- [ ] support yoga-wasm-web api
- [ ] custom event