<template>
  <div class="product-detail" v-if="!loading && product">
    <div class="product-container">
      <!-- 产品图片 -->
      <div class="product-images">
        <div class="main-image">
          <img :src="currentImage" :alt="product.name" />
        </div>
        <div class="thumbnail-images">
          <div
            v-for="(image, index) in product.images"
            :key="index"
            class="thumbnail"
            :class="{ active: selectedImageIndex === index }"
            @click="selectedImageIndex = index"
          >
            <img :src="image" :alt="`${product.name} - view ${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- 产品信息 -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <div class="product-category">{{ product.category }}</div>
        <div class="product-price">${{ product.price.toFixed(2) }}</div>

        <!-- 产品评分 -->
        <div class="product-rating">
          <div class="stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= product.rating }"> ★ </span>
          </div>
          <span class="rating-text">({{ product.reviewCount }} reviews)</span>
        </div>

        <!-- 产品可用性 -->
        <div class="product-stock" :class="{ inStock: product.stock > 0 }">
          {{ product.stock > 0 ? "In Stock" : "Out of Stock" }}
          <span v-if="product.stock > 0">({{ product.stock }} available)</span>
        </div>

        <!-- 数量选择 -->
        <div class="quantity-selector">
          <label for="quantity">Quantity:</label>
          <div class="quantity-controls">
            <button @click="decrementQuantity" :disabled="quantity <= 1" class="quantity-btn">-</button>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              min="1"
              :max="product.stock"
              class="quantity-input"
            />
            <button @click="incrementQuantity" :disabled="quantity >= product.stock" class="quantity-btn">+</button>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="addToCart" :disabled="product.stock <= 0" class="btn-primary">Add to Cart</button>
          <button @click="buyNow" :disabled="product.stock <= 0" class="btn-secondary">Buy Now</button>
        </div>

        <!-- 产品标签 -->
        <div class="product-tags">
          <span v-for="tag in product.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 产品详情选项卡 -->
    <div class="product-details-section">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="tab"
          :class="{ active: activeTab === tab.id }"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="tab-content">
        <!-- 描述 -->
        <div v-if="activeTab === 'description'" class="description-content">
          <h2>Description</h2>
          <div v-html="product.description"></div>
        </div>

        <!-- 规格 -->
        <div v-if="activeTab === 'specifications'" class="specifications-content">
          <h2>Specifications</h2>
          <div class="specifications-grid">
            <div v-for="(value, key) in product.specifications" :key="key" class="specification-item">
              <span class="spec-key">{{ key }}:</span>
              <span class="spec-value">{{ value }}</span>
            </div>
          </div>
        </div>

        <!-- 评论 -->
        <div v-if="activeTab === 'reviews'" class="reviews-content">
          <h2>Customer Reviews ({{ product.reviewCount }})</h2>
          <div v-if="product.reviews?.length > 0" class="reviews-list">
            <div v-for="review in product.reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <span class="review-author">{{ review.author }}</span>
                <span class="review-date">{{ formatDate(review.date) }}</span>
              </div>
              <div class="review-rating">
                <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= review.rating }"> ★ </span>
              </div>
              <div class="review-content">{{ review.comment }}</div>
            </div>
          </div>
          <div v-else class="no-reviews">No reviews yet. Be the first to review this product!</div>
        </div>
      </div>
    </div>

    <!-- 相关产品 -->
    <div class="related-products">
      <h2>Related Products</h2>
      <div class="related-products-grid">
        <div
          v-for="relatedProduct in relatedProducts"
          :key="relatedProduct.id"
          class="related-product-card"
          @click="navigateToProduct(relatedProduct.id)"
        >
          <div class="related-product-image">
            <img :src="relatedProduct.images?.[0] ?? '/placeholder.jpg'" :alt="relatedProduct.name" />
          </div>
          <h3>{{ relatedProduct.name }}</h3>
          <div class="related-product-price">${{ relatedProduct.price.toFixed(2) }}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else-if="loading" class="loading">Loading product details...</div>

  <!-- 产品不存在 -->
  <div v-else class="product-not-found">
    <h1>Product not found</h1>
    <p>The product you are looking for might have been removed or is temporarily unavailable.</p>
    <router-link to="/products" class="btn-primary"> Browse Products </router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useProductsStore } from "../stores/products"
import { useCartStore } from "../stores/cart"
import { ElMessage } from "element-plus"

