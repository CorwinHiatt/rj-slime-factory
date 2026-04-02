'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Heart, Star, Clock } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ScrollReveal from '@/components/ScrollReveal';
import { featuredProducts, categories } from '@/data/products';

const perks = [
  { icon: Sparkles, title: 'Handcrafted', desc: 'Small batch quality' },
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Heart, title: 'Made with Love', desc: 'Premium ingredients' },
  { icon: Clock, title: 'Coming Soon', desc: 'Join the waitlist' },
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
              <div className="relative max-w-[400px] mx-auto">
                {/* Animated gradient ring behind photo */}
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-slime-pink via-slime-purple to-slime-teal opacity-30 blur-xl animate-pulse" />
                <div className="absolute -inset-2 rounded-[2.8rem] bg-gradient-to-tr from-slime-teal via-slime-purple to-slime-pink opacity-20 rotate-3" />

                {/* Main photo container */}
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slime-purple/20">
                  <Image
                    src="/rj-founder.png"
                    alt="River Jordan Hiatt - Founder of RJ Slime Factory"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover object-top"
                    priority
                  />
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl bg-gradient-to-br from-slime-pink to-slime-purple flex items-center justify-center shadow-lg shadow-slime-pink/30 animate-float">
                  <Sparkles size={22} className="text-white" />
                </div>
                <div className="absolute top-1/4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-slime-teal to-emerald-400 flex items-center justify-center shadow-lg shadow-slime-teal/30 animate-float-delay">
                  <Star size={16} className="text-white fill-white" />
                </div>

                {/* Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl shadow-black/8 px-6 py-3 border border-gray-100 whitespace-nowrap">
                  <p className="font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal text-sm">The Brain Behind the Slime</p>
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
                The brain behind RJ Slime Factory. River Jordan is a slime expert who has spent years testing every texture on the market. Now he&apos;s channeling that expertise into creating his own line of premium slimes.
              </p>
              <p className="text-base text-gray-500 max-w-lg mb-10 leading-relaxed">
                RJ Slime Factory is gearing up for launch. Reserve your favorites now and be first in line when we ship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Browse &amp; Reserve <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link href="/about" className="btn-secondary">
                  Our Story
                </Link>
              </div>

              {/* Waitlist CTA */}
              <div className="flex items-center gap-5 mt-12 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 px-4 py-2 bg-slime-teal/10 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-slime-teal animate-pulse" />
                  <span className="text-sm font-display font-semibold text-slime-teal">Waitlist Open</span>
                </div>
                <p className="text-xs text-gray-400">Reserve your spot &mdash; no charge until we ship</p>
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
              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-slime-pink mb-4">Launching soon</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                First <span className="gradient-text">Drops</span>
              </h2>
              <p className="text-gray-400 max-w-sm mx-auto text-[15px]">
                Reserve your favorites. Limited first-run quantities.
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
              <div className="relative aspect-[3/4] max-w-sm mx-auto">
                <div className="absolute -inset-2 bg-gradient-to-br from-slime-pink/10 to-slime-teal/10 rounded-[2.5rem] rotate-1" />
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-full">
                  <Image
                    src="/rj-portrait.jpg"
                    alt="River Jordan Hiatt — Founder of RJ Slime Factory"
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover object-top"
                  />
                </div>
                <div className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-xl shadow-black/8 px-4 py-2.5 border border-gray-100">
                  <p className="font-display font-bold text-slime-teal text-xs">Bend, Oregon</p>
                </div>
              </div>
            </ScrollReveal>
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
            We&apos;re gearing up for launch. Reserve your slimes now and be first to get them.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-10 py-4 bg-white text-slime-dark font-display font-bold rounded-full
              transition-all duration-500 ease-out shadow-xl shadow-white/10 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-white/20 text-[15px]"
          >
            Join the Waitlist <ArrowRight size={16} className="ml-2" />
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
