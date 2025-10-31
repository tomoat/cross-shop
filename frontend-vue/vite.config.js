import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 900, // 提高警告阈值以适应Element Plus的大小
    cssCodeSplit: true, // 启用CSS代码分割
    sourcemap: false, // 生产环境不生成sourcemap
    rollupOptions: {
      output: {
        // 优化代码分割策略
        manualChunks: (id) => {
          // 将Element Plus组件库单独打包
          if (id.includes('element-plus')) {
            return 'element-plus';
          }
          // 将图标库单独打包
          if (id.includes('@element-plus/icons-vue')) {
            return 'element-icons';
          }
          // 将Vue相关库单独打包
          if (id.includes('node_modules/vue') || 
              id.includes('node_modules/vue-router') || 
              id.includes('node_modules/pinia')) {
            return 'vue-vendor';
          }
          // 将axios单独打包
          if (id.includes('node_modules/axios')) {
            return 'axios';
          }
          // 按页面路径分块
          if (id.includes('/src/views/')) {
            const viewName = id.split('/src/views/')[1].split('.')[0];
            return `views-${viewName.toLowerCase()}`;
          }
        },
        // 确保每个分块都有唯一的名称
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
