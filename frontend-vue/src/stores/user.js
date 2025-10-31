import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userInfo: (state) => state.user
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/users/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post('/api/users/register', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async fetchUserProfile() {
      if (!this.token) return
      
      this.loading = true
      try {
        const response = await axios.get('/api/users/profile')
        this.user = response.data
      } catch (error) {
        this.logout() // Token可能已过期，清除用户状态
        throw error
      } finally {
        this.loading = false
      }
    },

    // 检查用户认证状态
    async checkAuth() {
      // 如果有token，尝试获取用户信息以验证token有效性
      if (this.token) {
        try {
          // 设置axios请求头
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          // 尝试获取用户信息
          await this.fetchUserProfile()
          return true
        } catch (error) {
          // Token无效或已过期，清除用户状态
          this.logout()
          return false
        }
      }
      return false
    }
  }
})