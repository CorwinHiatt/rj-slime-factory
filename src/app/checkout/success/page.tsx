'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ShoppingBag, Gift, Loader2, Mail, Heart } from 'lucide-react';

interface OrderDetails {
  orderId: string;
  email: string;
  total: number;
  preOrderNumber: number;
  preOrderGoal: number;
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 size={40} className="animate-spin text-slime-purple mx-auto mb-4" />
            <p className="text-gray-500 font-display">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setOrder(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Keep cart intact so customers can continue shopping

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-slime-purple mx-auto mb-4" />
          <p className="text-gray-500 font-display">Confirming your pre-order...</p>
        </div>
      </div>
    );
  }

  const preOrderNumber = order?.preOrderNumber || 0;
  const preOrderGoal = order?.preOrderGoal || 50;
  const spotsLeft = Math.max(preOrderGoal - preOrderNumber, 0);
  const percentage = preOrderNumber > 0 ? Math.min((preOrderNumber / preOrderGoal) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white section-padding">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={48} className="text-green-600" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Thank You for Believing in RJ!</h1>
          <p className="text-gray-500 text-lg mb-2">
            Your pre-order is confirmed and means the world to us.
          </p>
          {order?.email && (
            <p className="text-gray-400 text-sm">
              Confirmation sent to <span className="font-medium text-slime-dark">{order.email}</span>
            </p>
          )}

          {/* Pre-order number */}
          {preOrderNumber > 0 && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slime-purple/10 rounded-full mt-4">
              <span className="text-sm text-gray-500">You&apos;re pre-order #</span>
              <span className="font-display font-bold text-2xl text-slime-purple">
                {preOrderNumber}
                <span className="text-base text-gray-400 font-normal">/{preOrderGoal}</span>
              </span>
            </div>
          )}
        </div>

        {/* Order details */}
        {order && (
          <div className="bg-gradient-to-r from-slime-purple/5 to-slime-pink/5 rounded-2xl p-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Order Number</p>
              <p className="font-display font-bold text-xl text-slime-purple">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Total Charged</p>
              <p className="font-display font-bold text-xl text-slime-dark">${order.total.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Pre-order progress */}
        {preOrderNumber > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold text-sm">Pre-Order Progress</span>
              <span className="text-sm text-slime-purple font-medium">{spotsLeft} spots left</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
              <div
                className="bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal h-3 rounded-full transition-all duration-1000"
                style={{ width: `${Math.max(percentage, 4)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              {preOrderNumber < preOrderGoal
                ? `${spotsLeft} more pre-orders until production begins and your slime ships!`
                : 'We\'ve hit our goal! Production is starting and your slime will ship soon!'}
            </p>
          </div>
        )}

        {/* Founder's gift notice */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slime-yellow/10 to-slime-pink/10 rounded-2xl border border-slime-yellow/20 mb-6">
          <Gift size={20} className="text-slime-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-slime-dark text-sm">Founder&apos;s Gift Secured!</p>
            <p className="text-sm text-gray-500">As one of our first 50 supporters, you&apos;ll receive an exclusive thank-you gift with your order. Thank you for believing in RJ Slime Factory from day one!</p>
          </div>
        </div>

        {/* Estimated timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6">
          <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
            <Heart size={16} className="text-slime-pink" />
            Estimated Timeline
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Pre-order confirmed & payment processed', time: 'Just now', done: true },
              { label: 'Founder\'s gift secured for your order', time: 'Just now', done: true },
              { label: 'Reaching our 50 pre-order goal', time: 'In progress — we\'re getting close!', done: false, active: true },
              { label: 'Production & handcrafting begins', time: 'Estimated 2–4 weeks after goal is met', done: false },
              { label: 'Your slime + founder\'s gift ships!', time: 'Estimated 4–6 weeks from now', done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${s.done ? 'bg-slime-teal' : s.active ? 'bg-slime-yellow ring-4 ring-slime-yellow/20' : 'bg-gray-200'}`} />
                  {i < 4 && <div className={`w-0.5 h-6 ${s.done ? 'bg-slime-teal' : 'bg-gray-200'}`} />}
                </div>
                <div className="-mt-0.5">
                  <p className={`text-sm ${s.done || s.active ? 'font-medium text-slime-dark' : 'text-gray-400'}`}>{s.label}</p>
                  <p className="text-xs text-gray-400">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact info for status updates */}
        <div className="bg-slime-dark rounded-2xl p-6 text-white mb-8 relative overflow-hidden noise">
          <div className="absolute top-0 right-0 w-40 h-40 bg-slime-purple/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h3 className="font-display font-bold text-lg mb-2 flex items-center gap-2">
              <Mail size={18} className="text-slime-teal" />
              Questions About Your Order?
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              Want to check on the status of RJ Slime Factory or your pre-order? Reach out to any of us — we&apos;re happy to keep you in the loop!
            </p>
            <div className="space-y-2.5">
              {[
                { name: 'Corwin', email: 'corwin@coleesoftwareservices.com', role: 'Operations' },
                { name: 'Lea', email: 'lea@coleesoftwareservices.com', role: 'Customer Support' },
                { name: 'Hannah', email: 'hronquillo7@gmail.com', role: 'Order Support' },
              ].map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slime-pink to-slime-purple flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{contact.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{contact.name} <span className="text-gray-500 font-normal">&middot; {contact.role}</span></p>
                    <p className="text-xs text-slime-teal group-hover:underline truncate">{contact.email}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary gap-2">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link href="/contact" className="btn-secondary gap-2">
            Contact Us
          </Link>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Thank you for supporting a young entrepreneur. RJ can&apos;t wait to get slime in your hands!
        </p>
      </div>
    </div>
  );
}
