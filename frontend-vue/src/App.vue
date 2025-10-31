<template>
  <div class="app">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <router-link to="/" class="logo">
            Cross Shop
          </router-link>
        </div>
        
        <nav class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/products" class="nav-link">Products</router-link>
          <router-link to="/cart" class="nav-link cart-link">
            <span class="cart-icon">🛒</span>
            <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
          </router-link>
        </nav>
        
        <div class="user-actions">
          <template v-if="isAuthenticated">
            <router-link to="/profile" class="user-link">
              {{ user.name || 'My Account' }}
            </router-link>
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link">Login</router-link>
            <router-link to="/register" class="auth-link signup-btn">Sign Up</router-link>
          </template>
        </div>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Cross Shop</h3>
            <p>Your trusted destination for quality products at great prices. Shop with confidence.</p>
          </div>
          
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><router-link to="/">Home</router-link></li>
              <li><router-link to="/products">Products</router-link></li>
              <li><router-link to="/terms">Terms of Service</router-link></li>
              <li><router-link to="/privacy">Privacy Policy</router-link></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@crossshop.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          
          <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">Instagram</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} Cross Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user'
import { useCartStore } from './stores/cart'
import { ElMessage } from 'element-plus'

export default {
  name: 'App',
  setup() {
    const userStore = useUserStore()
    const cartStore = useCartStore()
    const router = useRouter()
    
    // 初始化用户和购物车数据
    onMounted(async () => {
      // 检查用户是否已登录
      await userStore.checkAuth()
      // 加载购物车数据
      await cartStore.fetchCart()
    })
    
    // 计算属性
    const isAuthenticated = computed(() => userStore.isAuthenticated)
    const user = computed(() => userStore.user)
    const cartItemsCount = computed(() => cartStore.cartItemsCount)
    const currentYear = computed(() => new Date().getFullYear())
    
    // 登出函数
    const logout = async () => {
      try {
        await userStore.logout()
        ElMessage.success('Logged out successfully')
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
        ElMessage.error('Failed to logout')
      }
    }
    
    return {
      isAuthenticated,
      user,
      cartItemsCount,
      currentYear,
      logout
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #333;
  line-height: 1.6;
  background-color: #f8f9fa;
}

/* 容器样式 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 导航栏样式 */
.navbar {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.navbar-brand .logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #667eea;
}

.cart-link {
  position: relative;
  font-size: 1.2rem;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -12px;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  min-width: 20px;
  text-align: center;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-link {
  color: #333;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.auth-link:hover {
  color: #667eea;
}

.signup-btn {
  background-color: #667eea;
  color: white;
}

.signup-btn:hover {
  background-color: #5a67d8;
  color: white;
}

.user-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: 1px solid #e0e0e0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #f8f9fa;
}

/* 主内容样式 */
.main-content {
  min-height: calc(100vh - 180px);
}

/* 页脚样式 */
.footer {
  background-color: #333;
  color: white;
  padding: 2rem 0;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.footer-section ul {
  list-style: none;
}

.footer-section li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #ddd;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: white;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-bottom {
  border-top: 1px solid #555;
  padding-top: 1rem;
  text-align: center;
  color: #aaa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
</style>
