import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your RJ Slime Factory order. Secure checkout with fast shipping from Bend, Oregon.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white">
      <CheckoutForm />
    </div>
  );
}
