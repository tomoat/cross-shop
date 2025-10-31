<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <h1>Login</h1>
        <p>Welcome back! Please enter your credentials to continue.</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- 邮箱 -->
        <div class="form-group">
          <label for="email">Email Address</label>
          <input 
            type="email" 
            id="email"
            v-model="form.email"
            placeholder="Enter your email"
            required
            class="form-input"
          />
        </div>
        
        <!-- 密码 -->
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password"
            v-model="form.password"
            placeholder="Enter your password"
            required
            class="form-input"
          />
        </div>
        
        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.rememberMe" />
            Remember me
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot password?
          </router-link>
        </div>
        
        <!-- 登录按钮 -->
        <button 
          type="submit" 
          class="btn-primary login-btn"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <!-- 错误消息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <!-- 注册链接 -->
      <div class="register-link">
        <p>Don't have an account? <router-link to="/register">Register here</router-link></p>
      </div>
      
      <!-- 社交媒体登录 -->
      <div class="social-login">
        <div class="divider">
          <span>Or login with</span>
        </div>
        <div class="social-buttons">
          <button class="social-btn google-btn" @click="socialLogin('google')">
            <span class="social-icon">G</span>
            Google
          </button>
          <button class="social-btn facebook-btn" @click="socialLogin('facebook')">
            <span class="social-icon">f</span>
            Facebook
          </button>
          <button class="social-btn apple-btn" @click="socialLogin('apple')">
            <span class="social-icon">A</span>
            Apple
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const error = ref('')
    
    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })
    
    const handleLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const userData = await userStore.login(form.email, form.password, form.rememberMe)
        
        if (userData) {
          ElMessage.success('Login successful!')
          
          // 检查是否有重定向路径
          const redirectPath = localStorage.getItem('redirectAfterLogin')
          if (redirectPath) {
            localStorage.removeItem('redirectAfterLogin')
            router.push(redirectPath)
          } else {
            // 默认重定向到首页
            router.push('/')
          }
        }
      } catch (err) {
        error.value = err.message ?? 'Failed to login. Please check your credentials.'
        ElMessage.error(error.value)
      } finally {
        loading.value = false
      }
    }
    
    const socialLogin = (provider) => {
      // 这里是模拟社交媒体登录
      ElMessage.info(`Redirecting to ${provider} login...`)
      // 实际应用中，这里会重定向到相应的OAuth提供商
    }
    
    return {
      form,
      loading,
      error,
      handleLogin,
      socialLogin
    }
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.login-header p {
  margin: 0;
  color: #666;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #333;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  font-size: 1.1rem;
}

.error-message {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.8rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-bottom: 2rem;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}

.social-login {
  text-align: center;
}

.divider {
  position: relative;
  margin-bottom: 1.5rem;
}

.divider span {
  background-color: white;
  padding: 0 1rem;
  color: #666;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e0e0e0;
  z-index: 0;
}

.social-buttons {
  display: flex;
  gap: 1rem;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background-color: #f8f9fa;
}

.social-icon {
  font-weight: bold;
  font-size: 1.2rem;
}

.google-btn .social-icon {
  color: #db4437;
}

.facebook-btn .social-icon {
  color: #4267b2;
}

.apple-btn .social-icon {
  color: #000;
}

/* Buttons */
.btn-primary {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background-color: #5a67d8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 480px) {
  .social-buttons {
    flex-direction: column;
  }
}
</style>