import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

// Same order as Berine: the Cloudflare plugin owns the `ssr` environment,
// then TanStack Start, then the React transform.
export default defineConfig({
  server: { port: 3300 },
  build: { target: 'es2022' },
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
})
