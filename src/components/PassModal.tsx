import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  QrCode,
  Sparkles,
  ShieldAlert,
  Users,
  User,
  ArrowRight,
  Copy,
  CreditCard,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Printer,
  ExternalLink
} from 'lucide-react';

type EventType = 'destroy' | 'soccer' | 'rc_race';
type TicketWindow = 'early' | 'last_chance';
type PassType = 'individual' | 'team';

interface PassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: EventType;
}

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

let razorpayScriptPromise: Promise<boolean> | null = null;

const getEnvVar = (key: string): string | undefined => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return env?.[key];
};

const loadRazorpayScript = (): Promise<boolean> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  const existingScript = document.querySelector('script[data-razorpay-checkout="true"]');
  if (existingScript) {
    if ((existingScript as HTMLScriptElement).dataset.loaded === 'true') {
      return Promise.resolve(Boolean(window.Razorpay));
    }
    razorpayScriptPromise = new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existingScript.addEventListener('error', () => {
        razorpayScriptPromise = null;
        resolve(false);
      }, { once: true });
    });

    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => {
      script.dataset.loaded = 'true';
      const loaded = Boolean(window.Razorpay);
      if (!loaded) {
        razorpayScriptPromise = null;
      }
      resolve(loaded);
    };
    script.onerror = () => {
      razorpayScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

export const PassModal: React.FC<PassModalProps> = ({ isOpen, onClose, initialEvent = 'destroy' }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventType>(initialEvent);

  useEffect(() => {
    if (initialEvent) {
      setSelectedEvent(initialEvent);
    }
  }, [initialEvent, isOpen]);

  const [ticketWindow, setTicketWindow] = useState<TicketWindow>('early');
  const [passType, setPassType] = useState<PassType>('team');
  const [step, setStep] = useState<'select' | 'details' | 'payment' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'razorpay'>('upi');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'JECRC University',
    teamName: '',
    teamSize: '3',
  });

  // Payment State
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [utrError, setUtrError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    ticketId: string;
    method: string;
    txnRef: string;
    paidAmount: number;
    timestamp: string;
  } | null>(null);

  if (!isOpen) return null;

  // Calculate pricing based on logic from registration_fee.txt
  let price = 0;
  if (selectedEvent === 'rc_race') {
    price = 299; // External Vendor price
  } else {
    if (ticketWindow === 'early') {
      price = passType === 'individual' ? 99 : 449;
    } else {
      price = passType === 'individual' ? 199 : 849;
    }
  }

  const eventNames: Record<EventType, string> = {
    destroy: 'Destroy-a-thon (Tower Crash)',
    soccer: 'Robo Soccer Fiesta',
    rc_race: 'RC Car Race (Offroad Reckoning)',
  };

  const eventPassTitles: Record<EventType, string> = {
    destroy: 'DESTROY-A-THON 2026 OFFICIAL PASS',
    soccer: 'ROBO SOCCER FIESTA 2026 OFFICIAL PASS',
    rc_race: 'RC CAR RACE 2026 OFFICIAL PASS',
  };

  const upiId = selectedEvent === 'rc_race' ? 'vendor.racing@okaxis' : 'makerspace.ju@okhdfcbank';
  const payeeName = selectedEvent === 'rc_race' ? 'RC Race Club Vendor' : 'JUMakerspace JECRC';
  const sanitizedName = formData.name ? formData.name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) : 'ENTRY';
  const note = `Pass-${selectedEvent.toUpperCase()}-${sanitizedName}`;
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${price}&cu=INR&tn=${encodeURIComponent(note)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=8&data=${encodeURIComponent(upiUrl)}`;

  const registrationContext = {
    event: selectedEvent,
    eventName: eventNames[selectedEvent],
    ticketWindow,
    passType,
    participant: {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      teamName: formData.teamName,
      teamSize: formData.teamSize,
    },
  };

  const buildTimestamp = () =>
    new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const buildTicketId = () => {
    const randomTicketNum = Math.floor(10000 + Math.random() * 90000);
    const prefix = selectedEvent === 'destroy' ? 'DST' : selectedEvent === 'soccer' ? 'SOC' : 'RCR';
    return `JU-${prefix}-2026-${randomTicketNum}`;
  };

  const persistRegistration = async (record: {
    ticketId: string;
    event: EventType;
    eventName: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    passType: PassType;
    teamName?: string;
    teamSize?: string;
    ticketWindow: TicketWindow;
    paymentMethod: string;
    txnRef: string;
    paidAmount: number;
    timestamp: string;
  }) => {
    // 1. Client-side persistence fallback
    try {
      const existing = JSON.parse(localStorage.getItem('rc_confirmed_registrations') || '[]');
      localStorage.setItem(
        'rc_confirmed_registrations',
        JSON.stringify([...existing, { ...record, registeredAt: new Date().toISOString() }])
      );
    } catch (e) {
      console.warn('Could not cache registration in localStorage:', e);
    }

    // 2. Server-side persistence via API or Webhook if configured
    const apiBaseUrl = getEnvVar('VITE_API_BASE_URL');
    const serverUrl = getEnvVar('VITE_REGISTRATION_API_URL') || (apiBaseUrl ? `${apiBaseUrl}/api/register` : null);

    if (serverUrl) {
      try {
        const response = await fetch(serverUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
        if (!response.ok) {
          throw new Error(`Registration API responded with ${response.status}`);
        }
      } catch (err) {
        console.error('Server registration persistence failed:', err);
        throw new Error('Payment was verified, but registration confirmation failed. Please retry.');
      }
    }
  };

  // Verification endpoint contract:
  // Request: JSON payload with payment details + registrationContext.
  // Response: JSON with { success: boolean } (or { verified: boolean }) and optional message.
  const verifyPayment = async (payload: Record<string, unknown>) => {
    const verificationUrl = getEnvVar('VITE_PAYMENT_VERIFY_API_URL');
    if (!verificationUrl) {
      throw new Error('Payment verification is unavailable. Please contact support.');
    }

    let response: Response;
    try {
      response = await fetch(verificationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Payment verification request failed:', error);
      throw new Error('Could not reach payment verification service. Please check your connection and retry.');
    }

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      const trimmedResponse = responseText.trim();
      throw new Error(
        trimmedResponse
          ? `Payment verification failed: ${trimmedResponse}`
          : `Payment verification failed with status ${response.status}.`
      );
    }

    let result: unknown;
    try {
      result = await response.json();
    } catch (error) {
      console.error('Payment verification response was not valid JSON:', error);
      throw new Error('Payment verification returned an invalid response.');
    }

    const responseObject = result as { success?: boolean; verified?: boolean; message?: string };
    const isVerified = Boolean(responseObject.success ?? responseObject.verified);

    if (!isVerified) {
      throw new Error(responseObject.message || 'Payment could not be verified.');
    }
  };

  const finalizeVerifiedRegistration = async (paymentMethodLabel: string, txnRef: string) => {
    const ticketId = buildTicketId();
    const timestamp = buildTimestamp();

    await persistRegistration({
      ticketId,
      event: selectedEvent,
      eventName: eventNames[selectedEvent],
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      passType,
      teamName: formData.teamName,
      teamSize: formData.teamSize,
      ticketWindow,
      paymentMethod: paymentMethodLabel,
      txnRef,
      paidAmount: price,
      timestamp,
    });

    setConfirmedTicket({
      ticketId,
      method: paymentMethodLabel,
      txnRef,
      paidAmount: price,
      timestamp,
    });
    setStep('success');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenUpiApp = () => {
    window.location.href = upiUrl;
  };

  const resetAndClose = () => {
    setStep('select');
    setUtrNumber('');
    setUtrError('');
    setPaymentError('');
    setConfirmedTicket(null);
    setIsProcessing(false);
    onClose();
  };

  const handleVerifyUtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    const cleanUtr = utrNumber.trim();
    if (!/^\d{12}$/.test(cleanUtr)) {
      setUtrError('Please enter a valid 12-digit UPI reference (UTR) number.');
      return;
    }
    setUtrError('');
    setPaymentError('');
    setIsProcessing(true);

    try {
      await verifyPayment({
        event: 'upi.utr.submit',
        amount: price,
        currency: 'INR',
        utr: cleanUtr,
        registrationContext,
      });
      await finalizeVerifiedRegistration('Direct UPI (Server Verified)', cleanUtr);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'UPI verification failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayViaRazorpay = async () => {
    if (isProcessing) return;
    setPaymentError('');
    setIsProcessing(true);
    const razorpayKey = getEnvVar('VITE_RAZORPAY_KEY_ID');
    if (!razorpayKey) {
      setPaymentError('Online payment is unavailable right now. Please try UPI or contact support.');
      setIsProcessing(false);
      return;
    }

    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
      setPaymentError('Unable to load Razorpay checkout. Please try again in a moment.');
      setIsProcessing(false);
      return;
    }

    const options: RazorpayOptions = {
      key: razorpayKey,
      amount: price * 100, // paise
      currency: 'INR',
      name: 'JUMakerspace x Red Bull',
      description: `${eventNames[selectedEvent]} Pass`,
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#EB0028',
      },
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          await verifyPayment({
            event: 'razorpay.checkout.success',
            amount: price,
            currency: 'INR',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            registrationContext,
          });
          await finalizeVerifiedRegistration('Razorpay Online Gateway', response.razorpay_payment_id);
        } catch (error) {
          setPaymentError(error instanceof Error ? error.message : 'Razorpay payment verification failed.');
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsProcessing(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
      return;
    } catch (err) {
      console.error('Razorpay checkout initialization failed:', err);
      setPaymentError('Unable to initialize Razorpay checkout. Please retry.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-3xl p-5 sm:p-8 shadow-2xl text-white my-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 sm:pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-condensed font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              OFFICIAL EVENT PASS
            </div>
            <h2 className="font-condensed font-black text-2xl sm:text-4xl text-white tracking-wider uppercase leading-none">
              {step === 'success' ? 'REGISTRATION CONFIRMED' : 'GET YOUR PASS'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              29th &middot; 30th September 2026 &middot; Central Lawn, JECRC
            </p>
          </div>

          <button
            onClick={resetAndClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Event & Tier */}
        {step === 'select' && (
          <div className="py-5 space-y-6">
            {/* Event Selection */}
            <div>
              <label className="block text-xs font-condensed font-bold tracking-widest text-zinc-300 uppercase mb-3">
                1. SELECT YOUR EVENT
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent('destroy')}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedEvent === 'destroy'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                    }`}
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Destroy-a-thon
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Tower crash challenge</div>
                  <div className="mt-2 text-xs font-mono font-bold text-brand-red">Internal Event</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEvent('soccer')}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedEvent === 'soccer'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                    }`}
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Robo Soccer
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Arena bot soccer</div>
                  <div className="mt-2 text-xs font-mono font-bold text-amber-400">Internal Event</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEvent('rc_race')}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedEvent === 'rc_race'
                    ? 'border-brand-cyan bg-brand-cyan/15 shadow-lg shadow-cyan-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                    }`}
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    RC Car Race
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">High-speed lawn circuit</div>
                  <div className="mt-2 text-xs font-mono font-bold text-brand-cyan">Vendor Event (~₹299)</div>
                </button>
              </div>
            </div>

            {/* Ticket Window & Pass Type (If Internal) */}
            {selectedEvent !== 'rc_race' ? (
              <>
                <div>
                  <label className="block text-xs font-condensed font-bold tracking-widest text-zinc-300 uppercase mb-3">
                    2. TICKET WINDOW
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTicketWindow('early')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${ticketWindow === 'early'
                        ? 'border-brand-red bg-brand-red/15'
                        : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-condensed font-bold text-base uppercase">Early Bird</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1">19th – 23rd Sept 2026</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTicketWindow('last_chance')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${ticketWindow === 'last_chance'
                        ? 'border-brand-red bg-brand-red/15'
                        : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                        }`}
                    >
                      <div className="font-condensed font-bold text-base uppercase">Last Chance</div>
                      <div className="text-xs text-zinc-400 mt-1">25th – 27th Sept 2026</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-condensed font-bold tracking-widest text-zinc-300 uppercase mb-3">
                    3. ENTRY FORMAT
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPassType('individual')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${passType === 'individual'
                        ? 'border-brand-red bg-brand-red/15'
                        : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                        }`}
                    >
                      <User className="w-5 h-5 text-brand-red" />
                      <div>
                        <div className="font-condensed font-bold text-base uppercase">Individual</div>
                        <div className="text-[11px] text-zinc-400">Team assigned by organizers</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPassType('team')}
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${passType === 'team'
                        ? 'border-brand-red bg-brand-red/15'
                        : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                        }`}
                    >
                      <Users className="w-5 h-5 text-brand-red" />
                      <div>
                        <div className="font-condensed font-bold text-base uppercase">Team Pass</div>
                        <div className="text-[11px] text-zinc-400">2 – 5 members squad</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-brand-cyan/30 text-xs text-zinc-300 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-1">External Vendor Partner Event:</strong>
                  The RC Car Race is operated by our certified external racing track partner. Registration is handled with dedicated vendor slots at ₹299.
                </div>
              </div>
            )}

            {/* Total Price & Proceed */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">Registration Fee</span>
                <span className="font-condensed font-black text-3xl sm:text-4xl text-white">
                  ₹{price}{' '}
                  <span className="text-xs font-sans text-zinc-400 font-normal">
                    {passType === 'individual' && selectedEvent !== 'rc_race' ? '/ person' : '/ team'}
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep('details')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-bold text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Participant Details */}
        {step === 'details' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="py-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                  Lead Participant Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  placeholder="e.g. Aditya Singh"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="e.g. aditya@jecrc.ac.in"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  name="college"
                  placeholder="e.g. JECRC University"
                  value={formData.college}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            {passType === 'team' && selectedEvent !== 'rc_race' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="teamName"
                    placeholder="e.g. Kinetic Smashers"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                    Team Members (2 to 5) *
                  </label>
                  <select
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                  >
                    <option value="2">2 Members</option>
                    <option value="3">3 Members</option>
                    <option value="4">4 Members</option>
                    <option value="5">5 Members</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-5 py-2.5 rounded-full border border-white/20 text-zinc-300 hover:text-white text-sm font-condensed font-bold uppercase transition-colors"
              >
                Back
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-bold text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Proceed to Pay ₹{price}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Payment Options (Dynamic UPI & Razorpay Checkout) */}
        {step === 'payment' && (
          <div className="py-4 space-y-5">
            {/* Payment Method Selector Tabs */}
            <div>
              <label className="block text-xs font-condensed font-bold tracking-widest text-zinc-400 uppercase mb-2">
                CHOOSE PAYMENT METHOD
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('upi');
                    setPaymentError('');
                  }}
                  className={`p-3 sm:p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${paymentMethod === 'upi'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                    }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-red">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-condensed font-bold text-sm sm:text-base uppercase text-white leading-tight">
                      Instant UPI (QR / Apps)
                    </div>
                    <div className="text-[11px] text-zinc-400">GPay, PhonePe, Paytm, BHIM</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('razorpay');
                    setPaymentError('');
                  }}
                  className={`p-3 sm:p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${paymentMethod === 'razorpay'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                    }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-red">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-condensed font-bold text-sm sm:text-base uppercase text-white leading-tight">
                      Razorpay Gateway
                    </div>
                    <div className="text-[11px] text-zinc-400">Cards, NetBanking, UPI, Wallets</div>
                  </div>
                </button>
              </div>
            </div>

            {/* TAB 1: Instant UPI (QR Code + Deep Link + UTR Submission) */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4">
                {paymentError && (
                  <p role="alert" className="text-xs text-red-400 p-3 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{paymentError}</span>
                  </p>
                )}
                <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Dynamic Scannable QR Code */}
                    <div className="shrink-0 bg-white p-2.5 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                      <img
                        src={qrCodeUrl}
                        alt="Dynamic UPI QR Code"
                        className="w-36 h-36 sm:w-40 sm:h-40 block object-contain"
                      />
                      <span className="text-[10px] font-mono font-bold mt-1 text-black uppercase tracking-wider">
                        Scan with any UPI App
                      </span>
                    </div>

                    {/* Instructions & Actions */}
                    <div className="flex-1 text-left space-y-3 w-full">
                      <div>
                        <span className="text-xs text-zinc-400 uppercase tracking-wider block">Total Payable</span>
                        <span className="font-condensed font-black text-3xl text-white">
                          ₹{price}
                        </span>
                      </div>

                      {/* Copy UPI ID */}
                      <div className="flex items-center justify-between p-2.5 bg-black/50 border border-white/10 rounded-xl text-xs">
                        <span className="font-mono text-zinc-300 truncate mr-2">{upiId}</span>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-condensed font-bold text-xs uppercase transition-colors"
                        >
                          {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpi ? 'COPIED' : 'COPY UPI'}</span>
                        </button>
                      </div>

                      {/* Direct UPI App Intent Trigger (For Mobile Devices) */}
                      <button
                        type="button"
                        onClick={handleOpenUpiApp}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/20 font-condensed font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md active:scale-98"
                      >
                        <Smartphone className="w-4 h-4 text-brand-red" />
                        <span>Open in UPI App (1-Tap Pay)</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verification via UTR / Transaction ID */}
                <form onSubmit={handleVerifyUtr} className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-condensed font-bold text-zinc-300 uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Enter UPI Reference Number (UTR) to Verify</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="e.g. 426891048215 (12-digit UTR)"
                        value={utrNumber}
                        onChange={(e) => {
                          setUtrNumber(e.target.value.replace(/\D/g, '').slice(0, 12));
                          if (utrError) setUtrError('');
                          if (paymentError) setPaymentError('');
                        }}
                        inputMode="numeric"
                        maxLength={12}
                        pattern="\d{12}"
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/20 text-white text-sm font-mono focus:outline-none focus:border-brand-red"
                      />
                      {utrError && (
                        <p role="alert" className="text-xs text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{utrError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white font-condensed font-bold text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {isProcessing ? 'Verifying...' : 'Verify & Generate Pass'}
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    * Found in your UPI app receipt under &apos;UPI Ref No.&apos; or &apos;UTR&apos;.
                  </p>
                </form>
              </div>
            )}

            {/* TAB 2: Online Payment Gateway (Razorpay Checkout) */}
            {paymentMethod === 'razorpay' && (
              <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-6 text-center space-y-5">
                {paymentError && (
                  <p role="alert" className="text-xs text-red-400 p-3 rounded-xl border border-red-500/40 bg-red-500/10 flex items-center gap-2 text-left">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{paymentError}</span>
                  </p>
                )}
                <div className="w-16 h-16 rounded-2xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center mx-auto text-brand-red">
                  <CreditCard className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-condensed font-black text-2xl uppercase tracking-wider text-white">
                    Razorpay Secure Checkout
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Pay securely using Indian Credit or Debit Cards (Visa, Mastercard, RuPay), NetBanking (SBI, HDFC, ICICI, Axis), UPI, or Wallets.
                  </p>
                </div>

                <div className="inline-flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-zinc-300">
                  <span>Payable Amount:</span>
                  <span className="font-condensed font-black text-xl text-white">₹{price}</span>
                </div>

                <div>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handlePayViaRazorpay}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-3.5 rounded-full bg-brand-red hover:bg-brand-redDark disabled:opacity-50 text-white font-condensed font-black text-base uppercase tracking-wider shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{isProcessing ? 'Connecting to Razorpay...' : `Pay ₹${price} via Razorpay`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[11px] text-zinc-500">
                  * 100% compliant with Indian banking standards, RBI guidelines, and UPI 2.0.
                </p>
              </div>
            )}

            {/* Back Navigation Button */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-5 py-2.5 rounded-full border border-white/20 text-zinc-300 hover:text-white text-xs font-condensed font-bold uppercase transition-colors"
              >
                Back to Details
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="text-xs text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Registration Confirmed & Official Digital E-Pass */}
        {step === 'success' && confirmedTicket && (
          <div className="py-4 space-y-5 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs font-condensed font-bold tracking-widest text-emerald-400 uppercase">
                PAYMENT VERIFIED & CONFIRMED
              </div>
              <h3 className="font-condensed font-black text-2xl sm:text-3xl uppercase tracking-wider text-white mt-1">
                YOU ARE ENTERED IN THE ARENA
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Save or screenshot this official event pass. Present it at the entrance desk.
              </p>
            </div>

            {/* Official Digital E-Pass Badge */}
            <div id="printable-ticket" className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-white/20 rounded-3xl p-5 sm:p-6 text-left shadow-2xl space-y-4">
              {/* Pass Top Banner */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <div className="font-condensed font-black text-lg text-white tracking-wider uppercase">
                    JUMAKERSPACE <span className="text-brand-red">X RED BULL</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase">
                    {eventPassTitles[selectedEvent]}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-condensed text-zinc-400 tracking-wider">Pass ID</div>
                  <div className="font-mono font-bold text-sm text-brand-red tracking-wider">
                    {confirmedTicket.ticketId}
                  </div>
                </div>
              </div>

              {/* Pass Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Competition</span>
                  <strong className="text-white uppercase font-condensed font-bold text-sm block truncate">
                    {eventNames[selectedEvent]}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Participant</span>
                  <strong className="text-white uppercase font-condensed font-bold text-sm block truncate">
                    {formData.name || 'Participant'}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Format</span>
                  <strong className="text-white uppercase font-condensed font-bold text-sm block">
                    {passType === 'team' && selectedEvent !== 'rc_race'
                      ? `Team (${formData.teamSize} Members)`
                      : 'Solo Pass'}
                  </strong>
                </div>

                {passType === 'team' && selectedEvent !== 'rc_race' && formData.teamName && (
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 block">Squad Name</span>
                    <strong className="text-white uppercase font-condensed font-bold text-sm block truncate">
                      {formData.teamName}
                    </strong>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Institution</span>
                  <strong className="text-zinc-300 font-condensed font-bold text-xs block truncate">
                    {formData.college || 'JECRC University'}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Venue & Date</span>
                  <strong className="text-zinc-300 font-condensed font-bold text-xs block">
                    Central Lawn, JECRC &middot; 29-30 Sept
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase text-zinc-500 block">Transaction Reference</span>
                  <span className="font-mono text-xs text-emerald-400 block truncate">
                    {confirmedTicket.txnRef}
                  </span>
                </div>
              </div>

              {/* Pass Footer Strip */}
              <div className="pt-3 border-t border-dashed border-white/20 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Method: <strong className="text-white">{confirmedTicket.method}</strong></span>
                <span>Amount Paid: <strong className="text-emerald-400 font-bold font-mono">₹{confirmedTicket.paidAmount}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/20 hover:border-white text-white font-condensed font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save Ticket</span>
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
