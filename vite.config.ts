import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

const isProd = process.env.NODE_ENV === 'production'

const getPackageName = () => {
  return packageJson.name
}

const getPackageNameCamelCase = () => {
  try {
    return getPackageName().replace(/-./g, (char) => char[1].toUpperCase())
  } catch (err) {
    throw new Error('Name property in package.json is missing.')
  }
}
const fileName = {
  es: `${getPackageName()}.mjs`,
  cjs: `${getPackageName()}.cjs`,
  iife: `${getPackageName()}.iife.js`,
}

const libConfig = defineConfig({
  base: './',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: getPackageNameCamelCase(),
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => fileName[format],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
})

const exampleConfig = defineConfig({
  base: '/example',
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'dist/example'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    },
  },
})

export default isProd ? libConfig : exampleConfig
