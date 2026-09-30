import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';


interface PassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: 'destroy' | 'soccer' | 'rc_race' | 'offroad' | 'speed';
}

export const PassModal: React.FC<PassModalProps> = ({ isOpen, onClose, initialEvent = 'offroad' }) => {
  const [selectedEvent, setSelectedEvent] = useState<'destroy' | 'soccer' | 'rc_race' | 'offroad' | 'speed'>(
    (initialEvent === 'rc_race' || initialEvent === 'destroy' || initialEvent === 'soccer') ? 'offroad' : (initialEvent as any)
  );

  React.useEffect(() => {
    if (initialEvent) {
      if (initialEvent === 'rc_race' || initialEvent === 'destroy' || initialEvent === 'soccer') {
        setSelectedEvent('offroad');
      } else {
        setSelectedEvent(initialEvent);
      }
    }
  }, [initialEvent, isOpen]);

  const [step, setStep] = useState<'select' | 'details' | 'payment'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'JECRC University',
    teamName: '',
    teamSize: '3',
    teamMembers: ['', '', ''] as string[],
  });

  if (!isOpen) return null;

  // Fixed pricing for RC events
  const price = 299;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetAndClose = () => {
    setStep('select');
    setIsProcessing(false);
    onClose();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // 1. Create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price * 100 }), // amount in paise
      });
      
      const order = await response.json();
      
      if (!response.ok) {
        throw new Error(order.message || 'Failed to create order');
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: (import.meta as any).env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'JUMakerspace',
        description: 'Event Registration Pass',
        order_id: order.id,
        handler: async function (paymentResponse: any) {
          // 3. Verify payment
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                participantData: {
                  ...formData,
                  event: selectedEvent,
                  amount: price
                }
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.status === 'ok') {
              setStep('payment'); // Move to success step
            } else {
              alert('Payment verification failed: ' + verifyData.message);
            }
          } catch (error) {
            alert('Payment verification error. Please contact support.');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#E63946', // brand-red
        },
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (errorResponse: any) {
        alert('Payment Failed: ' + errorResponse.error.description);
      });
      rzp.open();
    } catch (error: any) {
      alert('Error initiating payment: ' + error.message);
    } finally {
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
              {step === 'payment' ? 'REGISTRATION CONFIRMED' : 'GET YOUR PASS'}
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              1st October 2026 &middot; Central Lawn, JECRC
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  className="p-4 rounded-2xl border text-left transition-all border-white/5 bg-zinc-900/40 opacity-75 cursor-not-allowed"
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Destroy-a-thon
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Tower crash challenge</div>
                  <div className="mt-2 text-xs font-mono font-bold text-zinc-600">NOT AVAILABLE</div>
                </button>

                <button
                  type="button"
                  disabled
                  className="p-4 rounded-2xl border text-left transition-all border-white/5 bg-zinc-900/40 opacity-75 cursor-not-allowed"
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Robo Soccer
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Arena bot soccer</div>
                  <div className="mt-2 text-xs font-mono font-bold text-zinc-600">NOT AVAILABLE</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedEvent('offroad')}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedEvent === 'offroad'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                    }`}
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Off-Roads Reckoning
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Conquer untamed terrain with raw power.</div>
                  <div className="mt-2 text-xs font-mono font-bold text-brand-red">RC Car Event</div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedEvent('speed')}
                  className={`p-4 rounded-2xl border text-left transition-all ${selectedEvent === 'speed'
                    ? 'border-brand-red bg-brand-red/15 shadow-lg shadow-red-600/20'
                    : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                    }`}
                >
                  <div className="font-condensed font-bold text-lg text-white uppercase leading-tight">
                    Speed Reckoning
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">Blistering speed on the ultimate track.</div>
                  <div className="mt-2 text-xs font-mono font-bold text-brand-red">RC Car Event</div>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 uppercase tracking-wider block">Registration Fee</span>
                <span className="font-condensed font-black text-3xl sm:text-4xl text-white">
                  ₹{price}{' '}
                </span>
                <div className="text-[10px] sm:text-xs text-brand-red font-bold uppercase mt-1 tracking-wider">
                  * Two participants allowed per registration
                </div>
              </div>

              {(() => {
                const isLocked = selectedEvent !== 'offroad' && selectedEvent !== 'speed';
                return (
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => setStep('details')}
                    className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-condensed font-bold text-base uppercase tracking-wider shadow-lg transition-all ${
                      isLocked
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-75'
                        : 'bg-brand-red hover:bg-brand-redDark text-white shadow-red-600/30 hover:scale-105 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <span>{isLocked ? 'Not Available' : 'Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })()}
            </div>
          </div>
        )}

        {/* Step 2: Participant Details */}
        {step === 'details' && (
          <form
            onSubmit={handlePayment}
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
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-bold text-base uppercase tracking-wider shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{isProcessing ? 'Processing...' : `Proceed to Pay ₹${price}`}</span>
                {!isProcessing && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success Confirmation */}
        {step === 'payment' && (
          <div className="py-5 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto">
              <Check className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-condensed font-black text-3xl uppercase tracking-wider text-white">
                PAYMENT SUCCESSFUL!
              </h3>
              <p className="text-sm text-zinc-400 mt-2 max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. Your registration for{' '}
                <strong className="text-white">
                  {selectedEvent === 'destroy' ? 'Destroy-a-thon' : selectedEvent === 'soccer' ? 'Robo Soccer' : selectedEvent === 'offroad' ? 'Off-Roads Reckoning' : 'Speed Reckoning'}
                </strong>{' '}
                has been confirmed.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-sm mx-auto">
              <div className="text-xs text-zinc-400 mb-1">Pass Type</div>
              <div className="font-bold text-white uppercase text-sm mb-3">
                Standard Pass
              </div>
              <div className="text-xs text-zinc-400 mb-1">Amount Paid</div>
              <div className="font-bold text-white text-lg">₹{price}</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center justify-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>You will receive an email confirmation shortly!</span>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-8 py-3 rounded-full bg-brand-red hover:bg-brand-redDark text-white text-sm font-condensed font-bold uppercase tracking-wider shadow-lg shadow-red-600/30 w-full max-w-sm"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
