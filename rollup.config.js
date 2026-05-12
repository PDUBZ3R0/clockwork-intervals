
import terser from '@rollup/plugin-terser';
import { base64 } from 'rollup-plugin-base64'

export default {
  input: 'source/clockwork.js',
  output: {
    format: 'iife',
    dir: 'dist',
    name: "Intervals"
  },
  plugins: [
    base64({ include: "**/worker.js" }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};