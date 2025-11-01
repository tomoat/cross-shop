import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-8">About Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">Our Story</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Founded in 2020, we started with a simple mission: to provide high-quality products at affordable prices with exceptional customer service. Over the years, we've grown into a trusted online retailer serving thousands of customers worldwide.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Our team is passionate about curating the best products and ensuring that every customer has a positive shopping experience. We believe in transparency, integrity, and putting our customers first in everything we do.
          </p>
        </div>
        
        <div className="bg-zinc-100 dark:bg-zinc-900 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-4">Our Values</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="text-zinc-900 dark:text-white mr-2 mt-1">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Customer First:</strong> We prioritize your needs and satisfaction.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-zinc-900 dark:text-white mr-2 mt-1">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Quality:</strong> We carefully select products that meet our high standards.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-zinc-900 dark:text-white mr-2 mt-1">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Integrity:</strong> We operate with honesty and transparency.
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-zinc-900 dark:text-white mr-2 mt-1">•</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                <strong className="text-zinc-900 dark:text-white">Innovation:</strong> We continuously improve and evolve.
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-12 bg-white dark:bg-zinc-950 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-6">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamMember
            name="John Doe"
            role="Founder & CEO"
            imageUrl="https://picsum.photos/id/1005/200/200"
          />
          <TeamMember
            name="Jane Smith"
            role="Product Manager"
            imageUrl="https://picsum.photos/id/1027/200/200"
          />
          <TeamMember
            name="Mike Johnson"
            role="Marketing Director"
            imageUrl="https://picsum.photos/id/1074/200/200"
          />
          <TeamMember
            name="Sarah Williams"
            role="Customer Support Lead"
            imageUrl="https://picsum.photos/id/1062/200/200"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Thank you for being a part of our journey. We look forward to serving you!
        </p>
        <Link 
          href="/products" 
          className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          Shop Our Products
        </Link>
      </div>
    </div>
  );
}

function TeamMember({ name, role, imageUrl }: { name: string; role: string; imageUrl: string }) {
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white dark:border-zinc-800 shadow-md">
        <Image 
          src={imageUrl} 
          alt={name} 
          width={200} 
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{name}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{role}</p>
    </div>
  );
}