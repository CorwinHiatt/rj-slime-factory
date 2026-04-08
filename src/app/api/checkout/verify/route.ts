import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const TEAM_EMAILS = [
  'corwin@coleesoftwareservices.com',
  'lea@coleesoftwareservices.com',
  'hronquillo7@gmail.com',
];

async function sendOrderNotification(order: {
  orderId: string;
  email: string;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingMethod: string;
  items: { name: string; price: number; quantity: number }[];
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const resend = new Resend(resendKey);

  const itemRows = order.items
    .map(
      (i) =>
        `<tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6;">${i.name}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: right;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  try {
    await resend.emails.send({
      from: 'RJ Slime Factory <noreply@rjslimefactory.com>',
      to: TEAM_EMAILS,
      subject: `New Pre-Order! ${order.orderId} — $${order.total.toFixed(2)} from ${order.shippingName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #FF6B9D); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Pre-Order Received!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">RJ Slime Factory</p>
          </div>

          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f9fafb;">
                <td style="padding: 10px 12px; font-weight: bold; color: #374151; width: 140px;">Order ID</td>
                <td style="padding: 10px 12px; color: #7c3aed; font-weight: bold;">${order.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; color: #374151;">Customer</td>
                <td style="padding: 10px 12px;">${order.shippingName}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 10px 12px; font-weight: bold; color: #374151;">Email</td>
                <td style="padding: 10px 12px;"><a href="mailto:${order.email}" style="color: #7c3aed;">${order.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; color: #374151;">Ship To</td>
                <td style="padding: 10px 12px;">${order.shippingAddress}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 10px 12px; font-weight: bold; color: #374151;">Shipping</td>
                <td style="padding: 10px 12px;">${order.shippingMethod}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; font-weight: bold; color: #374151;">Total</td>
                <td style="padding: 10px 12px; font-weight: bold; font-size: 18px; color: #059669;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>

            <h3 style="color: #374151; margin: 20px 0 10px;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
                  <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
                  <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <div style="margin-top: 24px; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0;">
              <p style="margin: 0; color: #166534; font-size: 14px;">
                <strong>Action needed:</strong> This order is a pre-order. Fulfill once we hit 50 orders and production begins. Don't forget the founder's gift!
              </p>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Failed to send order notification email:', err);
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

    const orderId = `RJS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const total = (session.amount_total || 0) / 100;
    const email = session.customer_email || '';
    const shippingName = metadata.shipping_name || '';
    const shippingMethod = metadata.shipping_method || 'standard';

    // Parse items from metadata
    let items: { name: string; price: number; quantity: number }[] = [];
    try {
      items = JSON.parse(metadata.items_json || '[]');
    } catch {}

    // Build shipping address string
    const shippingAddress = [
      metadata.shipping_address,
      metadata.shipping_apartment,
      `${metadata.shipping_city}, ${metadata.shipping_state} ${metadata.shipping_zip}`,
    ]
      .filter(Boolean)
      .join(', ');

    // Send email notification to team
    await sendOrderNotification({
      orderId,
      email,
      total,
      shippingName,
      shippingAddress,
      shippingMethod:
        shippingMethod === 'standard'
          ? 'Standard Shipping'
          : shippingMethod === 'express'
          ? 'Express Shipping'
          : shippingMethod === 'overnight'
          ? 'Overnight Shipping'
          : shippingMethod,
      items,
    });

    return NextResponse.json({
      orderId,
      email,
      total,
      preOrderNumber: 1,
      preOrderGoal: 50,
      shippingName,
      shippingMethod,
    });
  } catch (err) {
    console.error('Session verification error:', err);
    return NextResponse.json(
      { error: 'Unable to verify payment session. If you completed payment, check your email for confirmation.' },
      { status: 500 }
    );
  }
}
