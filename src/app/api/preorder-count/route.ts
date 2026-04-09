import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const stripe = getStripeServer();

  if (!stripe) {
    return NextResponse.json({ count: 0, goal: 50 });
  }

  try {
    // Count completed checkout sessions from Stripe
    const sessions = await stripe.checkout.sessions.list({
      status: 'complete',
      limit: 100,
    });

    const count = sessions.data.length;

    return NextResponse.json({ count, goal: 50 });
  } catch (err) {
    console.error('Failed to fetch pre-order count from Stripe:', err);
    return NextResponse.json({ count: 0, goal: 50 });
  }
}
