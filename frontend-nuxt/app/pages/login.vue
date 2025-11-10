<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
    <!-- 导航栏 -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">Cross Shop</span>
          </NuxtLink>
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-primary transition-colors">首页</NuxtLink>
            <NuxtLink to="/products" class="text-gray-600 hover:text-primary transition-colors">产品</NuxtLink>
            <NuxtLink to="/register" class="text-gray-600 hover:text-primary transition-colors">注册</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="flex-1 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full space-y-8 animate-fadeInUp">
        <div class="text-center space-y-2 animate-fadeInUp">
          <h2 class="text-3xl font-extrabold text-gray-900">欢迎回来</h2>
          <p class="text-gray-600">登录您的账户继续购物</p>
        </div>

        <!-- 登录表单 -->
        <form class="mt-8 space-y-6 animate-scaleIn animation-delay-100" @submit.prevent="handleLogin">
          <div class="rounded-md -space-y-px">
            <!-- 邮箱输入 -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary transition-all"
                placeholder="your@email.com"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 animate-shake">{{ errors.email }}</p>
            </div>

            <!-- 密码输入 -->
            <div class="mt-4">
              <div class="flex justify-between mb-1">
                <label for="password" class="block text-sm font-medium text-gray-700">密码</label>
                <NuxtLink to="/forgot-password" class="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  忘记密码?
                </NuxtLink>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="form.password"
                class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary transition-all"
                placeholder="输入密码"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-red-600 animate-shake">{{ errors.password }}</p>
            </div>
          </div>

          <!-- 记住我选项 -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                v-model="form.rememberMe"
                class="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary transition-all"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">记住我</label>
            </div>
          </div>

          <!-- 登录按钮 -->
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-white opacity-70" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
              </span>
              <span v-if="loading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </div>

          <!-- 错误消息 -->
          <div v-if="error" class="text-red-600 text-center text-sm py-2 px-4 bg-red-50 rounded-lg animate-fadeIn">
            {{ error }}
          </div>
        </form>

        <!-- 分隔线 -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-gray-50 text-gray-500">或</span>
          </div>
        </div>

        <!-- 社交登录选项 -->
        <div class="flex flex-col space-y-3 animate-fadeInUp animation-delay-200">
          <button class="flex justify-center items-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span class="ml-3">使用GitHub登录</span>
          </button>
          <button class="flex justify-center items-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-all">
            <svg class="h-5 w-5 text-[#4285F4]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.498 12.238c0-2.43-.738-4.652-1.98-6.41L13.52 14.33c.714.163 1.364.295 1.998.295 1.99 0 3.815-1.015 4.907-2.59l3.984-5.072C22.682 5.249 24 8.549 24 12.238z"/>
              <path d="M13.52 14.33c-.012.028-.02.056-.032.084l8.374 4.776c1.25-1.765 1.987-3.995 1.987-6.41 0-1.765-.455-3.407-1.205-4.817l-8.07 9.943z"/>
              <path d="M5.254 7.339A8.912 8.912 0 000 12.238c0 1.708.507 3.318 1.392 4.686L10.55 8.928a5.43 5.43 0 00-5.296-1.59z"/>
              <path d="M13.52 14.33V20.5h8.374c-1.25-1.765-3.303-3.995-6.116-5.427l-2.258 1.257z"/>
              <path d="M1.392 16.924c.885-1.368 1.392-2.978 1.392-4.686 0-3.689 3.168-6.679 7.035-6.962L0 2.78v4.56C1.103 8.724 1.392 10.298 1.392 11.9v5.024z"/>
            </svg>
            <span class="ml-3">使用Google登录</span>
          </button>
        </div>

        <!-- 注册链接 -->
        <div class="text-center mt-6 animate-fadeInUp animation-delay-300">
          <p class="text-sm text-gray-600">
            还没有账户?
            <NuxtLink to="/register" class="font-medium text-primary hover:text-primary-dark transition-colors ml-1">
              立即注册
            </NuxtLink>
          </p>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            &copy; {{ new Date().getFullYear() }} Cross Shop. 保留所有权利。
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <NuxtLink to="/privacy" class="text-gray-500 hover:text-primary transition-colors text-sm">隐私政策</NuxtLink>
            <NuxtLink to="/terms" class="text-gray-500 hover:text-primary transition-colors text-sm">使用条款</NuxtLink>
            <NuxtLink to="/contact" class="text-gray-500 hover:text-primary transition-colors text-sm">联系我们</NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 表单状态
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

// 错误状态
const errors = ref({
  email: '',
  password: ''
})

const error = ref('')
const loading = ref(false)

// 表单验证
const validateForm = () => {
  let isValid = true
  
  // 重置错误
  errors.value = {
    email: '',
    password: ''
  }
  error.value = ''
  
  // 验证邮箱
  if (!form.value.email) {
    errors.value.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = '请输入有效的邮箱地址'
    isValid = false
  }
  
  // 验证密码
  if (!form.value.password) {
    errors.value.password = '请输入密码'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = '密码长度至少为6位'
    isValid = false
  }
  
  return isValid
}

// 处理登录
const handleLogin = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // 这里模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 登录成功后的操作
    alert('登录成功!')
    // 实际应用中这里会跳转页面
    // navigateTo('/')
  } catch (err) {
    error.value = '登录失败，请检查您的邮箱和密码'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.6s ease-in-out;
}

/* 输入框焦点动画 */
input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

/* 按钮悬停效果 */
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
</style>