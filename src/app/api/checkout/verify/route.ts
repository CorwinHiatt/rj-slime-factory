import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const TEAM_EMAILS = [
  'corwin@coleesoftwareservices.com',
  'lea@coleesoftwareservices.com',
  'hronquillo7@gmail.com',
];

// Must be an address on a domain VERIFIED in Resend. rjslime.xyz is verified;
// rjslimefactory.com is NOT, which is why previous sends silently failed.
const EMAIL_FROM = 'RJ Slime Factory <orders@rjslime.xyz>';

interface OrderEmailData {
  sessionId: string;
  orderId: string;
  email: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingName: string;
  shippingAddress: string;
  shippingMethodLabel: string;
  isPickup: boolean;
  items: { name: string; price: number; quantity: number }[];
}

function itemRowsHtml(items: OrderEmailData['items']): string {
  return items
    .map(
      (i) =>
        `<tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6;">${i.name}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #f3f4f6; text-align: right;">$${(i.price * i.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');
}

// ── Team notification: sent to corwin@ / lea@ / hannah on every paid order ──
async function sendTeamNotification(order: OrderEmailData) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('RESEND_API_KEY is not set — cannot send team order notification');
    return;
  }
  const resend = new Resend(resendKey);

  try {
    const { data, error } = await resend.emails.send(
      {
        from: EMAIL_FROM,
        to: TEAM_EMAILS,
        replyTo: order.email || undefined,
        subject: `New Order! ${order.orderId} — $${order.total.toFixed(2)} from ${order.shippingName}`,
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #8B5CF6, #FF6B9D); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Order Received!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">RJ Slime Factory</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151; width: 140px;">Order ID</td><td style="padding: 10px 12px; color: #7c3aed; font-weight: bold;">${order.orderId}</td></tr>
              <tr><td style="padding: 10px 12px; font-weight: bold; color: #374151;">Customer</td><td style="padding: 10px 12px;">${order.shippingName}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151;">Email</td><td style="padding: 10px 12px;"><a href="mailto:${order.email}" style="color: #7c3aed;">${order.email}</a></td></tr>
              <tr><td style="padding: 10px 12px; font-weight: bold; color: #374151;">Ship To</td><td style="padding: 10px 12px;">${order.shippingAddress}</td></tr>
              <tr style="background: #f9fafb;"><td style="padding: 10px 12px; font-weight: bold; color: #374151;">Method</td><td style="padding: 10px 12px;">${order.shippingMethodLabel}</td></tr>
              <tr><td style="padding: 10px 12px; font-weight: bold; color: #374151;">Total</td><td style="padding: 10px 12px; font-weight: bold; font-size: 18px; color: #059669;">$${order.total.toFixed(2)}</td></tr>
            </table>
            <h3 style="color: #374151; margin: 20px 0 10px;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead><tr style="background: #f3f4f6;">
                <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Product</th>
                <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
                <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Price</th>
              </tr></thead>
              <tbody>${itemRowsHtml(order.items)}</tbody>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: ${order.isPickup ? '#eff6ff' : '#f0fdf4'}; border-radius: 8px; border: 1px solid ${order.isPickup ? '#bfdbfe' : '#bbf7d0'};">
              <p style="margin: 0; color: ${order.isPickup ? '#1e40af' : '#166534'}; font-size: 14px;">
                <strong>Action needed:</strong> River handcrafts this order by hand — aim to make &amp; ship within ~2–4 weeks.
                ${order.isPickup ? ' This is a <strong>LOCAL PICKUP</strong> — no shipping; arrange a pickup time with the customer.' : ''}
                Don't forget the founder's gift for the first 50 orders!
              </p>
            </div>
          </div>
        </div>`,
      },
      { idempotencyKey: `team-${order.sessionId}` }
    );
    if (error) {
      console.error('Resend team notification error:', JSON.stringify(error));
    } else {
      console.log('Team notification sent:', data?.id);
    }
  } catch (err) {
    console.error('Failed to send team notification email:', err);
  }
}

