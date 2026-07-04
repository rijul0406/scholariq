import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Plugins extend Vite. react() handles JSX; tailwindcss() processes our
  // utility classes at build time.
  plugins: [react(), tailwindcss()],
})
