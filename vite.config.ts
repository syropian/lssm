import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

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

const libConfig = {
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: getPackageNameCamelCase(),
    },
  },
  plugins: [
    dts({ rollupTypes: true }),
  ],
}

const exampleConfig = {
  base: '/example',
  plugins: [vue()],
  build: {
    outDir: path.resolve(__dirname, 'dist/example'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
}

export default defineConfig(({ mode }) => {
  return mode === 'lib' ? libConfig : exampleConfig
});

