import type { Metadata } from 'next';
import { Fredoka, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import LocalBusinessSchema, { WebsiteSchema } from '@/components/LocalBusinessSchema';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const siteUrl = 'https://rjslime.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RJ Slime Factory | Handcrafted Slime Shop in Bend, Oregon',
    template: '%s | RJ Slime Factory - Bend, OR',
  },
  description:
    'Premium handcrafted slime made in Bend, Oregon by young entrepreneur River Jordan Hiatt. Shop cloud slime, butter slime, clear slime, crunchy slime, and more. Satisfying textures, custom scents, shipped nationwide. New drops every Friday.',
  keywords: [
    'slime shop',
    'handmade slime',
    'cloud slime',
    'butter slime',
    'clear slime',
    'crunchy slime',
    'fluffy slime',
    'glitter slime',
    'ASMR slime',
    'buy slime online',
    'slime shop Bend Oregon',
    'RJ Slime Factory',
    'satisfying slime',
    'slime for kids',
    'custom scented slime',
    'Oregon slime shop',
    'handcrafted slime',
    'slime store',
    'best slime shop',
    'slime delivery',
  ],
  authors: [{ name: 'RJ Slime Factory' }],
  creator: 'RJ Slime Factory',
  publisher: 'RJ Slime Factory',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'RJ Slime Factory',
    title: 'RJ Slime Factory | Handcrafted Slime Shop in Bend, Oregon',
    description:
      'Premium handcrafted slime made in Bend, Oregon. Cloud, butter, clear, crunchy slime and more. Satisfying textures, custom scents, new drops every Friday. Shop now!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RJ Slime Factory | Handcrafted Slime Shop in Bend, Oregon',
    description:
      'Premium handcrafted slime made in Bend, OR. Cloud, butter, clear, crunchy slime and more. New drops every Friday!',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'shopping',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${poppins.variable}`}>
      <head>
        <LocalBusinessSchema />
        <WebsiteSchema />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
