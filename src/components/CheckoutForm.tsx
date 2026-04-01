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
  MapPin,
  AlertCircle,
  Loader2,
  ShoppingBag,
  ChevronRight,
  X,
  Wallet,
  Smartphone,
  Mail,
  Printer,
  Copy,
  CheckCircle2,
  Zap,
  Clock,
  Star,
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

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
  saveCard: boolean;
}

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  name: string;
  expiry: string;
  token: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: typeof Truck;
}

interface OrderConfirmation {
  id: string;
  email: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  itemCount: number;
  estimatedDelivery: string;
  shippingMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
  items: { name: string; quantity: number; price: number; image: string; tintColor: string }[];
}

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'processing' | 'confirmation';

/* ================================================================
   CONSTANTS
   ================================================================ */

const SAVED_CARDS_KEY = 'rj-slime-saved-cards';
const SAVED_SHIPPING_KEY = 'rj-slime-saved-shipping';
const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.0; // Oregon — no sales tax

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'USPS Priority Mail',
    price: 5.99,
    estimatedDays: '5–7 business days',
    icon: Package,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'USPS Express Mail',
    price: 12.99,
    estimatedDays: '2–3 business days',
    icon: Zap,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'FedEx Overnight',
    price: 24.99,
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
  { key: 'payment', label: 'Payment', num: 3 },
];

/* ================================================================
   UTILITIES
   ================================================================ */

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length >= 4) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length > 0) return `(${digits}`;
  return '';
}

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let even = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (even) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    even = !even;
  }
  return sum % 10 === 0;
}

function getCardBrand(num: string): string {
  const d = num.replace(/\D/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  if (/^6(?:011|5)/.test(d)) return 'discover';
  return '';
}

function getCardBrandLabel(brand: string): string {
  const labels: Record<string, string> = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover' };
  return labels[brand] || 'Card';
}

function getCardBrandColor(brand: string): string {
  const colors: Record<string, string> = { visa: '#1A1F71', mastercard: '#EB001B', amex: '#006FCF', discover: '#FF6000' };
  return colors[brand] || '#6B7280';
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generateToken(): string {
  return `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RJS-${ts}-${r}`;
}

function loadSavedCards(): SavedCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const s = localStorage.getItem(SAVED_CARDS_KEY);
    return s ? JSON.parse(s) : [];
  } catch { return []; }
}

