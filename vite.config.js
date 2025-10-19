import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // Không cần upload middleware - Backend API sẽ xử lý upload
    port: 5173
  },
  build: {
    // Tối ưu cho production
    sourcemap: mode === 'production' ? false : true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production', // Loại bỏ console.log trong production
        drop_debugger: mode === 'production'
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'axios'],
          ui: ['bootstrap', '@fortawesome/fontawesome-free'],
          charts: ['apexcharts', 'chart.js']
        }
      }
    }
  },
  // Cấu hình cho deployment
  base: mode === 'production' ? '/' : '/',
  define: {
    __VUE_PROD_DEVTOOLS__: mode === 'production' ? false : true
  }
}))
