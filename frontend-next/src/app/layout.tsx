import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartProvider } from '../contexts/CartContext';
import CartLink from '../components/CartLink';

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Cross Shop - Premium Products Store",
  description: "Discover high-quality products with fast delivery and secure payment options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <CartProvider>
        {/* Header with Navigation */}
        <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/next.svg"
                    alt="Cross Shop Logo"
                    width={80}
                    height={20}
                    className="dark:invert h-auto w-auto"
                  />
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <nav className="flex space-x-8">
                  <NavLink href="/" active>Home</NavLink>
                  <NavLink href="/products">Products</NavLink>
                  <NavLink href="/about">About</NavLink>
                  <NavLink href="/contact">Contact</NavLink>
                </nav>
                
                {/* Cart Icon with Count */}
                <CartLink />
              </div>
              
              {/* Mobile Navigation and Cart */}
              <div className="md:hidden flex items-center space-x-4">
                <CartLink />
                <button className="text-zinc-900 dark:text-white p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-zinc-900 text-white pt-12 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Cross Shop</h3>
                <p className="text-zinc-400 mb-4">
                  High-quality products at affordable prices with exceptional customer service.
                </p>
                <div className="flex space-x-4">
                  <SocialIcon href="#">Facebook</SocialIcon>
                  <SocialIcon href="#">Twitter</SocialIcon>
                  <SocialIcon href="#">Instagram</SocialIcon>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Shop</h3>
                <ul className="space-y-2">
                  <FooterLink href="/products">All Products</FooterLink>
                  <FooterLink href="#">New Arrivals</FooterLink>
                  <FooterLink href="#">Best Sellers</FooterLink>
                  <FooterLink href="#">Sale</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <FooterLink href="/about">About Us</FooterLink>
                  <FooterLink href="#">Careers</FooterLink>
                  <FooterLink href="#">Privacy Policy</FooterLink>
                  <FooterLink href="#">Terms of Service</FooterLink>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Help</h3>
                <ul className="space-y-2">
                  <FooterLink href="/contact">Contact Us</FooterLink>
                  <FooterLink href="#">FAQ</FooterLink>
                  <FooterLink href="#">Shipping & Returns</FooterLink>
                  <FooterLink href="#">Track Order</FooterLink>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-zinc-800 pt-8 text-center text-zinc-500">
              <p>&copy; {new Date().getFullYear()} Cross Shop. All rights reserved.</p>
            </div>
          </div>
        </footer>
        </CartProvider>
      </body>
    </html>
  );
}

// Navigation Link Component
function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-base font-medium transition-colors hover:text-zinc-900 dark:hover:text-white ${active ? 'text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400'}`}
    >
      {children}
    </Link>
  );
}

// CartLink component imported from '../components/CartLink'

// Social Icon Component
function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-zinc-400 hover:text-white transition-colors">
      <span className="sr-only">{children}</span>
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    </Link>
  );
}

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-zinc-400 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  );
}
