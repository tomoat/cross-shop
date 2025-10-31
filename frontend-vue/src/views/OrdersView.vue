<template>
  <div class="orders-container">
    <div class="orders-header">
      <h1>My Orders</h1>
      <p>Track and manage your orders</p>
    </div>

    <div class="orders-filter">
      <div class="search-bar">
        <input type="text" placeholder="Search orders by ID or product name..." v-model="searchQuery" />
      </div>

      <div class="filter-options">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select v-model="sortOrder" class="filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>
    </div>

    <div class="orders-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>

      <div v-else-if="filteredOrders?.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No orders found</h3>
        <p>
          {{ searchQuery ?? statusFilter ? "No orders match your filters." : "You haven't placed any orders yet." }}
        </p>
        <router-link to="/products" class="btn btn-primary">Start Shopping</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card">
          <div class="order-card-header">
            <div class="order-id-section">
              <span class="order-id-label">Order #</span>
              <span class="order-id">{{ order.id }}</span>
            </div>
            <div class="order-status" :class="`status-${order.status}`">
              {{ capitalize(order.status) }}
            </div>
          </div>

          <div class="order-date">Placed on {{ formatDate(order.date) }}</div>

          <div class="order-items">
            <div v-for="(item, index) in order.items.slice(0, 3)" :key="index" class="order-item">
              <div class="item-image">
                <img :src="item.image" alt="Item image" :title="item.name" />
              </div>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">${{ item.price.toFixed(2) }}</div>
              </div>
              <div class="item-quantity">x{{ item.quantity }}</div>
            </div>

            <div v-if="order.items?.length > 3" class="more-items">
              + {{ order.items?.length - 3 }} more items
              <button
                class="show-more-btn"
                @click="showAllItems(order.id, $event)"
                :class="{ expanded: expandedOrders.includes(order.id) }"
              >
                {{ expandedOrders.includes(order.id) ? "Show Less" : "Show All" }}
              </button>
            </div>

            <div v-if="expandedOrders.includes(order.id)" class="expanded-items">
              <div v-for="(item, index) in order.items.slice(3)" :key="index" class="order-item">
                <div class="item-image">
                  <img :src="item.image" alt="Item image" :title="item.name" />
                </div>
                <div class="item-details">
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-price">${{ item.price.toFixed(2) }}</div>
                </div>
                <div class="item-quantity">x{{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ calculateSubtotal(order).toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Shipping</span>
              <span>${{ order.shipping.toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax</span>
              <span>${{ order.tax.toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total</span>
              <span>${{ order.total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="order-actions">
            <button class="btn btn-outline" @click="viewOrderDetails(order.id)">View Details</button>

            <button v-if="order.status === 'delivered'" class="btn btn-primary" @click="buyAgain(order)">
              Buy Again
            </button>

            <button v-if="order.status === 'processing'" class="btn btn-danger" @click="cancelOrder(order.id)">
              Cancel Order
            </button>

            <button v-if="order.status === 'shipped'" class="btn btn-primary" @click="trackOrder(order.id)">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredOrders?.length > 0" class="pagination">
      <button class="btn btn-outline" :disabled="currentPage === 1" @click="currentPage--">Previous</button>

      <span class="page-info"> Page {{ currentPage }} of {{ Math.ceil(filteredOrders?.length / itemsPerPage) }} </span>

      <button
        class="btn btn-outline"
        :disabled="currentPage === Math.ceil(filteredOrders?.length / itemsPerPage)"
        @click="currentPage++"
      >
        Next
      </button>
    </div>

    <!-- Order Cancellation Modal -->
    <div v-if="showCancelModal" class="modal-overlay" @click.self="closeCancelModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Cancel Order</h2>
          <button class="modal-close" @click="closeCancelModal">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to cancel order #{{ cancellingOrderId }}?</p>
          <div class="cancel-reasons">
            <label for="cancelReason">Reason for cancellation:</label>
            <select id="cancelReason" v-model="cancelReason">
              <option value="changed-mind">Changed my mind</option>
              <option value="wrong-item">Ordered the wrong item</option>
              <option value="price-too-high">Found a better price elsewhere</option>
              <option value="delivery-too-slow">Delivery taking too long</option>
              <option value="other">Other reason</option>
            </select>
          </div>
          <div class="form-group" v-if="cancelReason === 'other'">
            <label for="cancelNotes">Additional notes:</label>
            <textarea
              id="cancelNotes"
              v-model="cancelNotes"
              rows="3"
              placeholder="Please provide details..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeCancelModal">No, Keep Order</button>
          <button class="btn btn-danger" @click="confirmCancelOrder" :disabled="processingCancel">
            {{ processingCancel ? "Processing..." : "Yes, Cancel Order" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "../stores/user"
import { useCartStore } from "../stores/cart"
import { ElMessage } from "element-plus"

export default {
  name: "OrdersView",
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const cartStore = useCartStore()

    // State
    const loading = ref(false)
    const orders = ref([])
    const searchQuery = ref("")
    const statusFilter = ref("")
    const sortOrder = ref("newest")
    const currentPage = ref(1)
    const itemsPerPage = 5
    const expandedOrders = ref([])

    // Cancellation modal state
    const showCancelModal = ref(false)
    const cancellingOrderId = ref(null)
    const cancelReason = ref("changed-mind")
    const cancelNotes = ref("")
    const processingCancel = ref(false)

    // Computed properties
    const filteredOrders = computed(() => {
      let result = [...orders.value]

      // Apply status filter
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }

      // Apply search
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(order => {
          // Search by order ID
          if (order.id.toLowerCase().includes(query)) {
            return true
          }
          // Search by product name
          return order.items.some(item => item.name.toLowerCase().includes(query))
        })
      }

      // Apply sorting
      result.sort((a, b) => {
        switch (sortOrder.value) {
          case "newest":
            return new Date(b.date) - new Date(a.date)
          case "oldest":
            return new Date(a.date) - new Date(b.date)
          case "price-high":
            return b.total - a.total
          case "price-low":
            return a.total - b.total
          default:
            return 0
        }
      })

      // Apply pagination
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return result.slice(start, end)
    })

    // Methods
    const loadOrders = async () => {
      if (!userStore.isAuthenticated) {
        router.push("/login")
        return
      }

      loading.value = true
      try {
        // In a real application, this would be an API call
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Mock data
        orders.value = [
          {
            id: "ORD-2023-0001",
            date: "2023-11-10",
            status: "delivered",
            items: [
              {
                id: 1,
                name: "Smartphone X Pro Max",
                price: 1299.99,
                quantity: 1,
                image: "/images/smartphone.jpg",
              },
              {
                id: 2,
                name: "Premium Phone Case",
                price: 49.99,
                quantity: 2,
                image: "/images/case.jpg",
              },
            ],
            subtotal: 1399.97,
            shipping: 0,
            tax: 112.0,
            total: 1511.97,
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            trackingNumber: "TRK-789012",
            paymentMethod: "Credit Card ending in 4242",
          },
          {
            id: "ORD-2023-0002",
            date: "2023-10-15",
            status: "shipped",
            items: [
              {
                id: 3,
                name: 'Ultra Thin Laptop 14"',
                price: 1499.99,
                quantity: 1,
                image: "/images/laptop.jpg",
              },
              {
                id: 4,
                name: "Wireless Mouse",
                price: 29.99,
                quantity: 1,
                image: "/images/mouse.jpg",
              },
              {
                id: 5,
                name: "Laptop Sleeve",
                price: 39.99,
                quantity: 1,
                image: "/images/sleeve.jpg",
              },
              {
                id: 6,
                name: "USB-C Hub",
                price: 79.99,
                quantity: 1,
                image: "/images/hub.jpg",
              },
            ],
            subtotal: 1649.96,
            shipping: 15.99,
            tax: 132.0,
            total: 1797.95,
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            trackingNumber: "TRK-345678",
            paymentMethod: "PayPal",
          },
          {
            id: "ORD-2023-0003",
            date: "2023-09-22",
            status: "processing",
            items: [
              {
                id: 7,
                name: "Wireless Noise Cancelling Headphones",
                price: 299.99,
                quantity: 1,
                image: "/images/headphones.jpg",
              },
            ],
            subtotal: 299.99,
            shipping: 0,
            tax: 24.0,
            total: 323.99,
            shippingAddress: {
              name: "John Doe",
              street: "456 Market Ave",
              city: "Los Angeles",
              state: "CA",
              zipCode: "90001",
              country: "United States",
            },
            paymentMethod: "Apple Pay",
          },
          {
            id: "ORD-2023-0004",
            date: "2023-08-15",
            status: "cancelled",
            items: [
              {
                id: 8,
                name: "Bluetooth Speaker",
                price: 149.99,
                quantity: 2,
                image: "/images/speaker.jpg",
              },
            ],
            subtotal: 299.98,
            shipping: 0,
            tax: 24.0,
            total: 323.98,
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            paymentMethod: "Credit Card ending in 4242",
          },
          {
            id: "ORD-2023-0005",
            date: "2023-07-30",
            status: "delivered",
            items: [
              {
                id: 9,
                name: "Fitness Tracker",
                price: 89.99,
                quantity: 1,
                image: "/images/tracker.jpg",
              },
              {
                id: 10,
                name: "Extra Bands (Pack of 3)",
                price: 29.99,
                quantity: 1,
                image: "/images/bands.jpg",
              },
            ],
            subtotal: 119.98,
            shipping: 0,
            tax: 9.6,
            total: 129.58,
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            trackingNumber: "TRK-901234",
            paymentMethod: "Google Pay",
          },
          {
            id: "ORD-2023-0006",
            date: "2023-07-05",
            status: "delivered",
            items: [
              {
                id: 11,
                name: "Smart Home Hub",
                price: 199.99,
                quantity: 1,
                image: "/images/hub.jpg",
              },
              {
                id: 12,
                name: "Smart Light Bulbs (Pack of 4)",
                price: 39.99,
                quantity: 2,
                image: "/images/bulbs.jpg",
              },
              {
                id: 13,
                name: "Smart Plug (Pack of 2)",
                price: 29.99,
                quantity: 1,
                image: "/images/plug.jpg",
              },
            ],
            subtotal: 339.96,
            shipping: 0,
            tax: 27.2,
            total: 367.16,
            shippingAddress: {
              name: "John Doe",
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "United States",
            },
            trackingNumber: "TRK-567890",
            paymentMethod: "Credit Card ending in 4242",
          },
        ]
      } catch (error) {
        console.error("Failed to load orders:", error)
        ElMessage.error("Failed to load your orders. Please try again.")
      } finally {
        loading.value = false
      }
    }

    const calculateSubtotal = order => {
      return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }

    const formatDate = dateString => {
      const options = { year: "numeric", month: "long", day: "numeric" }
      return new Date(dateString).toLocaleDateString("en-US", options)
    }

    const capitalize = str => {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }

    const viewOrderDetails = orderId => {
      router.push(`/order/${orderId}`)
    }

    const showAllItems = (orderId, event) => {
      event.stopPropagation() // Prevent triggering the order card click
      const index = expandedOrders.value.indexOf(orderId)
      if (index === -1) {
        expandedOrders.value.push(orderId)
      } else {
        expandedOrders.value.splice(index, 1)
      }
    }

    const buyAgain = order => {
      // Add all items from the order to cart
      order.items.forEach(item => {
        cartStore.addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })
      })

      ElMessage.success("Items have been added to your cart!")
      router.push("/cart")
    }

    const trackOrder = orderId => {
      const order = orders.value.find(o => o.id === orderId)
      if (order?.trackingNumber) {
        // In a real app, this would open a tracking page or external tracking site
        ElMessage.info(`Tracking number: ${order.trackingNumber}`)
      } else {
        ElMessage.warning("Tracking information not available")
      }
    }

    const cancelOrder = orderId => {
      cancellingOrderId.value = orderId
      showCancelModal.value = true
    }

    const closeCancelModal = () => {
      showCancelModal.value = false
      cancellingOrderId.value = null
      cancelReason.value = "changed-mind"
      cancelNotes.value = ""
    }

    const confirmCancelOrder = async () => {
      if (!cancellingOrderId.value) return

      processingCancel.value = true
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Update the order status locally
        const orderIndex = orders.value.findIndex(o => o.id === cancellingOrderId.value)
        if (orderIndex !== -1) {
          orders.value[orderIndex].status = "cancelled"
        }

        ElMessage.success("Order has been cancelled")
        closeCancelModal()
      } catch (error) {
        console.error("Failed to cancel order:", error)
        ElMessage.error("Failed to cancel the order. Please try again.")
      } finally {
        processingCancel.value = false
      }
    }

    // Lifecycle
    onMounted(() => {
      loadOrders()
    })

    return {
      loading,
      orders,
      searchQuery,
      statusFilter,
      sortOrder,
      currentPage,
      itemsPerPage,
      expandedOrders,
      filteredOrders,
      showCancelModal,
      cancellingOrderId,
      cancelReason,
      cancelNotes,
      processingCancel,
      calculateSubtotal,
      formatDate,
      capitalize,
      viewOrderDetails,
      showAllItems,
      buyAgain,
      trackOrder,
      cancelOrder,
      closeCancelModal,
      confirmCancelOrder,
    }
  },
}
</script>

<style scoped>
.orders-container {
  padding: 2rem 0;
}

.orders-header {
  margin-bottom: 2rem;
  text-align: center;
}

.orders-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.orders-header p {
  color: var(--text-secondary);
}

.orders-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-bar input {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 350px;
  font-size: 1rem;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
}

.orders-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary-color);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.empty-state {
  text-align: center;
  padding: 5rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.orders-list {
  padding: 1rem;
}

.order-card {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.order-id-section {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.order-id-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.order-id {
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

.order-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.order-items {
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f5f5f5;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 1rem;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-price {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.item-quantity {
  font-weight: 500;
}

.more-items {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0 0;
  color: var(--text-secondary);
}

.show-more-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0;
}

.show-more-btn:hover {
  text-decoration: underline;
}

.expanded-items {
  margin-top: 0.5rem;
}

.order-summary {
  border-top: 1px solid #f0f0f0;
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-row.total {
  font-weight: 500;
  font-size: 1.125rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f5f5f5;
}

.order-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  flex-wrap: wrap;
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

.btn-outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.btn-outline:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}

.btn-danger:disabled,
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.page-info {
  color: var(--text-secondary);
}

/* Modal Styles */
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
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--text-primary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin-bottom: 1.5rem;
}

.cancel-reasons {
  margin-bottom: 1.5rem;
}

.cancel-reasons label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.cancel-reasons select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #e0e0e0;
}

@media (max-width: 768px) {
  .orders-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar input {
    width: 100%;
  }

  .filter-options {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .order-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .order-actions {
    justify-content: center;
  }

  .btn {
    flex: 1;
    text-align: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
  }
}
</style>
