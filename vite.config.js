import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Image editors and upscalers drop temporary files into the project root.
      // Watching those files can crash the dev server with EBUSY on Windows.
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/*.tmp',
        '**/~*',
        '**/*.crdownload',
        '**/*.partial',
      ],
    },
  },
})
