<template>
  <div class="checkout-container">
    <div class="checkout-header">
      <h1>Checkout</h1>
      <div class="checkout-steps">
        <div class="step active">
          <span class="step-number">1</span>
          <span class="step-text">Shipping</span>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <span class="step-text">Payment</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span class="step-text">Confirm</span>
        </div>
      </div>
    </div>

    <div class="checkout-content">
      <!-- 送货地址 -->
      <div class="checkout-section">
        <h2>Shipping Address</h2>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else-if="addresses?.length === 0">
          <p>You don't have any saved addresses. Please add one below.</p>
          <button @click="showAddAddressForm = true" class="btn btn-primary">Add Address</button>
        </div>
        <div v-else class="addresses">
          <div
            v-for="address in addresses"
            :key="address.id"
            class="address-card"
            :class="{ selected: selectedAddressId === address.id }"
            @click="selectAddress(address.id)"
          >
            <div class="address-content">
              <h3>{{ address.name }}</h3>
              <p>{{ address.street }}</p>
              <p>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
              <p>{{ address.country }}</p>
              <p>{{ address.phone }}</p>
            </div>
            <div class="address-actions">
              <input
                type="radio"
                name="address"
                :checked="selectedAddressId === address.id"
                @change="selectAddress(address.id)"
              />
            </div>
          </div>
          <button @click="showAddAddressForm = true" class="btn btn-secondary">Add New Address</button>
        </div>
      </div>

      <!-- 添加地址表单 -->
      <div v-if="showAddAddressForm" class="checkout-section">
        <h2>Add New Address</h2>
        <form @submit.prevent="addAddress">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="newAddress.name" required />
          </div>
          <div class="form-group">
            <label for="street">Street Address</label>
            <input type="text" id="street" v-model="newAddress.street" required />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="newAddress.city" required />
          </div>
          <div class="form-group">
            <label for="state">State/Province</label>
            <input type="text" id="state" v-model="newAddress.state" required />
          </div>
          <div class="form-group">
            <label for="zipCode">ZIP Code</label>
            <input type="text" id="zipCode" v-model="newAddress.zipCode" required />
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="newAddress.country" required />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" v-model="newAddress.phone" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Save Address</button>
            <button type="button" @click="showAddAddressForm = false" class="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>

      <!-- 支付方式 -->
      <div class="checkout-section">
        <h2>Payment Method</h2>
        <div class="payment-methods">
          <div class="payment-method">
            <input type="radio" id="creditCard" name="payment" v-model="paymentMethod" value="creditCard" checked />
            <label for="creditCard">Credit Card</label>
          </div>
          <div class="payment-method">
            <input type="radio" id="paypal" name="payment" v-model="paymentMethod" value="paypal" />
            <label for="paypal">PayPal</label>
          </div>
          <div class="payment-method">
            <input type="radio" id="bankTransfer" name="payment" v-model="paymentMethod" value="bankTransfer" />
            <label for="bankTransfer">Bank Transfer</label>
          </div>
        </div>
      </div>

      <!-- 订单摘要 -->
      <div class="checkout-summary">
        <h2>Order Summary</h2>
        <div class="summary-content">
          <div class="summary-item" v-for="item in cartItems" :key="item.id">
            <div class="summary-item-info">
              <span class="summary-item-name">{{ item.name }}</span>
              <span class="summary-item-quantity">x{{ item.quantity }}</span>
            </div>
            <div class="summary-item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <div class="summary-item-label">Subtotal</div>
            <div class="summary-item-value">${{ subtotal.toFixed(2) }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-item-label">Shipping</div>
            <div class="summary-item-value">${{ shipping.toFixed(2) }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-item-label">Tax</div>
            <div class="summary-item-value">${{ tax.toFixed(2) }}</div>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <div class="summary-item-label">Total</div>
            <div class="summary-item-value">${{ total.toFixed(2) }}</div>
          </div>
        </div>
        <button @click="placeOrder" class="btn btn-primary place-order-btn">Place Order</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useCartStore } from "../stores/cart"
import { useUserStore } from "../stores/user"
import { ElMessage } from "element-plus"

export default {
  name: "CheckoutView",
  setup() {
    const router = useRouter()
    const cartStore = useCartStore()
    const userStore = useUserStore()

    // 状态管理
    const loading = ref(false)
    const error = ref("")
    const addresses = ref([])
    const selectedAddressId = ref(null)
    const showAddAddressForm = ref(false)
    const paymentMethod = ref("creditCard")

    // 新地址表单
    const newAddress = ref({
      name: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
    })

    // 获取用户地址
    const fetchAddresses = async () => {
      loading.value = true
      error.value = ""

      try {
        // 模拟API调用
        // 在实际应用中，这里应该调用API获取用户地址
        // const response = await userStore.getUserAddresses()
        // addresses.value = response.data

        // 模拟数据
        addresses.value = [
          {
            id: 1,
            name: "John Doe",
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
            phone: "123-456-7890",
          },
          {
            id: 2,
            name: "John Doe",
            street: "456 Market Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90001",
            country: "United States",
            phone: "123-456-7890",
          },
        ]

        // 默认选择第一个地址
        if (addresses.value?.length > 0) {
          selectedAddressId.value = addresses.value[0].id
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err)
        error.value = "Failed to load addresses. Please try again."
      } finally {
        loading.value = false
      }
    }

    // 添加新地址
    const addAddress = async () => {
      try {
        // 模拟API调用
        // const response = await userStore.addUserAddress(newAddress.value)
        // addresses.value.push(response.data)

        // 模拟添加新地址
        const newId = Math.max(...addresses.value.map(addr => addr.id), 0) + 1
        const addressToAdd = {
          ...newAddress.value,
          id: newId,
        }
        addresses.value.push(addressToAdd)

        // 选择新添加的地址
        selectedAddressId.value = newId

        // 重置表单
        newAddress.value = {
          name: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phone: "",
        }

        showAddAddressForm.value = false
        ElMessage.success("Address added successfully")
      } catch (err) {
        console.error("Failed to add address:", err)
        ElMessage.error("Failed to add address. Please try again.")
      }
    }

    // 选择地址
    const selectAddress = id => {
      selectedAddressId.value = id
    }

    // 提交订单
    const placeOrder = async () => {
      if (!selectedAddressId.value) {
        ElMessage.warning("Please select a shipping address")
        return
      }

      loading.value = true

      try {
        const orderData = {
          addressId: selectedAddressId.value,
          paymentMethod: paymentMethod.value,
          items: cartItems.value,
          total: total.value,
        }

        // 模拟API调用
        // const response = await cartStore.placeOrder(orderData)

        // 模拟订单成功
        ElMessage.success("Order placed successfully!")

        // 清空购物车
        cartStore.clearCart()

        // 跳转到订单确认页面
        router.push({
          path: "/order-confirmation",
          query: { orderId: "ORD" + Math.floor(Math.random() * 10000) },
        })
      } catch (err) {
        console.error("Failed to place order:", err)
        ElMessage.error("Failed to place order. Please try again.")
      } finally {
        loading.value = false
      }
    }

    // 计算属性
    const cartItems = computed(() => cartStore.cartItems)
    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })
    const shipping = computed(() => {
      // 简单的运费计算逻辑
      return subtotal.value >= 100 ? 0 : 10
    })
    const tax = computed(() => {
      // 假设税率为8%
      return subtotal.value * 0.08
    })
    const total = computed(() => {
      return subtotal.value + shipping.value + tax.value
    })

    // 组件挂载时获取地址
    onMounted(() => {
      // 检查用户是否已登录
      if (!userStore.isAuthenticated) {
        router.push("/login")
        return
      }

      // 检查购物车是否为空
      if (cartItems.value?.length === 0) {
        router.push("/cart")
        return
      }

      fetchAddresses()
    })

    return {
      loading,
      error,
      addresses,
      selectedAddressId,
      showAddAddressForm,
      newAddress,
      paymentMethod,
      cartItems,
      subtotal,
      shipping,
      tax,
      total,
      addAddress,
      selectAddress,
      placeOrder,
    }
  },
}
</script>

