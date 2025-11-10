<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <header class="bg-gray-900 text-white shadow-md transition-all duration-300" :class="{ 
      'sticky top-0 z-50 shadow-lg bg-opacity-95 backdrop-blur-md py-2': isScrolled,
      'bg-opacity-100 py-4': !isScrolled,
      'translate-y-0': isNavVisible,
      '-translate-y-full': !isNavVisible && isScrolled
    }">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-between items-center w-full">
          <!-- Logo -->
          <div class="flex items-center space-x-2 logo-container group">
            <svg class="w-8 h-8 text-primary transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
            <h1 class="text-2xl font-bold tracking-tight transition-all duration-300 group-hover:scale-105">Cross Shop</h1>
          </div>
          
          <!-- 桌面导航 -->
          <nav class="hidden md:flex items-center flex-shrink-0">
            <ul class="flex flex-row space-x-1 sm:space-x-3 lg:space-x-8">
              <li>
                <NuxtLink 
                  to="/" 
                  class="nav-link text-white hover:text-primary transition-all duration-300 py-2 px-3 rounded-md"
                  exact-active-class="text-primary font-medium"
                >
                  首页
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/products" 
                  class="nav-link text-white hover:text-primary transition-all duration-300 py-2 px-3 rounded-md"
                  active-class="text-primary font-medium"
                >
                  产品
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/about" 
                  class="nav-link text-white hover:text-primary transition-all duration-300 py-2 px-3 rounded-md"
                  active-class="text-primary font-medium"
                >
                  关于
                </NuxtLink>
              </li>
              <li>
                <NuxtLink 
                  to="/contact" 
                  class="nav-link text-white hover:text-primary transition-all duration-300 py-2 px-3 rounded-md"
                  active-class="text-primary font-medium"
                >
                  联系我们
                </NuxtLink>
              </li>
            </ul>
          </nav>
          
          <!-- 功能按钮组 -->
          <div class="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
            <!-- 搜索按钮 -->
            <button class="text-white hover:text-primary transition-all duration-300 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800/80 relative group">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <!-- 搜索提示 -->
              <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">搜索</span>
            </button>
            
            <!-- 购物车按钮 -->
            <button class="text-white hover:text-primary transition-all duration-300 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800/80 relative group">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span class="cart-badge">3</span>
              <!-- 购物车提示 -->
              <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">购物车</span>
            </button>
            
            <!-- 用户按钮 -->
            <button class="text-white hover:text-primary transition-all duration-300 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800/80 relative group">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <!-- 用户提示 -->
              <span class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg">我的账户</span>
            </button>
            
            <!-- 移动端菜单按钮 -->
            <button class="md:hidden text-white focus:outline-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-800/80" @click="isMenuOpen = !isMenuOpen" aria-label="菜单">
              <svg class="w-6 h-6 transition-transform duration-300" :class="{ 'rotate-90': isMenuOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 移动端导航菜单 -->
        <div 
          class="md:hidden mt-4 space-y-3 overflow-hidden transition-all duration-500 ease-in-out mobile-menu-enter-active mobile-menu-leave-active" 
          :class="{ 
            'max-h-0 opacity-0': !isMenuOpen,
            'max-h-[300px] opacity-100': isMenuOpen 
          }"
        >
          <NuxtLink 
            to="/" 
            class="block py-2 px-4 text-white hover:bg-gray-800 rounded-md transition-all duration-300 transform hover:translate-x-2"
            exact-active-class="bg-gray-800 text-primary font-medium"
            @click="isMenuOpen = false"
          >
            首页
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="block py-2 px-4 text-white hover:bg-gray-800 rounded-md transition-all duration-300 transform hover:translate-x-2"
            active-class="bg-gray-800 text-primary font-medium"
            @click="isMenuOpen = false"
          >
            产品
          </NuxtLink>
          <NuxtLink 
            to="/about" 
            class="block py-2 px-4 text-white hover:bg-gray-800 rounded-md transition-all duration-300 transform hover:translate-x-2"
            active-class="bg-gray-800 text-primary font-medium"
            @click="isMenuOpen = false"
          >
            关于
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="block py-2 px-4 text-white hover:bg-gray-800 rounded-md transition-all duration-300 transform hover:translate-x-2"
            active-class="bg-gray-800 text-primary font-medium"
            @click="isMenuOpen = false"
          >
            联系我们
          </NuxtLink>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <NuxtPage />
    </main>
    
    <!-- 页脚 -->
    <footer class="bg-gray-900 text-white py-10">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- 公司信息 -->
          <div>
            <div class="flex items-center space-x-2 mb-4">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <h3 class="text-xl font-bold">Cross Shop</h3>
            </div>
            <p class="text-gray-400 mb-4">专注于提供高品质产品和卓越客户体验的电子商务平台。</p>
            <div class="flex space-x-4">
              <a href="#" class="social-icon text-gray-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" class="social-icon text-gray-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </a>
              <a href="#" class="social-icon text-gray-400">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <!-- 快速链接 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">快速链接</h3>
            <ul class="space-y-2">
              <li><NuxtLink to="/" class="footer-link text-gray-400">首页</NuxtLink></li>
              <li><NuxtLink to="/products" class="footer-link text-gray-400">产品目录</NuxtLink></li>
              <li><NuxtLink to="/about" class="footer-link text-gray-400">关于我们</NuxtLink></li>
              <li><NuxtLink to="/contact" class="footer-link text-gray-400">联系我们</NuxtLink></li>
            </ul>
          </div>
          
          <!-- 客户服务 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">客户服务</h3>
            <ul class="space-y-2">
              <li><a href="#" class="footer-link text-gray-400">购物指南</a></li>
              <li><a href="#" class="footer-link text-gray-400">支付方式</a></li>
              <li><a href="#" class="footer-link text-gray-400">配送信息</a></li>
              <li><a href="#" class="footer-link text-gray-400">退换货政策</a></li>
              <li><a href="#" class="footer-link text-gray-400">常见问题</a></li>
            </ul>
          </div>
          
          <!-- 联系信息 -->
          <div>
            <h3 class="text-lg font-semibold mb-4">联系我们</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="w-5 h-5 text-primary mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-gray-400">上海市浦东新区张江高科技园区博云路2号</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-gray-400">contact@cross-shop.com</span>
              </li>
              <li class="flex items-center">
                <svg class="w-5 h-5 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-gray-400">400-888-8888</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- 版权信息 -->
        <div class="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {{ new Date().getFullYear() }} Cross Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 直接导入全局样式文件
