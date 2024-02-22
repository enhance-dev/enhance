import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
  input: './index.mjs',
  output: {
    file: './dist/index.js',
    format: 'es'
  },
  plugins: [ nodeResolve() ]
}
