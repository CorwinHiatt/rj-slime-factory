'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } =
    useCart();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-slime-purple" />
            <h2 className="font-display font-bold text-xl">
              Your Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-slime-pink/10 flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-slime-pink" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                Time to fill it with some amazing slime!
              </p>
              <button onClick={closeCart} className="btn-primary text-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-gray-50 animate-fade-in"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 opacity-45 mix-blend-color"
                      style={{ backgroundColor: item.product.tintColor }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-sm truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.product.category} slime
                    </p>
                    <p className="font-display font-bold text-slime-pink mt-1">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="p-0.5 text-gray-500 hover:text-slime-purple transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="p-0.5 text-gray-500 hover:text-slime-purple transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 space-y-4">
            {/* Free shipping progress */}
            {subtotal < 50 && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">
                    ${(50 - subtotal).toFixed(2)} away from free shipping
                  </span>
                  <span className="font-medium text-slime-teal">$50.00</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-slime-pink to-slime-teal h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= 50 && (
              <p className="text-sm text-slime-teal font-medium text-center">
                You&apos;ve unlocked FREE shipping!
              </p>
            )}

            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-lg">Subtotal</span>
              <span className="font-display font-bold text-xl">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full text-center">
              Reserve Now - ${subtotal.toFixed(2)}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Join the waitlist &middot; No charge until we ship
            </p>
          </div>
        )}
      </div>
    </>
  );
}
