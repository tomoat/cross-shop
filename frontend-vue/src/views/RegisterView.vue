<template>
  <div class="register-view">
    <div class="register-container">
      <div class="register-header">
        <h1>Create Account</h1>
        <p>Join us and enjoy shopping with Cross Shop</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="register-form">
        <!-- 姓名 -->
        <div class="form-group">
          <label for="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            v-model="form.name"
            placeholder="Enter your full name"
            required
            class="form-input"
          />
        </div>
        
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
            placeholder="Create a password"
            required
            class="form-input"
          />
          <div v-if="form.password" class="password-strength">
            <div class="strength-indicator" :class="passwordStrength"></div>
            <span class="strength-text">{{ getStrengthText() }}</span>
          </div>
        </div>
        
        <!-- 确认密码 -->
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword"
            v-model="form.confirmPassword"
            placeholder="Confirm your password"
            required
            class="form-input"
          />
          <div v-if="form.confirmPassword && form.password !== form.confirmPassword" class="password-match-error">
            Passwords do not match
          </div>
        </div>
        
        <!-- 条款同意 -->
        <div class="form-group terms">
          <label class="terms-label">
            <input type="checkbox" v-model="form.acceptTerms" required />
            <span>I agree to the <router-link to="/terms">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link></span>
          </label>
        </div>
        
        <!-- 注册按钮 -->
        <button 
          type="submit" 
          class="btn-primary register-btn"
          :disabled="loading || !isFormValid"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
        
        <!-- 错误消息 -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>
      
      <!-- 登录链接 -->
      <div class="login-link">
        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
      </div>
      
      <!-- 社交媒体注册 -->
      <div class="social-register">
        <div class="divider">
          <span>Or sign up with</span>
        </div>
        <div class="social-buttons">
          <button class="social-btn google-btn" @click="socialRegister('google')">
            <span class="social-icon">G</span>
            Google
          </button>
          <button class="social-btn facebook-btn" @click="socialRegister('facebook')">
            <span class="social-icon">f</span>
            Facebook
          </button>
          <button class="social-btn apple-btn" @click="socialRegister('apple')">
            <span class="social-icon">A</span>
            Apple
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

export default {
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const error = ref('')
    
    const form = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })
    
    // 密码强度
    const passwordStrength = ref('weak')
    
    watch(() => form.password, (newPassword) => {
      if (newPassword) {
        updatePasswordStrength(newPassword)
      }
    })
    
    const updatePasswordStrength = (password) => {
      let strength = 0
      
      // 长度检查
      if (password.length >= 8) strength++
      if (password.length >= 12) strength++
      
      // 复杂度检查
      if (/[A-Z]/.test(password)) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      
      if (strength <= 2) {
        passwordStrength.value = 'weak'
      } else if (strength <= 4) {
        passwordStrength.value = 'medium'
      } else {
        passwordStrength.value = 'strong'
      }
    }
    
    const getStrengthText = () => {
      const texts = {
        weak: 'Weak password',
        medium: 'Medium strength',
        strong: 'Strong password'
      }
      return texts[passwordStrength.value]
    }
    
    // 表单验证
    const isFormValid = computed(() => {
      return form.name.trim() &&
      form.email.trim() &&
      form.password &&
      form.confirmPassword &&
      form.password === form.confirmPassword && 
             form.acceptTerms
    })
    
    const handleRegister = async () => {
      if (!isFormValid.value) {
        ElMessage.warning('Please fill all required fields correctly')
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        const userData = await userStore.register({
          name: form.name,
          email: form.email,
          password: form.password
        })
        
        if (userData) {
          ElMessage.success('Account created successfully!')
          // 注册成功后自动登录
          await userStore.login(form.email, form.password)
          // 重定向到首页
          router.push('/')
        }
      } catch (err) {
        error.value = err.message ?? 'Failed to create account. Please try again.'
        ElMessage.error(error.value)
      } finally {
        loading.value = false
      }
    }
    
    const socialRegister = (provider) => {
      // 这里是模拟社交媒体注册
      ElMessage.info(`Redirecting to ${provider} registration...`)
      // 实际应用中，这里会重定向到相应的OAuth提供商
    }
    
    return {
      form,
      loading,
      error,
      passwordStrength,
      isFormValid,
      getStrengthText,
      handleRegister,
      socialRegister
    }
  }
}
</script>

<style scoped>
.register-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.register-container {
  width: 100%;
  max-width: 450px;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #333;
}

.register-header p {
  margin: 0;
  color: #666;
}

.register-form {
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

/* Password Strength */
.password-strength {
  margin-top: 0.5rem;
}

.strength-indicator {
  height: 4px;
  border-radius: 2px;
  margin-bottom: 0.3rem;
  transition: all 0.3s ease;
}

.strength-indicator.weak {
  background-color: #ef4444;
  width: 33%;
}

.strength-indicator.medium {
  background-color: #f59e0b;
  width: 66%;
}

.strength-indicator.strong {
  background-color: #10b981;
  width: 100%;
}

.strength-text {
  font-size: 0.8rem;
  color: #666;
}

.password-match-error {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

/* Terms */
.form-group.terms {
  margin-bottom: 2rem;
}

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  color: #333;
  font-size: 0.9rem;
}

.terms-label input {
  margin-top: 0.3rem;
}

.terms-label a {
  color: #667eea;
  text-decoration: none;
}

.terms-label a:hover {
  text-decoration: underline;
}

.register-btn {
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

.login-link {
  text-align: center;
  margin-bottom: 2rem;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.social-register {
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