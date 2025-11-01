'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id: String(product.id), name: product.name, price: product.price, image: product.images?.[0] ?? '/placeholder.jpg' }, 1);
  };
  
  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <Link href={`/product/${product.id}`} className="group block p-4">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.[0] ?? '/placeholder.jpg'}
            alt={product.name}
            fill
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="mt-4">
          <h3 className="line-clamp-2 text-base font-medium text-zinc-900 dark:text-zinc-50">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-sm ${i < product.rating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-700'}`}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-1 text-xs text-zinc-500 dark:text-zinc-400">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button 
          onClick={handleAddToCart}
          className="w-full py-2 px-4 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors text-sm"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};