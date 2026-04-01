import { NextResponse } from 'next/server';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutRequest {
  shipping: ShippingInfo;
  paymentToken: string; // Mock token - never real card data
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
];

function generateOrderId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RJS-${timestamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequest = await request.json();
    const { shipping, paymentToken, items, subtotal, shipping_cost, tax, total } = body;

    // Validate required fields
    const errors: string[] = [];

    if (!shipping.firstName?.trim()) errors.push('First name is required');
    if (!shipping.lastName?.trim()) errors.push('Last name is required');
    if (!shipping.email?.trim()) errors.push('Email is required');
    else if (!validateEmail(shipping.email)) errors.push('Invalid email address');
    if (!shipping.phone?.trim()) errors.push('Phone number is required');
    else if (!validatePhone(shipping.phone)) errors.push('Invalid phone number');
    if (!shipping.address?.trim()) errors.push('Street address is required');
    if (!shipping.city?.trim()) errors.push('City is required');
    if (!shipping.state?.trim()) errors.push('State is required');
    else if (!US_STATES.includes(shipping.state)) errors.push('Invalid state');
    if (!shipping.zip?.trim()) errors.push('ZIP code is required');
    else if (!validateZip(shipping.zip)) errors.push('Invalid ZIP code');

    if (!paymentToken) errors.push('Payment information is required');
    if (!items || items.length === 0) errors.push('Cart is empty');

    // Validate totals
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
      errors.push('Order total mismatch - please refresh and try again');
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Simulate payment processing delay (1-2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Mock: 2% chance of payment decline for realism
    if (Math.random() < 0.02) {
      return NextResponse.json(
        {
          success: false,
          errors: ['Payment was declined. Please check your card details and try again.'],
        },
        { status: 402 }
      );
    }

    const orderId = generateOrderId();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5 + Math.floor(Math.random() * 3));

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        email: shipping.email,
        total,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        estimatedDelivery: estimatedDelivery.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        shippingAddress: {
          name: `${shipping.firstName} ${shipping.lastName}`,
          address: shipping.address,
          apartment: shipping.apartment,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Something went wrong. Please try again.'] },
      { status: 500 }
    );
  }
}
