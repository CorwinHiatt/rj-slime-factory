import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const filePath = join(process.cwd(), '.data', 'waitlist.json');
    const data = await readFile(filePath, 'utf-8');
    const entries = JSON.parse(data);
    const count = Array.isArray(entries) ? entries.length : 0;
    return NextResponse.json({ count, goal: 50 });
  } catch {
    // File doesn't exist yet — no pre-orders
    return NextResponse.json({ count: 0, goal: 50 });
  }
}
