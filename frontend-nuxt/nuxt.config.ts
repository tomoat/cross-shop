// https://nuxt.com/docs/api/configuration/nuxt-config

// 导入全局钩子，在应用启动前拦截控制台输出
// require('./hooks.cjs');
import "./hooks.cjs"

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // 更简洁的配置，服务器中间件通过server/middleware目录自动加载
  router: {
    // 添加Vue Router选项配置
    options: {
      // 在生产环境中，这些路径不会存在，所以警告主要在开发环境
    },
  },
  // 现代化样式配置
  css: [
    // CSS 全局样式文件 - 使用@@别名指向项目根目录
    "@@/assets/css/main.css",
  ],
  modules: [
    // Tailwind CSS 支持
  ],

  // PostCSS 配置（替代单独的postcss.config.js文件）
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      // 添加现代字体
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        },
      ],
      // 添加视口配置以支持响应式设计
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
        },
        {
          name: "theme-color",
          content: "#3b82f6",
        },
      ],
    },
  },
  // 构建配置
  build: {
    // 可以在这里添加构建相关配置
    transpile: [],
  },
  // 运行时配置
  runtimeConfig: {
    public: {
      // 可以在这里添加公共配置
      theme: {
        primaryColor: "#3b82f6",
        secondaryColor: "#10b981",
        accentColor: "#f59e0b",
      },
    },
  },
})
