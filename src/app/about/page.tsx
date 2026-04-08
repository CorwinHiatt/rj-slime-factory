import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Shield, Leaf, Gift } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About RJ Slime Factory - Meet River Jordan Hiatt',
  description:
    'Meet River Jordan Hiatt, the young entrepreneur behind RJ Slime Factory in Bend, Oregon. Learn about our pre-order model, how your support funds our first production run, and the exclusive founder\'s gift for our first 50 supporters.',
  keywords: [
    'RJ Slime Factory about',
    'River Jordan Hiatt',
    'slime maker Bend Oregon',
    'young entrepreneur slime',
    'handcrafted slime story',
    'slime pre-order',
    'slime care guide',
    'how to care for slime',
  ],
  openGraph: {
    title: 'About RJ Slime Factory | Meet the Young Founder - Bend, OR',
    description:
      'Meet River Jordan Hiatt, the young entrepreneur behind RJ Slime Factory. Pre-order now to help fund his first production run of handcrafted slime.',
    url: 'https://rjslime.xyz/about',
  },
  alternates: {
    canonical: 'https://rjslime.xyz/about',
  },
};

const values = [
  {
    icon: Heart,
    title: 'Passion First',
    description: 'Every slime is made with genuine love for the craft. We obsess over getting the perfect texture.',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'Only the best ingredients. No shortcuts, no compromises. You can feel the difference.',
  },
  {
    icon: Shield,
    title: 'Safe & Non-Toxic',
    description: 'All our slimes are made with non-toxic, skin-safe ingredients. Fun for all ages.',
  },
  {
    icon: Leaf,
    title: 'Eco-Conscious',
    description: 'Recyclable packaging and sustainable practices. Good slime, good planet.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'The Slime Obsession Begins',
    description: 'RJ discovers slime and quickly becomes the go-to slime expert among friends and family. Testing every texture, every brand — he knows what makes a slime truly satisfying.',
  },
  {
    year: '2024',
    title: 'From Tester to Creator',
    description: 'After years of testing, RJ starts creating his own recipes. Friends and family are blown away by the quality — and they keep asking for more.',
  },
  {
    year: '2025',
    title: 'RJ Slime Factory Is Born',
    description: 'The idea becomes a real business plan. RJ begins perfecting his signature line of handcrafted slimes in Bend, Oregon, with a vision to share them with the world.',
  },
  {
    year: '2026',
    title: 'Pre-Orders Launch',
    description: 'RJ Slime Factory opens pre-orders for the first 50 supporters. Every pre-order directly funds manufacturing — and includes an exclusive founder\'s gift as a thank you for believing in the dream.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-slime-pink/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-slime-teal/15 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-slime-purple/10 text-slime-purple font-display font-semibold text-sm rounded-full mb-6">
                Our Story
              </span>
              <h1 className="font-display text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                Meet{' '}
                <span className="gradient-text">RJ</span>
              </h1>
              <h2 className="font-display text-2xl font-semibold text-gray-700 mb-6">
                River Jordan Hiatt &mdash; Young Entrepreneur &amp; Slime Creator
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                River Jordan Hiatt is a young entrepreneur with a passion that runs deep. After years of testing every slime texture on the market, RJ decided it was time to stop just buying slime &mdash; and start making it. He knows exactly what makes a slime satisfying: the perfect stretch, the right texture, the ideal sound.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                But turning a dream into a business takes support. That&apos;s why RJ Slime Factory runs on a pre-order model: <strong>the first 50 orders directly fund our initial production run.</strong> Every pre-order is an investment in a young creator&apos;s vision &mdash; and every supporter receives an exclusive founder&apos;s gift as our way of saying thank you for the faith and belief in RJSLIME.
              </p>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slime-yellow/10 to-slime-pink/10 rounded-xl border border-slime-yellow/20">
                <Gift size={20} className="text-slime-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-display font-bold text-slime-dark text-sm">Exclusive Founder&apos;s Gift</p>
                  <p className="text-sm text-gray-500">Every one of our first 50 pre-orders includes a special gift — our heartfelt thank you for believing in RJ and supporting a young entrepreneur from day one.</p>
                </div>
              </div>
            </div>

            <div className="relative max-w-[400px] mx-auto">
              {/* Animated gradient glow */}
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-slime-pink via-slime-purple to-slime-teal opacity-30 blur-xl animate-pulse" />
              <div className="absolute -inset-2 rounded-[2.8rem] bg-gradient-to-tr from-slime-teal via-slime-purple to-slime-pink opacity-20 rotate-3" />

              {/* Photo with gradient overlay */}
              <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl shadow-slime-purple/20">
                <div className="absolute inset-0 bg-gradient-to-br from-slime-purple/90 via-indigo-600/80 to-slime-pink/70 z-10 mix-blend-color" />
                <div className="absolute inset-0 bg-gradient-to-t from-slime-dark/60 via-transparent to-transparent z-10" />
                <Image
                  src="/rj-portrait.jpg"
                  alt="River Jordan Hiatt - Young Founder of RJ Slime Factory"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating sparkle */}
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-slime-pink to-slime-purple flex items-center justify-center shadow-lg shadow-slime-pink/30">
                <Sparkles size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              What We <span className="gradient-text">Stand For</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-3xl p-8 text-center card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slime-pink/10 to-slime-purple/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon size={24} className="text-slime-purple" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gradient-to-b from-white to-purple-50/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slime-pink via-slime-purple to-slime-teal" />

            <div className="space-y-10">
              {timeline.map((item) => (
                <div key={item.year} className="relative flex gap-8">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center z-10">
                    <span className="font-display font-bold text-slime-purple text-sm">
                      {item.year}
                    </span>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-display font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Slime Care Guide */}
      <section id="slime-care" className="section-padding bg-white scroll-mt-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
              Slime <span className="gradient-text">Care Guide</span>
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Keep your slime fresh and satisfying with these simple tips.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'Storage',
                tip: 'Always store slime in its sealed container at room temperature. Avoid direct sunlight and extreme heat.',
              },
              {
                title: 'Sticky Slime?',
                tip: 'Add a small pump of activator (contact lens solution with boric acid) and knead until smooth.',
              },
              {
                title: 'Hard or Stiff?',
                tip: 'Add a few drops of warm water or lotion and knead well. Your slime will soften right up.',
              },
              {
                title: 'Clean Hands',
                tip: 'Always wash and dry your hands before playing. Oils and dirt affect texture and longevity.',
              },
              {
                title: 'Lifespan',
                tip: 'With proper care, most slimes last 2-4 weeks. Cloud and butter slimes may change texture over time.',
              },
              {
                title: 'Not Edible',
                tip: 'Our slime is non-toxic but not meant for consumption. Keep away from mouths and eyes.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
              >
                <h4 className="font-display font-bold text-base mb-2 text-slime-dark">
                  {item.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Be Part of Our First 50
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Pre-order your favorites and help fund RJ&apos;s dream. Every supporter gets an exclusive founder&apos;s gift.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-10 py-4 bg-white text-slime-purple font-display font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-lg"
          >
            Pre-Order Now <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </>
  );
}
