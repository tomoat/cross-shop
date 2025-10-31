<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>My Profile</h1>
      <p>Manage your personal information and account settings</p>
    </div>

    <div class="profile-content">
      <div class="profile-sidebar">
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ userInitials }}
          </div>
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
        
        <nav class="profile-nav">
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            <span class="nav-icon">👤</span>
            <span class="nav-text">Personal Info</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'orders' }"
            @click="activeTab = 'orders'"
          >
            <span class="nav-icon">📦</span>
            <span class="nav-text">My Orders</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'addresses' }"
            @click="activeTab = 'addresses'"
          >
            <span class="nav-icon">📍</span>
            <span class="nav-text">Addresses</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'password' }"
            @click="activeTab = 'password'"
          >
            <span class="nav-icon">🔒</span>
            <span class="nav-text">Password</span>
          </div>
          <div 
            class="nav-item" 
            :class="{ active: activeTab === 'notifications' }"
            @click="activeTab = 'notifications'"
          >
            <span class="nav-icon">🔔</span>
            <span class="nav-text">Notifications</span>
          </div>
        </nav>
      </div>

      <div class="profile-main">
        <!-- Personal Info Tab -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <h2>Personal Information</h2>
          <form @submit.prevent="updatePersonalInfo">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="personalInfo.firstName" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="personalInfo.lastName" 
                  required
                >
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                v-model="personalInfo.email" 
                required
              >
              <small class="form-text">You can't change your email address</small>
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="personalInfo.phone" 
              >
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Updating...' : 'Update Information' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="cancelEdit">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- My Orders Tab -->
        <div v-else-if="activeTab === 'orders'" class="tab-content">
          <div class="tab-header">
            <h2>My Orders</h2>
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Search orders..." 
                v-model="orderSearch"
              >
            </div>
          </div>
          
          <div v-if="loading" class="loading">Loading orders...</div>
          <div v-else-if="orders?.length === 0" class="empty-state">
            <p>You haven't placed any orders yet.</p>
            <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
          </div>
          <div v-else class="orders-list">
            <div 
              v-for="order in filteredOrders" 
              :key="order.id" 
              class="order-card"
              @click="viewOrder(order.id)"
            >
              <div class="order-header">
                <span class="order-id">Order #{{ order.id }}</span>
                <span class="order-date">{{ formatDate(order.date) }}</span>
              </div>
              <div class="order-items">
                <div 
                  v-for="(item, index) in order.items.slice(0, 3)" 
                  :key="index" 
                  class="order-item"
                >
                  <div class="item-image">
                    <img :src="item.image" alt="Item image">
                  </div>
                  <div class="item-info">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-quantity">x{{ item.quantity }}</div>
                  </div>
                </div>
                <div v-if="order.items.length > 3" class="more-items">
                  + {{ order.items.length - 3 }} more items
                </div>
              </div>
              <div class="order-footer">
                <div class="order-total">Total: ${{ order.total.toFixed(2) }}</div>
                <div class="order-status" :class="`status-${order.status}`">
                  {{ capitalize(order.status) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Addresses Tab -->
        <div v-else-if="activeTab === 'addresses'" class="tab-content">
          <div class="tab-header">
            <h2>My Addresses</h2>
            <button class="btn btn-primary" @click="showAddAddressForm = true">
              Add New Address
            </button>
          </div>
          
          <div v-if="loading" class="loading">Loading addresses...</div>
          <div v-else-if="addresses?.length === 0" class="empty-state">
            <p>You don't have any saved addresses.</p>
            <button class="btn btn-primary" @click="showAddAddressForm = true">
              Add New Address
            </button>
          </div>
          <div v-else class="addresses-list">
            <div 
              v-for="address in addresses" 
              :key="address.id" 
              class="address-card"
            >
              <div class="address-content">
                <div class="address-header">
                  <h3>{{ address.name }}</h3>
                  <div class="address-tags">
                    <span v-if="address.isDefault" class="tag default">Default</span>
                  </div>
                </div>
                <p>{{ address.street }}</p>
                <p>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                <p>{{ address.country }}</p>
                <p>{{ address.phone }}</p>
              </div>
              <div class="address-actions">
                <button class="btn btn-secondary" @click="editAddress(address)">
                  Edit
                </button>
                <button 
                  class="btn btn-danger" 
                  @click="confirmDeleteAddress(address.id)"
                  :disabled="address.isDefault"
                >
                  Delete
                </button>
                <button 
                  class="btn btn-outline" 
                  v-if="!address.isDefault"
                  @click="setDefaultAddress(address.id)"
                >
                  Set as Default
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Tab -->
        <div v-else-if="activeTab === 'password'" class="tab-content">
          <h2>Change Password</h2>
          <form @submit.prevent="changePassword">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                required
              >
            </div>
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                required
              >
              <small class="form-text">Password must be at least 8 characters long</small>
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                required
              >
            </div>
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="loading || !isPasswordValid"
              >
                {{ loading ? 'Changing...' : 'Change Password' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="resetPasswordForm">
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Notifications Tab -->
        <div v-else-if="activeTab === 'notifications'" class="tab-content">
          <h2>Notification Settings</h2>
          <form @submit.prevent="updateNotificationSettings">
            <div class="notification-group">
              <h3>Email Notifications</h3>
              <div class="notification-item">
                <input 
                  type="checkbox" 
                  id="orderUpdates" 
                  v-model="notificationSettings.orderUpdates"
                >
                <label for="orderUpdates">Order updates and confirmations</label>
              </div>
              <div class="notification-item">
                <input 
                  type="checkbox" 
                  id="promotionalEmails" 
                  v-model="notificationSettings.promotionalEmails"
                >
                <label for="promotionalEmails">Promotional emails and offers</label>
              </div>
              <div class="notification-item">
                <input 
                  type="checkbox" 
                  id="newsletter" 
                  v-model="notificationSettings.newsletter"
                >
                <label for="newsletter">Newsletter</label>
              </div>
            </div>
            
            <div class="notification-group">
              <h3>Push Notifications</h3>
              <div class="notification-item">
                <input 
                  type="checkbox" 
                  id="mobileAlerts" 
                  v-model="notificationSettings.mobileAlerts"
                >
                <label for="mobileAlerts">Mobile alerts for order status changes</label>
              </div>
              <div class="notification-item">
                <input 
                  type="checkbox" 
                  id="stockAlerts" 
                  v-model="notificationSettings.stockAlerts"
                >
                <label for="stockAlerts">Stock alerts for products in your wishlist</label>
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="loading"
              >
                {{ loading ? 'Saving...' : 'Save Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <div v-if="showAddAddressForm || isEditingAddress" class="modal-overlay" @click.self="closeAddressModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ isEditingAddress ? 'Edit Address' : 'Add New Address' }}</h2>
          <button class="modal-close" @click="closeAddressModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveAddress">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="addressForm.name" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="addressForm.phone" 
                  required
                >
              </div>
            </div>
            <div class="form-group">
              <label for="street">Street Address</label>
              <input 
                type="text" 
                id="street" 
                v-model="addressForm.street" 
                required
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="addressForm.city" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="state">State/Province</label>
                <input 
                  type="text" 
                  id="state" 
                  v-model="addressForm.state" 
                  required
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="zipCode">ZIP Code</label>
                <input 
                  type="text" 
                  id="zipCode" 
                  v-model="addressForm.zipCode" 
                  required
                >
              </div>
              <div class="form-group">
                <label for="country">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  v-model="addressForm.country" 
                  required
                >
              </div>
            </div>
            <div class="form-group checkbox">
              <input 
                type="checkbox" 
                id="defaultAddress" 
                v-model="addressForm.isDefault"
              >
              <label for="defaultAddress">Set as default address</label>
            </div>
            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary" 
                :disabled="loading"
              >
                {{ loading ? 'Saving...' : 'Save Address' }}
              </button>
              <button 
                type="button" 
                class="btn btn-secondary" 
                @click="closeAddressModal"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    
    // 状态管理
    const activeTab = ref('info')
    const loading = ref(false)
    
    // 用户个人信息
    const personalInfo = ref({
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    })
    
    // 密码修改表单
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 地址管理
    const addresses = ref([])
    const showAddAddressForm = ref(false)
    const isEditingAddress = ref(false)
    const editingAddressId = ref(null)
    const addressForm = ref({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: '',
      isDefault: false
    })
    
    // 订单管理
    const orders = ref([])
    const orderSearch = ref('')
    
    // 通知设置
    const notificationSettings = ref({
      orderUpdates: true,
      promotionalEmails: false,
      newsletter: false,
      mobileAlerts: true,
      stockAlerts: false
    })
    
    // 计算属性
    const user = computed(() => userStore.user)
    const userInitials = computed(() => {
      if (!user.value) return '?'
      const name = user.value.name ?? user.value.email.split('@')[0]
      return name.split(' ').map(part => part[0]).join('').toUpperCase()
    })
    
    // 密码验证
    const isPasswordValid = computed(() => {
      return passwordForm.value.newPassword.length >= 8 && 
             passwordForm.value.newPassword === passwordForm.value.confirmPassword
    })
    
    // 过滤订单
    const filteredOrders = computed(() => {
      if (!orderSearch.value) return orders.value
      const searchTerm = orderSearch.value.toLowerCase()
      return orders.value.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm))
      )
    })
    
    // 加载用户数据
    const loadUserData = async () => {
      if (!userStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      try {
        // 在实际应用中，这里应该调用API获取用户详细信息
        // 模拟用户数据
        personalInfo.value = {
          firstName: 'John',
          lastName: 'Doe',
          email: user.value.email,
          phone: '123-456-7890'
        }
        
        // 加载地址
        await loadAddresses()
        
        // 加载订单
        await loadOrders()
      } catch (error) {
        console.error('Failed to load user data:', error)
        ElMessage.error('Failed to load your profile data')
      }
    }
    
    // 加载地址
    const loadAddresses = async () => {
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API获取用户地址
        addresses.value = [
          {
            id: 1,
            name: 'John Doe',
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States',
            phone: '123-456-7890',
            isDefault: true
          },
          {
            id: 2,
            name: 'John Doe',
            street: '456 Market Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90001',
            country: 'United States',
            phone: '123-456-7890',
            isDefault: false
          }
        ]
      } catch (error) {
        console.error('Failed to load addresses:', error)
        ElMessage.error('Failed to load your addresses')
      }
    }
    
    // 加载订单
    const loadOrders = async () => {
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API获取用户订单
        orders.value = [
          {
            id: 'ORD-2023-0001',
            date: '2023-11-10',
            items: [
              { name: 'Smartphone X', quantity: 1, image: '/product1.jpg', price: 799.99 },
              { name: 'Phone Case', quantity: 2, image: '/product2.jpg', price: 19.99 }
            ],
            total: 839.97,
            status: 'delivered'
          },
          {
            id: 'ORD-2023-0002',
            date: '2023-10-15',
            items: [
              { name: 'Laptop Pro', quantity: 1, image: '/product3.jpg', price: 1299.99 }
            ],
            total: 1299.99,
            status: 'shipped'
          },
          {
            id: 'ORD-2023-0003',
            date: '2023-09-22',
            items: [
              { name: 'Wireless Headphones', quantity: 1, image: '/product4.jpg', price: 249.99 },
              { name: 'Charging Dock', quantity: 1, image: '/product5.jpg', price: 79.99 },
              { name: 'Screen Protector', quantity: 3, image: '/product6.jpg', price: 15.99 },
              { name: 'Bluetooth Speaker', quantity: 1, image: '/product7.jpg', price: 129.99 }
            ],
            total: 497.94,
            status: 'processing'
          }
        ]
      } catch (error) {
        console.error('Failed to load orders:', error)
        ElMessage.error('Failed to load your orders')
      }
    }
    
    // 更新个人信息
    const updatePersonalInfo = async () => {
      loading.value = true
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API更新用户信息
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        ElMessage.success('Your information has been updated')
      } catch (error) {
        console.error('Failed to update personal info:', error)
        ElMessage.error('Failed to update your information')
      } finally {
        loading.value = false
      }
    }
    
    // 更改密码
    const changePassword = async () => {
      if (!isPasswordValid.value) {
        ElMessage.warning('Please check your password requirements')
        return
      }
      
      loading.value = true
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API更改密码
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        ElMessage.success('Your password has been changed')
        resetPasswordForm()
      } catch (error) {
        console.error('Failed to change password:', error)
        ElMessage.error('Failed to change your password')
      } finally {
        loading.value = false
      }
    }
    
    // 重置密码表单
    const resetPasswordForm = () => {
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
    
    // 取消编辑
    const cancelEdit = () => {
      // 重新加载原始数据
      loadUserData()
    }
    
    // 编辑地址
    const editAddress = (address) => {
      isEditingAddress.value = true
      editingAddressId.value = address.id
      addressForm.value = { ...address }
    }
    
    // 保存地址
    const saveAddress = async () => {
      loading.value = true
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API保存地址
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        
        if (isEditingAddress.value) {
          // 更新现有地址
          const index = addresses.value.findIndex(addr => addr.id === editingAddressId.value)
          if (index !== -1) {
            addresses.value[index] = { ...addressForm.value, id: editingAddressId.value }
          }
        } else {
          // 添加新地址
          const newId = Math.max(...addresses.value.map(addr => addr.id), 0) + 1
          addresses.value.push({ ...addressForm.value, id: newId })
        }
        
        ElMessage.success(isEditingAddress.value ? 'Address updated' : 'Address added')
        closeAddressModal()
      } catch (error) {
        console.error('Failed to save address:', error)
        ElMessage.error('Failed to save address')
      } finally {
        loading.value = false
      }
    }
    
    // 关闭地址模态框
    const closeAddressModal = () => {
      showAddAddressForm.value = false
      isEditingAddress.value = false
      editingAddressId.value = null
      addressForm.value = {
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        isDefault: false
      }
    }
    
    // 设置默认地址
    const setDefaultAddress = async (addressId) => {
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API设置默认地址
        addresses.value.forEach(addr => {
          addr.isDefault = addr.id === addressId
        })
        ElMessage.success('Default address updated')
      } catch (error) {
        console.error('Failed to set default address:', error)
        ElMessage.error('Failed to update default address')
      }
    }
    
    // 确认删除地址
    const confirmDeleteAddress = async (addressId) => {
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API删除地址
        addresses.value = addresses.value.filter(addr => addr.id !== addressId)
        ElMessage.success('Address deleted')
      } catch (error) {
        console.error('Failed to delete address:', error)
        ElMessage.error('Failed to delete address')
      }
    }
    
    // 更新通知设置
    const updateNotificationSettings = async () => {
      loading.value = true
      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API更新通知设置
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        ElMessage.success('Your notification settings have been updated')
      } catch (error) {
        console.error('Failed to update notification settings:', error)
        ElMessage.error('Failed to update your notification settings')
      } finally {
        loading.value = false
      }
    }
    
    // 查看订单详情
    const viewOrder = (orderId) => {
      router.push(`/order/${orderId}`)
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('en-US', options)
    }
    
    // 首字母大写
    const capitalize = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
    
    // 组件挂载时加载用户数据
    onMounted(() => {
      loadUserData()
    })
    
    return {
      activeTab,
      loading,
      user,
      userInitials,
      personalInfo,
      passwordForm,
      isPasswordValid,
      addresses,
      showAddAddressForm,
      isEditingAddress,
      addressForm,
      orders,
      orderSearch,
      filteredOrders,
      notificationSettings,
      updatePersonalInfo,
      cancelEdit,
      changePassword,
      resetPasswordForm,
      editAddress,
      saveAddress,
      closeAddressModal,
      setDefaultAddress,
      confirmDeleteAddress,
      updateNotificationSettings,
      viewOrder,
      formatDate,
      capitalize
    }
  }
}
</script>

