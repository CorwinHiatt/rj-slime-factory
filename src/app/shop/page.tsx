'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products, categories, type SlimeCategory } from '@/data/products';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as SlimeCategory | null;

  const [activeCategory, setActiveCategory] = useState<SlimeCategory | 'all'>(
    initialCategory || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const filteredProducts = useMemo(() => {
    let filtered =
      activeCategory === 'all'
        ? [...products]
        : products.filter((p) => p.category === activeCategory);

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return filtered;
  }, [activeCategory, sortBy]);

  return (
    <>
      {/* Page Header */}
      <section className="bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding pb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
            Shop <span className="gradient-text">All Slimes</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Browse our full collection. Every slime is handcrafted, scented, and ready to ship.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full font-display font-medium text-sm transition-all ${
                activeCategory === 'all'
                  ? 'bg-slime-purple text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({products.length})
            </button>
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-display font-medium text-sm transition-all ${
                    activeCategory === cat.id
                      ? 'bg-slime-purple text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slime-purple/30 font-body"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-400 mb-6">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-xl text-gray-400">
              No slimes found in this category yet!
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="btn-primary mt-4"
            >
              View All Slimes
            </button>
          </div>
        )}
      </section>

      {/* Slime Care Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-slime-purple/5 to-slime-pink/5 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            First Time Buying Slime?
          </h3>
          <p className="text-gray-500 max-w-lg mx-auto mb-6">
            Check out our slime care guide to learn how to keep your slime fresh, stretchy, and satisfying for weeks.
          </p>
          <a href="/about#slime-care" className="btn-secondary text-sm">
            Read Slime Care Guide
          </a>
        </div>
      </section>
    </>
  );
}
