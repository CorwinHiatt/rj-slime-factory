import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe-server';

const DATA_DIR = join(process.cwd(), '.data');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const WAITLIST_FILE = join(DATA_DIR, 'waitlist.json');

interface Order {
  id: string;
  stripeSessionId: string;
  email: string;
  name: string;
  phone: string;
  shippingAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  shippingMethod: string;
  shippingCost: number;
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  total: number;
  status: 'paid' | 'refunded';
  preOrderNumber: number;
  createdAt: string;
}

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readOrders(): Promise<Order[]> {
  try {
    const data = await readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await ensureDataDir();
  await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

// Also update waitlist.json for backward compatibility with preorder-count
async function updateWaitlist(order: Order) {
  await ensureDataDir();
  let waitlist: { entries: Record<string, unknown>[] } = { entries: [] };
  try {
    const data = await readFile(WAITLIST_FILE, 'utf-8');
    waitlist = JSON.parse(data);
  } catch {}

  waitlist.entries.push({
    id: order.id,
    email: order.email,
    name: order.name,
    phone: order.phone,
    address: order.shippingAddress,
    items: order.items,
    subtotal: order.subtotal,
    total: order.total,
    paymentMethod: 'Stripe',
    createdAt: order.createdAt,
  });

  await writeFile(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RJS-${ts}-${r}`;
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  // If webhook secret is set, verify signature
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  const stripe = getStripeServer();

  try {
    if (webhookSecret && signature && stripe) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // In development without webhook secret, parse directly
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Only process paid sessions
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const metadata = session.metadata || {};
    let items: { productId: string; name: string; price: number; quantity: number }[] = [];
    try {
      items = JSON.parse(metadata.items_json || '[]');
    } catch {}

    const orders = await readOrders();

    // Prevent duplicate processing
    if (orders.some(o => o.stripeSessionId === session.id)) {
      return NextResponse.json({ received: true });
    }

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = parseFloat(metadata.shipping_cost || '0');

    const order: Order = {
      id: generateOrderId(),
      stripeSessionId: session.id,
      email: session.customer_email || metadata.shipping_name || '',
      name: metadata.shipping_name || '',
      phone: metadata.shipping_phone || '',
      shippingAddress: {
        line1: metadata.shipping_address || '',
        line2: metadata.shipping_apartment || '',
        city: metadata.shipping_city || '',
        state: metadata.shipping_state || '',
        zip: metadata.shipping_zip || '',
      },
      shippingMethod: metadata.shipping_method || 'standard',
      shippingCost,
      items,
      subtotal,
      total: (session.amount_total || 0) / 100,
      status: 'paid',
      preOrderNumber: orders.length + 1,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);
    await writeOrders(orders);
    await updateWaitlist(order);

    console.log(`Pre-order #${order.preOrderNumber} received: ${order.id} (${order.email})`);
  }

  return NextResponse.json({ received: true });
}
