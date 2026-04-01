'use client';

import Link from 'next/link';
import Logo from './Logo';

const footerLinks = {
  shop: [
    { label: 'All Slimes', href: '/shop' },
    { label: 'Cloud Slime', href: '/shop?category=cloud' },
    { label: 'Butter Slime', href: '/shop?category=butter' },
    { label: 'Clear Slime', href: '/shop?category=clear' },
    { label: 'Crunchy Slime', href: '/shop?category=crunchy' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Slime Care', href: '/about#slime-care' },
    { label: 'FAQ', href: '/contact#faq' },
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Pinterest', href: 'https://pinterest.com' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slime-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-3xl font-bold mb-3 gradient-text">
              Don&apos;t Miss a Drop
            </h3>
            <p className="text-gray-400 mb-6">
              Be the first to know about new slimes, restocks, and exclusive deals.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slime-pink focus:border-transparent"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="h-12 w-auto mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Handcrafted slime made with love in Bend, Oregon. Satisfying textures, amazing scents, shipped nationwide.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-slime-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-slime-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Follow Us</h4>
            <ul className="space-y-2.5">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-slime-pink transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} RJ Slime Factory. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-gray-500 text-sm">
            <Link href="/privacy" className="hover:text-slime-pink transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slime-pink transition-colors">
              Terms of Service
            </Link>
            <Link href="/shipping" className="hover:text-slime-pink transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
