import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateReceiptPdf } from '@/lib/receipt-pdf';

// TEMPORARY: verifies PDF generation + Resend attachment delivery in the live
// serverless runtime. Only sends to the fixed team address. Remove after verify.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const out: Record<string, unknown> = { ok: true };

  if (searchParams.get('test') === 'receipt') {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      out.error = 'RESEND_API_KEY not set';
      return NextResponse.json(out);
    }
    try {
      const pdf = await generateReceiptPdf({
        orderId: 'RJS-TESTPDF01',
        dateStr: 'July 18, 2026',
        shippingName: 'Test Customer',
        items: [
          { name: 'Unicorn Crunch', price: 15.99, quantity: 1 },
          { name: 'Midnight Galaxy', price: 15.99, quantity: 1 },
        ],
        subtotal: 31.98,
        shippingCost: 8.99,
        total: 40.97,
        isPickup: false,
        shippingAddress: '123 Slime St, Bend, OR 97701',
      });
      out.pdfBytes = pdf.length;

      const resend = new Resend(key);
      const { data, error } = await resend.emails.send({
        from: 'RJ Slime Factory <orders@rjslime.xyz>',
        to: ['corwin@coleesoftwareservices.com'],
        subject: 'RJ Slime — receipt + PDF attachment test',
        html: '<p>Test of the automated customer receipt: branded email + attached PDF. If the PDF is attached and opens, customer receipts are working end-to-end.</p>',
        attachments: [{ filename: 'RJ-Slime-Receipt-TEST.pdf', content: Buffer.from(pdf).toString('base64') }],
      });
      out.send = error ? { ok: false, error } : { ok: true, id: data?.id };
    } catch (e) {
      out.pdfError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json(out);
}
