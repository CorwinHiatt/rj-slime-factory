import type { Metadata } from 'next';
import { Fredoka, Poppins } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

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

export const metadata: Metadata = {
  title: 'RJ Slime Factory | Handcrafted Slime Shop',
  description:
    'Premium handcrafted slime made with love. Cloud, butter, clear, crunchy, and more. Satisfying textures, amazing scents, and endless fun. Shop the latest drops now!',
  keywords: [
    'slime',
    'slime shop',
    'handmade slime',
    'cloud slime',
    'butter slime',
    'ASMR slime',
    'RJ Slime Factory',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'RJ Slime Factory | Handcrafted Slime Shop',
    description:
      'Premium handcrafted slime. Satisfying textures, amazing scents, endless fun.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${poppins.variable}`}>
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
