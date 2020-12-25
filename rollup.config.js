import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve  from 'rollup-plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
  input: "./src/index.ts",
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    sourceMaps(),
    json(),
    typescript({
      exclude: "node_modules/**",
      tsconfig: "./tsconfig.json",
      typescript: require("typescript")
    })
  ],
  output: [
    {
      format: "umd",
      file: "lib/bundle.min.js",
      name: "TaggingMaster",
      sourcemap: true
    }
  ]
}