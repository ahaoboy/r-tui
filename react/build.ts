import { build } from "esbuild"

build({
  entryPoints: ["./test/*.tsx"],
  bundle: true,
  minify: true,
  outdir: "bundle",
  // TODO: solid not support node platform?
  // platform:"node",
  external: ["fs", "node:child_process"],
}).catch(() => process.exit(1))
