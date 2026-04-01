import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
            Terms of <span className="gradient-text">Service</span>
          </h1>
          <p className="text-gray-500">Last updated: April 1, 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the RJ Slime Factory website and purchasing our products, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Products & Orders</h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>All products are handmade and may vary slightly in color, texture, and scent from photos shown</li>
              <li>Prices are listed in USD and are subject to change without notice</li>
              <li>We reserve the right to limit quantities or refuse any order</li>
              <li>Orders are confirmed only after successful payment processing</li>
              <li>Product availability is not guaranteed until checkout is complete</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Payment</h2>
            <p className="text-gray-600 leading-relaxed">
              We accept major credit cards, debit cards, and other payment methods as displayed at checkout. All payments are processed securely. You agree to provide accurate and complete payment information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Product Use & Safety</h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>Our slime products are intended for sensory play and are not edible</li>
              <li>Recommended for ages 6 and up; adult supervision recommended for younger children</li>
              <li>Keep away from eyes, mouth, clothing, and furniture</li>
              <li>Discontinue use if skin irritation occurs</li>
              <li>RJ Slime Factory is not responsible for misuse of products</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed">
              All content on this website, including text, images, logos, and product designs, is the property of RJ Slime Factory and is protected by copyright laws. You may not reproduce, distribute, or use any content without written permission.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              RJ Slime Factory shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the purchase price of the product in question.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these terms at any time. Changes take effect immediately upon posting. Continued use of our website constitutes acceptance of updated terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Questions about these terms? <Link href="/contact" className="text-slime-purple hover:underline">Get in touch</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