// ── Customer receipt: automated order confirmation sent to the buyer ──
async function sendCustomerReceipt(order: OrderEmailData) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('RESEND_API_KEY is not set — cannot send customer receipt');
    return;
  }
  if (!order.email) {
    console.error('No customer email on session — cannot send receipt', order.orderId);
    return;
  }
  const resend = new Resend(resendKey);

  const shippingLine = order.isPickup
    ? 'Local Pickup — FREE'
    : order.shippingCost === 0
    ? 'FREE'
    : `$${order.shippingCost.toFixed(2)}`;

  try {
    const { data, error } = await resend.emails.send(
      {
        from: EMAIL_FROM,
        to: [order.email],
        replyTo: 'hello@rjslimefactory.com',
        subject: `Your RJ Slime order is confirmed! (${order.orderId})`,
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <div style="background: linear-gradient(135deg, #FF6B9D, #8B5CF6, #06D6A0); padding: 28px 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 26px;">Thank you for your order! 🫧</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">RJ Slime Factory · Bend, Oregon</p>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; color: #374151;">
            <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
              Hi ${order.shippingName || 'there'}, your order is confirmed and River is on it!
              Every slime is <strong>handcrafted to order</strong> by River himself, so please allow about
              <strong>2–4 weeks</strong>. Thanks so much for your patience and for supporting a young entrepreneur.
            </p>

            <div style="background: #faf5ff; border-radius: 10px; padding: 14px 16px; margin: 18px 0;">
              <p style="margin: 0; font-size: 13px; color: #6b7280;">Order number</p>
              <p style="margin: 2px 0 0; font-size: 18px; font-weight: bold; color: #7c3aed;">${order.orderId}</p>
            </div>

            <h3 style="color: #374151; margin: 20px 0 10px; font-size: 15px;">Order summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead><tr style="background: #f3f4f6;">
                <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase;">Item</th>
                <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase;">Qty</th>
                <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase;">Price</th>
              </tr></thead>
              <tbody>${itemRowsHtml(order.items)}</tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 14px;">
              <tr><td style="padding: 4px 12px; color: #6b7280;">Subtotal</td><td style="padding: 4px 12px; text-align: right;">$${order.subtotal.toFixed(2)}</td></tr>
              <tr><td style="padding: 4px 12px; color: #6b7280;">${order.isPickup ? 'Pickup' : 'Shipping'}</td><td style="padding: 4px 12px; text-align: right;">${shippingLine}</td></tr>
              <tr><td style="padding: 8px 12px; font-weight: bold; font-size: 16px; border-top: 2px solid #f3f4f6;">Total</td><td style="padding: 8px 12px; text-align: right; font-weight: bold; font-size: 16px; border-top: 2px solid #f3f4f6; color: #059669;">$${order.total.toFixed(2)}</td></tr>
            </table>

            <div style="margin-top: 20px; padding: 14px 16px; border-radius: 10px; background: ${order.isPickup ? '#eff6ff' : '#f0fdf4'}; border: 1px solid ${order.isPickup ? '#bfdbfe' : '#bbf7d0'};">
              <p style="margin: 0; font-size: 14px; color: ${order.isPickup ? '#1e40af' : '#166534'};">
                ${
                  order.isPickup
                    ? '<strong>Local pickup:</strong> No shipping needed — we\'ll email or text you to arrange a pickup time in Bend, OR once your order is ready.'
                    : `<strong>Shipping to:</strong> ${order.shippingAddress}. You\'ll get a tracking email once it ships.`
                }
              </p>
            </div>

            <div style="margin-top: 16px; padding: 14px 16px; border-radius: 10px; background: linear-gradient(135deg, #fff7ed, #fef2f8); border: 1px solid #fde68a;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">🎁 As one of our first 50 orders, an <strong>exclusive founder's gift</strong> is included with your order — our thank-you for believing in RJ Slime Factory from day one!</p>
            </div>

            <p style="font-size: 13px; color: #9ca3af; margin-top: 22px; line-height: 1.6;">
              Questions about your order? Just reply to this email or reach us at hello@rjslimefactory.com.<br>
              RJ Slime Factory · rjslime.xyz · Bend, Oregon
            </p>
          </div>
        </div>`,
      },
      { idempotencyKey: `receipt-${order.sessionId}` }
    );
    if (error) {
      console.error('Resend customer receipt error:', JSON.stringify(error));
    } else {
      console.log('Customer receipt sent:', data?.id);
    }
  } catch (err) {
    console.error('Failed to send customer receipt email:', err);
  }
}

async function getPreOrderCount(stripe: ReturnType<typeof getStripeServer>): Promise<number> {
  if (!stripe) return 0;
  try {
    const sessions = await stripe.checkout.sessions.list({
      status: 'complete',
      limit: 100,
    });
    return sessions.data.length;
  } catch {
    return 0;
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

    // Get real pre-order count from Stripe
    const preOrderCount = await getPreOrderCount(stripe);

    // Deterministic order id derived from the Stripe session — stable across page
    // refreshes (so the same order isn't shown with a new id every reload).
    const orderId = `RJS-${session.id.slice(-10).toUpperCase()}`;
    const total = (session.amount_total || 0) / 100;
    const email = session.customer_email || '';
    const shippingName = metadata.shipping_name || '';
    const shippingMethod = metadata.shipping_method || 'standard';
    const isPickup = shippingMethod === 'pickup';
    const shippingCost = parseFloat(metadata.shipping_cost || '0');

    // Parse items from metadata
    let items: { name: string; price: number; quantity: number }[] = [];
    try {
      items = JSON.parse(metadata.items_json || '[]');
    } catch {}
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    const shippingAddress = isPickup
      ? 'LOCAL PICKUP — no shipping (arrange pickup time with customer)'
      : [
          metadata.shipping_address,
          metadata.shipping_apartment,
          `${metadata.shipping_city}, ${metadata.shipping_state} ${metadata.shipping_zip}`,
        ]
          .filter(Boolean)
          .join(', ');

    const shippingMethodLabel = isPickup
      ? 'Local Pickup (no shipping)'
      : shippingMethod === 'standard'
      ? 'Standard Shipping'
      : shippingMethod === 'express'
      ? 'Express Shipping'
      : shippingMethod === 'overnight'
      ? 'Overnight Shipping'
      : shippingMethod;

    const orderData: OrderEmailData = {
      sessionId: session.id,
      orderId,
      email,
      subtotal,
      shippingCost,
      total,
      shippingName,
      shippingAddress,
      shippingMethodLabel,
      isPickup,
      items,
    };

    // Notify the team AND send the customer their receipt (idempotent per session,
    // so a page refresh won't double-send).
    await Promise.all([sendTeamNotification(orderData), sendCustomerReceipt(orderData)]);

    return NextResponse.json({
      orderId,
      email,
      total,
      preOrderNumber: preOrderCount,
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
