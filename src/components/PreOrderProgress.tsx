'use client';

import { useState, useEffect } from 'react';
import { Gift, Users, Target } from 'lucide-react';

interface PreOrderProgressProps {
  variant?: 'default' | 'compact' | 'hero';
  showGift?: boolean;
}

export default function PreOrderProgress({ variant = 'default', showGift = true }: PreOrderProgressProps) {
  const [count, setCount] = useState(0);
  const goal = 50;

  useEffect(() => {
    fetch('/api/preorder-count')
      .then((res) => res.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, []);

  const percentage = Math.min((count / goal) * 100, 100);
  const spotsLeft = Math.max(goal - count, 0);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slime-purple/8 rounded-xl">
        <Target size={16} className="text-slime-purple flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-display font-semibold text-slime-dark">{count}/{goal} Pre-Orders</span>
            <span className="text-slime-purple font-medium">{spotsLeft} spots left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal h-1.5 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-6 max-w-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slime-pink to-slime-purple flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-slime-dark text-sm">Pre-Order Campaign</p>
            <p className="text-xs text-gray-400">First 50 orders fund our first production run</p>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-display font-bold text-2xl text-slime-purple">{count}<span className="text-base text-gray-400 font-normal">/{goal}</span></span>
            <span className="text-xs font-medium text-slime-teal bg-slime-teal/10 px-2.5 py-1 rounded-full">{spotsLeft} spots left</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{ width: `${Math.max(percentage, 2)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {showGift && (
          <div className="flex items-start gap-2.5 mt-4 p-3 bg-gradient-to-r from-slime-yellow/10 to-slime-pink/10 rounded-xl border border-slime-yellow/20">
            <Gift size={16} className="text-slime-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-display font-bold text-slime-dark">Exclusive Founder&apos;s Gift</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">First 50 pre-orders receive a special thank-you gift for believing in RJ Slime Factory from day one.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-gradient-to-r from-slime-purple/5 to-slime-pink/5 rounded-2xl p-6 border border-slime-purple/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-slime-purple" />
          <span className="font-display font-bold text-slime-dark">Pre-Order Progress</span>
        </div>
        <span className="text-sm font-medium text-slime-purple">{count}/{goal}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
        <div
          className="bg-gradient-to-r from-slime-pink via-slime-purple to-slime-teal h-3 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{spotsLeft} spots remaining</span>
        <span>Shipping begins at 50 orders</span>
      </div>

      {showGift && (
        <div className="flex items-start gap-2.5 mt-4 p-3 bg-white rounded-xl">
          <Gift size={16} className="text-slime-yellow flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-slime-dark">Exclusive gift</span> included with every pre-order &mdash; our thank you for believing in RJ Slime Factory!
          </p>
        </div>
      )}
    </div>
  );
}
