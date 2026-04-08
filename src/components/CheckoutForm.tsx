'use client';

import { useState, useCallback, useEffect, useRef, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  CreditCard,
  Truck,
  Check,
  ShieldCheck,
  Package,
  AlertCircle,
  Loader2,
  ShoppingBag,
  ChevronRight,
  Mail,
  Zap,
  Clock,
  Gift,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

/* ================================================================
   TYPES
   ================================================================ */

interface ShippingData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: typeof Truck;
}

type CheckoutStep = 'information' | 'shipping' | 'review';

/* ================================================================
   CONSTANTS
   ================================================================ */

const SAVED_SHIPPING_KEY = 'rj-slime-saved-shipping';
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.0; // Oregon — no sales tax

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'USPS Priority Mail',
    price: 8.99,
    estimatedDays: '5–7 business days',
    icon: Package,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'USPS Express Mail',
    price: 18.99,
    estimatedDays: '2–3 business days',
    icon: Zap,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'FedEx Overnight',
    price: 34.99,
    estimatedDays: 'Next business day',
    icon: Clock,
  },
];

const US_STATES = [
  { value: '', label: 'State' },
  { value: 'AL', label: 'Alabama' },{ value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },{ value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },{ value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },{ value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },{ value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },{ value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },{ value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },{ value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },{ value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },{ value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },{ value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },{ value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },{ value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },{ value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },{ value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },{ value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },{ value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },{ value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },{ value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },{ value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },{ value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },{ value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },{ value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },{ value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'Washington DC' },
];

const STEPS: { key: CheckoutStep; label: string; num: number }[] = [
  { key: 'information', label: 'Information', num: 1 },
  { key: 'shipping', label: 'Shipping', num: 2 },
  { key: 'review', label: 'Review & Pay', num: 3 },
];

