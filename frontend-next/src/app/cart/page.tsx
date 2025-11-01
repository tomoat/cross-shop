'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice } = useCart();

  // 处理数量变化
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // 如果购物车为空
  if (cartCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="mx-auto max-w-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Your cart is empty</h2>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Looks like you haven't added any items to your cart yet.</p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
          >
            Shop Now
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-8">Shopping Cart</h1>

      <div className="bg-white dark:bg-zinc-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-700">
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-zinc-900 dark:text-white">${item.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                        className="p-1 rounded-l-md border border-r-0 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                        disabled={(item.quantity || 1) <= 1}
                      >
                        <span className="sr-only">Decrease quantity</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        value={item.quantity || 1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 p-1 border-y border-zinc-300 dark:border-zinc-600 bg-transparent text-center text-sm"
                        min="1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        className="p-1 rounded-r-md border border-l-0 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-colors"
                      >
                        <span className="sr-only">Increase quantity</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-zinc-900 dark:text-white">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex flex-col sm:flex-row justify-between">
            <div className="flex space-x-3 sm:order-2">
              <button
                onClick={clearCart}
                className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                Clear Cart
              </button>
              <Link
                href="/products"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-600 hover:bg-zinc-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Checkout
              </button>
            </div>
            <div className="mt-6 sm:mt-0 sm:order-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">Subtotal</span>
                <span className="ml-2 text-sm font-medium text-zinc-900 dark:text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Shipping and taxes calculated at checkout
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Placeholder for recommended products */}
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white dark:bg-zinc-800 shadow-sm rounded-lg overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <Image
                  src="/next.svg"
                  alt={`Recommended product ${item}`}
                  width={400}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-white truncate">Recommended Product {item}</h3>
                <div className="mt-1 flex items-center">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">$49.99</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}