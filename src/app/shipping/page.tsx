import Link from 'next/link';
import { Truck, Clock, Package, RefreshCw } from 'lucide-react';

const shippingOptions = [
  {
    icon: Truck,
    title: 'Standard Shipping',
    time: '3-5 business days',
    price: '$5.99',
    note: 'Free on orders over $50',
  },
  {
    icon: Clock,
    title: 'Processing Time',
    time: '1-3 business days',
    price: '',
    note: 'All slime is made fresh to order',
  },
  {
    icon: Package,
    title: 'Packaging',
    time: 'Sealed & secure',
    price: '',
    note: 'Eco-friendly, leak-proof containers',
  },
  {
    icon: RefreshCw,
    title: 'Returns',
    time: '14-day window',
    price: '',
    note: 'Unopened items only',
  },
];

export default function ShippingPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
            Shipping & <span className="gradient-text">Returns</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Everything you need to know about getting your slime delivered.
          </p>
        </div>
      </section>

      {/* Shipping Overview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {shippingOptions.map((option) => (
            <div
              key={option.title}
              className="bg-white rounded-2xl p-6 shadow-md card-hover text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slime-pink/10 to-slime-purple/10 flex items-center justify-center mx-auto mb-4">
                <option.icon size={22} className="text-slime-purple" />
              </div>
              <h3 className="font-display font-bold text-sm mb-1">{option.title}</h3>
              <p className="text-slime-dark font-medium text-sm">{option.time}</p>
              {option.price && (
                <p className="text-slime-pink font-display font-bold text-sm mt-1">{option.price}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">{option.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Info */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Shipping Policy</h2>
            <div className="text-gray-600 space-y-3 leading-relaxed">
              <p>
                All orders are processed within <strong>1-3 business days</strong> (Monday-Friday, excluding holidays). Because every slime is handcrafted fresh, we need a bit of time to make yours perfect.
              </p>
              <p>
                Standard shipping within the United States takes <strong>3-5 business days</strong> after processing. You will receive a tracking number via email once your order ships.
              </p>
              <p>
                <strong>Free shipping</strong> is available on all orders of $50 or more. Orders under $50 have a flat rate of $5.99.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">International Shipping</h2>
            <p className="text-gray-600 leading-relaxed">
              We currently ship within the <strong>United States only</strong>. International shipping is coming soon! Sign up for our newsletter to be the first to know when we expand.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Packaging</h2>
            <p className="text-gray-600 leading-relaxed">
              Every order is carefully packaged in sealed, leak-proof containers with eco-friendly materials. We bubble-wrap each slime to ensure it arrives in perfect condition. During hot weather, we may include ice packs for heat-sensitive textures.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Return Policy</h2>
            <div className="text-gray-600 space-y-3 leading-relaxed">
              <p>
                Due to the handmade nature of our products, we have the following return guidelines:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Unopened items</strong> may be returned within 14 days of delivery for a full refund</li>
                <li><strong>Opened items</strong> cannot be returned for hygiene and safety reasons</li>
                <li><strong>Damaged orders</strong> — if your slime arrives damaged, email us with a photo within 48 hours and we will send a replacement at no cost</li>
                <li><strong>Wrong items</strong> — if you received the wrong product, contact us immediately and we will correct it</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Refunds</h2>
            <p className="text-gray-600 leading-relaxed">
              Approved refunds are processed within 5-7 business days to your original payment method. Shipping costs are non-refundable unless the return is due to our error.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Lost or Stolen Packages</h2>
            <p className="text-gray-600 leading-relaxed">
              Once your package is marked as delivered by the carrier, it is no longer our responsibility. However, if your tracking shows delivered but you haven&apos;t received it, contact us within 7 days and we will work with you to resolve the issue.
            </p>
          </div>

          <div className="bg-gradient-to-r from-slime-purple/5 to-slime-pink/5 rounded-3xl p-8 text-center">
            <h3 className="font-display text-xl font-bold mb-2">Still Have Questions?</h3>
            <p className="text-gray-500 mb-4">
              Check our FAQ or reach out directly. We&apos;re here to help!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact#faq" className="btn-secondary text-sm">
                View FAQ
              </Link>
              <Link href="/contact" className="btn-primary text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
