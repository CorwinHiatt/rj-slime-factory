import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Pre-Order Checkout',
  description: 'Complete your RJ Slime Factory pre-order. Your order helps fund our first production run — shipping begins once we hit 50 orders. Every pre-order includes an exclusive founder\'s gift.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white">
      <CheckoutForm />
    </div>
  );
}
