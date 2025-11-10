<template>
  <div class="product-detail-page">
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <p class="text-lg text-gray-600">正在加载产品信息...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-lg text-red-600">{{ error }}</p>
      <NuxtLink to="/products" class="mt-4 inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors shadow-md">
        返回产品列表
      </NuxtLink>
    </div>

    <!-- 产品详情 -->
    <div v-else-if="product" class="animate-fade-in">
      <!-- 面包屑导航 -->
      <div class="breadcrumbs mb-6">
        <NuxtLink to="/" class="text-gray-600 hover:text-primary">首页</NuxtLink>
        <span class="mx-2 text-gray-400">/</span>
        <NuxtLink to="/products" class="text-gray-600 hover:text-primary">产品列表</NuxtLink>
        <span class="mx-2 text-gray-400">/</span>
        <span class="text-gray-900 font-medium truncate max-w-xs">
          {{ product.name }}
        </span>
      </div>

      <!-- 产品核心信息区 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- 产品图片预览区 -->
        <div class="product-image-section">
          <!-- 主图展示 -->
          <div class="main-image-container bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
            <img 
              :src="selectedImage || product.image" 
              :alt="product.name" 
              class="w-full h-auto object-contain max-h-[500px] transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <!-- 标签区域 -->
            <div v-if="product.discount" class="absolute top-4 left-4">
              <span class="inline-flex items-center px-3 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full shadow-md">
                -{{ product.discount }}%
              </span>
            </div>
          </div>
          
          <!-- 缩略图列表 -->
          <div v-if="product.images && product.images.length > 0" class="thumbnails flex gap-2 overflow-x-auto pb-2">
            <div 
              v-for="(img, index) in product.images" 
              :key="index"
              class="thumbnail cursor-pointer flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200"
              :class="{ 'border-primary': selectedImage === img, 'border-transparent hover:border-primary/50': selectedImage !== img }"
              @click="selectedImage = img"
            >
              <img :src="img" :alt="`${product.name} 图片 ${index + 1}`" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <!-- 产品信息 -->
        <div class="product-info">
          <!-- 产品名称和评分 -->
          <div class="mb-4">
            <!-- 分类标签 -->
            <div v-if="product.category" class="mb-2">
              <span class="inline-block px-3 py-1 text-xs font-medium text-primary-dark bg-primary/10 rounded-full">
                {{ product.category }}
              </span>
            </div>
            
            <!-- 产品名称 -->
            <h1 class="text-3xl font-bold mb-2 text-gray-900">
              {{ product.name }}
            </h1>
            
            <!-- 评分 -->
            <div class="flex items-center gap-2">
              <div class="flex text-amber-400">
                <span v-for="star in 5" :key="star" class="text-lg">
                  {{ star <= product.rating ? "★" : "☆" }}
                </span>
              </div>
              <span class="text-gray-600">({{ product.rating }} 评分)</span>
              <span class="text-gray-400">·</span>
              <span class="text-gray-600">{{ product.reviewCount || 0 }} 条评价</span>
            </div>
          </div>

          <!-- 价格区域 -->
          <div class="mb-6 bg-gray-50 p-4 rounded-lg">
            <div class="flex items-baseline gap-3">
              <p class="text-4xl font-bold text-blue-600">${{ product.price.toFixed(2) }}</p>
              <p v-if="product.originalPrice && product.originalPrice > product.price" class="text-xl text-gray-500 line-through">
                ${{ product.originalPrice.toFixed(2) }}
              </p>
            </div>
            <div class="mt-2 flex gap-3">
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-primary rounded shadow-sm">
                已售 {{ product.soldCount || 0 }}
              </span>
              <span class="text-gray-600">
                库存: <span :class="product.stock > 0 ? 'text-green-600' : 'text-red-600'">{{ product.stock > 0 ? '充足' : '缺货' }}</span>
              </span>
            </div>
          </div>

          <!-- 简要描述 -->
          <div class="mb-8">
            <p class="text-gray-700 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- 购买选项 -->
          <div class="mb-8 space-y-6">
            <!-- 颜色选择 -->
            <div v-if="product.colors && product.colors.length > 0">
              <label class="block text-sm font-medium text-gray-700 mb-2">颜色</label>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="(color, index) in product.colors"
                  :key="index"
                  class="color-option w-10 h-10 rounded-full cursor-pointer border-2 transition-transform hover:scale-110"
                  :style="{ backgroundColor: color, borderColor: selectedColor === color ? '#3b82f6' : 'transparent' }"
                  :class="{ 'ring-2 ring-primary ring-offset-2': selectedColor === color }"
                  :title="color"
                  @click="selectedColor = color"
                ></button>
              </div>
            </div>

            <!-- 数量控制 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">数量</label>
              <div class="flex items-center">
                <button
                  @click="decreaseQuantity"
                  class="quantity-btn w-12 h-12 border border-gray-300 rounded-l-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  :disabled="quantity <= 1 || product.stock === 0"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 || product.stock === 0 }"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                  </svg>
                </button>
                <input
                  type="number"
                  v-model="quantity"
                  min="1"
                  :max="product.stock || 99"
                  class="quantity-input w-16 h-12 border-t border-b border-gray-300 text-center text-lg font-medium focus:outline-none"
                  @input="validateQuantity"
                />
                <button
                  @click="increaseQuantity"
                  class="quantity-btn w-12 h-12 border border-gray-300 rounded-r-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  :disabled="quantity >= (product.stock || 99)"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity >= (product.stock || 99) }"
                >
                  <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              @click="addToCart"
              :disabled="product.stock === 0 || addingToCart"
              class="flex-1 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :class="{ 'opacity-50 cursor-not-allowed': product.stock === 0, 'scale-95': addingToCart }"
            >
              <svg v-if="!addingToCart" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ addingToCart ? '添加中...' : '添加到购物车' }}
            </button>
            <button
              @click="buyNow"
              :disabled="product.stock === 0"
              class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :class="{ 'opacity-50 cursor-not-allowed': product.stock === 0 }"
            >
              立即购买
            </button>
          </div>

          <!-- 分享和收藏 -->
          <div class="mt-8 flex items-center gap-6">
            <button 
              @click="toggleFavorite"
              class="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <svg class="w-6 h-6" :class="{ 'fill-current': isFavorite }" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              {{ isFavorite ? '已收藏' : '收藏' }}
            </button>
            <button class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
              分享
            </button>
          </div>
        </div>
      </div>

      <!-- 产品详情标签页 -->
      <div class="product-details-tabs mb-16">
        <div class="tabs-nav border-b border-gray-200 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="tab-button px-6 py-3 text-base font-medium border-b-2 transition-colors"
            :class="{ 'border-blue-600 text-blue-600': activeTab === tab.id, 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTab !== tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <div class="tab-content">
          <!-- 详情内容 -->
          <div v-if="activeTab === 'details'" class="prose max-w-none">
            <h3 class="text-xl font-bold mb-4">产品详情</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              这是一款高品质的产品，精心设计，工艺精湛，为您提供卓越的使用体验。我们注重每一个细节，确保产品的质量和性能达到最高标准。
            </p>
            <p class="text-gray-700 leading-relaxed mb-4">
              产品采用先进的生产工艺和优质材料制作而成，具有耐用、美观、实用等特点。无论您是日常使用还是专业需求，都能满足您的期望。
            </p>
            
            <!-- 产品规格 -->
            <div class="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 class="font-bold mb-4">产品规格</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">材质</span>
                  <span class="font-medium">{{ product.material || '高品质材料' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">尺寸</span>
                  <span class="font-medium">{{ product.size || '标准尺寸' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">颜色</span>
                  <span class="font-medium">{{ product.colors ? product.colors.join(', ') : '多色可选' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">保修</span>
                  <span class="font-medium">{{ product.warranty || '1年质保' }}</span>
                </div>
              </div>
            </div>
            
            <!-- 详情图片 -->
            <div v-if="product.detailImages && product.detailImages.length > 0" class="space-y-4">
              <img 
                v-for="(img, index) in product.detailImages" 
                :key="index"
                :src="img" 
                :alt="`${product.name} 详情图 ${index + 1}`" 
                class="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </div>
          
          <!-- 评价内容 -->
          <div v-else-if="activeTab === 'reviews'">
            <div class="flex flex-col md:flex-row gap-8">
              <!-- 评价统计 -->
              <div class="md:w-1/4 bg-gray-50 p-6 rounded-lg">
                <div class="text-center">
                  <div class="text-4xl font-bold text-blue-600 mb-2">{{ product.rating }}</div>
                  <div class="flex justify-center text-amber-400 mb-4">
                    <span v-for="star in 5" :key="star" class="text-lg">
                      {{ star <= product.rating ? "★" : "☆" }}
                    </span>
                  </div>
                  <div class="text-gray-600">{{ product.reviewCount || 0 }} 条评价</div>
                </div>
                
                <!-- 评分分布 -->
                <div class="mt-6 space-y-2">
                  <div v-for="rating in [5, 4, 3, 2, 1]" :key="rating" class="flex items-center">
                    <span class="text-sm w-8">{{ rating }}星</span>
                    <div class="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                      <div 
                        class="bg-amber-400 h-2 rounded-full" 
                        :style="{ width: `${(product.rating / 5) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-gray-500">100%</span>
                  </div>
                </div>
              </div>
              
              <!-- 评价列表 -->
              <div class="md:w-3/4">
                <h3 class="text-xl font-bold mb-4">用户评价</h3>
                
                <!-- 评价输入框 -->
                <div class="bg-white p-6 rounded-lg border border-gray-200 mb-6">
                  <h4 class="font-medium mb-3">写评价</h4>
                  <div class="flex mb-3">
                    <button v-for="star in 5" :key="star" class="text-2xl text-gray-300 hover:text-amber-400 transition-colors">
                      ★
                    </button>
                  </div>
                  <textarea 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-24" 
                    placeholder="分享您对这款产品的使用体验..."
                  ></textarea>
                  <button class="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    提交评价
                  </button>
                </div>
                
                <!-- 评价列表 -->
                <div v-if="reviews && reviews.length > 0" class="space-y-4">
                  <div v-for="(review, index) in reviews" :key="index" class="bg-white p-6 rounded-lg border border-gray-200">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-center">
                        <div class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                          <img :src="review.avatar" :alt="review.username" class="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div class="font-medium">{{ review.username }}</div>
                          <div class="text-sm text-gray-500">{{ review.date }}</div>
                        </div>
                      </div>
                      <div class="flex text-amber-400">
                        <span v-for="star in 5" :key="star" class="text-sm">
                          {{ star <= review.rating ? "★" : "☆" }}
                        </span>
                      </div>
                    </div>
                    <p class="text-gray-700">{{ review.content }}</p>
                    <div v-if="review.images && review.images.length > 0" class="mt-3 flex gap-2">
                      <img 
                        v-for="(img, imgIndex) in review.images" 
                        :key="imgIndex"
                        :src="img" 
                        :alt="`评价图片 ${imgIndex + 1}`" 
                        class="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
                
                <!-- 无评价提示 -->
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">暂无评价，来做第一个评价的人吧！</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 服务内容 -->
          <div v-else-if="activeTab === 'services'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold mb-1">正品保障</h4>
                  <p class="text-sm text-gray-600">所有产品均为正品，假一赔十</p>
                </div>
              </div>
              
              <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold mb-1">7天无理由退换</h4>
                  <p class="text-sm text-gray-600">不喜欢随时退换，购物无忧</p>
                </div>
              </div>
              
              <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold mb-1">快速配送</h4>
                  <p class="text-sm text-gray-600">大部分地区48小时内送达</p>
                </div>
              </div>
              
              <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold mb-1">专业客服</h4>
                  <p class="text-sm text-gray-600">工作时间9:00-22:00为您服务</p>
                </div>
              </div>
            </div>
            
            <div class="bg-blue-50 p-6 rounded-lg">
              <h4 class="font-bold mb-3">常见问题</h4>
              <div class="space-y-3">
                <div class="flex items-start gap-2">
                  <span class="text-blue-600 mt-1">•</span>
                  <span class="text-gray-700">产品保修政策是什么？</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-blue-600 mt-1">•</span>
                  <span class="text-gray-700">如何申请退换货？</span>
                </div>
                <div class="flex items-start gap-2">
                  <span class="text-blue-600 mt-1">•</span>
                  <span class="text-gray-700">订单什么时候发货？</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 相关产品 -->
      <div class="related-products-section mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">相关产品</h2>
          <NuxtLink to="/products" class="text-blue-600 hover:text-blue-800 transition-colors">
            查看全部 <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="relatedProduct in relatedProducts" 
            :key="relatedProduct.id" 
            :product="relatedProduct" 
            class="hover:shadow-lg transition-shadow duration-300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import { useRoute } from "vue-router"
import ProductCard from "../../../components/ProductCard.vue"

// 状态管理
const route = useRoute()
const loading = ref(true)
const error = ref("")
const product = ref(null)
const quantity = ref(1)
const selectedImage = ref(null)
const selectedColor = ref(null)
const isFavorite = ref(false)
const addingToCart = ref(false)
const activeTab = ref('details')

// 标签页配置
const tabs = [
  { id: 'details', name: '产品详情' },
  { id: 'reviews', name: '用户评价' },
  { id: 'services', name: '售后服务' }
]

// 模拟产品数据 - 增强版
const products = [
  {
    id: 1,
    name: "时尚运动鞋",
    price: 89.99,
    originalPrice: 119.99,
    discount: 25,
    description:
      "舒适透气的运动鞋，适合日常穿着和轻度运动。采用高品质材料制作，提供出色的支撑和缓冲性能，让您的每一步都轻松自在。",
    image: "https://picsum.photos/id/20/800/800",
    images: [
      "https://picsum.photos/id/20/800/800",
      "https://picsum.photos/id/26/800/800",
      "https://picsum.photos/id/96/800/800"
    ],
    detailImages: [
      "https://picsum.photos/id/20/1200/800",
      "https://picsum.photos/id/26/1200/800"
    ],
    categoryId: 2,
    category: "运动鞋",
    rating: 4.5,
    reviewCount: 128,
    soldCount: 326,
    stock: 150,
    colors: ["#000000", "#FF5733", "#33FF57", "#3357FF"],
    material: "合成纤维 + 橡胶",
    size: "36-45码",
    warranty: "1年质保"
  },
  {
    id: 2,
    name: "智能手表",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    description: "多功能智能手表，支持心率监测和运动追踪。大屏幕显示，操作简单，电池续航持久，是您健康生活的得力助手。",
    image: "https://picsum.photos/id/21/800/800",
    images: [
      "https://picsum.photos/id/21/800/800",
      "https://picsum.photos/id/119/800/800"
    ],
    categoryId: 1,
    category: "智能设备",
    rating: 4.7,
    reviewCount: 89,
    soldCount: 156,
    stock: 80,
    colors: ["#000000", "#FFFFFF"],
    material: "不锈钢表壳 + 硅胶表带",
    size: "42mm/46mm"
  },
  {
    id: 3,
    name: "无线耳机",
    price: 129.99,
    description:
      "高品质无线耳机，提供沉浸式音频体验。主动降噪功能，蓝牙5.0连接，防水设计，让您随时随地享受音乐的魅力。",
    image: "https://picsum.photos/id/22/800/800",
    categoryId: 1,
    category: "音频设备",
    rating: 4.3,
    reviewCount: 203,
    soldCount: 412,
    stock: 200,
    colors: ["#000000", "#FFFFFF", "#00FF00"]
  },
  {
    id: 4,
    name: "便携充电宝",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    description: "大容量便携充电宝，让您的设备永不断电。小巧轻便，支持快充，多口输出，是旅行和日常使用的必备品。",
    image: "https://picsum.photos/id/23/800/800",
    categoryId: 1,
    category: "数码配件",
    rating: 4.1,
    reviewCount: 312,
    soldCount: 890,
    stock: 500,
    colors: ["#000000", "#FF0000", "#0000FF"]
  },
  {
    id: 5,
    name: "棉质T恤",
    price: 29.99,
    description:
      "柔软舒适的棉质T恤，适合日常穿着。采用优质纯棉面料，透气吸汗，印刷精美，不易褪色，是您衣橱的基础单品。",
    image: "https://picsum.photos/id/24/800/800",
    categoryId: 2,
    category: "休闲服饰",
    rating: 4.2,
    reviewCount: 156,
    soldCount: 567,
    stock: 300,
    colors: ["#FFFFFF", "#000000", "#FF0000", "#0000FF", "#FFFF00"]
  },
]

// 模拟评价数据
const reviews = [
  {
    id: 1,
    username: "张先生",
    avatar: "https://picsum.photos/id/1012/100/100",
    rating: 5,
    date: "2023-05-15",
    content: "这款产品非常好用，质量很好，物流也很快，下次还会再来购买！",
    images: ["https://picsum.photos/id/20/200/200"]
  },
  {
    id: 2,
    username: "李女士",
    avatar: "https://picsum.photos/id/1027/100/100",
    rating: 4,
    date: "2023-05-10",
    content: "产品质量不错，就是颜色和图片有一点差异，但总体来说还是很满意的。"
  },
  {
    id: 3,
    username: "王先生",
    avatar: "https://picsum.photos/id/1025/100/100",
    rating: 5,
    date: "2023-05-05",
    content: "服务态度很好，产品也很棒，推荐购买！",
    images: ["https://picsum.photos/id/20/200/200", "https://picsum.photos/id/26/200/200"]
  }
]

// 计算相关产品
const relatedProducts = computed(() => {
  if (!product.value) return []
  return products.filter(p => p.id !== product.value.id && p.categoryId === product.value.categoryId).slice(0, 4)
})

// 生命周期钩子
onMounted(() => {
  fetchProduct()
})

// 获取产品详情
function fetchProduct() {
  const productId = parseInt(route.params.id)

  // 模拟API请求延迟
  setTimeout(() => {
    const foundProduct = products.find(p => p.id === productId)

    if (foundProduct) {
      product.value = foundProduct
      // 设置默认选中第一张图片
      if (foundProduct.images && foundProduct.images.length > 0) {
        selectedImage.value = foundProduct.images[0]
      }
      // 设置默认选中第一个颜色
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        selectedColor.value = foundProduct.colors[0]
      }
      loading.value = false
    } else {
      error.value = "产品不存在"
      loading.value = false
    }
  }, 500)
}

// 增加数量
function increaseQuantity() {
  if (quantity.value < (product.value?.stock || 99)) {
    quantity.value++
  }
}

// 减少数量
function decreaseQuantity() {
  if (quantity.value > 1 && product.value?.stock !== 0) {
    quantity.value--
  }
}

// 验证数量输入
function validateQuantity() {
  const maxStock = product.value?.stock || 99
  if (quantity.value < 1) {
    quantity.value = 1
  } else if (quantity.value > maxStock) {
    quantity.value = maxStock
  }
}

// 添加到购物车
function addToCart() {
  if (!product.value || product.value.stock === 0 || addingToCart.value) return
  
  addingToCart.value = true
  
  // 模拟添加到购物车的延迟
  setTimeout(() => {
    console.log(`添加 ${quantity.value} 个 ${product.value.name} 到购物车`)
    console.log(`颜色: ${selectedColor.value}`)
    alert(`${quantity.value} 个 ${product.value.name} 已添加到购物车`)
    addingToCart.value = false
  }, 800)
}

// 立即购买
function buyNow() {
  if (!product.value || product.value.stock === 0) return
  
  console.log(`立即购买 ${quantity.value} 个 ${product.value.name}`)
  console.log(`颜色: ${selectedColor.value}`)
  alert(`即将前往结算 ${quantity.value} 个 ${product.value.name}`)
  // 这里可以跳转到结算页面
}

// 切换收藏状态
function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  console.log(`${isFavorite.value ? '添加' : '取消'}收藏`)
}
</script>

<style scoped>
.product-detail-page {
  min-height: calc(100vh - 160px);
  padding-bottom: 40px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* 面包屑导航 */
.breadcrumbs {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* 产品图片区域 */
.product-image-section {
  position: relative;
}

.main-image-container {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.main-image-container img {
  transition: transform 0.5s ease;
}

.thumbnails {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #f3f4f6;
}

.thumbnails::-webkit-scrollbar {
  height: 6px;
}

.thumbnails::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.thumbnails::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.thumbnail {
  transition: all 0.2s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

/* 产品信息区域 */
.product-info h1 {
  line-height: 1.2;
}

.quantity-btn {
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.quantity-input {
  font-size: 1.125rem;
}

/* 标签页样式 */
.product-details-tabs {
  border-top: 1px solid #e5e7eb;
  padding-top: 30px;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 30px;
}

.tab-button {
  padding: 12px 24px;
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tab-button.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

/* 评价区域样式 */
.review-item {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.review-item:last-child {
  border-bottom: none;
}

/* 相关产品区域 */
.related-products-section {
  padding-top: 30px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-info h1 {
    font-size: 1.75rem;
  }
  
  .tabs-nav {
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .tab-button {
    padding: 10px 16px;
    font-size: 0.875rem;
  }
  
  .main-image-container {
    min-height: 300px;
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .main-image-container img {
    animation: none;
    transition: none;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .product-image-section .main-image-container {
    border: 2px solid #000;
  }
  
  .tab-button {
    border-bottom-width: 3px;
  }
}
</style>
