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
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Slime Care', href: '/about#slime-care' },
    { label: 'FAQ', href: '/contact#faq' },
  ],
  support: [
    { label: 'Shipping & Returns', href: '/shipping' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slime-dark text-white relative noise">
      {/* Newsletter */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-xl mx-auto text-center relative z-10">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-pink/80 mb-4">
              Stay in the loop
            </p>
            <h3 className="font-display text-3xl sm:text-4xl font-bold mb-4 text-white">
              Don&apos;t Miss Out
            </h3>
            <p className="text-gray-500 mb-8 text-[15px]">
              Pre-order updates, production milestones, and launch news. Straight to your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white placeholder-gray-500 text-sm
                  focus:outline-none focus:ring-2 focus:ring-slime-pink/40 focus:border-transparent transition-all duration-300"
              />
              <button type="submit" className="btn-primary whitespace-nowrap text-sm px-7">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Logo className="h-11 w-auto mb-5 brightness-0 invert opacity-80" />
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Handcrafted slime by a young entrepreneur in Bend, Oregon. Pre-order now to help fund our first production run.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white/60 uppercase tracking-wider mb-5">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white/60 uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-sm text-white/60 uppercase tracking-wider mb-5">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-500 hover:text-white transition-colors duration-300 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} RJ Slime Factory. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Bend, Oregon
          </p>
        </div>
      </div>
    </footer>
  );
}
