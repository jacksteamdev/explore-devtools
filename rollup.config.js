/* eslint-env node */

import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension'

import commonjs from '@rollup/plugin-commonjs'
import { emptyDir } from 'rollup-plugin-empty-dir'
import path from 'path'
import preprocess from 'svelte-preprocess'
import resolve from '@rollup/plugin-node-resolve'
import summary from 'rollup-plugin-summary'
import svelte from 'rollup-plugin-svelte'
import typescript from '@rollup/plugin-typescript'
import zip from 'rollup-plugin-zip'

const p = process.env.NODE_ENV === 'production'
const d = process.env.NODE_ENV === 'development'

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: path.join('chunks', '[name]-[hash].js'),
  },
  plugins: [
    chromeExtension({
      extendManifest: d
        ? {
            content_scripts: [
              {
                matches: ['http://localhost:5000/*'],
                js: ['content.ts'],
              },
            ],
          }
        : undefined,
    }),
    // Adds a Chrome extension reloader during watch mode
    simpleReloader(),
    resolve(),
    commonjs(),
    svelte({
      emitCss: false,
      preprocess: preprocess({
        postcss: {
          plugins: [require('tailwindcss')],
        },
      }),
    }),
    typescript(),
    // Empties the output dir before a new build
    emptyDir(),
    // Outputs a zip file in ./releases
    p && zip({ dir: 'release' }),
    summary(),
  ],
}
