<template>
  <div class="product-card group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
    <!-- 产品标签 -->
    <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
      <span v-if="product.discount" class="badge discount px-2 py-1 rounded text-xs font-bold text-white bg-primary shadow-md">
        -{{ product.discount }}%
      </span>
      <span v-if="product.isNew" class="badge new px-2 py-1 rounded text-xs font-bold text-white bg-primary shadow-md">
        新品
      </span>
    </div>
    
    <!-- 产品图片区域 -->
    <NuxtLink 
      :to="`/products/${product.id}`" 
      class="block relative aspect-square overflow-hidden group"
    >
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <!-- 评分标签 -->
      <div
        v-if="product.rating"
        class="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1"
      >
        <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
        {{ product.rating }}
      </div>
      
      <!-- 快速操作按钮 -->
      <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <button 
          class="action-btn w-10 h-10 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center shadow-md"
          @click.stop="addToWishlist"
          aria-label="添加到收藏"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>
    </NuxtLink>

    <!-- 产品信息区域 -->
    <div class="p-4">
      <!-- 产品分类 -->
      <div v-if="product.category" class="product-category text-xs text-gray-500 mb-1 uppercase tracking-wider">
        {{ product.category }}
      </div>
      
      <!-- 产品名称 -->
      <NuxtLink :to="`/products/${product.id}`" class="block">
        <h3 class="font-bold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-1">
          {{ product.name }}
        </h3>
      </NuxtLink>

      <!-- 产品描述 -->
      <p class="text-gray-600 text-sm mb-3 line-clamp-2 h-12">
        {{ product.description || '暂无产品描述' }}
      </p>

      <!-- 价格和操作按钮 -->
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <p class="text-blue-600 font-bold text-xl">${{ product.price.toFixed(2) }}</p>
          <p v-if="product.originalPrice" class="text-gray-400 line-through text-sm">
            ${{ product.originalPrice.toFixed(2) }}
          </p>
        </div>
        <button
          @click="addToCart"
          class="add-to-cart-btn bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          aria-label="添加到购物车"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router"

// 定义组件属性
const props = defineProps({
  product: {
    type: Object,
    required: true,
    default: () => ({
      id: "",
      name: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      description: "",
      image: "",
      rating: 0,
      category: "",
      isNew: false
    }),
  },
})

const router = useRouter()

// 添加到购物车函数
function addToCart() {
  // 这里可以实现添加到购物车的逻辑
  console.log("添加到购物车:", props.product)

  // 显示添加成功的动画效果
  const button = event.currentTarget
  const originalContent = button.innerHTML
  
  // 禁用按钮并显示加载状态
  button.disabled = true
  button.classList.add('bg-green-500')
  button.classList.remove('bg-blue-600', 'hover:bg-blue-700')
  
  button.innerHTML = `
    <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `
  
  // 模拟API调用延迟
  setTimeout(() => {
    // 显示成功图标
    button.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    `
    
    // 3秒后恢复原始状态
    setTimeout(() => {
      button.disabled = false
      button.innerHTML = originalContent
      button.classList.remove('bg-green-500')
      button.classList.add('bg-blue-600', 'hover:bg-blue-700')
    }, 2000)
  }, 800)
}

// 添加到收藏函数
function addToWishlist() {
  console.log("添加到收藏:", props.product)
  const button = event.currentTarget
  
  // 添加动画效果
  button.classList.add('animate-bounce')
  setTimeout(() => {
    button.classList.remove('animate-bounce')
  }, 500)
  
  // 可以在这里添加实际的收藏逻辑
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-6px);
  border-color: #3b82f6;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.badge {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-category {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.add-to-cart-btn {
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn:hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.add-to-cart-btn:hover::before {
  left: 100%;
}

.action-btn {
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .action-btn {
  transform: translateY(0);
  opacity: 1;
}

.action-btn:nth-child(1) {
  transition-delay: 0.1s;
}

.action-btn:nth-child(2) {
  transition-delay: 0.2s;
}

/* 动画效果 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-bounce {
  animation: bounce 0.5s ease;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .product-card {
    max-width: 160px;
    margin: 0 auto;
  }
  
  .product-card h3 {
    font-size: 0.875rem;
  }
  
  .product-card p {
    font-size: 0.75rem;
  }
  
  .product-card .text-xl {
    font-size: 1rem;
  }
  
  .action-btn {
    width: 9px;
    height: 9px;
  }
  
  .action-btn svg {
    width: 4px;
    height: 4px;
  }
}
</style>
