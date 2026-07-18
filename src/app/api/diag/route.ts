import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// TEMPORARY diagnostic for email/config debugging. Remove after verification.
export const dynamic = 'force-dynamic';

function computeBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://rjslime.xyz';
  try {
    const u = new URL(raw);
    return `${u.protocol}//${u.host}`;
  } catch {
    return 'https://rjslime.xyz';
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resendKey = process.env.RESEND_API_KEY;

  const base = computeBaseUrl();
  const out: Record<string, unknown> = {
    resendKeySet: !!resendKey,
    stripeSecretSet: !!process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET,
    rawSiteUrlEnv: process.env.NEXT_PUBLIC_SITE_URL || null,
    computedBaseUrl: base,
    exampleSuccessUrl: `${base}/checkout/success?session_id=TEST`,
  };

  // One-off delivery test (only ever sends to the fixed team address).
  if (searchParams.get('test') === 'send' && resendKey) {
    const resend = new Resend(resendKey);
    const { data, error } = await resend.emails.send({
      from: 'RJ Slime Factory <orders@rjslime.xyz>',
      to: ['corwin@coleesoftwareservices.com'],
      subject: 'RJ Slime — email delivery test ✅',
      html: '<p>This is a delivery test from the RJ Slime Factory diagnostic. If you received this, order notifications and customer receipts now work (sent from <strong>orders@rjslime.xyz</strong>, a verified Resend domain).</p>',
    });
    out.testSend = error ? { ok: false, error } : { ok: true, id: data?.id };
  }

  return NextResponse.json(out);
}