<style scoped>
.profile-container {
  padding: 2rem 0;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.profile-header h1 {
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.profile-header p {
  color: var(--text-secondary);
}

.profile-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.profile-sidebar {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-avatar {
  text-align: center;
  padding: 2rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

.profile-nav {
  padding: 1rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.nav-item.active {
  background-color: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
  font-weight: 500;
}

.nav-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.profile-main {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 600px;
}

.tab-content {
  padding: 2rem;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  width: auto;
  margin-right: 0.5rem;
}

.form-group.checkbox label {
  margin-bottom: 0;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-light);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: var(--text-primary);
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.empty-state .btn {
  margin-top: 1rem;
}

/* Orders */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
}

.order-id {
  font-weight: 500;
}

.order-date {
  color: var(--text-light);
  font-size: 0.875rem;
}

.order-items {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.item-image {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 4px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.item-quantity {
  color: var(--text-light);
  font-size: 0.75rem;
}

.more-items {
  display: flex;
  align-items: center;
  color: var(--text-light);
  font-size: 0.875rem;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.order-total {
  font-weight: 500;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-processing {
  background-color: rgba(245, 158, 11, 0.1);
  color: var(--warning-color);
}

.status-shipped {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-delivered {
  background-color: rgba(52, 211, 153, 0.1);
  color: #10b981;
}

.status-cancelled {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.search-bar input {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 300px;
  font-size: 0.875rem;
}

/* Addresses */
.addresses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.address-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.address-header h3 {
  margin-bottom: 0;
}

.tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.tag.default {
  background-color: rgba(102, 126, 234, 0.1);
  color: var(--primary-color);
}

.address-content p {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.address-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.address-actions .btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Notification Settings */
.notification-group {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.notification-group h3 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.notification-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.notification-item input {
  width: auto;
  margin-right: 0.75rem;
}

.notification-item label {
  margin-bottom: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin-bottom: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .tab-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-bar input {
    width: 100%;
  }
  
  .addresses-list {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>