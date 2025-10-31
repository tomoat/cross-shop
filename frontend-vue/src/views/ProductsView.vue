<template>
  <div class="products-view">
    <h1>Products</h1>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search products..." class="search-input" />
        <button @click="applyFilters" class="search-btn">Search</button>
      </div>

      <div class="filters">
        <select v-model="selectedCategory" class="category-filter">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>

        <select v-model="sortBy" class="sort-filter">
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>
    </div>

    <!-- 产品列表 -->
    <div v-if="loading" class="loading">Loading products...</div>

    <div v-else-if="products?.length > 0" class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <div class="product-image">
          <img :src="product.images?.[0] ?? '/placeholder.jpg'" :alt="product.name" />
        </div>
        <div class="product-info">
          <h3>{{ product.name }}</h3>
          <p class="product-category">{{ product.category }}</p>
          <p class="product-price">${{ product.price.toFixed(2) }}</p>
          <p class="product-description">{{ truncateText(product.description, 100) }}</p>
          <div class="product-actions">
            <button class="btn-primary" @click="addToCart(product.id)">Add to Cart</button>
            <router-link :to="`/product/${product.id}`" class="btn-secondary"> Details </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-products">No products match your search criteria.</div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(1)" :disabled="currentPage === 1" class="page-btn">First</button>
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="page-btn">Previous</button>

      <span class="page-info"> Page {{ currentPage }} of {{ totalPages }} </span>

      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="page-btn">Next</button>
      <button @click="changePage(totalPages)" :disabled="currentPage === totalPages" class="page-btn">Last</button>
    </div>
  </div>
</template>

<script>
import { useProductsStore } from "../stores/products"
import { useCartStore } from "../stores/cart"
import { onMounted, ref, computed, watch } from "vue"
import { ElMessage } from "element-plus"
import { useRoute } from "vue-router"

export default {
  name: "ProductsView",
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    const route = useRoute()

    const searchQuery = ref("")
    const selectedCategory = ref("")
    const sortBy = ref("price-asc")
    const currentPage = ref(1)
    const itemsPerPage = 12

    // 从路由参数中初始化筛选条件
    onMounted(async () => {
      // 获取路由参数中的分类
      const categoryFromRoute = route.query.category
      if (categoryFromRoute) {
        selectedCategory.value = categoryFromRoute
      }

      // 获取分类和产品数据
      await Promise.all([productsStore.fetchCategories(), fetchProducts()])
    })

    // 监听路由参数变化
    watch(
      () => route.query.category,
      newCategory => {
        if (newCategory) {
          selectedCategory.value = newCategory
          fetchProducts()
        }
      }
    )

    const fetchProducts = async () => {
      const params = {
        page: currentPage.value,
        limit: itemsPerPage,
        category: selectedCategory.value ?? undefined,
        sort: sortBy.value,
        search: searchQuery.value ?? undefined,
      }

      await productsStore.fetchProducts(params)
    }

    const applyFilters = () => {
      currentPage.value = 1
      fetchProducts()
    }

    const changePage = async page => {
      currentPage.value = page
      await fetchProducts()
    }

    const addToCart = async productId => {
      try {
        await cartStore.addToCart(productId)
        ElMessage.success("Product added to cart!")
      } catch (error) {
        ElMessage.warning("Added to local cart (login to sync)")
      }
    }

    const truncateText = (text, maxLength) => {
      if (!text) return ""
      return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
    }

    const totalPages = computed(() => {
      return Math.ceil(productsStore.totalProducts / itemsPerPage)
    })

    return {
      products: computed(() => productsStore.products),
      categories: computed(() => productsStore.categories),
      loading: computed(() => productsStore.loading),
      searchQuery,
      selectedCategory,
      sortBy,
      currentPage,
      totalPages,
      applyFilters,
      changePage,
      addToCart,
      truncateText,
    }
  },
}
</script>

<style scoped>
.products-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.products-view h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Filter Section */
.filter-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.search-btn {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-weight: 500;
}

.search-btn:hover {
  background-color: #5a67d8;
}

.filters {
  display: flex;
  gap: 1rem;
}

.category-filter,
.sort-filter {
  padding: 0.6rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
}

.category-filter {
  flex: 1;
  max-width: 250px;
}

.sort-filter {
  width: 200px;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: 1rem;
}

.product-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.product-category {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.product-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.product-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  background-color: #f0f0f0;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-weight: 500;
}

/* Buttons */
.btn-primary {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #5a67d8;
}

.btn-secondary {
  background-color: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-secondary:hover {
  background-color: #667eea;
  color: white;
}

/* Loading and Error States */
.loading,
.no-products {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}
</style>
