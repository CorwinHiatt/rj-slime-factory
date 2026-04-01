import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with RJ Slime Factory in Bend, Oregon. Questions about orders, custom slime requests, wholesale inquiries, or collaborations. We respond within 24 hours. Email hello@rjslimefactory.com.',
  keywords: [
    'contact RJ Slime Factory',
    'slime shop contact',
    'custom slime order',
    'wholesale slime',
    'slime FAQ',
    'Bend Oregon slime',
  ],
  openGraph: {
    title: 'Contact RJ Slime Factory | Bend, Oregon',
    description:
      'Questions, custom orders, or collaborations? We\'d love to hear from you. Based in Bend, Oregon.',
    url: 'https://rjslime.xyz/contact',
  },
  alternates: {
    canonical: 'https://rjslime.xyz/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
