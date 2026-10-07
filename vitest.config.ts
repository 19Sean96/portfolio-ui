import { defineConfig } from 'vitest/config'

// Tests cover the pure modules (content, lab registry, progress, clock).
// They run on Node, not in a Workers runner or a browser.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ['src/**/*.test.ts'] },
})
