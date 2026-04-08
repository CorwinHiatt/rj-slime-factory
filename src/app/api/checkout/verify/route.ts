import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

async function getPreOrderCount(): Promise<number> {
  try {
    const data = await readFile(join(process.cwd(), '.data', 'orders.json'), 'utf-8');
    const orders = JSON.parse(data);
    return Array.isArray(orders) ? orders.length : 0;
  } catch {
    // Fall back to waitlist
    try {
      const data = await readFile(join(process.cwd(), '.data', 'waitlist.json'), 'utf-8');
      const waitlist = JSON.parse(data);
      return waitlist.entries?.length || 0;
    } catch {
      return 0;
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: 'Payment processing is not configured yet.' }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment has not been completed.' }, { status: 400 });
    }

    const metadata = session.metadata || {};
    const preOrderCount = await getPreOrderCount();

    // Generate order ID from metadata or create one
    const orderId = `RJS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json({
      orderId,
      email: session.customer_email || '',
      total: (session.amount_total || 0) / 100,
      preOrderNumber: preOrderCount || 1,
      preOrderGoal: 50,
      shippingName: metadata.shipping_name || '',
      shippingMethod: metadata.shipping_method || 'standard',
    });
  } catch (err) {
    console.error('Session verification error:', err);
    return NextResponse.json(
      { error: 'Unable to verify payment session. If you completed payment, check your email for confirmation.' },
      { status: 500 }
    );
  }
}