<style scoped>
.checkout-container {
  padding: 2rem 0;
}

.checkout-header {
  text-align: center;
  margin-bottom: 2rem;
}

.checkout-header h1 {
  margin-bottom: 1rem;
  font-size: 2rem;
}

.checkout-steps {
  display: flex;
  justify-content: center;
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step::after {
  content: "";
  position: absolute;
  top: 12px;
  left: 50%;
  width: 100%;
  height: 2px;
  background-color: #e0e0e0;
  z-index: -1;
}

.step:last-child::after {
  display: none;
}

.step.active {
  color: var(--primary-color);
}

.step.active::after {
  background-color: var(--primary-color);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e0e0e0;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: bold;
}

.step.active .step-number {
  background-color: var(--primary-color);
  color: white;
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.checkout-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.checkout-section h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.addresses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.address-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.address-card.selected {
  border-color: var(--primary-color);
  background-color: rgba(102, 126, 234, 0.05);
}

.address-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.address-content p {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.address-actions {
  margin-top: 0.5rem;
  text-align: right;
}

.form-group {
  margin-bottom: 1rem;
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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.payment-method input {
  width: auto;
}

.checkout-summary {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 80px;
}

.checkout-summary h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.summary-item-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.summary-item-label {
  color: var(--text-secondary);
}

.summary-item-value {
  font-weight: 500;
}

.summary-item.total {
  font-size: 1rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.summary-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 1rem 0;
}

.place-order-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.place-order-btn:hover {
  background-color: var(--primary-hover);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
}

.btn-secondary {
  background-color: #f5f5f5;
  color: var(--text-primary);
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.error-message {
  color: var(--danger-color);
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.05);
  border-radius: 4px;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }

  .checkout-steps {
    gap: 1rem;
  }

  .step-text {
    display: none;
  }
}
</style>
