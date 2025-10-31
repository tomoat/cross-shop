<template>
  <div class="home">
    <!-- 首页轮播 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Welcome to Cross Shop</h1>
        <p>Your ultimate destination for quality products</p>
        <router-link to="/products" class="btn-primary">
          Shop Now
        </router-link>
      </div>
    </section>

    <!-- 特色分类 -->
    <section class="categories-section">
      <h2>Shop by Category</h2>
      <div class="categories-grid" v-if="categories?.length > 0">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="navigateToCategory(category.id)"
        >
          <div class="category-image">
            <img :src="`/category-${category.id}.jpg`" :alt="category.name" />
          </div>
          <h3>{{ category.name }}</h3>
        </div>
      </div>
      <div v-else class="loading">
        Loading categories...
      </div>
    </section>

    <!-- 热销产品 -->
    <section class="featured-section">
      <div class="section-header">
        <h2>Featured Products</h2>
        <router-link to="/products" class="view-all">View All</router-link>
      </div>
      
      <div v-if="loading" class="loading">
        Loading products...
      </div>
      
      <div v-else-if="products?.length > 0" class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.images[0] || '/placeholder.jpg'" :alt="product.name" />
          </div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <p class="product-price">${{ product.price.toFixed(2) }}</p>
            <div class="product-actions">
              <button 
                class="btn-primary"
                @click="addToCart(product.id)"
              >
                Add to Cart
              </button>
              <router-link 
                :to="`/product/${product.id}`" 
                class="btn-secondary"
              >
                Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-products">
        No products available at the moment.
      </div>
    </section>

    <!-- 促销区域 -->
    <section class="promo-section">
      <div class="promo-card">
        <h3>Special Offer</h3>
        <p>Get 20% off on all electronics this week</p>
        <router-link to="/products?category=1" class="btn-primary">
          Shop Electronics
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'HomeView',
  setup() {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()

    onMounted(async () => {
      // 获取产品和分类数据
      await Promise.all([
        productsStore.fetchProducts({ limit: 6 }),
        productsStore.fetchCategories()
      ])
    })

    const navigateToCategory = (categoryId) => {
      window.location.href = `/products?category=${categoryId}`
    }

    const addToCart = async (productId) => {
      try {
        await cartStore.addToCart(productId)
        ElMessage.success('Product added to cart!')
      } catch (error) {
        ElMessage.warning('Added to local cart (login to sync)')
      }
    }

    return {
      products: computed(() => productsStore.products),
      categories: computed(() => productsStore.categories),
      loading: computed(() => productsStore.loading),
      navigateToCategory,
      addToCart
    }
  }
}
</script>

<style scoped>
.home {
  padding-bottom: 2rem;
}

/* Hero Section */
.hero-section {
  height: 70vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  margin-bottom: 2rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

/* Categories Section */
.categories-section {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.categories-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.category-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.category-image img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.category-card h3 {
  padding: 1rem;
  text-align: center;
  margin: 0;
}

/* Featured Section */
.featured-section {
  padding: 2rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 2rem;
  margin: 0;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.view-all:hover {
  text-decoration: underline;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
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
  margin: 0 0 1rem 0;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
}

/* Promo Section */
.promo-section {
  padding: 3rem 0;
  background-color: #f8f9fa;
  margin-top: 3rem;
}

.promo-card {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.promo-card h3 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
}

.promo-card p {
  font-size: 1.2rem;
  margin: 0 0 2rem 0;
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
  padding: 3rem 0;
  color: #666;
}
</style>