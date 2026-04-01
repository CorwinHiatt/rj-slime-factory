import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="text-gray-500">Last updated: April 1, 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-gray max-w-none space-y-8">
          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Information We Collect</h2>
            <p className="text-gray-600 leading-relaxed">
              When you visit RJ Slime Factory, we collect information you provide directly, such as your name, email address, shipping address, and payment information when you place an order. We also automatically collect certain data including your IP address, browser type, and browsing behavior on our site through cookies.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">How We Use Your Information</h2>
            <ul className="text-gray-600 space-y-2 list-disc pl-5">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to customer service requests</li>
              <li>Send marketing emails (with your consent)</li>
              <li>Improve our website and product offerings</li>
              <li>Prevent fraud and protect our business</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Information Sharing</h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We share data only with trusted service providers who help us operate our business, including payment processors, shipping carriers, and email marketing platforms. These partners are contractually obligated to protect your information.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              We use cookies to remember your cart contents, preferences, and to analyze site traffic. You can disable cookies in your browser settings, though some site features may not function properly without them.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Data Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We use industry-standard SSL encryption to protect your data during transmission. Payment information is processed securely through our third-party payment processor and is never stored on our servers.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, correct, or delete your personal information at any time. To exercise these rights or to opt out of marketing emails, contact us at{' '}
              <a href="mailto:hello@rjslimefactory.com" className="text-slime-purple hover:underline">hello@rjslimefactory.com</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Children&apos;s Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold mb-3">Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this privacy policy, please{' '}
              <Link href="/contact" className="text-slime-purple hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
