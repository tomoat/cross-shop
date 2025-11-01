"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// 定义产品类型
export interface Product {
  id: string
  name: string
  price: number
  image: string
  quantity?: number
}

// 定义购物车上下文类型
interface CartContextType {
  cart: Product[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  totalPrice: number
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined)

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([])

  // 添加到购物车
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      // 检查产品是否已在购物车中
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id)

      if (existingItemIndex !== -1) {
        // 如果已存在，增加数量
        // 创建一个全新的数组和对象，避免直接修改prevCart中的对象
        const newCart = prevCart.map((item, index) => {
          if (index === existingItemIndex) {
            // 只更新找到的商品，使用明确的数量计算
            return {
              ...item,
              quantity: (item.quantity || 0) + quantity,
            }
          }
          return item
        })
        return newCart
      } else {
        // 如果不存在，添加新商品
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  // 从购物车移除
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // 更新数量
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart => prevCart.map(item => (item.id === productId ? { ...item, quantity } : item)))
  }

  // 清空购物车
  const clearCart = () => {
    setCart([])
  }

  // 计算购物车商品总数
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0)

  // 计算购物车总价
  const totalPrice = cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0)

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// 自定义Hook用于使用购物车上下文
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