export default {
  name: "ProductDetailView",
  setup() {
    const route = useRoute()
    const router = useRouter()
    const productsStore = useProductsStore()
    const cartStore = useCartStore()

    const loading = ref(true)
    const selectedImageIndex = ref(0)
    const quantity = ref(1)
    const activeTab = ref("description")

    const tabs = [
      { id: "description", label: "Description" },
      { id: "specifications", label: "Specifications" },
      { id: "reviews", label: "Reviews" },
    ]

    const product = computed(() => productsStore.currentProduct)
    const relatedProducts = computed(() => productsStore.relatedProducts)

    const currentImage = computed(() => {
      if (!product.value ?? !product.value.images?.length) {
        return "/placeholder.jpg"
      }
      return product.value.images[selectedImageIndex.value] ?? product.value.images[0]
    })

    onMounted(async () => {
      try {
        const productId = parseInt(route.params.id)
        if (isNaN(productId)) {
          loading.value = false
          return
        }

        await productsStore.fetchProductById(productId)
        await productsStore.fetchRelatedProducts(productId)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        ElMessage.error("Failed to load product details")
      } finally {
        loading.value = false
      }
    })

    const incrementQuantity = () => {
      if (quantity.value < product.value.stock) {
        quantity.value++
      }
    }

    const decrementQuantity = () => {
      if (quantity.value > 1) {
        quantity.value--
      }
    }

    const addToCart = async () => {
      try {
        await cartStore.addToCart(product.value.id, quantity.value)
        ElMessage.success("Product added to cart!")
      } catch (error) {
        ElMessage.warning("Added to local cart (login to sync)")
      }
    }

    const buyNow = async () => {
      // 先添加到购物车
      try {
        await cartStore.addToCart(product.value.id, quantity.value)
        // 然后跳转到结账页面
        router.push("/checkout")
      } catch (error) {
        ElMessage.warning("Added to local cart (login to proceed)")
        router.push("/checkout")
      }
    }

    const navigateToProduct = productId => {
      router.push(`/product/${productId}`)
    }

    const formatDate = dateString => {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    }

    return {
      loading,
      product,
      relatedProducts,
      currentImage,
      selectedImageIndex,
      quantity,
      activeTab,
      tabs,
      incrementQuantity,
      decrementQuantity,
      addToCart,
      buyNow,
      navigateToProduct,
      formatDate,
    }
  },
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.product-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

/* Product Images */
.product-images {
  flex: 1;
  min-width: 300px;
}

.main-image {
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.main-image img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
}

.thumbnail-images {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.thumbnail.active {
  border-color: #667eea;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Product Info */
.product-info {
  flex: 1;
  min-width: 300px;
}

.product-info h1 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.product-category {
  color: #666;
  margin-bottom: 0.5rem;
}

.product-price {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  letter-spacing: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
}

.star.filled {
  color: #f59e0b;
}

.rating-text {
  color: #666;
  font-size: 0.9rem;
}

.product-stock {
  padding: 0.5rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
}

.product-stock.inStock {
  background-color: #d1fae5;
  color: #065f46;
}

.product-stock:not(.inStock) {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Quantity Selector */
.quantity-selector {
  margin-bottom: 2rem;
}

.quantity-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
  width: 120px;
}

.quantity-btn {
  width: 35px;
  height: 35px;
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
}

.quantity-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.quantity-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 35px;
  border: 1px solid #e0e0e0;
  border-left: none;
  border-right: none;
  text-align: center;
  font-size: 1rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  flex: 1;
}

.btn-primary {
  background-color: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #5a67d8;
}

.btn-secondary {
  background-color: transparent;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #667eea;
  color: white;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Product Tags */
.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  color: #666;
}

/* Product Details Section */
.product-details-section {
  margin-bottom: 3rem;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #e0e0e0;
  margin-bottom: 2rem;
}

.tab {
  padding: 1rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
}

.tab.active {
  color: #667eea;
  font-weight: 500;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #667eea;
}

/* Tab Content */
.tab-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.description-content,
.specifications-content,
.reviews-content {
  line-height: 1.6;
}

/* Specifications */
.specifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.specification-item {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.spec-key {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.spec-value {
  color: #666;
}

/* Reviews */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-item {
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.review-author {
  font-weight: 500;
}

.review-date {
  color: #666;
  font-size: 0.9rem;
}

.review-content {
  margin-top: 0.5rem;
  color: #333;
}

.no-reviews {
  padding: 2rem;
  text-align: center;
  color: #666;
}

/* Related Products */
.related-products {
  margin-top: 3rem;
}

.related-products h2 {
  margin-bottom: 1.5rem;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.related-product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.related-product-image {
  margin-bottom: 1rem;
  text-align: center;
}

.related-product-image img {
  max-width: 100%;
  height: 150px;
  object-fit: contain;
}

.related-product-card h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.related-product-price {
  font-weight: bold;
  color: #333;
}

/* Loading and Error States */
.loading,
.product-not-found {
  text-align: center;
  padding: 4rem 0;
  color: #666;
}

.product-not-found h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.product-not-found p {
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
