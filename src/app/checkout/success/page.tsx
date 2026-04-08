'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, ShoppingBag, Printer, Gift, Loader2, AlertCircle } from 'lucide-react';

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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('No session found. If you just completed a pre-order, check your email for confirmation.');
      setLoading(false);
      return;
    }

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
      })
      .catch(() => {
        setError('Unable to verify your order. If you completed payment, check your email for confirmation.');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Clear cart after successful payment
  useEffect(() => {
    if (order) {
      try {
        localStorage.removeItem('rj-slime-cart');
      } catch {}
    }
  }, [order]);

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

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white section-padding">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-amber-600" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">Order Status Pending</h1>
          <p className="text-gray-500 mb-8">{error || 'Unable to verify order.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary gap-2">
              <ShoppingBag size={16} /> Continue Shopping
            </Link>
            <Link href="/contact" className="btn-secondary">Contact Support</Link>
          </div>
        </div>
      </div>
    );
  }

  const spotsLeft = Math.max(order.preOrderGoal - order.preOrderNumber, 0);
  const percentage = Math.min((order.preOrderNumber / order.preOrderGoal) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slime-cream to-white section-padding">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={40} className="text-green-600" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Pre-Order Confirmed!</h1>
          <p className="text-gray-500 mb-4">
            Confirmation sent to <span className="font-medium text-slime-dark">{order.email}</span>
          </p>

          {/* Pre-order number */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slime-purple/10 rounded-full">
            <span className="text-sm text-gray-500">Pre-order #</span>
            <span className="font-display font-bold text-2xl text-slime-purple">
              {order.preOrderNumber}
              <span className="text-base text-gray-400 font-normal">/{order.preOrderGoal}</span>
            </span>
          </div>
        </div>

        {/* Order ID */}
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

        {/* Pre-order progress */}
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
            {order.preOrderNumber < order.preOrderGoal
              ? `${order.preOrderGoal - order.preOrderNumber} more pre-orders until production begins and your slime ships!`
              : 'We\'ve hit our goal! Production is starting and your slime will ship soon!'}
          </p>
        </div>

        {/* Founder's gift notice */}
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slime-yellow/10 to-slime-pink/10 rounded-2xl border border-slime-yellow/20 mb-6">
          <Gift size={20} className="text-slime-yellow flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-display font-bold text-slime-dark text-sm">Founder&apos;s Gift Secured!</p>
            <p className="text-sm text-gray-500">As one of our first {order.preOrderGoal} supporters, you&apos;ll receive an exclusive thank-you gift with your order. Thank you for believing in RJ Slime Factory!</p>
          </div>
        </div>

        {/* What happens next */}
        <div className="bg-gradient-to-r from-slime-teal/5 to-slime-purple/5 rounded-2xl p-5 mb-8">
          <h3 className="font-display font-bold text-sm mb-4">What Happens Next</h3>
          <div className="space-y-4">
            {[
              { label: 'Pre-order confirmed & payment processed', time: 'Just now', done: true },
              { label: 'Founder\'s gift secured for your order', time: 'Just now', done: true },
              { label: 'Reaching our 50 pre-order goal', time: 'In progress', done: false, active: true },
              { label: 'Production begins', time: 'At 50 orders', done: false },
              { label: 'Your slime + founder\'s gift ships', time: 'After production', done: false },
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary gap-2">
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
          <button onClick={() => window.print()} className="btn-secondary gap-2">
            <Printer size={16} /> Print Receipt
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions about your order? <Link href="/contact" className="text-slime-purple hover:underline">Contact us</Link>
        </p>
      </div>
    </div>
  );
}
