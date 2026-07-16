'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group bg-white rounded-[1.25rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/8 transition-all duration-500 ease-out hover:-translate-y-1">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Color tint overlay */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-color transition-opacity duration-500"
          style={{ backgroundColor: product.tintColor }}
        />
        <div
          className="absolute inset-0 opacity-15 mix-blend-overlay"
          style={{ backgroundColor: product.tintColor }}
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3.5 left-3.5 bg-slime-dark text-white text-[10px] font-display font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
            {product.badge}
          </span>
        )}
        {/* Quick Add - appears on hover */}
        <div className="absolute inset-x-3.5 bottom-3.5 z-10 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 ease-out">
          <button
            onClick={() => addItem(product)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur-sm text-slime-dark font-display font-semibold text-sm rounded-xl
              shadow-lg hover:bg-slime-dark hover:text-white transition-all duration-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={16} strokeWidth={2.5} />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-medium text-slime-purple/70 uppercase tracking-[0.15em] mb-1.5">
          {product.category}
        </p>
        <h3 className="font-display font-bold text-base text-slime-dark mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="text-gray-400 text-[13px] mb-3 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
          <span className="font-display font-bold text-lg text-slime-dark">
            ${product.price.toFixed(2)}
          </span>
          {product.scent && (
            <span className="text-[11px] text-gray-400 font-medium">
              {product.scent}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
