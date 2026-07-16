import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your RJ Slime Factory order. River handcrafts every order himself — please allow about 2–4 weeks. The first 50 orders include an exclusive founder\'s gift.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white">
      <CheckoutForm />
    </div>
  );
}
