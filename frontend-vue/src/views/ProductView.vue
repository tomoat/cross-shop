<template>
  <div class="product-view">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="categoryName">{{ categoryName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="product-container">
      <div class="product-images">
        <el-carousel height="400px" indicator-position="outside">
          <el-carousel-item v-for="(image, index) in product.images" :key="index">
            <img :src="image" :alt="`${product.name} ${index + 1}`" class="product-img" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="product-info">
        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-rating">
          <el-rate v-model="product.rating" disabled show-score />
          <span class="review-count">({{ product.reviewCount }}条评价)</span>
        </div>
        <div class="product-price">
          <span class="currency">¥</span>
          <span class="price">{{ product.price.toFixed(2) }}</span>
          <span v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice.toFixed(2) }}</span>
        </div>
        <div class="product-stock">
          <span>库存: </span>
          <span :class="{ 'out-of-stock': product.stock <= 0 }">
            {{ product.stock > 0 ? `${product.stock} 件` : '缺货' }}
          </span>
        </div>

        <div class="product-options">
          <div class="option-group" v-for="option in product.options" :key="option.name">
            <label class="option-label">{{ option.name }}:</label>
            <div class="option-values">
              <el-button 
                v-for="value in option.values" 
                :key="value"
                :class="{ active: selectedOptions[option.name] === value }"
                @click="selectOption(option.name, value)"
                size="small"
                plain
              >
                {{ value }}
              </el-button>
            </div>
          </div>
        </div>

        <div class="product-quantity">
          <label>数量:</label>
          <el-input-number 
            v-model="quantity" 
            :min="1" 
            :max="product.stock"
            :disabled="product.stock <= 0"
          />
        </div>

        <div class="product-actions">
          <el-button 
            type="primary" 
            size="large"
            @click="addToCart"
            :disabled="product.stock <= 0"
            class="add-to-cart-btn"
          >
            <el-icon><ShoppingCart /></el-icon>
            加入购物车
          </el-button>
          <el-button 
            type="success" 
            size="large"
            @click="buyNow"
            :disabled="product.stock <= 0"
          >
            立即购买
          </el-button>
        </div>

        <div class="product-share">
          <span>分享:</span>
          <div class="share-icons">
            <el-icon class="icon"><Share /></el-icon>
            <el-icon class="icon"><Star /></el-icon>
            <el-icon class="icon"><Message /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="product-details">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情">
          <div class="detail-content" v-html="product.description"></div>
        </el-tab-pane>
        <el-tab-pane label="规格参数">
          <el-descriptions :column="1" border>
            <el-descriptions-item v-for="(spec, key) in product.specifications" :key="key" :label="key">
              {{ spec }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="用户评价">
          <div class="reviews-section">
            <div class="reviews-header">
              <h3>用户评价 ({{ product.reviewCount }})</h3>
              <el-rate v-model="ratingFilter" show-score :max="5" />
            </div>
            <div class="review-item" v-for="(review, index) in product.reviews" :key="index">
              <div class="reviewer-info">
                <el-avatar :size="40" :src="review.avatar"></el-avatar>
                <div>
                  <div class="reviewer-name">{{ review.username }}</div>
                  <div class="review-date">{{ formatDate(review.date) }}</div>
                </div>
                <el-rate v-model="review.rating" disabled :max="5" show-score />
              </div>
              <div class="review-content">{{ review.content }}</div>
              <div class="review-images" v-if="review.images?.length > 0">
                <img v-for="(img, idx) in review.images" :key="idx" :src="img" :alt="`Review image ${idx + 1}`" class="review-img" />
              </div>
            </div>
            <el-pagination 
              layout="prev, pager, next" 
              :total="product.reviewCount"
              :page-size="5"
              class="reviews-pagination"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="related-products">
      <h2>相关商品</h2>
      <div class="product-grid">
        <div 
          v-for="related in relatedProducts" 
          :key="related.id" 
          class="product-card"
          @click="goToProduct(related.id)"
        >
          <div class="product-card-image">
            <img :src="related.images?.[0] ?? '/placeholder.jpg'" :alt="related.name" />
          </div>
          <div class="product-card-info">
            <h3 class="product-card-name">{{ related.name }}</h3>
            <div class="product-card-price">¥{{ related.price.toFixed(2) }}</div>
            <el-rate v-model="related.rating" disabled :max="5" show-score />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { ShoppingCart, Share, Star, Message } from '@element-plus/icons-vue'

export default {
  name: 'ProductView',
  components: {
    ShoppingCart,
    Share,
    Star,
    Message
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const cartStore = useCartStore()
    const activeTab = ref('0')
    const quantity = ref(1)
    const ratingFilter = ref(0)
    const selectedOptions = ref({})
    
    // 产品数据（模拟，实际应从API获取）
    const product = ref({
      id: 1,
      name: '示例产品名称',
      price: 999.99,
      originalPrice: 1299.99,
      rating: 4.5,
      reviewCount: 120,
      stock: 100,
      images: [
        'https://via.placeholder.com/800x800',
        'https://via.placeholder.com/800x800',
        'https://via.placeholder.com/800x800'
      ],
      options: [
        {
          name: '颜色',
          values: ['红色', '蓝色', '黑色']
        },
        {
          name: '尺寸',
          values: ['S', 'M', 'L', 'XL']
        }
      ],
      specifications: {
        '品牌': '示例品牌',
        '型号': 'ABC123',
        '材质': '优质材料',
        '重量': '500g',
        '产地': '中国'
      },
      description: '<h2>产品详情描述</h2><p>这是一个高质量的产品，具有优秀的性能和精美的外观。</p><p>适合各种场景使用，满足您的多种需求。</p>',
      reviews: [
        {
          id: 1,
          username: '用户1',
          avatar: 'https://via.placeholder.com/40',
          rating: 5,
          content: '产品质量非常好，完全符合预期，很满意！',
          date: '2024-01-15',
          images: ['https://via.placeholder.com/100x100']
        },
        {
          id: 2,
          username: '用户2',
          avatar: 'https://via.placeholder.com/40',
          rating: 4,
          content: '总体不错，有一点小瑕疵，但不影响使用。',
          date: '2024-01-10'
        }
      ]
    })

    const categoryName = computed(() => '示例分类')
    
    const relatedProducts = ref([
      {
        id: 2,
        name: '相关产品1',
        price: 899.99,
        rating: 4.2,
        images: ['https://via.placeholder.com/400x400']
      },
      {
        id: 3,
        name: '相关产品2',
        price: 1199.99,
        rating: 4.7,
        images: ['https://via.placeholder.com/400x400']
      },
      {
        id: 4,
        name: '相关产品3',
        price: 799.99,
        rating: 4.0,
        images: ['https://via.placeholder.com/400x400']
      },
      {
        id: 5,
        name: '相关产品4',
        price: 1099.99,
        rating: 4.8,
        images: ['https://via.placeholder.com/400x400']
      }
    ])

    const selectOption = (optionName, value) => {
      selectedOptions.value[optionName] = value
    }

    const addToCart = () => {
      cartStore.addToCart({
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.images[0],
        quantity: quantity.value,
        options: selectedOptions.value
      })
      
      // 显示成功消息
      ElMessage.success('商品已成功加入购物车！')
    }

    const buyNow = () => {
      // 先添加到购物车，然后跳转到结账页面
      cartStore.addToCart({
        id: product.value.id,
        name: product.value.name,
        price: product.value.price,
        image: product.value.images[0],
        quantity: quantity.value,
        options: selectedOptions.value
      })
      router.push('/checkout')
    }

    const goToProduct = (productId) => {
      router.push(`/product/${productId}`)
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }

    onMounted(() => {
      // 这里可以调用API获取产品数据
      // 例如: fetchProduct(route.params.id)
    })

    return {
      product,
      categoryName,
      relatedProducts,
      activeTab,
      quantity,
      ratingFilter,
      selectedOptions,
      selectOption,
      addToCart,
      buyNow,
      goToProduct,
      formatDate
    }
  }
}
</script>

<style scoped>
.product-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.product-container {
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
}

.product-images {
  flex: 1;
}

.product-img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 24px;
  margin-bottom: 15px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.review-count {
  color: #606266;
}

.product-price {
  margin-bottom: 20px;
}

.currency {
  font-size: 16px;
  color: #f56c6c;
  margin-right: 2px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 10px;
}

.original-price {
  font-size: 16px;
  color: #909399;
  text-decoration: line-through;
}

.product-stock {
  margin-bottom: 20px;
  font-size: 16px;
}

.out-of-stock {
  color: #f56c6c;
}

.option-group {
  margin-bottom: 20px;
}

.option-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.option-values {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.option-values .active {
  border-color: #409eff;
  background-color: #ecf5ff;
  color: #409eff;
}

.product-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.add-to-cart-btn {
  flex: 1;
}

.product-share {
  display: flex;
  align-items: center;
  gap: 10px;
}

.share-icons .icon {
  cursor: pointer;
  margin-right: 10px;
  color: #606266;
  transition: color 0.3s;
}

.share-icons .icon:hover {
  color: #409eff;
}

.product-details {
  margin-bottom: 40px;
}

.detail-content {
  padding: 20px;
  line-height: 1.8;
}

.reviews-section {
  padding: 20px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.review-item {
  border-bottom: 1px solid #ebeef5;
  padding: 20px 0;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.reviewer-name {
  font-weight: 500;
}

.review-date {
  color: #909399;
  font-size: 14px;
}

.review-content {
  margin-bottom: 15px;
  line-height: 1.6;
}

.review-images {
  display: flex;
  gap: 10px;
}

.review-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.reviews-pagination {
  margin-top: 30px;
  text-align: center;
}

.related-products {
  margin-bottom: 40px;
}

.related-products h2 {
  margin-bottom: 20px;
  font-size: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.product-card-image {
  margin-bottom: 15px;
}

.product-card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.product-card-name {
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-card-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>