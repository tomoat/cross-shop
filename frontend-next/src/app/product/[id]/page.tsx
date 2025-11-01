"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "../../../contexts/CartContext"

// Mock product data with more details
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    images: [
      "https://picsum.photos/id/1/800/600",
      "https://picsum.photos/id/11/800/600",
      "https://picsum.photos/id/12/800/600",
    ],
    rating: 4.5,
    description:
      "Experience studio-quality sound with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions for extended listening sessions.",
    specifications: {
      brand: "AudioTech",
      connectivity: "Bluetooth 5.2",
      battery: "30 hours",
      driverSize: "40mm",
      weight: "280g",
    },
    stock: 25,
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    price: 299.99,
    images: [
      "https://picsum.photos/id/20/800/600",
      "https://picsum.photos/id/21/800/600",
      "https://picsum.photos/id/22/800/600",
    ],
    rating: 4.8,
    description:
      "Designed for maximum comfort during long work hours. Our ergonomic chair features adjustable lumbar support, tilt function, and breathable mesh backrest for optimal airflow.",
    specifications: {
      material: "Mesh and PU leather",
      weightCapacity: "250lbs",
      adjustability: "Height, armrests, lumbar",
      color: "Black/White/Gray",
    },
    stock: 12,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 149.99,
    images: [
      "https://picsum.photos/id/96/800/600",
      "https://picsum.photos/id/100/800/600",
      "https://picsum.photos/id/98/800/600",
    ],
    rating: 4.2,
    description:
      "Track your fitness goals with our feature-packed smartwatch. Monitors heart rate, sleep quality, steps, and offers 50+ sports modes to keep you motivated and on track.",
    specifications: {
      display: '1.4" AMOLED',
      battery: "Up to 14 days",
      waterResistance: "5ATM",
      sensors: "Heart rate, SpO2, GPS",
    },
    stock: 30,
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToCart } = useCart()

  // Find product by ID
  const product = mockProducts.find(p => p.id === productId)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-zinc-950 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">Product Not Found</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">The requested product could not be found.</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // 使用购物车上下文的addToCart函数，不再需要本地实现

  const buyNow = () => {
    // In a real app, this would add to cart and redirect to checkout
    alert(`Buying ${quantity} ${product.name}(s)!`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div
            className="overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900"
            style={{ width: "100%", maxWidth: "600px", maxHeight: "400px", height: "auto", margin: "0 auto" }}
          >
            <Image
              src={product.images?.[currentImageIndex] ?? "/placeholder.jpg"}
              alt={product.name}
              width={600}
              height={400}
              className="h-auto w-full object-cover"
              style={{ height: "auto", width: "auto" }}
              loading="eager"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square w-16 overflow-hidden rounded-md border ${
                    currentImageIndex === index ? "border-zinc-900 dark:border-zinc-50" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`${i < product.rating ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-sm text-zinc-600 dark:text-zinc-400">
              {product.rating.toFixed(1)} (120 reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">${product.price.toFixed(2)}</p>

          {/* Stock Status */}
          <div
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
              product.stock > 0
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </div>

          {/* Description */}
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">{product.description}</p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium text-zinc-900 dark:text-zinc-50">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-4 py-1.5 font-medium text-zinc-900 dark:text-zinc-50 min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= product.stock}
                className="px-3 py-1.5 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() =>
                addToCart(
                  {
                    id: String(product.id),
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  },
                  quantity
                )
              }
              disabled={product.stock <= 0}
              className="flex-1 px-6 py-3 bg-zinc-200 text-zinc-900 font-medium rounded-md hover:bg-zinc-300 transition-colors disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={product.stock <= 0}
              className="flex-1 px-6 py-3 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-16 bg-white dark:bg-zinc-950 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-zinc-200 dark:border-zinc-800">
              <span className="text-zinc-600 dark:text-zinc-400 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-50">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Back to Products Link */}
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="inline-flex items-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  )
}
