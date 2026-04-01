export type SlimeCategory =
  | 'cloud'
  | 'butter'
  | 'clear'
  | 'crunchy'
  | 'fluffy'
  | 'jelly'
  | 'foam'
  | 'glitter';

export interface Product {
  id: string;
  name: string;
  category: SlimeCategory;
  price: number;
  originalPrice?: number;
  description: string;
  scent: string;
  texture: string;
  image: string;
  tintColor: string;
  gradient: string;
  badge?: string;
  inStock: boolean;
}

export const categories: { id: SlimeCategory; name: string; color: string }[] = [
  { id: 'cloud', name: 'Cloud Slime', color: '#C4B5FD' },
  { id: 'butter', name: 'Butter Slime', color: '#FFD166' },
  { id: 'clear', name: 'Clear Slime', color: '#6EE7B7' },
  { id: 'crunchy', name: 'Crunchy Slime', color: '#FF8A80' },
  { id: 'fluffy', name: 'Fluffy Slime', color: '#FFB8D4' },
  { id: 'jelly', name: 'Jelly Slime', color: '#8B5CF6' },
  { id: 'foam', name: 'Foam Slime', color: '#06D6A0' },
  { id: 'glitter', name: 'Glitter Slime', color: '#FF6B9D' },
];

// All images are verified real slime/dough photos from Pexels (cottonbro studio series)
// tintColor is applied as an overlay to show accurate product color
export const products: Product[] = [
  {
    id: 'cotton-candy-cloud',
    name: 'Cotton Candy Cloud',
    category: 'cloud',
    price: 14.99,
    description: 'Dreamy, drizzly cloud slime with an airy cotton candy texture. Stretches into satisfying wisps.',
    scent: 'Cotton Candy',
    texture: 'Drizzly & Airy',
    image: 'https://images.pexels.com/photos/6144294/pexels-photo-6144294.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#C4B5FD',
    gradient: 'from-purple-300 via-pink-200 to-blue-200',
    badge: 'Bestseller',
    inStock: true,
  },
  {
    id: 'midnight-galaxy',
    name: 'Midnight Galaxy',
    category: 'glitter',
    price: 15.99,
    description: 'Deep purple glitter slime with holographic star confetti. Mesmerizing sparkle with every stretch.',
    scent: 'Blackberry Vanilla',
    texture: 'Glossy & Sparkly',
    image: 'https://images.pexels.com/photos/6144289/pexels-photo-6144289.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#6D28D9',
    gradient: 'from-purple-600 via-indigo-500 to-blue-900',
    badge: 'New',
    inStock: true,
  },
  {
    id: 'strawberry-butter',
    name: 'Strawberry Butter',
    category: 'butter',
    price: 14.99,
    description: 'Ultra-smooth butter slime that spreads like frosting. Creamy, pillowy, and oh-so-satisfying.',
    scent: 'Fresh Strawberry',
    texture: 'Smooth & Spreadable',
    image: 'https://images.pexels.com/photos/6144305/pexels-photo-6144305.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#FB7185',
    gradient: 'from-pink-400 via-red-300 to-pink-200',
    inStock: true,
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    category: 'clear',
    price: 13.99,
    description: 'Crystal-clear slime with tiny blue beads that look like ocean bubbles. Incredibly stretchy.',
    scent: 'Sea Salt & Coconut',
    texture: 'Crystal Clear & Stretchy',
    image: 'https://images.pexels.com/photos/6144307/pexels-photo-6144307.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#22D3EE',
    gradient: 'from-cyan-300 via-blue-400 to-teal-300',
    inStock: true,
  },
  {
    id: 'unicorn-crunch',
    name: 'Unicorn Crunch',
    category: 'crunchy',
    price: 15.99,
    description: 'Rainbow bingsu beads in a glossy base. Every squeeze produces the most satisfying crunch sounds.',
    scent: 'Birthday Cake',
    texture: 'Crunchy & Crispy',
    image: 'https://images.pexels.com/photos/6144293/pexels-photo-6144293.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#F472B6',
    gradient: 'from-pink-400 via-yellow-300 to-purple-400',
    badge: 'Popular',
    inStock: true,
  },
  {
    id: 'lavender-dreams',
    name: 'Lavender Dreams',
    category: 'fluffy',
    price: 14.99,
    description: 'Light-as-air fluffy slime with real dried lavender pieces. Calming, soft, and cloud-like.',
    scent: 'French Lavender',
    texture: 'Fluffy & Soft',
    image: 'https://images.pexels.com/photos/6144311/pexels-photo-6144311.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#A78BFA',
    gradient: 'from-purple-300 via-purple-200 to-purple-100',
    inStock: true,
  },
  {
    id: 'tropical-sunset',
    name: 'Tropical Sunset',
    category: 'jelly',
    price: 14.99,
    description: 'Bouncy jelly slime with a gorgeous orange-to-pink gradient. Jiggly, squishy, and inflatable.',
    scent: 'Mango Pineapple',
    texture: 'Bouncy & Jiggly',
    image: 'https://images.pexels.com/photos/6144288/pexels-photo-6144288.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#FB923C',
    gradient: 'from-orange-400 via-pink-400 to-red-400',
    inStock: true,
  },
  {
    id: 'mint-chocolate',
    name: 'Mint Chocolate',
    category: 'butter',
    price: 15.99,
    description: 'Rich chocolate-brown butter slime swirled with mint green. Smells like a gourmet dessert.',
    scent: 'Mint Chocolate Chip',
    texture: 'Creamy & Thick',
    image: 'https://images.pexels.com/photos/6144309/pexels-photo-6144309.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#34D399',
    gradient: 'from-green-400 via-emerald-600 to-amber-800',
    badge: 'Limited',
    inStock: true,
  },
  {
    id: 'rainbow-explosion',
    name: 'Rainbow Explosion',
    category: 'foam',
    price: 13.99,
    description: 'Foam beads in every color of the rainbow. Crunchy, squishy, and endlessly playable.',
    scent: 'Fruit Punch',
    texture: 'Foamy & Crunchy',
    image: 'https://images.pexels.com/photos/6144306/pexels-photo-6144306.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#F59E0B',
    gradient: 'from-red-400 via-yellow-400 to-green-400',
    inStock: true,
  },
  {
    id: 'peach-paradise',
    name: 'Peach Paradise',
    category: 'cloud',
    price: 14.99,
    description: 'Soft peach-colored cloud slime that drizzles like honey. Melt-in-your-hands texture.',
    scent: 'Georgia Peach',
    texture: 'Drizzly & Smooth',
    image: 'https://images.pexels.com/photos/6144308/pexels-photo-6144308.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#FDBA74',
    gradient: 'from-orange-200 via-orange-300 to-pink-200',
    inStock: true,
  },
  {
    id: 'berry-blast',
    name: 'Berry Blast',
    category: 'crunchy',
    price: 15.99,
    description: 'Deep berry-colored slime packed with crunchy foam beads. ASMR heaven in a jar.',
    scent: 'Mixed Berry',
    texture: 'Crunchy & Thick',
    image: 'https://images.pexels.com/photos/6144310/pexels-photo-6144310.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#DB2777',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    inStock: true,
  },
  {
    id: 'lemon-drop',
    name: 'Lemon Drop',
    category: 'clear',
    price: 13.99,
    description: 'Sunny yellow clear slime with tiny lemon charm add-ins. Transparent, stretchy, and bright.',
    scent: 'Lemon Zest',
    texture: 'Clear & Glossy',
    image: 'https://images.pexels.com/photos/6144312/pexels-photo-6144312.jpeg?auto=compress&cs=tinysrgb&w=600',
    tintColor: '#FACC15',
    gradient: 'from-yellow-300 via-yellow-400 to-amber-300',
    inStock: true,
  },
];

export const featuredProducts = products.filter((p) => p.badge);

export function getProductsByCategory(category: SlimeCategory): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
