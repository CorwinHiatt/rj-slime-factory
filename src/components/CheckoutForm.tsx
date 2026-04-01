'use client';

import { useState, useCallback, useEffect } from 'react';
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
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// ─── Types ─────────────────────────────────────────────────────────
interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
}

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface OrderConfirmation {
  id: string;
  email: string;
  total: number;
  itemCount: number;
  estimatedDelivery: string;
  shippingAddress: {
    name: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zip: string;
  };
}

type CheckoutStep = 'shipping' | 'payment' | 'review' | 'confirmation';

const STEPS: { key: CheckoutStep; label: string; icon: typeof Truck }[] = [
  { key: 'shipping', label: 'Shipping', icon: Truck },
  { key: 'payment', label: 'Payment', icon: CreditCard },
  { key: 'review', label: 'Review', icon: ShoppingBag },
];

const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.0;  // Oregon has no sales tax

const US_STATES = [
  { value: '', label: 'Select state' },
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
  { value: 'DC', label: 'District of Columbia' },
];

// ─── Utilities ─────────────────────────────────────────────────────
function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length >= 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length >= 4) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }
  if (digits.length > 0) {
    return `(${digits}`;
  }
  return digits;
}

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function getCardBrand(number: string): string {
  const digits = number.replace(/\D/g, '');
  if (/^4/.test(digits)) return 'Visa';
  if (/^5[1-5]/.test(digits)) return 'Mastercard';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^6(?:011|5)/.test(digits)) return 'Discover';
  return '';
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generatePaymentToken(): string {
  return `tok_mock_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
}

// ─── Component ─────────────────────────────────────────────────────
export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, clearCart, isLoaded } = useCart();

  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', state: '', zip: '',
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: '', cardName: '', expiry: '', cvv: '',
  });
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  // Redirect to shop if cart is empty (unless viewing confirmation)
  // Wait for isLoaded so we don't redirect before localStorage is hydrated
  useEffect(() => {
    if (isLoaded && items.length === 0 && step !== 'confirmation') {
      router.push('/shop');
    }
  }, [isLoaded, items.length, step, router]);

  // ─── Shipping validation ──────────────────────────────────────
  const validateShipping = useCallback((): boolean => {
    const errors: Partial<Record<keyof ShippingData, string>> = {};

    if (!shipping.firstName.trim()) errors.firstName = 'First name is required';
    if (!shipping.lastName.trim()) errors.lastName = 'Last name is required';
    if (!shipping.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(shipping.email)) errors.email = 'Enter a valid email address';
    if (!shipping.phone.trim()) errors.phone = 'Phone number is required';
    else if (shipping.phone.replace(/\D/g, '').length < 10) errors.phone = 'Enter a valid 10-digit phone number';
    if (!shipping.address.trim()) errors.address = 'Address is required';
    if (!shipping.city.trim()) errors.city = 'City is required';
    if (!shipping.state) errors.state = 'State is required';
    if (!shipping.zip.trim()) errors.zip = 'ZIP code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(shipping.zip)) errors.zip = 'Enter a valid ZIP code';

    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  }, [shipping]);

  // ─── Payment validation ───────────────────────────────────────
  const validatePayment = useCallback((): boolean => {
    const errors: Partial<Record<keyof PaymentData, string>> = {};
    const cardDigits = payment.cardNumber.replace(/\D/g, '');

    if (!payment.cardName.trim()) errors.cardName = 'Name on card is required';
    if (!cardDigits) errors.cardNumber = 'Card number is required';
    else if (cardDigits.length < 13) errors.cardNumber = 'Card number is too short';
    else if (!luhnCheck(cardDigits)) errors.cardNumber = 'Invalid card number';
    if (!payment.expiry.trim()) errors.expiry = 'Expiry date is required';
    else {
      const [mm, yy] = payment.expiry.split('/');
      const month = parseInt(mm, 10);
      const year = parseInt(yy, 10);
      if (!month || month < 1 || month > 12) errors.expiry = 'Invalid month';
      else if (!year || year < 26) errors.expiry = 'Card is expired';
    }
    if (!payment.cvv.trim()) errors.cvv = 'CVV is required';
    else if (payment.cvv.length < 3) errors.cvv = 'CVV must be 3-4 digits';

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  }, [payment]);

  // ─── Navigation ───────────────────────────────────────────────
  const goToPayment = () => {
    if (validateShipping()) {
      setStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToReview = () => {
    if (validatePayment()) {
      setStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = (target: CheckoutStep) => {
    setStep(target);
    setServerErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Submit order ─────────────────────────────────────────────
  const submitOrder = async () => {
    setIsProcessing(true);
    setServerErrors([]);
    setProcessingMessage('Validating order...');

    await new Promise((r) => setTimeout(r, 800));
    setProcessingMessage('Processing payment...');

    // IMPORTANT: We never send real card data to the server.
    // In production, you would use Stripe.js / PayPal SDK to tokenize on the client,
    // then only send the token. This mock follows that same pattern.
    const paymentToken = generatePaymentToken();

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping,
          paymentToken,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setServerErrors(data.errors || ['Something went wrong. Please try again.']);
        setIsProcessing(false);
        return;
      }

      setProcessingMessage('Confirming order...');
      await new Promise((r) => setTimeout(r, 600));

      setOrderConfirmation(data.order);
      clearCart();
      setStep('confirmation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerErrors(['Network error. Please check your connection and try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Field updater helpers ────────────────────────────────────
  const updateShipping = (field: keyof ShippingData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field]) {
      setShippingErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const updatePayment = (field: keyof PaymentData, value: string) => {
    let formatted = value;
    if (field === 'cardNumber') formatted = formatCardNumber(value);
    if (field === 'expiry') formatted = formatExpiry(value);
    if (field === 'cvv') formatted = value.replace(/\D/g, '').slice(0, 4);
    setPayment((prev) => ({ ...prev, [field]: formatted }));
    if (paymentErrors[field]) {
      setPaymentErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ─── Loading / empty cart guard ────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="section-padding max-w-6xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-slime-purple" />
      </div>
    );
  }

  if (items.length === 0 && step !== 'confirmation') {
    return null;
  }

  // ─── Order confirmation ───────────────────────────────────────
  if (step === 'confirmation' && orderConfirmation) {
    return (
      <div className="section-padding max-w-2xl mx-auto text-center">
        <div className="animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-8">
            Thank you for your order. A confirmation email will be sent to{' '}
            <span className="font-medium text-slime-dark">{orderConfirmation.email}</span>
          </p>

          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 text-left space-y-6 mb-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Order Number</p>
                <p className="font-display font-bold text-lg text-slime-purple">{orderConfirmation.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Total</p>
                <p className="font-display font-bold text-lg">${orderConfirmation.total.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Package size={18} className="text-slime-teal mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Estimated Delivery</p>
                <p className="text-gray-500 text-sm">{orderConfirmation.estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-slime-pink mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Shipping To</p>
                <p className="text-gray-500 text-sm">
                  {orderConfirmation.shippingAddress.name}<br />
                  {orderConfirmation.shippingAddress.address}
                  {orderConfirmation.shippingAddress.apartment && `, ${orderConfirmation.shippingAddress.apartment}`}<br />
                  {orderConfirmation.shippingAddress.city}, {orderConfirmation.shippingAddress.state} {orderConfirmation.shippingAddress.zip}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main checkout layout ─────────────────────────────────────
  return (
    <div className="section-padding max-w-6xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-slime-purple transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="font-display text-3xl sm:text-4xl font-bold mb-8">Checkout</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.key === step;
          const stepIndex = STEPS.findIndex((x) => x.key === step);
          const isDone = i < stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-2">
              {i > 0 && (
                <ChevronRight size={16} className={isDone ? 'text-slime-teal' : 'text-gray-300'} />
              )}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slime-purple text-white'
                    : isDone
                    ? 'bg-slime-teal/10 text-slime-teal'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isDone ? <Check size={14} /> : <Icon size={14} />}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left column — forms */}
        <div className="lg:col-span-3">
          {/* ─── SHIPPING STEP ─────────────────────────────── */}
          {step === 'shipping' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <Truck size={20} className="text-slime-purple" />
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={shipping.firstName}
                    onChange={(v) => updateShipping('firstName', v)}
                    error={shippingErrors.firstName}
                    autoComplete="given-name"
                  />
                  <InputField
                    label="Last Name"
                    value={shipping.lastName}
                    onChange={(v) => updateShipping('lastName', v)}
                    error={shippingErrors.lastName}
                    autoComplete="family-name"
                  />
                </div>

                <InputField
                  label="Email Address"
                  type="email"
                  value={shipping.email}
                  onChange={(v) => updateShipping('email', v)}
                  error={shippingErrors.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                />

                <InputField
                  label="Phone Number"
                  type="tel"
                  value={shipping.phone}
                  onChange={(v) => updateShipping('phone', formatPhone(v))}
                  error={shippingErrors.phone}
                  autoComplete="tel"
                  placeholder="(555) 123-4567"
                />

                <InputField
                  label="Street Address"
                  value={shipping.address}
                  onChange={(v) => updateShipping('address', v)}
                  error={shippingErrors.address}
                  autoComplete="address-line1"
                />

                <InputField
                  label="Apartment, Suite, etc. (optional)"
                  value={shipping.apartment}
                  onChange={(v) => updateShipping('apartment', v)}
                  autoComplete="address-line2"
                />

                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-3">
                    <InputField
                      label="City"
                      value={shipping.city}
                      onChange={(v) => updateShipping('city', v)}
                      error={shippingErrors.city}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                    <select
                      value={shipping.state}
                      onChange={(e) => updateShipping('state', e.target.value)}
                      autoComplete="address-level1"
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple ${
                        shippingErrors.state ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {US_STATES.map((s) => (
                        <option key={s.value} value={s.value}>{s.value || '—'}</option>
                      ))}
                    </select>
                    {shippingErrors.state && (
                      <p className="text-xs text-red-500 mt-1">{shippingErrors.state}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <InputField
                      label="ZIP Code"
                      value={shipping.zip}
                      onChange={(v) => updateShipping('zip', v.replace(/[^\d-]/g, '').slice(0, 10))}
                      error={shippingErrors.zip}
                      autoComplete="postal-code"
                      placeholder="97701"
                    />
                  </div>
                </div>
              </div>

              <button onClick={goToPayment} className="btn-primary w-full mt-8 gap-2">
                Continue to Payment
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ─── PAYMENT STEP ──────────────────────────────── */}
          {step === 'payment' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-slime-purple" />
                Payment Details
              </h2>

              {/* Security notice */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-200 mb-6">
                <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700">
                  Your payment info is encrypted and secure. We never store your card details.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <InputField
                    label="Card Number"
                    value={payment.cardNumber}
                    onChange={(v) => updatePayment('cardNumber', v)}
                    error={paymentErrors.cardNumber}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    inputMode="numeric"
                  />
                  {payment.cardNumber.replace(/\D/g, '').length >= 4 && (
                    <p className="text-xs text-slime-purple mt-1 font-medium">
                      {getCardBrand(payment.cardNumber)}
                    </p>
                  )}
                </div>

                <InputField
                  label="Name on Card"
                  value={payment.cardName}
                  onChange={(v) => updatePayment('cardName', v)}
                  error={paymentErrors.cardName}
                  autoComplete="cc-name"
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Expiry (MM/YY)"
                    value={payment.expiry}
                    onChange={(v) => updatePayment('expiry', v)}
                    error={paymentErrors.expiry}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    inputMode="numeric"
                  />
                  <InputField
                    label="CVV"
                    value={payment.cvv}
                    onChange={(v) => updatePayment('cvv', v)}
                    error={paymentErrors.cvv}
                    placeholder="123"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => goBack('shipping')}
                  className="btn-secondary flex-1 gap-2"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button onClick={goToReview} className="btn-primary flex-1 gap-2">
                  Review Order
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ─── REVIEW STEP ──────────────────────────────── */}
          {step === 'review' && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <ShoppingBag size={20} className="text-slime-purple" />
                Review Your Order
              </h2>

              {serverErrors.length > 0 && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 mb-6">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      {serverErrors.map((err, i) => (
                        <p key={i} className="text-sm text-red-600">{err}</p>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping summary */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                    <Truck size={14} className="text-slime-teal" />
                    Shipping
                  </h3>
                  <button
                    onClick={() => goBack('shipping')}
                    className="text-xs text-slime-purple hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.address}
                  {shipping.apartment && `, ${shipping.apartment}`}<br />
                  {shipping.city}, {shipping.state} {shipping.zip}<br />
                  {shipping.email} &middot; {shipping.phone}
                </p>
              </div>

              {/* Payment summary */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm flex items-center gap-1.5">
                    <CreditCard size={14} className="text-slime-teal" />
                    Payment
                  </h3>
                  <button
                    onClick={() => goBack('payment')}
                    className="text-xs text-slime-purple hover:underline font-medium"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {getCardBrand(payment.cardNumber)} ending in {payment.cardNumber.replace(/\D/g, '').slice(-4)}<br />
                  {payment.cardName}
                </p>
              </div>

              {/* Items */}
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <h3 className="font-display font-semibold text-sm mb-3 flex items-center gap-1.5">
                  <Package size={14} className="text-slime-teal" />
                  Items ({items.reduce((sum, i) => sum + i.quantity, 0)})
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 opacity-45 mix-blend-color"
                          style={{ backgroundColor: item.product.tintColor }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => goBack('payment')}
                  className="btn-secondary flex-1 gap-2"
                  disabled={isProcessing}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <button
                  onClick={submitOrder}
                  disabled={isProcessing}
                  className="btn-primary flex-1 gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {processingMessage}
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Place Order &middot; ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Right column — order summary ──────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 opacity-45 mix-blend-color"
                      style={{ backgroundColor: item.product.tintColor }}
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-slime-purple text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.product.category}</p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className={`font-medium ${shippingCost === 0 ? 'text-slime-teal' : ''}`}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-display font-bold text-lg">Total</span>
                <span className="font-display font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>

            {shippingCost === 0 && (
              <div className="mt-4 p-2.5 bg-slime-teal/10 rounded-xl text-center">
                <p className="text-xs text-slime-teal font-medium">
                  You qualify for FREE shipping!
                </p>
              </div>
            )}

            {/* Trust badges */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-400">
              <div className="flex items-center gap-1 text-xs">
                <Lock size={12} />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <ShieldCheck size={12} />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Truck size={12} />
                <span>Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable input component ──────────────────────────────────────
function InputField({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple ${
          error ? 'border-red-400 bg-red-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle size={10} />
          {error}
        </p>
      )}
    </div>
  );
}
