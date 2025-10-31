import { defineStore } from 'pinia'
import axios from 'axios'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  getters: {
    totalItems: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalAmount: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0),
    cartItems: (state) => state.items
  },

  actions: {
    async fetchCart() {
      this.loading = true
      try {
        const response = await axios.get('/api/cart')
        this.items = response.data.items || []
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch cart:', error)
        // 尝试从localStorage获取购物车数据（未登录状态）
        this.loadItemsFromLocalStorage()
      } finally {
        this.loading = false
      }
    },

    async addToCart(productId, quantity = 1) {
      this.loading = true
      try {
        const response = await axios.post('/api/cart', { productId, quantity })
        this.items = response.data.items
        this.saveItemsToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message
        // 未登录状态下，使用localStorage存储
        this.addToLocalCart(productId, quantity)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateCartItem(itemId, quantity) {
      this.loading = true
      try {
        const response = await axios.put(`/api/cart/${itemId}`, { quantity })
        this.items = response.data.items
        this.saveItemsToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message
        this.updateLocalCartItem(itemId, quantity)
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeFromCart(itemId) {
      this.loading = true
      try {
        const response = await axios.delete(`/api/cart/${itemId}`)
        this.items = response.data.items
        this.saveItemsToLocalStorage()
        return response.data
      } catch (error) {
        this.error = error.message
        this.removeLocalCartItem(itemId)
        throw error
      } finally {
        this.loading = false
      }
    },

    // 本地存储相关方法（未登录状态）
    saveItemsToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    },

    loadItemsFromLocalStorage() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
    },

    addToLocalCart(productId, quantity) {
      const existingItem = this.items.find(item => item.productId === productId)
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        // 这里简化处理，实际应该先获取产品信息
        this.items.push({
          id: Date.now().toString(),
          productId,
          quantity,
          price: 0 // 临时价格，实际应该从API获取
        })
      }
      this.saveItemsToLocalStorage()
    },

    updateLocalCartItem(itemId, quantity) {
      const item = this.items.find(i => i.id === itemId || i.productId === itemId)
      if (item) {
        item.quantity = quantity
        this.saveItemsToLocalStorage()
      }
    },

    removeLocalCartItem(itemId) {
      this.items = this.items.filter(i => i.id !== itemId && i.productId !== itemId)
      this.saveItemsToLocalStorage()
    },

    clearCart() {
      this.items = []
      localStorage.removeItem('cart')
    }
  }
})