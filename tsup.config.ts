import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/types.ts'],
  clean: true,
  dts: true,
  sourcemap: true,
  format: ['cjs', 'esm']
})
