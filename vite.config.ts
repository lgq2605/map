import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// base './' để chạy được trên GitHub Pages với bất kỳ tên repo nào
export default defineConfig({ base: './', plugins: [react(), tailwindcss()] })
