import { build } from "esbuild"
import { solidPlugin } from "esbuild-plugin-solid"

build({
  entryPoints: ["./test/*.tsx"],
  bundle: true,
  minify: true,
  outdir: "bundle",
  // TODO: solid not support node platform?
  // platform:"node",
  external: ["fs", "node:child_process"],
  plugins: [
    solidPlugin({
      solid: {
        moduleName: "@r-tui/solid",
        generate: "universal",
      },
    }),
  ],
}).catch(() => process.exit(1))
