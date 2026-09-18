import React, { useState } from 'react';
import { X, Check, QrCode, Sparkles, ShieldAlert, Users, User, ArrowRight } from 'lucide-react';

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
  const [ticketWindow, setTicketWindow] = useState<'early' | 'last_chance'>('early');
  const [passType, setPassType] = useState<'individual' | 'team'>('team');
  const [step, setStep] = useState<'select' | 'details' | 'payment'>('select');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: 'JECRC University',
    teamName: '',
    teamSize: '3',
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetAndClose = () => {
    setStep('select');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-xs font-condensed font-bold tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              OFFICIAL EVENT PASS
            </div>
            <h2 className="font-condensed font-black text-3xl sm:text-4xl text-white tracking-wider uppercase leading-none">
              GET YOUR PASS
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
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedEvent === 'destroy'
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
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedEvent === 'soccer'
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
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedEvent === 'rc_race'
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
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ticketWindow === 'early'
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
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        ticketWindow === 'last_chance'
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
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        passType === 'individual'
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
                      className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                        passType === 'team'
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

        {/* Step 3: UPI QR & Confirmation */}
        {step === 'payment' && (
          <div className="py-5 text-center space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-red/20 text-brand-red border border-brand-red/40 mx-auto">
              <QrCode className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-condensed font-black text-2xl uppercase tracking-wider text-white">
                SCAN & PAY VIA UPI
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                Scan using any UPI App (GPay, PhonePe, Paytm). Amount:{' '}
                <strong className="text-white text-sm">₹{price}</strong>
              </p>
            </div>

            {/* QR Mock Display */}
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
              <div className="w-full h-full border-2 border-dashed border-zinc-300 rounded-xl flex flex-col items-center justify-center p-2 text-black">
                <QrCode className="w-28 h-28 text-black" />
                <span className="text-[10px] font-mono font-bold mt-1 uppercase text-zinc-700">
                  {selectedEvent === 'rc_race' ? 'VENDOR-RC-RACE-UPI' : 'JUMAKERSPACE@UPI'}
                </span>
              </div>
            </div>

            <div className="text-xs text-zinc-400">
              UPI ID: <span className="font-mono text-white font-bold">{selectedEvent === 'rc_race' ? 'vendor.racing@okaxis' : 'makerspace.ju@okhdfcbank'}</span>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-xs text-emerald-400 flex items-center justify-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>After paying, keep the transaction screenshot ready at desk verification!</span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-5 py-2.5 rounded-full border border-white/20 text-zinc-300 hover:text-white text-xs font-condensed font-bold uppercase"
              >
                Back
              </button>
              <button
                type="button"
                onClick={resetAndClose}
                className="px-8 py-2.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white text-xs font-condensed font-bold uppercase tracking-wider shadow-lg shadow-red-600/30"
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
