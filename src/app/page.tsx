'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Heart, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { featuredProducts, categories } from '@/data/products';

const perks = [
  {
    icon: Sparkles,
    title: 'Handcrafted',
    description: 'Every slime made fresh to order with premium ingredients.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free shipping on orders over $50. Ships within 3-5 days.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Small batch, big passion. Quality you can feel.',
  },
  {
    icon: Star,
    title: '5-Star Rated',
    description: 'Thousands of happy customers and counting.',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'The Cotton Candy Cloud is INSANE. So satisfying and the scent is perfect!',
    rating: 5,
  },
  {
    name: 'Jessica L.',
    text: 'Best slime shop I have ever ordered from. The textures are so unique and high quality.',
    rating: 5,
  },
  {
    name: 'Emily R.',
    text: 'My kids are obsessed! We order every single Friday drop. The scents are amazing.',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Meet RJ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slime-cream via-white to-purple-50">
        {/* Decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-slime-pink/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-slime-purple/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-slime-teal/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* RJ Hero Image */}
            <div className="relative animate-float order-2 lg:order-1">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-slime-pink/30 via-slime-purple/30 to-slime-teal/30 rounded-[3rem] rotate-3" />
                <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl">
                  <Image
                    src="/rj-founder.png"
                    alt="River Jordan Hiatt - Founder of RJ Slime Factory"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl px-5 py-3">
                  <p className="font-display font-bold text-slime-purple text-sm">The Brain Behind the Slime</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="animate-slide-up order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 bg-slime-pink/10 text-slime-pink font-display font-semibold text-sm rounded-full mb-6">
                Meet the Founder
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Meet{' '}
                <span className="gradient-text">RJ</span>
              </h1>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-gray-700 mb-6">
                River Jordan Hiatt
              </h2>
              <p className="text-lg text-gray-600 max-w-lg mb-4 leading-relaxed">
                The brain behind RJ Slime Factory. River Jordan has been fueling his passion for the slime industry for over half of his life. His expertise is in slime testing, and he recently dove into slime creation.
              </p>
              <p className="text-lg text-gray-600 max-w-lg mb-8 leading-relaxed">
                RJ loves to make people smile, and he&apos;s recently decided to take the leap into making people smile one slime at a time with RJ Slime Factory.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Shop Now <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-slime-pink to-slime-purple"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Making people smile, one slime at a time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk) => (
              <div key={perk.title} className="flex items-center gap-3 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-slime-pink/10 to-slime-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <perk.icon size={22} className="text-slime-purple" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-sm">{perk.title}</h4>
                  <p className="text-xs text-gray-500">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-gradient-to-b from-white to-purple-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              This Week&apos;s <span className="gradient-text">Hot Drops</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Fresh slimes, limited quantities. Grab yours before they sell out!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/shop" className="btn-secondary">
              View All Slimes <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Shop by <span className="gradient-text">Texture</span>
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              From cloud-like softness to satisfying crunch. Find your perfect texture.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl p-8 text-center card-hover"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  style={{ backgroundColor: cat.color }}
                />
                <h3 className="font-display font-bold text-base">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Snippet */}
      <section className="section-padding bg-gradient-to-br from-slime-dark to-purple-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slime-pink/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-slime-teal/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
                Why RJ Slime Factory?
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                RJ Slime Factory isn&apos;t just another slime shop &mdash; it&apos;s built by someone who lives and breathes slime. With years of hands-on slime testing expertise, RJ crafts every batch with premium ingredients, perfect textures, and custom scent blends you won&apos;t find anywhere else.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Premium, non-toxic ingredients',
                  'Expert-tested textures by RJ himself',
                  'Custom scents crafted in-house',
                  'Made to make you smile',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slime-teal/20 flex items-center justify-center flex-shrink-0">
                      <span className="w-2 h-2 rounded-full bg-slime-teal" />
                    </span>
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-primary">
                Read Our Story <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/6144294/pexels-photo-6144294.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Handcrafted slime being stretched"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-purple-50/50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              What Our <span className="gradient-text">Slimers</span> Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-3xl shadow-md card-hover">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <p className="font-display font-semibold text-slime-dark">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Ready to Get Slimy?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of happy customers. Shop our latest collection today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-10 py-4 bg-white text-slime-purple font-display font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-lg"
          >
            Shop Now <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
