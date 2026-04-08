'use client';

import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-slime-dark text-white/80 text-xs font-medium overflow-hidden tracking-widest uppercase">
        <div className="animate-marquee-wrapper animate-marquee py-2.5">
          {[
            'Pre-Orders OPEN — Only 50 spots available',
            'Free shipping on orders over $50',
            'Exclusive founder\'s gift with every pre-order',
            'Shipping begins once we hit 50 orders',
          ].flatMap((text, i) => [
            <span key={`a${i}`} className="mx-10 whitespace-nowrap">{text}</span>,
            <span key={`d${i}`} className="mx-2 text-slime-purple/60 whitespace-nowrap">&#9679;</span>,
          ]).concat([
            'Pre-Orders OPEN — Only 50 spots available',
            'Free shipping on orders over $50',
            'Exclusive founder\'s gift with every pre-order',
            'Shipping begins once we hit 50 orders',
          ].flatMap((text, i) => [
            <span key={`b${i}`} className="mx-10 whitespace-nowrap">{text}</span>,
            <span key={`e${i}`} className="mx-2 text-slime-purple/60 whitespace-nowrap">&#9679;</span>,
          ]))}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass shadow-sm'
            : 'bg-white/0 backdrop-blur-none border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100/80 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]">
              <Logo className="h-11 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display font-medium text-[15px] transition-all duration-300 relative py-1
                    ${
                      pathname === link.href
                        ? 'text-slime-dark'
                        : 'text-gray-400 hover:text-slime-dark'
                    }
                  `}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-slime-pink transition-all duration-300 ${
                      pathname === link.href ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 -mr-2 rounded-xl hover:bg-gray-100/80 transition-all duration-300 group"
              aria-label="Open cart"
            >
              <ShoppingBag size={22} className="text-slime-dark group-hover:text-slime-purple transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-slime-pink text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
            mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col py-3 px-4 gap-0.5 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-display font-medium text-[15px] py-3 px-4 rounded-xl transition-all duration-300
                  ${
                    pathname === link.href
                      ? 'bg-slime-pink/5 text-slime-pink'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-slime-dark'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
