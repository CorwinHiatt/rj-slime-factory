import { NextResponse } from 'next/server';

// This endpoint is deprecated. Checkout now goes through Stripe Checkout Sessions.
// See /api/create-checkout-session instead.
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been replaced. Please use the checkout flow on the website.' },
    { status: 410 }
  );
}
