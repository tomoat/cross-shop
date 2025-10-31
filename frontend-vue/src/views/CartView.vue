<template>
  <div class="cart-view">
    <h1>Shopping Cart</h1>

    <!-- 购物车为空状态 -->
    <div v-if="cartItems?.length === 0" class="empty-cart">
      <div class="empty-cart-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added any products to your cart yet.</p>
      <router-link to="/products" class="btn-primary"> Shop Now </router-link>
    </div>

    <!-- 购物车内容 -->
    <div v-else class="cart-content">
      <!-- 购物车项目列表 -->
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <img :src="item.product.images?.[0] ?? '/placeholder.jpg'" :alt="item.product.name" />
          </div>

          <div class="item-details">
            <h3>{{ item.product.name }}</h3>
            <p class="item-category">{{ item.product.category }}</p>
            <p class="item-price">${{ item.product.price.toFixed(2) }}</p>
          </div>

          <div class="item-quantity">
            <button @click="decrementQuantity(item.id)" :disabled="item.quantity <= 1" class="quantity-btn">-</button>
            <span class="quantity">{{ item.quantity }}</span>
            <button
              @click="incrementQuantity(item.id)"
              :disabled="item.quantity >= item.product.stock"
              class="quantity-btn"
            >
              +
            </button>
          </div>

          <div class="item-subtotal">${{ getItemSubtotal(item).toFixed(2) }}</div>

          <div class="item-remove">
            <button @click="removeItem(item.id)" class="remove-btn">Remove</button>
          </div>
        </div>
      </div>

      <!-- 购物车摘要 -->
      <div class="cart-summary">
        <h2>Order Summary</h2>

        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>

        <div class="summary-row">
          <span>Shipping</span>
          <span>{{ shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "Free" }}</span>
        </div>

        <div class="summary-row">
          <span>Tax</span>
          <span>${{ tax.toFixed(2) }}</span>
        </div>

        <div class="summary-row total">
          <span>Total</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>

        <!-- 优惠券 -->
        <div class="coupon-section">
          <input type="text" v-model="couponCode" placeholder="Enter coupon code" class="coupon-input" />
          <button @click="applyCoupon" class="btn-secondary coupon-btn">Apply</button>
        </div>

        <!-- 结账按钮 -->
        <button @click="proceedToCheckout" class="btn-primary checkout-btn">Proceed to Checkout</button>

        <!-- 继续购物链接 -->
        <router-link to="/products" class="continue-shopping"> Continue Shopping </router-link>
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
  name: "CartView",
  setup() {
    const cartStore = useCartStore()
    const userStore = useUserStore()
    const router = useRouter()
    const couponCode = ref("")

    onMounted(async () => {
      // 获取购物车数据
      await cartStore.fetchCart()
    })

    // 购物车项目
    const cartItems = computed(() => cartStore.cartItems)

    // 计算价格
    const subtotal = computed(() => {
      return cartItems.value.reduce((sum, item) => {
        return sum + item.product.price * item.quantity
      }, 0)
    })

    // 运费（订单超过50美元免运费）
    const shippingCost = computed(() => {
      return subtotal.value >= 50 ? 0 : 5.99
    })

    // 税费（假设税率为8%）
    const tax = computed(() => {
      return subtotal.value * 0.08
    })

    // 总金额
    const total = computed(() => {
      return subtotal.value + shippingCost.value + tax.value
    })

    // 获取单项小计
    const getItemSubtotal = item => {
      return item.product.price * item.quantity
    }

    // 增加数量
    const incrementQuantity = async itemId => {
      try {
        await cartStore.updateQuantity(itemId, 1)
        ElMessage.success("Quantity updated")
      } catch (error) {
        console.error("Failed to update quantity:", error)
        ElMessage.error("Failed to update quantity")
      }
    }

    // 减少数量
    const decrementQuantity = async itemId => {
      try {
        await cartStore.updateQuantity(itemId, -1)
        ElMessage.success("Quantity updated")
      } catch (error) {
        console.error("Failed to update quantity:", error)
        ElMessage.error("Failed to update quantity")
      }
    }

    // 移除商品
    const removeItem = async itemId => {
      try {
        await cartStore.removeFromCart(itemId)
        ElMessage.success("Item removed from cart")
      } catch (error) {
        console.error("Failed to remove item:", error)
        ElMessage.error("Failed to remove item")
      }
    }

    // 应用优惠券
    const applyCoupon = () => {
      if (!couponCode.value.trim()) {
        ElMessage.warning("Please enter a coupon code")
        return
      }

      // 这里是模拟优惠券验证
      if (couponCode.value.toLowerCase() === "discount10") {
        ElMessage.success("Coupon applied: 10% off")
        // 实际应用优惠券的逻辑会在这里
      } else {
        ElMessage.error("Invalid coupon code")
      }
    }

    // 继续结账
    const proceedToCheckout = () => {
      // 检查用户是否已登录
      if (!userStore.isAuthenticated) {
        // 保存当前位置，登录后返回
        localStorage.setItem("redirectAfterLogin", "/checkout")
        ElMessage.warning("Please login to proceed to checkout")
        router.push("/login")
      } else {
        router.push("/checkout")
      }
    }

    return {
      cartItems,
      subtotal,
      shippingCost,
      tax,
      total,
      couponCode,
      getItemSubtotal,
      incrementQuantity,
      decrementQuantity,
      removeItem,
      applyCoupon,
      proceedToCheckout,
    }
  },
}
</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.cart-view h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 4rem 0;
}

.empty-cart-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-cart h2 {
  margin-bottom: 0.5rem;
}

.empty-cart p {
  color: #666;
  margin-bottom: 2rem;
}

/* Cart Content */
.cart-content {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

/* Cart Items */
.cart-items {
  flex: 3;
  min-width: 300px;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.item-category {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.item-price {
  font-weight: 500;
  color: #333;
  margin: 0;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background-color: #f0f0f0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  min-width: 30px;
  text-align: center;
}

.item-subtotal {
  font-weight: bold;
  color: #333;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.remove-btn:hover {
  background-color: #fee2e2;
}

/* Cart Summary */
.cart-summary {
  flex: 1;
  min-width: 300px;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  position: sticky;
  top: 2rem;
  align-self: flex-start;
}

.cart-summary h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: none;
  padding-top: 0.5rem;
}

/* Coupon Section */
.coupon-section {
  display: flex;
  margin-bottom: 2rem;
}

.coupon-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
}

.coupon-btn {
  border-radius: 0 4px 4px 0;
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem;
}

.continue-shopping:hover {
  text-decoration: underline;
}

/* Buttons */
.btn-primary {
  background-color: #667eea;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background-color: #5a67d8;
}

.btn-secondary {
  background-color: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #667eea;
  color: white;
}

/* Responsive */
@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    grid-template-areas:
      "image details"
      "quantity subtotal"
      "remove .";
  }

  .item-image {
    grid-area: image;
  }

  .item-details {
    grid-area: details;
  }

  .item-quantity {
    grid-area: quantity;
  }

  .item-subtotal {
    grid-area: subtotal;
    justify-self: end;
  }

  .item-remove {
    grid-area: remove;
    justify-self: start;
  }

  .cart-summary {
    position: relative;
    top: 0;
  }
}
</style>
