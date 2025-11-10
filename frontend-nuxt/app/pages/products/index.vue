<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 页面头部 -->
    <div class="bg-white border-b border-gray-200">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 animate-fadeInUp">产品列表</h1>
        <p class="text-gray-600 mt-2 animate-fadeInUp animation-delay-100">发现我们的精选商品</p>
      </div>
    </div>

    <!-- 主内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- 筛选和排序区域 -->
      <div class="mb-8 animate-fadeInUp animation-delay-200">
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <!-- 分类筛选 -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                ]"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
              <button
                class="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all duration-300"
                @click="selectedCategory = ''"
              >
                全部
              </button>
            </div>

            <!-- 排序选项 -->
            <div class="flex items-center gap-4">
              <label for="sort" class="text-sm text-gray-600">排序:</label>
              <select
                id="sort"
                v-model="sortBy"
                class="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              >
                <option value="popularity">热门程度</option>
                <option value="price-low-high">价格: 低到高</option>
                <option value="price-high-low">价格: 高到低</option>
                <option value="newest">最新上架</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- 产品列表 -->
      <div v-if="loading" class="flex justify-center items-center py-20 animate-fadeIn">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p class="text-gray-600">正在加载产品...</p>
        </div>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20 animate-fadeInUp">
        <div class="mb-4 text-gray-400">
          <svg class="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">未找到产品</h3>
        <p class="text-gray-600 mb-6">尝试更改筛选条件或浏览其他分类</p>
        <button
          class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-md"
          @click="selectedCategory = ''"
        >
          查看全部产品
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard
          v-for="(product, index) in paginatedProducts"
          :key="product.id"
          :product="product"
          :class="['animate-fadeInUp', `animation-delay-${(index % 4) * 100}`]"
        />
      </div>

      <!-- 分页 -->
      <div v-if="!loading && filteredProducts.length > 0" class="mt-12 flex justify-center animate-fadeInUp animation-delay-300">
        <nav class="flex items-center space-x-1">
          <button
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="() => { currentPage = 1; handlePageChange(); }"
          >
            首页
          </button>
          <button
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="() => { currentPage--; handlePageChange(); }"
          >
            上一页
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="px-4 py-2 rounded-md text-sm font-medium transition-all"
            :class="{
              'bg-primary text-white shadow-md': currentPage === page,
              'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50': currentPage !== page
            }"
            @click="() => { currentPage = page; handlePageChange(); }"
          >
            {{ page }}
          </button>
          <button
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="() => { currentPage++; handlePageChange(); }"
          >
            下一页
          </button>
          <button
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="() => { currentPage = totalPages; handlePageChange(); }"
          >
            末页
          </button>
        </nav>
      </div>
    </main>

    <!-- 推荐产品区域 -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center animate-fadeInUp">
          您可能也喜欢
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            v-for="(product, index) in recommendedProducts"
            :key="`recommended-${product.id}`"
            :product="product"
            :class="['animate-fadeInUp', `animation-delay-${(index % 4) * 100}`]"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '@/components/ProductCard.vue'

// 类型定义
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  rating: string;
  reviewCount: number;
  soldCount: number;
  stock: number;
  isNew: boolean;
  createdAt: string;
}

// 状态
const loading = ref(true)
const products = ref<Product[]>([])
const recommendedProducts = ref<Product[]>([])
const categories = ref(['电子产品', '服装', '家居', '食品', '美妆'])
const selectedCategory = ref('')
const sortBy = ref('popularity')
const currentPage = ref(1)
const itemsPerPage = 12

// 计算属性
const filteredProducts = computed(() => {
  let filtered = [...products.value]
  
  // 分类筛选
  if (selectedCategory.value) {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }
  
  // 排序
  switch (sortBy.value) {
    case 'price-low-high':
      filtered.sort((a, b) => (a.price - a.discount / 100 * a.price) - (b.price - b.discount / 100 * b.price))
      break
    case 'price-high-low':
      filtered.sort((a, b) => (b.price - b.discount / 100 * b.price) - (a.price - a.discount / 100 * a.price))
      break
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default: // popularity
      filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
  }
  
  return filtered
})

// 分页计算
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (current >= total - 2) {
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
})

// 生成模拟数据
const generateMockProducts = (count = 24): Product[] => {
  const mockProducts: Product[] = []
  const categoryOptions = categories.value
  
  for (let i = 1; i <= count; i++) {
    const hasDiscount = Math.random() > 0.7
    const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0
    const price = Math.floor(Math.random() * 900) + 100
    const category = categoryOptions[Math.floor(Math.random() * categoryOptions.length)] || '电子产品'
    const isNew = Math.random() > 0.8
    
    mockProducts.push({
      id: i,
      name: `${category} 产品 ${i}`,
      description: '这是一个高质量的产品，具有优秀的性能和精美的设计。',
      price,
      discount,
      originalPrice: price,
      image: `https://picsum.photos/seed/product${i}/400/400`,
      images: [
        `https://picsum.photos/seed/product${i}-1/400/400`,
        `https://picsum.photos/seed/product${i}-2/400/400`,
        `https://picsum.photos/seed/product${i}-3/400/400`
      ],
      category,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200) + 10,
      soldCount: Math.floor(Math.random() * 1000),
      stock: Math.floor(Math.random() * 50) + 10,
      isNew,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  
  return mockProducts
}

// 加载数据
const loadData = async () => {
  loading.value = true
  
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 生成模拟数据
    const allProducts = generateMockProducts()
    products.value = allProducts
    
    // 随机选择4个产品作为推荐
    recommendedProducts.value = [...allProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 4)
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    loading.value = false
  }
}

// 监听分页变化，滚动到顶部
const handlePageChange = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 组件挂载
onMounted(() => {
  loadData()
})

// 使用Vue的watch API监听currentPage变化
watch(currentPage, () => {
  handlePageChange()
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 优化按钮悬停效果 */
button {
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* 骨架屏加载效果 */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>