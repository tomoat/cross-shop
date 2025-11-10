<template>
  <div class="products-page">
    <h2 class="text-3xl font-bold mb-6">产品列表</h2>
    
    <!-- 筛选和搜索 -->
    <div class="filter-section mb-8 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="relative w-full md:w-64">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索产品..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <select v-model="selectedCategory" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">所有分类</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
        </select>
        <div class="flex items-center gap-2">
          <label for="sort">排序:</label>
          <select id="sort" v-model="sortBy" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="price-asc">价格: 低到高</option>
            <option value="price-desc">价格: 高到低</option>
            <option value="name-asc">名称: A-Z</option>
            <option value="name-desc">名称: Z-A</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 产品网格 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
      />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredProducts.length === 0" class="text-center py-16">
      <p class="text-gray-500 text-lg">没有找到符合条件的产品</p>
      <button @click="resetFilters" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        重置筛选条件
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductCard from '../components/ProductCard.vue';

// 状态管理
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('price-asc');

// 模拟分类数据
const categories = [
  { id: 1, name: "电子产品" },
  { id: 2, name: "服装鞋帽" },
  { id: 3, name: "家居用品" },
  { id: 4, name: "运动户外" }
];

// 模拟产品数据
const products = [
  {
    id: 1,
    name: "时尚运动鞋",
    price: 89.99,
    description: "舒适透气的运动鞋，适合日常穿着和轻度运动",
    image: "https://picsum.photos/id/20/400/400",
    categoryId: 2,
    rating: 4.5
  },
  {
    id: 2,
    name: "智能手表",
    price: 199.99,
    description: "多功能智能手表，支持心率监测和运动追踪",
    image: "https://picsum.photos/id/21/400/400",
    categoryId: 1,
    rating: 4.7
  },
  {
    id: 3,
    name: "无线耳机",
    price: 129.99,
    description: "高品质无线耳机，提供沉浸式音频体验",
    image: "https://picsum.photos/id/22/400/400",
    categoryId: 1,
    rating: 4.3
  },
  {
    id: 4,
    name: "便携充电宝",
    price: 39.99,
    description: "大容量便携充电宝，让您的设备永不断电",
    image: "https://picsum.photos/id/23/400/400",
    categoryId: 1,
    rating: 4.1
  },
  {
    id: 5,
    name: "棉质T恤",
    price: 29.99,
    description: "柔软舒适的棉质T恤，适合日常穿着",
    image: "https://picsum.photos/id/24/400/400",
    categoryId: 2,
    rating: 4.2
  },
  {
    id: 6,
    name: "保温杯",
    price: 24.99,
    description: "不锈钢保温杯，保温效果持久",
    image: "https://picsum.photos/id/25/400/400",
    categoryId: 3,
    rating: 4.4
  },
  {
    id: 7,
    name: "瑜伽垫",
    price: 45.99,
    description: "加厚瑜伽垫，提供舒适的练习体验",
    image: "https://picsum.photos/id/26/400/400",
    categoryId: 4,
    rating: 4.6
  },
  {
    id: 8,
    name: "太阳镜",
    price: 59.99,
    description: "防紫外线太阳镜，保护眼睛的同时展现时尚",
    image: "https://picsum.photos/id/27/400/400",
    categoryId: 2,
    rating: 4.0
  }
];

// 计算属性：筛选和排序产品
const filteredProducts = computed(() => {
  let result = [...products];
  
  // 应用搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    );
  }
  
  // 应用分类筛选
  if (selectedCategory.value) {
    result = result.filter(product => product.categoryId === parseInt(selectedCategory.value));
  }
  
  // 应用排序
  switch (sortBy.value) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  
  return result;
});

// 重置筛选条件
function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  sortBy.value = 'price-asc';
}
</script>

<style scoped>
.products-page {
  min-height: calc(100vh - 160px); /* 减去导航栏和页脚的高度 */
}

.filter-section {
  transition: box-shadow 0.3s ease;
}

.filter-section:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>