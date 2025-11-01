import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto py-20 px-4 sm:py-28 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Discover Amazing Products
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-zinc-600 dark:text-zinc-400">
            Shop the latest trends with fast delivery and secure payment options.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            >
              Shop Now
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 border border-zinc-300 text-base font-medium rounded-md text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 dark:border-zinc-700 dark:text-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
            >
              Learn More
            </Link>
          </div>
        </div>
        
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/id/26/1600/800"
            alt="Shop background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Featured Products</h2>
            <Link href="/products" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Preview Product Cards */}
            <PreviewProductCard
              id={1}
              name="Premium Wireless Headphones"
              price={199.99}
              imageUrl="https://picsum.photos/id/1/300/300"
              rating={4.5}
            />
            <PreviewProductCard
              id={2}
              name="Ergonomic Office Chair"
              price={299.99}
              imageUrl="https://picsum.photos/id/20/300/300"
              rating={4.8}
            />
            <PreviewProductCard
              id={3}
              name="Smart Fitness Watch"
              price={149.99}
              imageUrl="https://picsum.photos/id/96/300/300"
              rating={4.2}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🚚"
              title="Free Shipping"
              description="On orders over $50 within the contiguous US"
            />
            <FeatureCard
              icon="🔒"
              title="Secure Payment"
              description="Protected by industry-leading encryption"
            />
            <FeatureCard
              icon="🔄"
              title="Easy Returns"
              description="30-day return policy, no questions asked"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Preview Product Card Component
function PreviewProductCard({ id, name, price, imageUrl, rating }: { id: number; name: string; price: number; imageUrl: string; rating: number }) {
  return (
    <Link href={`/product/${id}`} className="block group">
      <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 mb-4 relative">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
        {name}
      </h3>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-lg font-semibold text-zinc-900 dark:text-white">${price.toFixed(2)}</span>
        <div className="flex items-center">
          <span className="text-amber-400 mr-1">★</span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-8 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
