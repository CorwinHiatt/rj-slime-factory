import { NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
}

interface CheckoutSessionRequest {
  items: CartItem[];
  shipping: ShippingInfo;
  shippingMethodId: string;
  shippingCost: number;
  subtotal: number;
}

const VALID_SHIPPING: Record<string, number> = {
  standard: 8.99,
  express: 18.99,
  overnight: 34.99,
};

export async function POST(request: Request) {
  try {
    const stripe = getStripeServer();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment processing is not configured yet. Please check back soon!' },
        { status: 503 }
      );
    }

    const body: CheckoutSessionRequest = await request.json();
    const { items, shipping, shippingMethodId, shippingCost, subtotal } = body;

    // Validate
    const errors: string[] = [];
    if (!items || items.length === 0) errors.push('Cart is empty');
    if (!shipping?.email?.trim()) errors.push('Email is required');
    if (!shipping?.firstName?.trim()) errors.push('First name is required');
    if (!shipping?.lastName?.trim()) errors.push('Last name is required');
    if (!shipping?.address?.trim()) errors.push('Address is required');
    if (!shipping?.city?.trim()) errors.push('City is required');
    if (!shipping?.state?.trim()) errors.push('State is required');
    if (!shipping?.zip?.trim()) errors.push('ZIP code is required');
    if (!VALID_SHIPPING[shippingMethodId]) errors.push('Invalid shipping method');

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Verify subtotal matches items
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      return NextResponse.json({ error: 'Price mismatch. Please refresh and try again.' }, { status: 400 });
    }

    // Build line items for Stripe (no images to avoid URL issues)
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Shipping (${shippingMethodId.charAt(0).toUpperCase() + shippingMethodId.slice(1)})`,
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rjslime.xyz';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: shipping.email,
      line_items: lineItems,
      metadata: {
        shipping_name: `${shipping.firstName} ${shipping.lastName}`,
        shipping_phone: shipping.phone || '',
        shipping_address: shipping.address,
        shipping_apartment: shipping.apartment || '',
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_zip: shipping.zip,
        shipping_method: shippingMethodId,
        shipping_cost: shippingCost.toString(),
        items_json: JSON.stringify(items.map(i => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        }))),
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe Checkout Session error:', message);
    return NextResponse.json(
      { error: `Payment error: ${message}` },
      { status: 500 }
    );
  }
}
