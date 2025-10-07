import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/cli.ts"],
  format: ["esm"],
  dts: false,
  clean: true,
  shims: true,
  noExternal: [/@sc-election\/.*/],
  banner: {
    js: "#!/usr/bin/env node",
  },
});
