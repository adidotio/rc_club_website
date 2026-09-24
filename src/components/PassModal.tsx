import React, { useState } from 'react';
import { X, Check, Sparkles, ShieldAlert, Users, User, ArrowRight, Clock } from 'lucide-react';
import { TICKET_WINDOWS, getWindowStatus, formatTimeLeft, TicketWindowId } from '../utils/tickets';

interface PassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: 'destroy' | 'soccer' | 'rc_race';
}


export const PassModal: React.FC<PassModalProps> = ({ isOpen, onClose, initialEvent = 'destroy' }) => {
  const [selectedEvent, setSelectedEvent] = useState<'destroy' | 'soccer' | 'rc_race'>(initialEvent);

  React.useEffect(() => {
    if (initialEvent) {
      setSelectedEvent(initialEvent);
    }
  }, [initialEvent, isOpen]);
  const [ticketWindow, setTicketWindow] = useState<TicketWindowId>(() => {
    const active = TICKET_WINDOWS.find((w) => getWindowStatus(w, new Date()) === 'active');
    return active ? active.id : 'early';
  });
  const [passType, setPassType] = useState<'individual' | 'team'>('team');
  const [step, setStep] = useState<'select' | 'details' | 'payment'>('select');
  const [isProcessing, setIsProcessing] = useState(false);
  const [now, setNow] = useState(new Date());

  React.useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

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

  // Calculate pricing
  let price = 0;
  if (selectedEvent === 'rc_race') {
    price = 299; // External Vendor price
  } else {
    const windowConfig = TICKET_WINDOWS.find((w) => w.id === ticketWindow);
    if (windowConfig) {
      price = passType === 'individual' ? windowConfig.prices.individual : windowConfig.prices.team;
    }
  }

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
              12th &middot; 13th October 2026 &middot; Central Lawn, JECRC
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TICKET_WINDOWS.map((window) => {
                      const status = getWindowStatus(window, now);
                      const isSelected = ticketWindow === window.id;
                      const isLocked = status !== 'active';

                      return (
                        <button
                          key={window.id}
                          type="button"
                          disabled={isLocked}
                          onClick={() => setTicketWindow(window.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                            isSelected && !isLocked
                              ? 'border-brand-red bg-brand-red/15'
                              : isLocked
                              ? 'border-white/5 bg-zinc-900/40 opacity-75 cursor-not-allowed'
                              : 'border-white/10 bg-zinc-900/60 hover:border-white/30'
                          }`}
                        >
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-condensed font-bold text-base uppercase">{window.name}</span>
                                {status === 'active' && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400">
                                {window.startDate.getDate()} {window.startDate.toLocaleString('default', { month: 'short' })} – {window.endDate.getDate()} {window.endDate.toLocaleString('default', { month: 'short' })}
                              </div>
                            </div>

                            {status === 'upcoming' && (
                              <div className="mt-2 pt-2 border-t border-white/5">
                                <div className="text-[9px] text-brand-red font-bold uppercase mb-0.5">Starts in</div>
                                <div className="flex items-center gap-1 text-xs font-mono text-zinc-300">
                                  <Clock className="w-3 h-3 text-brand-red" />
                                  {formatTimeLeft(window.startDate, now)}
                                </div>
                              </div>
                            )}
                            
                            {status === 'expired' && (
                              <div className="mt-2 pt-2 border-t border-white/5">
                                <div className="text-[10px] text-zinc-500 font-bold uppercase">Expired</div>
                              </div>
                            )}

                            {status === 'active' && (
                              <div className="mt-2 pt-2 border-t border-white/5">
                                <div className="text-[9px] text-emerald-500 font-bold uppercase mb-0.5">Ends in</div>
                                <div className="flex items-center gap-1 text-xs font-mono text-zinc-300">
                                  <Clock className="w-3 h-3 text-emerald-500" />
                                  {formatTimeLeft(window.endDate, now)}
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
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
                        <div className="text-[11px] text-zinc-400">We'll make the team for these</div>
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
                        <div className="text-[11px] text-zinc-400">2 – 4 members squad</div>
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

              {(() => {
                const currentWindowConfig = TICKET_WINDOWS.find((w) => w.id === ticketWindow);
                const isLocked = selectedEvent !== 'rc_race' && currentWindowConfig && getWindowStatus(currentWindowConfig, now) !== 'active';
                return (
                  <button
                    type="button"
                    disabled={isLocked || false}
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

            {passType === 'team' && selectedEvent !== 'rc_race' && (
              <>
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
                      Team Size (2 to 4) *
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
                    </select>
                  </div>
                </div>

                {Array.from({ length: parseInt(formData.teamSize) - 1 }).map((_, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-condensed font-bold tracking-wider text-zinc-300 uppercase mb-1.5">
                      Member {idx + 2} Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.teamMembers[idx] || ''}
                      onChange={(e) => {
                        const updatedMembers = [...formData.teamMembers];
                        updatedMembers[idx] = e.target.value;
                        setFormData({ ...formData, teamMembers: updatedMembers });
                      }}
                      placeholder={`e.g. Member ${idx + 2} Name`}
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/15 text-white text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                ))}
              </>
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
                <strong className="text-white">{selectedEvent === 'destroy' ? 'Destroy-a-thon' : selectedEvent === 'soccer' ? 'Robo Soccer' : 'RC Car Race'}</strong>{' '}
                has been confirmed.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-left max-w-sm mx-auto">
              <div className="text-xs text-zinc-400 mb-1">Pass Type</div>
              <div className="font-bold text-white uppercase text-sm mb-3">
                {passType} {selectedEvent !== 'rc_race' && (passType === 'team' ? `(${formData.teamSize} Members)` : '')}
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
