import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import linaria from '@linaria/vite'

const PROJECT_NAME = 'react-2048-sol'

// https://vitejs.dev/config/
export default defineConfig({
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
})
