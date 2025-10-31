import { defineStore } from "pinia"
import axios from "axios"

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    categories: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      priceRange: null,
      sort: "latest",
    },
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
    },
  }),

  actions: {
    async fetchProducts(filters = {}) {
      this.loading = true
      this.error = null

      try {
        const params = {
          ...this.filters,
          ...filters,
          page: filters.page || this.pagination.page,
          limit: filters.limit || this.pagination.limit,
        }

        const response = await axios.get("/api/products", { params })
        this.products = response.data.products
        this.pagination = {
          ...this.pagination,
          total: response.data.total,
          page: params.page,
          limit: params.limit,
        }

        return response.data
      } catch (error) {
        this.error = error.message
        console.error("Failed to fetch products:", error)
        // 提供模拟数据
        this.products = this.getMockProducts()
        return { products: this.products, total: this.products?.length }
      } finally {
        this.loading = false
      }
    },

    async fetchProductById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`/api/products/${id}`)
        this.currentProduct = response.data
        return response.data
      } catch (error) {
        this.error = error.message
        console.error(`Failed to fetch product ${id}:`, error)
        // 提供模拟数据
        this.currentProduct = this.getMockProducts().find(p => p.id === id)
        return this.currentProduct
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get("/api/categories")
        this.categories = response.data
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        // 提供模拟分类数据
        this.categories = [
          { id: "1", name: "Electronics", description: "Electronic devices and accessories" },
          { id: "2", name: "Clothing", description: "Fashion and apparel" },
          { id: "3", name: "Home & Kitchen", description: "Home and kitchen products" },
          { id: "4", name: "Books", description: "Books and publications" },
          { id: "5", name: "Toys", description: "Toys and games" },
        ]
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.fetchProducts(this.filters)
    },

    // 模拟产品数据
    getMockProducts() {
      return [
        {
          id: "1",
          name: "Smartphone X",
          description: "Latest smartphone with advanced features",
          price: 799.99,
          stock: 50,
          categoryId: "1",
          category: "Electronics",
          images: ["/phone1.jpg", "/phone2.jpg"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Laptop Pro",
          description: "Powerful laptop for professional use",
          price: 1299.99,
          stock: 30,
          categoryId: "1",
          category: "Electronics",
          images: ["/laptop1.jpg"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Casual T-Shirt",
          description: "Comfortable cotton t-shirt",
          price: 19.99,
          stock: 100,
          categoryId: "2",
          category: "Clothing",
          images: ["/shirt1.jpg"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Cookware Set",
          description: "Complete cookware set for your kitchen",
          price: 149.99,
          stock: 20,
          categoryId: "3",
          category: "Home & Kitchen",
          images: ["/cookware1.jpg"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Bestseller Book",
          description: "Popular book from bestselling author",
          price: 12.99,
          stock: 150,
          categoryId: "4",
          category: "Books",
          images: ["/book1.jpg"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          name: "Action Figure",
          description: "Collectible action figure",
          price: 29.99,
          stock: 75,
          categoryId: "5",
          category: "Toys",
          images: ["/toy1.jpg"],
          createdAt: new Date().toISOString(),
        },
      ]
    },
  },
})
