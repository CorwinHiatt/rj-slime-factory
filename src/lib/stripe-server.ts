import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe | null {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.warn(
      'STRIPE_SECRET_KEY is not set. Stripe payment processing will not work. ' +
      'Add your key to .env.local to enable payments.'
    );
    return null;
  }

  _stripe = new Stripe(key, {
    typescript: true,
  });

  return _stripe;
}

export default { getStripeServer };
