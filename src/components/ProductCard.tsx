'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group card-hover bg-white rounded-3xl overflow-hidden shadow-md">
      {/* Image */}
      <div className="product-image-wrapper">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Color tint overlay - shows accurate product color */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-color"
          style={{ backgroundColor: product.tintColor }}
        />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundColor: product.tintColor }}
        />
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-slime-pink text-white text-xs font-display font-bold px-3 py-1 rounded-full shadow-md z-10">
            {product.badge}
          </span>
        )}
        {/* Quick Add */}
        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-slime-dark p-3 rounded-full shadow-lg
            opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300
            hover:bg-slime-purple hover:text-white z-10"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="text-xs font-medium text-slime-purple uppercase tracking-wider mb-1">
          {product.category} slime
        </p>
        <h3 className="font-display font-bold text-lg text-slime-dark mb-1 group-hover:text-slime-pink transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-xl text-slime-dark">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            className="btn-cart text-xs"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
