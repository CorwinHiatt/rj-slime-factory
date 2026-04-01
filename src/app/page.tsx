'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Heart, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { featuredProducts, categories } from '@/data/products';

const perks = [
  { icon: Sparkles, title: 'Handcrafted', desc: 'Made fresh to order' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Heart, title: 'Made with Love', desc: 'Small batch quality' },
  { icon: Star, title: '5-Star Rated', desc: 'Trusted by thousands' },
];

const testimonials = [
  {
    name: 'Sarah M.',
    text: 'The Cotton Candy Cloud is INSANE. So satisfying and the scent is perfect!',
    rating: 5,
  },
  {
    name: 'Jessica L.',
    text: 'Best slime shop I\'ve ever ordered from. The textures are so unique and high quality.',
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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slime-cream via-white to-white">
        {/* Subtle decorative blobs */}
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] bg-slime-pink/[0.07] rounded-full blur-[100px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slime-purple/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-slime-teal/[0.05] rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* RJ Hero Image */}
            <ScrollReveal direction="left" className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/4] max-w-[380px] mx-auto">
                <div className="absolute -inset-3 bg-gradient-to-br from-slime-pink/20 via-slime-purple/15 to-slime-teal/20 rounded-[2.5rem] rotate-2 blur-sm" />
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slime-purple/10">
                  <Image
                    src="/rj-founder.png"
                    alt="River Jordan Hiatt - Founder of RJ Slime Factory"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-2xl shadow-xl shadow-black/8 px-5 py-3 border border-gray-100">
                  <p className="font-display font-bold text-slime-purple text-sm">The Brain Behind the Slime</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Text */}
            <ScrollReveal direction="right" delay={100} className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 bg-slime-pink/8 text-slime-pink font-display font-semibold text-xs tracking-wider uppercase rounded-full mb-8">
                Meet the Founder
              </span>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] mb-5">
                Meet{' '}
                <span className="gradient-text">RJ</span>
              </h1>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-gray-400 mb-7">
                River Jordan Hiatt
              </h2>
              <p className="text-base text-gray-500 max-w-lg mb-4 leading-relaxed">
                The brain behind RJ Slime Factory. River Jordan has been fueling his passion for the slime industry for over half of his life. His expertise is in slime testing, and he recently dove into slime creation.
              </p>
              <p className="text-base text-gray-500 max-w-lg mb-10 leading-relaxed">
                RJ loves to make people smile, and he&apos;s recently decided to take the leap into making people smile one slime at a time with RJ Slime Factory.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Shop Now <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-5 mt-12 pt-8 border-t border-gray-100">
                <div className="flex -space-x-1.5">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-slime-pink to-slime-purple"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Making people smile, one slime at a time</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Perks Bar */}
      <section className="border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, i) => (
              <ScrollReveal key={perk.title} delay={i * 80} direction="up">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slime-purple/[0.06] flex items-center justify-center">
                    <perk.icon size={18} className="text-slime-purple" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-sm text-slime-dark">{perk.title}</p>
                    <p className="text-xs text-gray-400">{perk.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-pink mb-4">Fresh this week</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Hot <span className="gradient-text">Drops</span>
              </h2>
              <p className="text-gray-400 max-w-sm mx-auto text-[15px]">
                Limited quantities. Grab yours before they sell out.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product, i) => (
              <ScrollReveal key={product.id} delay={i * 100} direction="up">
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="text-center mt-12">
            <Link href="/shop" className="btn-secondary">
              View All Slimes <ArrowRight size={14} className="ml-2" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50/50 pt-0">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-purple mb-4">Find your texture</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold">
                Shop by <span className="gradient-text">Texture</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 60} direction="up">
                <Link
                  href={`/shop?category=${cat.id}`}
                  className="group relative overflow-hidden rounded-2xl p-7 sm:p-8 text-center bg-white border border-gray-100
                    transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 hover:border-gray-200"
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-4 transition-transform duration-500 ease-out group-hover:scale-110"
                    style={{ backgroundColor: cat.color, boxShadow: `0 8px 24px ${cat.color}40` }}
                  />
                  <h3 className="font-display font-bold text-sm text-slime-dark">{cat.name}</h3>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why RJ */}
      <section className="section-padding bg-slime-dark text-white relative overflow-hidden noise">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slime-pink/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slime-teal/[0.04] rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-teal/80 mb-6">Why choose us</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-7 leading-tight">
                Why RJ Slime Factory?
              </h2>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                RJ Slime Factory isn&apos;t just another slime shop &mdash; it&apos;s built by someone who lives and breathes slime. Every batch is crafted with premium ingredients, perfect textures, and custom scent blends.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Premium, non-toxic ingredients',
                  'Expert-tested textures by RJ himself',
                  'Custom scents crafted in-house',
                  'Made to make you smile',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-slime-teal flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about" className="btn-primary">
                Read Our Story <ArrowRight size={16} className="ml-2" />
              </Link>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={150}>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-br from-slime-pink/10 to-slime-teal/10 rounded-[2.5rem] rotate-1" />
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/6144294/pexels-photo-6144294.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Handcrafted slime being stretched"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-pink mb-4">Reviews</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold">
                What Our <span className="gradient-text">Slimers</span> Say
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100} direction="up">
                <div className="bg-white p-7 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-black/5 transition-all duration-500">
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-display font-semibold text-sm text-slime-dark">{t.name}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-slime-dark text-white text-center relative overflow-hidden noise">
        <div className="absolute inset-0 bg-gradient-to-br from-slime-pink/10 via-slime-purple/10 to-slime-teal/10" />
        <ScrollReveal className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-5">
            Ready to Get Slimy?
          </h2>
          <p className="text-gray-400 text-base mb-10">
            Join thousands of happy customers. Shop our latest collection today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-10 py-4 bg-white text-slime-dark font-display font-bold rounded-full
              transition-all duration-500 ease-out shadow-xl shadow-white/10 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/20 text-[15px]"
          >
            Shop Now <ArrowRight size={16} className="ml-2" />
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
