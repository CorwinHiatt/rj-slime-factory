import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Shield, Leaf } from 'lucide-react';

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
    year: '2023',
    title: 'The First Batch',
    description: 'Started making slime as a hobby in the kitchen. Friends and family couldn\'t get enough.',
  },
  {
    year: '2024',
    title: 'Going Online',
    description: 'Launched our first online shop. Sold out our first drop in under 30 minutes.',
  },
  {
    year: '2025',
    title: 'Growing Community',
    description: 'Built an amazing community of slime lovers. Expanded to 20+ unique textures.',
  },
  {
    year: '2026',
    title: 'The Factory',
    description: 'Moved into our dedicated slime studio. More drops, more textures, more fun.',
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
                Made with{' '}
                <span className="gradient-text">Heart</span>,{' '}
                Played with Joy
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                RJ Slime Factory started with a simple idea: make the most satisfying slime on the planet. What began as a kitchen experiment quickly became a passion, and that passion became a business.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we handcraft every single batch with premium ingredients, custom scents, and textures that are pure ASMR magic. We&apos;re not the biggest slime shop, but we&apos;re working to be the best.
              </p>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/6144305/pexels-photo-6144305.jpeg?w=800"
                  alt="Handcrafting slime at RJ Slime Factory"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
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
            Come Get Slimy With Us
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Browse our latest drops and find your new favorite texture.
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
