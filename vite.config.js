import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/HqSport/',  // ✅ Correct for GitHub Pages
  
  // 🔥 CRITICAL: GitHub Pages build fixes
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // Smaller files, faster load
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  
  // 🛡️ Optimize for production
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  }
})
