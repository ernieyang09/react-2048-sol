import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import linaria from '@linaria/vite'

const PROJECT_NAME = 'react-2048-sol'

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      linaria({
        include: ['**/*.{ts,tsx}'],
        babelOptions: {
          presets: ['@babel/preset-typescript', '@babel/preset-react'],
        },
      }),
    ],
    base: `/${PROJECT_NAME}`,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'process.env.CHAIN_ID': env.CHAIN_ID,
    },
  }
})
