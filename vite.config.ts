import { inspect as xstateInspect } from '@xstate/inspect/lib/server'
import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension'
import { defineConfig } from 'vite'
import viteInspect from 'vite-plugin-inspect'
import * as WebSocket from 'ws'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'

// @ts-expect-error linked lib w/ different rollup version
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    const port = 5050
    const server = new WebSocket.Server({ port })
    xstateInspect({ server })
    console.log(
      `> XState Inspector: https://statecharts.io/inspect?server=localhost:${port}`,
    )
  }

  return {
    root: 'src',
    clearScreen: false,
    build: {
      emptyOutDir: true,
      minify: false,
      sourcemap: 'inline',
      outDir: '../dist-vite',
    },
    plugins: [
      viteInspect(),
      chromeExtension({
        extendManifest: {
          version_name: `Vite ${command}`
        },
      }),
      simpleReloader(),
      svelte({
        emitCss: false,
        preprocess: preprocess({
          postcss: {
            plugins: [require('tailwindcss')],
          },
        }),
      }),
    ],
  }
})