/* ================================================================
   UTILITIES
   ================================================================ */

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return '';
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function loadSavedShipping(): Partial<ShippingData> | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(SAVED_SHIPPING_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveSavedShipping(data: ShippingData) {
  try { localStorage.setItem(SAVED_SHIPPING_KEY, JSON.stringify(data)); } catch {}
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, isLoaded } = useCart();
  const formRef = useRef<HTMLFormElement>(null);

  // Steps
  const [step, setStep] = useState<CheckoutStep>('information');
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());

  // Shipping
  const [shipping, setShipping] = useState<ShippingData>({
    email: '', firstName: '', lastName: '', phone: '',
    address: '', apartment: '', city: '', state: '', zip: '', country: 'US',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');

  // Payment redirect
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  // Calculated totals
  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShippingMethod) || SHIPPING_METHODS[0];
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = freeShipping && shippingMethod.id === 'standard' ? 0 : shippingMethod.price;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  // Load saved shipping on mount
  useEffect(() => {
    const saved = loadSavedShipping();
    if (saved) {
      setShipping((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  // Redirect if empty
  useEffect(() => {
    if (isLoaded && items.length === 0) {
      router.push('/shop');
    }
  }, [isLoaded, items.length, router]);

  /* ──────────── Validation ──────────── */

  const validateInformation = useCallback((): boolean => {
    const errors: Partial<Record<keyof ShippingData, string>> = {};
    if (!shipping.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(shipping.email)) errors.email = 'Enter a valid email';
    if (!shipping.firstName.trim()) errors.firstName = 'Required';
    if (!shipping.lastName.trim()) errors.lastName = 'Required';
    if (!shipping.address.trim()) errors.address = 'Address is required';
    if (!shipping.city.trim()) errors.city = 'Required';
    if (!shipping.state) errors.state = 'Required';
    if (!shipping.zip.trim()) errors.zip = 'Required';
    else if (!/^\d{5}(-\d{4})?$/.test(shipping.zip)) errors.zip = 'Invalid ZIP';
    if (shipping.phone && shipping.phone.replace(/\D/g, '').length < 10) errors.phone = 'Invalid phone';
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  }, [shipping]);

  /* ──────────── Navigation ──────────── */

  const goTo = (target: CheckoutStep) => {
    setStep(target);
    setServerErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInformationSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateInformation()) {
      saveSavedShipping(shipping);
      setCompletedSteps((prev) => new Set(prev).add('information'));
      goTo('shipping');
    }
  };

  const handleShippingSubmit = () => {
    setCompletedSteps((prev) => new Set(prev).add('shipping'));
    goTo('review');
  };

  /* ──────────── Stripe Checkout ──────────── */

  const handleStripeCheckout = async () => {
    setIsRedirecting(true);
    setServerErrors([]);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            image: i.product.image,
          })),
          shipping,
          shippingMethodId: selectedShippingMethod,
          shippingCost,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setServerErrors([data.error || 'Something went wrong. Please try again.']);
        setIsRedirecting(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setServerErrors(['Unable to create payment session. Please try again.']);
        setIsRedirecting(false);
      }
    } catch {
      setServerErrors(['Network error. Please check your connection and try again.']);
      setIsRedirecting(false);
    }
  };

  /* ──────────── Field helpers ──────────── */

  const updateShipping = (field: keyof ShippingData, value: string) => {
    setShipping((p) => ({ ...p, [field]: value }));
    if (shippingErrors[field]) setShippingErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  /* ──────────── Guards ──────────── */

  if (!isLoaded) {
    return (
      <div className="section-padding max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-slime-purple mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  /* ──────────── REDIRECTING TO STRIPE ──────────── */

  if (isRedirecting) {
    return (
      <div className="section-padding max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-slime-purple/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-t-slime-purple border-r-slime-pink border-b-slime-teal border-l-transparent animate-spin" />
          </div>
          <Lock size={24} className="absolute inset-0 m-auto text-slime-purple" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Redirecting to Secure Payment</h2>
        <p className="text-gray-500 text-sm mb-4">You&apos;re being redirected to Stripe&apos;s secure payment page...</p>
        <p className="text-xs text-gray-400">Your card details are handled entirely by Stripe. We never see your card number.</p>
        <div className="flex items-center gap-2 mt-8 text-xs text-gray-400">
          <ShieldCheck size={14} />
          <span>256-bit SSL encrypted &middot; PCI compliant</span>
        </div>
      </div>
    );
  }

  /* ──────────── MAIN CHECKOUT LAYOUT ──────────── */

  return (
    <div className="section-padding max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/shop" className="text-slime-purple hover:underline">Shop</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-400">Pre-Order Checkout</span>
      </div>

      {/* Step progress bar */}
      <div className="flex items-center gap-1 mb-8">
        {STEPS.map((s, i) => {
          const isActive = s.key === step;
          const isDone = completedSteps.has(s.key);
          return (
            <div key={s.key} className="flex items-center gap-1 flex-1">
              <button
                onClick={() => isDone ? goTo(s.key) : undefined}
                disabled={!isDone}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all w-full justify-center ${
                  isActive
                    ? 'bg-slime-purple text-white shadow-lg shadow-slime-purple/20'
                    : isDone
                    ? 'bg-slime-teal/10 text-slime-teal cursor-pointer hover:bg-slime-teal/20'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
              >
                {isDone && !isActive ? <Check size={14} /> : <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{s.num}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`hidden sm:block w-8 h-0.5 flex-shrink-0 ${isDone ? 'bg-slime-teal' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* ──────── LEFT COLUMN: FORMS ──────── */}
        <div className="lg:col-span-3">

          {/* ═══ STEP 1: INFORMATION ═══ */}
          {step === 'information' && (
            <div className="animate-fade-in">
              {/* Contact & shipping form */}
              <form onSubmit={handleInformationSubmit} ref={formRef} autoComplete="on">
                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <Mail size={18} className="text-slime-purple" />
                  Contact Information
                </h2>

                <div className="space-y-3 mb-8">
                  <Input label="Email" value={shipping.email} onChange={(v) => updateShipping('email', v)} error={shippingErrors.email} type="email" autoComplete="email" placeholder="you@example.com" />
                  <Input label="Phone (optional)" value={shipping.phone} onChange={(v) => updateShipping('phone', formatPhone(v))} error={shippingErrors.phone} type="tel" autoComplete="tel" placeholder="(555) 123-4567" />
                </div>

                <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                  <Truck size={18} className="text-slime-purple" />
                  Shipping Address
                </h2>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="First name" value={shipping.firstName} onChange={(v) => updateShipping('firstName', v)} error={shippingErrors.firstName} autoComplete="given-name" />
                    <Input label="Last name" value={shipping.lastName} onChange={(v) => updateShipping('lastName', v)} error={shippingErrors.lastName} autoComplete="family-name" />
                  </div>
                  <Input label="Address" value={shipping.address} onChange={(v) => updateShipping('address', v)} error={shippingErrors.address} autoComplete="address-line1" />
                  <Input label="Apartment, suite, etc. (optional)" value={shipping.apartment} onChange={(v) => updateShipping('apartment', v)} autoComplete="address-line2" />
                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3">
                      <Input label="City" value={shipping.city} onChange={(v) => updateShipping('city', v)} error={shippingErrors.city} autoComplete="address-level2" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                      <select
                        value={shipping.state}
                        onChange={(e) => updateShipping('state', e.target.value)}
                        autoComplete="address-level1"
                        name="state"
                        className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple ${shippingErrors.state ? 'border-red-400' : 'border-gray-200'}`}
                      >
                        {US_STATES.map((s) => <option key={s.value} value={s.value}>{s.value || '—'}</option>)}
                      </select>
                      {shippingErrors.state && <p className="text-xs text-red-500 mt-1">{shippingErrors.state}</p>}
                    </div>
                    <div className="col-span-2">
                      <Input label="ZIP" value={shipping.zip} onChange={(v) => updateShipping('zip', v.replace(/[^\d-]/g, '').slice(0, 10))} error={shippingErrors.zip} autoComplete="postal-code" placeholder="97701" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full mt-8 gap-2">
                  Continue to Shipping
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}

          {/* ═══ STEP 2: SHIPPING METHOD ═══ */}
          {step === 'shipping' && (
            <div className="animate-fade-in">
              {/* Show address summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-start justify-between">
                <div className="text-sm text-gray-600">
                  <p className="text-xs text-gray-400 mb-1">Ship to</p>
                  <p className="font-medium text-slime-dark">{shipping.firstName} {shipping.lastName}</p>
                  <p>{shipping.address}{shipping.apartment && `, ${shipping.apartment}`}, {shipping.city}, {shipping.state} {shipping.zip}</p>
                </div>
                <button onClick={() => goTo('information')} className="text-xs text-slime-purple hover:underline font-medium whitespace-nowrap ml-4">Change</button>
              </div>

              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <Truck size={18} className="text-slime-purple" />
                Shipping Method
              </h2>

              <div className="space-y-3">
                {SHIPPING_METHODS.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedShippingMethod === method.id;
                  const isFree = freeShipping && method.id === 'standard';
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedShippingMethod(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-slime-purple bg-slime-purple/5 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-slime-purple text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-semibold text-sm">{method.name}</p>
                          {isFree && <span className="px-2 py-0.5 bg-slime-teal/10 text-slime-teal text-[10px] font-bold uppercase rounded-full">Free</span>}
                        </div>
                        <p className="text-xs text-gray-400">{method.description} &middot; {method.estimatedDays}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {isFree ? (
                          <div>
                            <p className="font-display font-bold text-slime-teal text-sm">FREE</p>
                            <p className="text-xs text-gray-400 line-through">${method.price.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="font-display font-bold text-sm">${method.price.toFixed(2)}</p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-slime-purple' : 'border-gray-200'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-slime-purple" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => goTo('information')} className="btn-secondary flex-1 gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={handleShippingSubmit} className="btn-primary flex-1 gap-2">
                  Review Order <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: REVIEW & PAY ═══ */}
          {step === 'review' && (
            <div className="animate-fade-in">
              {/* Summary bars */}
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-sm"><span className="text-gray-400">Contact: </span><span className="text-slime-dark">{shipping.email}</span></div>
                  <button onClick={() => goTo('information')} className="text-xs text-slime-purple hover:underline font-medium">Change</button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-sm"><span className="text-gray-400">Ship to: </span><span className="text-slime-dark">{shipping.address}, {shipping.city} {shipping.state}</span></div>
                  <button onClick={() => goTo('information')} className="text-xs text-slime-purple hover:underline font-medium">Change</button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between">
                  <div className="text-sm"><span className="text-gray-400">Method: </span><span className="text-slime-dark">{shippingMethod.name} &middot; {freeShipping && shippingMethod.id === 'standard' ? 'FREE' : `$${shippingMethod.price.toFixed(2)}`}</span></div>
                  <button onClick={() => goTo('shipping')} className="text-xs text-slime-purple hover:underline font-medium">Change</button>
                </div>
              </div>

              {serverErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>{serverErrors.map((err, i) => <p key={i} className="text-sm text-red-600">{err}</p>)}</div>
                  </div>
                </div>
              )}

              {/* Pre-order notice */}
              <div className="p-4 rounded-xl bg-slime-purple/5 border border-slime-purple/20 mb-6">
                <p className="text-sm text-slime-dark font-medium mb-1">This is a pre-order</p>
                <p className="text-xs text-gray-500">Your payment will be processed securely through Stripe. Your slime ships once we reach 50 pre-orders. Every pre-order includes an exclusive founder&apos;s gift!</p>
              </div>

              {/* Founder's gift banner */}
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-slime-yellow/10 to-slime-pink/10 rounded-xl border border-slime-yellow/20 mb-6">
                <Gift size={18} className="text-slime-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-display font-bold text-slime-dark">Exclusive Founder&apos;s Gift Included</p>
                  <p className="text-xs text-gray-500">Thank you for believing in RJ Slime Factory!</p>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-green-50 border border-green-200 mb-6 text-xs text-green-700">
                <ShieldCheck size={16} className="flex-shrink-0" />
                <span>Secure payment via Stripe &mdash; your card info never touches our servers</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => goTo('shipping')} className="btn-secondary flex-1 gap-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleStripeCheckout}
                  disabled={isRedirecting}
                  className="btn-primary flex-1 gap-2 disabled:opacity-60"
                >
                  <Lock size={16} />
                  Pre-Order &middot; ${total.toFixed(2)}
                </button>
              </div>

              <p className="text-center text-[11px] text-gray-400 mt-4">
                You&apos;ll be redirected to Stripe&apos;s secure payment page to enter your card details.
              </p>
            </div>
          )}
        </div>

        {/* ──────── RIGHT COLUMN: ORDER SUMMARY ──────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-slime-purple" />
              Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 opacity-45 mix-blend-color"
                      style={{ backgroundColor: item.product.tintColor }}
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-slime-purple text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.product.category} slime</p>
                  </div>
                  <p className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-medium ${shippingCost === 0 ? 'text-slime-teal' : ''}`}>
                  {step === 'information' ? (
                    <span className="text-gray-400 text-xs">Calculated next step</span>
                  ) : shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium text-gray-400 text-xs">$0.00 (OR — no tax)</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-xl">
                  <span className="text-xs text-gray-400 font-normal mr-1">USD</span>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Free shipping progress */}
            {!freeShipping && (
              <div className="mt-4 p-3 rounded-xl bg-slime-cream">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} away from free shipping</span>
                  <span className="font-medium text-slime-teal">${FREE_SHIPPING_THRESHOLD}</span>
                </div>
                <div className="w-full bg-white rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-slime-pink to-slime-teal h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {freeShipping && (
              <div className="mt-4 p-2.5 bg-slime-teal/10 rounded-xl text-center">
                <p className="text-xs text-slime-teal font-medium flex items-center justify-center gap-1">
                  <Check size={14} /> You qualify for FREE standard shipping!
                </p>
              </div>
            )}

            {/* Trust */}
            <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
              {[
                { icon: Lock, label: 'Secure Checkout' },
                { icon: ShieldCheck, label: 'Stripe Protected' },
                { icon: CreditCard, label: 'PCI Compliant' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-gray-400">
                  <Icon size={14} />
                  <span className="text-[10px] text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   INPUT COMPONENT
   ================================================================ */

function Input({
  label, value, onChange, error, type = 'text', placeholder, autoComplete, inputMode, maxLength, name,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
  name?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        name={name || autoComplete}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple ${
          error ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={10} />{error}
        </p>
      )}
    </div>
  );
}
