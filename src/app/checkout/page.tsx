import type { Metadata } from 'next';
import CheckoutForm from '@/components/CheckoutForm';

export const metadata: Metadata = {
  title: 'Reserve Your Spot',
  description: 'Join the RJ Slime Factory waitlist. Reserve your handcrafted slime — your card won\'t be charged until we officially launch and ship.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white">
      <CheckoutForm />
    </div>
  );
}
