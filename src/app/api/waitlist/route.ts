import { NextResponse } from 'next/server';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), '.data');
const WAITLIST_FILE = join(DATA_DIR, 'waitlist.json');

interface WaitlistEntry {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  createdAt: string;
}

interface WaitlistData {
  entries: WaitlistEntry[];
}

async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

async function readWaitlist(): Promise<WaitlistData> {
  try {
    const data = await readFile(WAITLIST_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { entries: [] };
  }
}

async function writeWaitlist(data: WaitlistData) {
  await ensureDataDir();
  await writeFile(WAITLIST_FILE, JSON.stringify(data, null, 2));
}

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RJS-${ts}-${r}`;
}

// GET — return waitlist count
export async function GET() {
  const data = await readWaitlist();
  return NextResponse.json({ count: data.entries.length });
}

// POST — add to waitlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shipping, items, subtotal, total, paymentMethod } = body;

    // Validate
    const errors: string[] = [];
    if (!shipping?.email?.trim()) errors.push('Email is required');
    if (!shipping?.firstName?.trim()) errors.push('First name is required');
    if (!shipping?.lastName?.trim()) errors.push('Last name is required');
    if (!shipping?.address?.trim()) errors.push('Address is required');
    if (!shipping?.city?.trim()) errors.push('City is required');
    if (!shipping?.state?.trim()) errors.push('State is required');
    if (!shipping?.zip?.trim()) errors.push('ZIP code is required');
    if (!items || items.length === 0) errors.push('No items selected');

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const data = await readWaitlist();

    const entry: WaitlistEntry = {
      id: generateId(),
      email: shipping.email,
      name: `${shipping.firstName} ${shipping.lastName}`,
      phone: shipping.phone || '',
      address: {
        line1: shipping.address,
        line2: shipping.apartment || '',
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
      },
      items: items.map((i: { productId: string; name: string; price: number; quantity: number }) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal,
      total,
      paymentMethod: paymentMethod || 'Card on file',
      createdAt: new Date().toISOString(),
    };

    data.entries.push(entry);
    await writeWaitlist(data);

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        position: data.entries.length,
        email: entry.email,
        total: entry.total,
        itemCount: items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, errors: ['Something went wrong. Please try again.'] },
      { status: 500 }
    );
  }
}
