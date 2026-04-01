import type { Metadata } from 'next';
import { ProductListSchema } from '@/components/LocalBusinessSchema';

export const metadata: Metadata = {
  title: 'Shop Handcrafted Slime Online',
  description:
    'Browse 12+ handcrafted slime varieties from RJ Slime Factory in Bend, Oregon. Cloud slime, butter slime, clear slime, crunchy slime, fluffy slime, and more. Prices from $13.99. Free shipping over $50. New drops every Friday.',
  keywords: [
    'buy slime online',
    'slime shop',
    'cloud slime for sale',
    'butter slime for sale',
    'clear slime',
    'crunchy slime',
    'ASMR slime shop',
    'best slime to buy',
    'slime Bend Oregon',
    'handmade slime shop',
  ],
  openGraph: {
    title: 'Shop Handcrafted Slime | RJ Slime Factory - Bend, OR',
    description:
      'Browse 12+ handcrafted slime textures. Cloud, butter, clear, crunchy, and more. Made in Bend, Oregon. Ships nationwide.',
    url: 'https://rjslime.xyz/shop',
  },
  alternates: {
    canonical: 'https://rjslime.xyz/shop',
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductListSchema />
      {children}
    </>
  );
}