import '@@/assets/css/main.css';
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 状态管理
const isMenuOpen = ref(false);
const isScrolled = ref(false);
const lastScrollTop = ref(0);
const isNavVisible = ref(true);

// 处理滚动事件，添加滚动方向检测
const handleScroll = () => {
  const scrollTop = window.scrollY;
  
  // 判断是否滚动超过阈值
  isScrolled.value = scrollTop > 10;
  
  // 处理导航栏显示/隐藏（向下滚动隐藏，向上滚动显示）
  if (Math.abs(scrollTop - lastScrollTop.value) > 10) { // 添加最小滚动距离阈值避免抖动
    isNavVisible.value = scrollTop < lastScrollTop.value || scrollTop < 50;
    lastScrollTop.value = scrollTop;
  }
};

// 处理窗口大小变化，在调整大小时关闭移动菜单
const handleResize = () => {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    isMenuOpen.value = false;
  }
};

// 监听菜单打开状态，添加辅助功能（如防止页面滚动）
watch(isMenuOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  document.body.style.overflow = ''; // 确保移除监听器时恢复页面滚动
});
</script>

<style scoped>
/* 导航栏样式增强 */
header {
  background-color: #111827;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 300ms ease;
}

header.sticky-top {
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(16px);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

/* Logo动画增强 */
.logo-container svg {
  transition: all 500ms ease;
}

.logo-container svg:hover {
  transform: scale(1.1) rotate(12deg);
}

/* 导航链接增强 */
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary);
  transition: all 300ms ease;
  content: '';
}

.nav-link:hover::after {
  width: 100%;
}

/* 购物车徽章动画增强 */
.cart-badge {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce-scale 2s ease-in-out infinite;
}

@keyframes bounce-scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 页脚样式增强 */
footer {
  background-color: #111827;
  color: white;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.footer-link {
  position: relative;
  display: inline-block;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.footer-link:hover {
  color: var(--primary);
}

.footer-link::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 0.125rem;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  background-color: var(--primary);
  content: '';
}

.footer-link:hover::after {
  width: 100%;
}

/* 移动端菜单动画 */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  max-height: 300px;
  opacity: 1;
}

/* 社交图标悬停效果 */
.social-icon {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.social-icon:hover {
  transform: scale(1.1);
  color: var(--primary);
}
</style>
