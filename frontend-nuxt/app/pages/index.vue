<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero py-24 px-4 relative overflow-hidden shadow-xl">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90"></div>
      <div class="absolute inset-0 bg-[url('https://picsum.photos/id/1067/1920/1080')] bg-cover bg-center opacity-20" style="animation: slowZoom 20s infinite alternate;"></div>
      <div class="container mx-auto text-center relative z-10">
        <div class="transform transition-all duration-1000 hover:scale-105 animate-fadeInUp">
          <h2 class="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">欢迎来到 <span class="text-blue-300">Cross Shop</span></h2>
          <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fadeInUp animation-delay-100">探索我们的精选产品，享受高品质的购物体验和无与伦比的优惠</p>
          <div class="flex flex-col sm:flex-row gap-6 justify-center">
            <NuxtLink to="/products" class="bg-white hover:bg-gray-100 text-primary px-10 py-4 rounded-full font-bold inline-block text-lg shadow-xl transform transition-all duration-300 hover:scale-105 animate-fadeInUp animation-delay-200">
              立即购买
            </NuxtLink>
            <button class="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg animate-fadeInUp animation-delay-300">
              了解更多
            </button>
          </div>
        </div>
      </div>
      
      <!-- 装饰元素 -->
      <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- 特色区域 -->
    <section class="features py-16 px-4">
      <div class="container mx-auto">
        <h3 class="text-3xl font-bold text-center mb-4 relative inline-block after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-1 after:bg-primary animate-fadeInUp">为什么选择我们</h3>
        <p class="text-gray-600 text-center max-w-2xl mx-auto mb-16 animate-fadeInUp animation-delay-100">我们致力于为您提供最优质的产品和服务，让您的购物体验更加愉悦</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="feature-item bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-100">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3">优质产品</h4>
            <p class="text-gray-600">我们精选的产品保证质量，每一件商品都经过严格的质量检验，让您购物无忧</p>
          </div>
          <div class="feature-item bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-200">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3">快速配送</h4>
            <p class="text-gray-600">高效的配送系统，全国覆盖的物流网络，让您尽快收到心仪的商品</p>
          </div>
          <div class="feature-item bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-300">
            <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 text-amber-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h4 class="text-xl font-bold mb-3">贴心服务</h4>
            <p class="text-gray-600">专业的客服团队，24/7在线为您解决购物问题，提供售前售后全方位支持</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门产品区域 -->
    <section class="popular-products py-16 px-4 bg-gray-50">
      <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div class="mb-4 md:mb-0">
            <h3 class="text-3xl font-bold mb-2 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-1 after:bg-primary animate-fadeInUp">热门产品</h3>
            <p class="text-gray-600 animate-fadeInUp animation-delay-100">我们精选的畅销产品，满足您的各种需求</p>
          </div>
          <NuxtLink to="/products" class="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors duration-300 transform hover:translate-x-1 animate-fadeInUp animation-delay-200">
            查看全部 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- 使用ProductCard组件 -->
          <ProductCard 
            v-for="(product, index) in popularProducts" 
            :key="product.id" 
            :product="product" 
            :class="['animate-fadeInUp', `animation-delay-${100 + (index * 100)}`]"
          />
        </div>
      </div>
    </section>
    
    <!-- 客户评价区域 -->
    <section class="testimonials py-16 px-4 bg-white">
      <div class="container mx-auto">
        <h3 class="text-3xl font-bold text-center mb-4 relative inline-block after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-1 after:bg-primary animate-fadeInUp">客户评价</h3>
        <p class="text-gray-600 text-center max-w-2xl mx-auto mb-12 animate-fadeInUp animation-delay-100">听听我们的客户怎么说</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-100">
            <div class="flex items-center space-x-1 text-amber-400 mb-4">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700 mb-6 italic">"Cross Shop的产品质量非常好，客服态度也很热情，我在这里购买的智能手表已经用了半年多了，依然如新。"</p>
            <div class="flex items-center">
              <img src="https://picsum.photos/id/64/100/100" alt="用户头像" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="font-semibold">张三</h4>
                <p class="text-sm text-gray-500">上海</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-200">
            <div class="flex items-center space-x-1 text-amber-400 mb-4">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700 mb-6 italic">"购物体验非常棒，物流速度快，包装精美，最重要的是产品质量好。已经向朋友们推荐了Cross Shop。"</p>
            <div class="flex items-center">
              <img src="https://picsum.photos/id/65/100/100" alt="用户头像" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="font-semibold">李四</h4>
                <p class="text-sm text-gray-500">北京</p>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animation-delay-300">
            <div class="flex items-center space-x-1 text-amber-400 mb-4">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700 mb-6 italic">"价格合理，产品种类丰富，网站操作简单直观。退换货政策也很人性化，很满意这次购物体验。"</p>
            <div class="flex items-center">
              <img src="https://picsum.photos/id/66/100/100" alt="用户头像" class="w-12 h-12 rounded-full object-cover mr-4" />
              <div>
                <h4 class="font-semibold">王五</h4>
                <p class="text-sm text-gray-500">广州</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>

<script setup>
import ProductCard from "../components/ProductCard.vue"

// 模拟热门产品数据，增加更多属性以适配ProductCard组件
const popularProducts = [
  {
    id: 1,
    name: "时尚运动鞋",
    price: 89.99,
    originalPrice: 109.99,
    discount: 18,
    description: "舒适透气的运动鞋，适合日常穿着和轻度运动，采用高品质材料制作",
    image: "https://picsum.photos/id/20/400/400",
    rating: 4.5,
    category: "运动装备",
    isNew: true
  },
  {
    id: 2,
    name: "智能手表 Pro",
    price: 199.99,
    description: "多功能智能手表，支持心率监测、血氧监测和运动追踪功能",
    image: "https://picsum.photos/id/21/400/400",
    rating: 4.8,
    category: "智能设备",
    isNew: true
  },
  {
    id: 3,
    name: "无线降噪耳机",
    price: 129.99,
    originalPrice: 159.99,
    discount: 19,
    description: "高品质无线耳机，提供沉浸式音频体验和主动降噪功能",
    image: "https://picsum.photos/id/22/400/400",
    rating: 4.7,
    category: "音频设备"
  },
  {
    id: 4,
    name: "10000mAh便携充电宝",
    price: 39.99,
    description: "大容量便携充电宝，支持快充和双向充电，让您的设备永不断电",
    image: "https://picsum.photos/id/23/400/400",
    rating: 4.2,
    category: "手机配件"
  }
];
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 160px); /* 减去导航栏和页脚的高度 */
}

.hero {
  background-position: center;
  background-size: cover;
}

.hero h2 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.feature-item {
  border: 1px solid #e5e7eb;
}

.feature-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #3b82f6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero {
    padding-top: 16rem;
    padding-bottom: 16rem;
  }
  
  .hero h2 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .feature-item {
    padding: 1.5rem;
  }
  
  .feature-item .w-16.h-16 {
    width: 3rem;
    height: 3rem;
  }
}
</style>