function saveSavedCards(cards: SavedCard[]) {
  try { localStorage.setItem(SAVED_CARDS_KEY, JSON.stringify(cards)); } catch {}
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
  const { items, subtotal, clearCart, isLoaded } = useCart();
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

  // Payment
  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: '', cardName: '', expiry: '', cvv: '', saveCard: true,
  });
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string | null>(null);
  const [useNewCard, setUseNewCard] = useState(false);
  const [billingMatchesShipping, setBillingMatchesShipping] = useState(true);

  // Processing & confirmation
  const [processingStage, setProcessingStage] = useState(0);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  // Express checkout
  const [showExpressLoading, setShowExpressLoading] = useState<string | null>(null);

  // Calculated totals
  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShippingMethod) || SHIPPING_METHODS[0];
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCost = freeShipping && shippingMethod.id === 'standard' ? 0 : shippingMethod.price;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  // Load saved data on mount
  useEffect(() => {
    setSavedCards(loadSavedCards());
    const saved = loadSavedShipping();
    if (saved) {
      setShipping((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  // Auto-select first saved card
  useEffect(() => {
    if (savedCards.length > 0 && !selectedSavedCard && !useNewCard) {
      setSelectedSavedCard(savedCards[0].id);
    }
  }, [savedCards, selectedSavedCard, useNewCard]);

  // Redirect if empty
  useEffect(() => {
    if (isLoaded && items.length === 0 && step !== 'confirmation') {
      router.push('/shop');
    }
  }, [isLoaded, items.length, step, router]);

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

  const validatePayment = useCallback((): boolean => {
    if (selectedSavedCard && !useNewCard) return true;
    const errors: Partial<Record<keyof PaymentData, string>> = {};
    const digits = payment.cardNumber.replace(/\D/g, '');
    if (!payment.cardName.trim()) errors.cardName = 'Name on card is required';
    if (!digits) errors.cardNumber = 'Card number is required';
    else if (digits.length < 13) errors.cardNumber = 'Too short';
    else if (!luhnCheck(digits)) errors.cardNumber = 'Invalid card number';
    if (!payment.expiry.trim()) errors.expiry = 'Required';
    else {
      const [mm, yy] = payment.expiry.split('/');
      const month = parseInt(mm, 10);
      const year = parseInt(yy, 10);
      if (!month || month < 1 || month > 12) errors.expiry = 'Invalid';
      else if (!year || year < 26) errors.expiry = 'Expired';
    }
    if (!payment.cvv.trim()) errors.cvv = 'Required';
    else if (payment.cvv.length < 3) errors.cvv = '3-4 digits';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }, [payment, selectedSavedCard, useNewCard]);

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
    goTo('payment');
  };

  const handlePaymentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      setCompletedSteps((prev) => new Set(prev).add('payment'));
      processOrder();
    }
  };

  /* ──────────── Express Checkout ──────────── */

  const handleExpressCheckout = async (method: string) => {
    setShowExpressLoading(method);
    // Simulate native payment sheet
    await new Promise((r) => setTimeout(r, 2000));
    setShowExpressLoading(null);

    // Auto-fill with mock data as if the payment sheet returned info
    setShipping({
      email: 'customer@example.com',
      firstName: 'Alex',
      lastName: 'Johnson',
      phone: '(541) 555-0123',
      address: '123 Main Street',
      apartment: '',
      city: 'Bend',
      state: 'OR',
      zip: '97701',
      country: 'US',
    });
    setSelectedShippingMethod('standard');
    setCompletedSteps(new Set<CheckoutStep>(['information', 'shipping', 'payment']));
    processOrder(method === 'apple-pay' ? 'Apple Pay' : 'Google Pay');
  };

  /* ──────────── Order Processing ──────────── */

  const processOrder = async (expressMethod?: string) => {
    goTo('processing');
    setProcessingStage(0);

    const stages = [
      'Securing connection...',
      'Validating order details...',
      'Processing payment...',
      'Confirming with bank...',
      'Finalizing order...',
    ];

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(i);
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 800));
    }

    // Save card if requested
    if (!expressMethod && useNewCard || (savedCards.length === 0 && !expressMethod)) {
      if (payment.saveCard && payment.cardNumber) {
        const brand = getCardBrand(payment.cardNumber);
        const newCard: SavedCard = {
          id: generateToken(),
          brand,
          last4: payment.cardNumber.replace(/\D/g, '').slice(-4),
          name: payment.cardName,
          expiry: payment.expiry,
          token: generateToken(),
        };
        const updated = [...savedCards, newCard];
        setSavedCards(updated);
        saveSavedCards(updated);
      }
    }

    // Build payment method string
    let paymentMethodStr = expressMethod || '';
    if (!paymentMethodStr) {
      if (selectedSavedCard && !useNewCard) {
        const card = savedCards.find((c) => c.id === selectedSavedCard);
        paymentMethodStr = card ? `${getCardBrandLabel(card.brand)} ending in ${card.last4}` : 'Saved card';
      } else {
        const brand = getCardBrand(payment.cardNumber);
        const last4 = payment.cardNumber.replace(/\D/g, '').slice(-4);
        paymentMethodStr = `${getCardBrandLabel(brand)} ending in ${last4}`;
      }
    }

    const deliveryDays = shippingMethod.id === 'overnight' ? 1 : shippingMethod.id === 'express' ? 3 : 6;
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    const confirmation: OrderConfirmation = {
      id: generateOrderId(),
      email: shipping.email || 'customer@example.com',
      total,
      subtotal,
      shippingCost,
      tax,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      estimatedDelivery: estimatedDelivery.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      }),
      shippingMethod: shippingMethod.name,
      shippingAddress: {
        name: `${shipping.firstName} ${shipping.lastName}`,
        address: shipping.address,
        apartment: shipping.apartment,
        city: shipping.city,
        state: shipping.state,
        zip: shipping.zip,
      },
      paymentMethod: paymentMethodStr,
      items: items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
        tintColor: i.product.tintColor,
      })),
    };

    // Also call the API route for server-side validation
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping,
          paymentToken: generateToken(),
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerErrors(data.errors || ['Payment failed. Please try again.']);
        goTo('payment');
        return;
      }
    } catch {
      // Network error — still show confirmation for mock purposes
    }

    setOrderConfirmation(confirmation);
    clearCart();
    goTo('confirmation');
  };

  /* ──────────── Field helpers ──────────── */

  const updateShipping = (field: keyof ShippingData, value: string) => {
    setShipping((p) => ({ ...p, [field]: value }));
    if (shippingErrors[field]) setShippingErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const updatePayment = (field: keyof PaymentData, value: string | boolean) => {
    let v = value;
    if (field === 'cardNumber' && typeof v === 'string') v = formatCardNumber(v);
    if (field === 'expiry' && typeof v === 'string') v = formatExpiry(v);
    if (field === 'cvv' && typeof v === 'string') v = (v as string).replace(/\D/g, '').slice(0, 4);
    setPayment((p) => ({ ...p, [field]: v }));
    if (paymentErrors[field as keyof PaymentData]) setPaymentErrors((p) => { const n = { ...p }; delete n[field as keyof PaymentData]; return n; });
  };

  const removeSavedCard = (id: string) => {
    const updated = savedCards.filter((c) => c.id !== id);
    setSavedCards(updated);
    saveSavedCards(updated);
    if (selectedSavedCard === id) {
      setSelectedSavedCard(updated.length > 0 ? updated[0].id : null);
      if (updated.length === 0) setUseNewCard(true);
    }
  };

  const copyOrderId = () => {
    if (orderConfirmation) {
      navigator.clipboard.writeText(orderConfirmation.id);
      setCopiedOrderId(true);
      setTimeout(() => setCopiedOrderId(false), 2000);
    }
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

  if (items.length === 0 && step !== 'confirmation' && step !== 'processing') {
    return null;
  }

  /* ──────────── PROCESSING SCREEN ──────────── */

  if (step === 'processing') {
    const stages = [
      'Securing connection...',
      'Validating order details...',
      'Processing payment...',
      'Confirming with bank...',
      'Finalizing order...',
    ];
    return (
      <div className="section-padding max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full border-4 border-slime-purple/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-t-slime-purple border-r-slime-pink border-b-slime-teal border-l-transparent animate-spin" />
          </div>
          <Lock size={24} className="absolute inset-0 m-auto text-slime-purple" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-2">Processing Your Order</h2>
        <p className="text-gray-500 text-sm mb-8">Please don&apos;t close this page</p>
        <div className="w-full max-w-xs space-y-3">
          {stages.map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              {i < processingStage ? (
                <CheckCircle2 size={18} className="text-slime-teal flex-shrink-0" />
              ) : i === processingStage ? (
                <Loader2 size={18} className="animate-spin text-slime-purple flex-shrink-0" />
              ) : (
                <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-200 flex-shrink-0" />
              )}
              <span className={`text-sm ${i <= processingStage ? 'text-slime-dark font-medium' : 'text-gray-300'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-8 text-xs text-gray-400">
          <ShieldCheck size={14} />
          <span>256-bit SSL encrypted connection</span>
        </div>
      </div>
    );
  }

  /* ──────────── CONFIRMATION SCREEN ──────────── */

  if (step === 'confirmation' && orderConfirmation) {
    return (
      <div className="section-padding max-w-3xl mx-auto animate-fade-in">
        {/* Success banner */}
        <div className="text-center mb-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={40} className="text-green-600" />
            </div>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-500">
            Confirmation sent to <span className="font-medium text-slime-dark">{orderConfirmation.email}</span>
          </p>
        </div>

        {/* Order ID */}
        <div className="bg-gradient-to-r from-slime-purple/5 to-slime-pink/5 rounded-2xl p-4 flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Order Number</p>
            <p className="font-display font-bold text-xl text-slime-purple">{orderConfirmation.id}</p>
          </div>
          <button
            onClick={copyOrderId}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            {copiedOrderId ? <><CheckCircle2 size={14} className="text-green-500" /> Copied!</> : <><Copy size={14} /> Copy</>}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Shipping info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-3">
              <MapPin size={16} className="text-slime-teal" /> Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {orderConfirmation.shippingAddress.name}<br />
              {orderConfirmation.shippingAddress.address}
              {orderConfirmation.shippingAddress.apartment && <>, {orderConfirmation.shippingAddress.apartment}</>}<br />
              {orderConfirmation.shippingAddress.city}, {orderConfirmation.shippingAddress.state} {orderConfirmation.shippingAddress.zip}
            </p>
          </div>

          {/* Delivery info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-3">
              <Truck size={16} className="text-slime-teal" /> Delivery Details
            </h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-slime-dark">{orderConfirmation.shippingMethod}</span><br />
              Estimated delivery: <span className="font-medium text-slime-dark">{orderConfirmation.estimatedDelivery}</span>
            </p>
          </div>

          {/* Payment info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-3">
              <CreditCard size={16} className="text-slime-teal" /> Payment Method
            </h3>
            <p className="text-sm text-gray-600">{orderConfirmation.paymentMethod}</p>
          </div>

          {/* Order total */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-3">
              <Wallet size={16} className="text-slime-teal" /> Order Total
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${orderConfirmation.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Shipping</span><span>{orderConfirmation.shippingCost === 0 ? 'FREE' : `$${orderConfirmation.shippingCost.toFixed(2)}`}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>${orderConfirmation.tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-display font-bold text-lg pt-2 border-t border-gray-100 text-slime-dark">
                <span>Total</span><span>${orderConfirmation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Items ordered */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-8">
          <h3 className="font-display font-bold text-sm flex items-center gap-2 mb-4">
            <Package size={16} className="text-slime-teal" /> Items Ordered ({orderConfirmation.itemCount})
          </h3>
          <div className="space-y-3">
            {orderConfirmation.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                  <div className="absolute inset-0 opacity-45 mix-blend-color" style={{ backgroundColor: item.tintColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status timeline */}
        <div className="bg-gradient-to-r from-slime-teal/5 to-slime-purple/5 rounded-2xl p-5 mb-8">
          <h3 className="font-display font-bold text-sm mb-4">Order Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Order placed', time: 'Just now', done: true },
              { label: 'Payment confirmed', time: 'Just now', done: true },
              { label: 'Preparing your slime', time: 'In progress', done: false },
              { label: 'Shipped', time: 'Pending', done: false },
              { label: 'Delivered', time: orderConfirmation.estimatedDelivery, done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${s.done ? 'bg-slime-teal' : i === 2 ? 'bg-slime-yellow ring-4 ring-slime-yellow/20' : 'bg-gray-200'}`} />
                  {i < 4 && <div className={`w-0.5 h-6 ${s.done ? 'bg-slime-teal' : 'bg-gray-200'}`} />}
                </div>
                <div className="-mt-0.5">
                  <p className={`text-sm ${s.done || i === 2 ? 'font-medium text-slime-dark' : 'text-gray-400'}`}>{s.label}</p>
                  <p className="text-xs text-gray-400">{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="btn-primary gap-2">
            <ShoppingBag size={16} />
            Continue Shopping
          </Link>
          <button onClick={() => window.print()} className="btn-secondary gap-2">
            <Printer size={16} />
            Print Receipt
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions about your order? <Link href="/contact" className="text-slime-purple hover:underline">Contact us</Link>
        </p>
      </div>
    );
  }

  /* ──────────── MAIN CHECKOUT LAYOUT ──────────── */

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="section-padding max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/shop" className="text-slime-purple hover:underline">Shop</Link>
        <ChevronRight size={14} className="text-gray-300" />
        <span className="text-gray-400">Checkout</span>
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
              {/* Express checkout */}
              <div className="mb-8">
                <p className="text-xs text-gray-400 text-center uppercase tracking-wider font-medium mb-3">Express checkout</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleExpressCheckout('apple-pay')}
                    disabled={!!showExpressLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-60"
                  >
                    {showExpressLoading === 'apple-pay' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <><Smartphone size={16} /> Apple Pay</>
                    )}
                  </button>
                  <button
                    onClick={() => handleExpressCheckout('google-pay')}
                    disabled={!!showExpressLoading}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
                  >
                    {showExpressLoading === 'google-pay' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <><Wallet size={16} /> Google Pay</>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">or continue below</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
              </div>

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
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: PAYMENT ═══ */}
          {step === 'payment' && (
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

              <h2 className="font-display text-lg font-bold mb-1 flex items-center gap-2">
                <CreditCard size={18} className="text-slime-purple" />
                Payment
              </h2>
              <p className="text-xs text-gray-400 mb-4">All transactions are secure and encrypted.</p>

              <form onSubmit={handlePaymentSubmit} autoComplete="on">
                {/* Saved cards */}
                {savedCards.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                      <Star size={14} className="text-slime-yellow" /> Saved Payment Methods
                    </p>
                    <div className="space-y-2">
                      {savedCards.map((card) => (
                        <div
                          key={card.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedSavedCard === card.id && !useNewCard
                              ? 'border-slime-purple bg-slime-purple/5'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                          onClick={() => { setSelectedSavedCard(card.id); setUseNewCard(false); }}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedSavedCard === card.id && !useNewCard ? 'border-slime-purple' : 'border-gray-200'}`}>
                            {selectedSavedCard === card.id && !useNewCard && <div className="w-2.5 h-2.5 rounded-full bg-slime-purple" />}
                          </div>
                          <div className="w-10 h-7 rounded flex items-center justify-center" style={{ backgroundColor: getCardBrandColor(card.brand) + '15' }}>
                            <CreditCard size={14} style={{ color: getCardBrandColor(card.brand) }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{getCardBrandLabel(card.brand)} &middot;&middot;&middot;&middot; {card.last4}</p>
                            <p className="text-xs text-gray-400">{card.name} &middot; Exp {card.expiry}</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); removeSavedCard(card.id); }}
                            className="p-1 text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      {/* Add new card option */}
                      <div
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          useNewCard ? 'border-slime-purple bg-slime-purple/5' : 'border-gray-100 hover:border-gray-200'
                        }`}
                        onClick={() => setUseNewCard(true)}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${useNewCard ? 'border-slime-purple' : 'border-gray-200'}`}>
                          {useNewCard && <div className="w-2.5 h-2.5 rounded-full bg-slime-purple" />}
                        </div>
                        <CreditCard size={16} className="text-gray-400" />
                        <p className="text-sm font-medium text-gray-600">Use a new card</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* New card form */}
                {(useNewCard || savedCards.length === 0) && (
                  <div className="border border-gray-200 rounded-2xl p-5 mb-4 space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Lock size={12} />
                        <span>Card details are never stored on our servers</span>
                      </div>
                      {/* Card brand badges */}
                      <div className="flex gap-1">
                        {['visa', 'mastercard', 'amex', 'discover'].map((b) => (
                          <div
                            key={b}
                            className={`w-8 h-5 rounded text-[8px] font-bold flex items-center justify-center transition-opacity ${
                              payment.cardNumber.replace(/\D/g, '').length >= 2 && getCardBrand(payment.cardNumber) !== b
                                ? 'opacity-20'
                                : 'opacity-100'
                            }`}
                            style={{ backgroundColor: getCardBrandColor(b) + '15', color: getCardBrandColor(b) }}
                          >
                            {b.slice(0, 4).toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Card number"
                      value={payment.cardNumber}
                      onChange={(v) => updatePayment('cardNumber', v)}
                      error={paymentErrors.cardNumber}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      name="cardnumber"
                    />
                    <Input
                      label="Name on card"
                      value={payment.cardName}
                      onChange={(v) => updatePayment('cardName', v)}
                      error={paymentErrors.cardName}
                      autoComplete="cc-name"
                      name="ccname"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Expiration (MM/YY)"
                        value={payment.expiry}
                        onChange={(v) => updatePayment('expiry', v)}
                        error={paymentErrors.expiry}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        name="cc-exp"
                      />
                      <Input
                        label="Security code"
                        value={payment.cvv}
                        onChange={(v) => updatePayment('cvv', v)}
                        error={paymentErrors.cvv}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        placeholder="CVV"
                        maxLength={4}
                        name="cvc"
                      />
                    </div>

                    {/* Save card checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={payment.saveCard}
                        onChange={(e) => updatePayment('saveCard', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-slime-purple focus:ring-slime-purple/30"
                      />
                      <span className="text-sm text-gray-600">Save this card for future purchases</span>
                    </label>
                  </div>
                )}

                {/* Billing address */}
                <div className="mb-6">
                  <h3 className="font-display font-semibold text-sm mb-3">Billing Address</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={billingMatchesShipping}
                      onChange={() => setBillingMatchesShipping(true)}
                      name="billing"
                      className="w-4 h-4 text-slime-purple focus:ring-slime-purple/30"
                    />
                    <span className="text-sm text-gray-600">Same as shipping address</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="radio"
                      checked={!billingMatchesShipping}
                      onChange={() => setBillingMatchesShipping(false)}
                      name="billing"
                      className="w-4 h-4 text-slime-purple focus:ring-slime-purple/30"
                    />
                    <span className="text-sm text-gray-600">Use a different billing address</span>
                  </label>
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-1.5 p-3 rounded-xl bg-green-50 border border-green-200 mb-6 text-xs text-green-700">
                  <ShieldCheck size={16} className="flex-shrink-0" />
                  <span>Your payment information is protected with 256-bit SSL encryption</span>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => goTo('shipping')} className="btn-secondary flex-1 gap-2">
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button type="submit" className="btn-primary flex-1 gap-2">
                    <Lock size={16} />
                    Pay ${total.toFixed(2)}
                  </button>
                </div>
              </form>
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

            {/* Discount code */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <DiscountCode />
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
                { icon: ShieldCheck, label: 'SSL Encrypted' },
                { icon: Truck, label: 'Fast Shipping' },
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
   DISCOUNT CODE COMPONENT
   ================================================================ */

function DiscountCode() {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const applyCode = () => {
    if (!code.trim()) return;
    // Mock: accept "SLIME10" as a valid code
    if (code.toUpperCase() === 'SLIME10') {
      setApplied(true);
      setError('');
    } else {
      setError('Invalid discount code');
      setApplied(false);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(''); setApplied(false); }}
          placeholder="Discount code"
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple"
        />
        <button
          onClick={applyCode}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {applied && <p className="text-xs text-slime-teal mt-1 flex items-center gap-1"><Check size={12} /> Code applied!</p>}
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
