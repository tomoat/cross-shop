import React from 'react';
import { ProductCard } from '@/components/ProductCard';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    price: 199.99,
    images: ['https://picsum.photos/id/1/600/400', 'https://picsum.photos/id/11/600/400'],
    rating: 4.5,
    category: 'Electronics'
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    price: 299.99,
    images: ['https://picsum.photos/id/20/600/400', 'https://picsum.photos/id/21/600/400'],
    rating: 4.8,
    category: 'Furniture'
  },
  {
    id: 3,
    name: 'Smart Fitness Watch',
    price: 149.99,
    images: ['https://picsum.photos/id/96/600/400', 'https://picsum.photos/id/100/600/400'],
    rating: 4.2,
    category: 'Wearables'
  },
  {
    id: 4,
    name: 'Portable Bluetooth Speaker',
    price: 79.99,
    images: ['https://picsum.photos/id/36/600/400', 'https://picsum.photos/id/37/600/400'],
    rating: 4.0,
    category: 'Audio'
  },
  {
    id: 5,
    name: 'Non-stick Cooking Pan Set',
    price: 89.99,
    images: ['https://picsum.photos/id/42/600/400', 'https://picsum.photos/id/43/600/400'],
    rating: 4.6,
    category: 'Kitchen'
  },
  {
    id: 6,
    name: 'Ultra-Thin Laptop Backpack',
    price: 59.99,
    images: ['https://picsum.photos/id/48/600/400', 'https://picsum.photos/id/49/600/400'],
    rating: 4.3,
    category: 'Accessories'
  }
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-zinc-50">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}