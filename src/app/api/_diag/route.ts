import { NextResponse } from 'next/server';

// TEMPORARY read-only diagnostic for email/config debugging.
// Returns NO secrets — only whether env vars are set and Resend domain status.
// Remove after diagnosis.
export const dynamic = 'force-dynamic';

export async function GET() {
  const resendKey = process.env.RESEND_API_KEY;

  const out: Record<string, unknown> = {
    resendKeySet: !!resendKey,
    stripeSecretSet: !!process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecretSet: !!process.env.STRIPE_WEBHOOK_SECRET,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  };

  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${resendKey}` },
        cache: 'no-store',
      });
      const body = await res.json();
      out.resendHttpStatus = res.status;
      out.resendDomains = Array.isArray(body?.data)
        ? body.data.map((d: { name?: string; status?: string; region?: string }) => ({
            name: d.name,
            status: d.status,
            region: d.region,
          }))
        : body;
    } catch (e) {
      out.resendError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json(out);
}
