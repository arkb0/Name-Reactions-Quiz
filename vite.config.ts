import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // If we are in GitHub Actions, use the repo name; otherwise, use root
  base: process.env.NODE_ENV === 'production' 
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/` 
    : '/',
  
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
