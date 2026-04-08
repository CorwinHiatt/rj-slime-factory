'use client';

import { useState } from 'react';
import { Mail, MapPin, Clock, Instagram, ChevronDown, ChevronUp, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    detail: 'hello@rjslimefactory.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Location',
    detail: 'Bend, Oregon',
    sub: 'Online shop, shipping nationwide',
  },
  {
    icon: Clock,
    title: 'Hours',
    detail: 'Mon-Fri 9AM-5PM PST',
    sub: 'Pre-orders open now',
  },
  {
    icon: Instagram,
    title: 'Social',
    detail: '@rjslimefactory',
    sub: 'Follow for sneak peeks & restocks',
  },
];

const faqs = [
  {
    question: 'How do pre-orders work?',
    answer:
      'When you place a pre-order, your payment is processed immediately and goes directly toward funding our first production run. Once we hit 50 orders, we begin manufacturing and ship your slime along with an exclusive founder\'s gift.',
  },
  {
    question: 'When will my order ship?',
    answer:
      'Shipping begins once we reach 50 pre-orders. We\'ll email you with updates on our progress and a shipping date once production starts. We anticipate hitting our goal soon!',
  },
  {
    question: 'What is the founder\'s gift?',
    answer:
      'Every one of our first 50 pre-orders includes an exclusive thank-you gift from RJ himself. It\'s our way of showing gratitude for believing in RJ Slime Factory from the very beginning. The exact gift is a surprise!',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Currently we ship within the United States only. International shipping is coming soon!',
  },
  {
    question: 'What if my slime arrives damaged?',
    answer:
      'We stand behind every order. If your slime arrives damaged, email us with a photo within 48 hours and we\'ll send a replacement.',
  },
  {
    question: 'Are your slimes safe for kids?',
    answer:
      'Yes! All our slimes are made with non-toxic, skin-safe ingredients. Recommended for ages 6+. Adult supervision recommended for younger children.',
  },
  {
    question: 'Can I cancel my pre-order?',
    answer:
      'Yes, you can cancel your pre-order for a full refund before production begins. Once manufacturing starts (after we hit 50 orders), cancellations may not be possible. Contact us for details.',
  },
  {
    question: 'My slime is sticky/hard. What do I do?',
    answer:
      'Check out our Slime Care Guide on the About page! For sticky slime, add activator. For hard slime, add warm water or lotion.',
  },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-slime-cream via-white to-purple-50 section-padding pb-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto text-lg">
            Questions, custom orders, or just want to say hi? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-md card-hover text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slime-pink/10 to-slime-purple/10 flex items-center justify-center mx-auto mb-4">
                <item.icon size={22} className="text-slime-purple" />
              </div>
              <h3 className="font-display font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-slime-dark font-medium text-sm">{item.detail}</p>
              <p className="text-gray-400 text-xs mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="font-display text-3xl font-bold mb-6">
              Send Us a Message
            </h2>

            {submitted && (
              <div className="bg-slime-teal/10 border border-slime-teal/30 text-slime-teal rounded-2xl p-4 mb-6 animate-slide-up">
                <p className="font-display font-semibold">Message sent!</p>
                <p className="text-sm opacity-80">We&apos;ll get back to you within 24 hours.</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 mb-6 animate-slide-up">
                <p className="font-display font-semibold">Oops!</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple transition-all"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple transition-all"
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order Question</option>
                  <option value="custom">Custom Order</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="collab">Collaboration</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slime-purple/30 focus:border-slime-purple transition-all resize-none"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <button type="submit" disabled={sending} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={16} className="mr-2" /> {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* FAQ */}
          <div id="faq" className="scroll-mt-24">
            <h2 className="font-display text-3xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-display font-semibold text-sm pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp size={18} className="text-slime-purple flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 animate-slide-up">
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-slime-dark to-purple-900 rounded-3xl p-8 sm:p-12 text-white text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Want to Collaborate?
          </h3>
          <p className="text-gray-300 max-w-lg mx-auto mb-6">
            We love working with creators, influencers, and fellow slime enthusiasts. Let&apos;s make something amazing together.
          </p>
          <a
            href="mailto:hello@rjslimefactory.com"
            className="inline-flex items-center px-8 py-3 bg-white text-slime-purple font-display font-bold rounded-full hover:scale-105 transition-transform"
          >
            <Mail size={18} className="mr-2" /> Email Us
          </a>
        </div>
      </section>
    </>
  );
}
