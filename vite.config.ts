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

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })

export default defineConfig(async ({ command }) => {
  if (command === 'serve') {
    const port = 5050
    const server = new WebSocket.Server({ port })
    xstateInspect({ server })
    console.log(
      `> XState Inspector: https://statecharts.io/inspect?server=localhost:${port}`,
    )
  }

  command === 'serve' && (await delay(5000))

  return {
    root: 'src',
    clearScreen: false,
    build: {
      emptyOutDir: true,
      minify: false,
      sourcemap: 'inline',
      outDir: '../dist-vite',
      rollupOptions: {
        input: ['test1.html', 'test2.html'],
      },
    },
    plugins: [
      viteInspect(),
      chromeExtension({
        extendManifest: {
          version_name: `Vite ${command}`,
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
