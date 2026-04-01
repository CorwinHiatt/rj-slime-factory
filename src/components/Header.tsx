'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal text-white text-sm font-medium overflow-hidden">
        <div className="animate-marquee-wrapper animate-marquee py-2">
          <span className="mx-8 whitespace-nowrap">
            FREE SHIPPING ON ORDERS OVER $50
          </span>
          <span className="mx-8 whitespace-nowrap">
            NEW DROPS EVERY FRIDAY AT 5PM PST
          </span>
          <span className="mx-8 whitespace-nowrap">
            USE CODE SLIMELOVE FOR 10% OFF YOUR FIRST ORDER
          </span>
          <span className="mx-8 whitespace-nowrap">
            HANDMADE WITH LOVE IN BEND, OREGON
          </span>
          <span className="mx-8 whitespace-nowrap">
            FREE SHIPPING ON ORDERS OVER $50
          </span>
          <span className="mx-8 whitespace-nowrap">
            NEW DROPS EVERY FRIDAY AT 5PM PST
          </span>
          <span className="mx-8 whitespace-nowrap">
            USE CODE SLIMELOVE FOR 10% OFF YOUR FIRST ORDER
          </span>
          <span className="mx-8 whitespace-nowrap">
            HANDMADE WITH LOVE IN BEND, OREGON
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo className="h-12 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display font-medium text-base transition-all duration-300 relative
                    ${
                      pathname === link.href
                        ? 'text-slime-pink'
                        : 'text-slime-dark hover:text-slime-purple'
                    }
                  `}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-slime-pink to-slime-purple rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag size={24} className="text-slime-dark" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-slime-pink text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-slide-up">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 animate-slide-up">
            <nav className="flex flex-col py-4 px-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`font-display font-medium text-base py-3 px-4 rounded-xl transition-all
                    ${
                      pathname === link.href
                        ? 'bg-slime-pink/10 text-slime-pink'
                        : 'text-slime-dark hover:bg-gray-50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
