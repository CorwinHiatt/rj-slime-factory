import { loadStripe, type Stripe } from '@stripe/stripe-js';

// Client-side Stripe (for redirecting to Checkout)
let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key) {
      stripePromise = loadStripe(key);
    } else {
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
}

export function isStripeConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}
