import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base must match the GitHub Pages repo path (ADR-008)
export default defineConfig({
  base: '/EarTrainingWithFun/',
  plugins: [react()],
})
