import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

interface HeroProps {
  onGetPassClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetPassClick }) => {
  return (
    <section id="home" className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-between select-none">
      {/* Aspect Container for exact desktop visual fidelity matching 1920x1041 design mock */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Background Image Layer */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{
            backgroundImage: `url('/images/hero.png')`,
            backgroundPosition: 'center 30%',
          }}
        >
          {/* Subtle edge vignette for seamless deep black blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 opacity-70" />
        </div>

        {/* Desktop Exact Relative Positioning Container (Active on lg+ screens, scales cleanly) */}
        <div className="hidden lg:block relative w-full max-w-[1920px] aspect-[1920/1041] mx-auto pointer-events-none">
          {/* 1. Left Side: Event Details Badge (Date & Venue) */}
          <div 
            className="absolute pointer-events-auto"
            style={{
              top: '62.5%',
              left: '3.6%',
            }}
          >
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-white/20 bg-black/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/40">
              {/* Calendar Icon + Date */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border-2 border-white/80 flex flex-col items-center justify-center p-0.5">
                  <div className="w-full h-1 bg-white/80 rounded-t-sm mb-0.5" />
                  <div className="grid grid-cols-3 gap-0.5 w-4/5 h-3/5">
                    <span className="w-1 h-1 bg-white rounded-full" />
                    <span className="w-1 h-1 bg-white rounded-full" />
                    <span className="w-1 h-1 bg-white rounded-full" />
                    <span className="w-1 h-1 bg-white rounded-full" />
                    <span className="w-1 h-1 bg-white rounded-full" />
                    <span className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </div>
                <span className="font-condensed font-extrabold text-white text-lg xl:text-xl tracking-wider uppercase">
                  12-13 OCTOBER 2026
                </span>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-9 bg-white/30" />

              {/* Location Pin + Venue */}
              <div className="flex items-center gap-2.5">
                <MapPin className="w-6 h-6 text-white fill-white shrink-0" />
                <div className="flex flex-col">
                  <span className="font-condensed font-extrabold text-white text-base xl:text-lg tracking-wider uppercase leading-none">
                    JECRC UNIVERSITY
                  </span>
                  <span className="text-zinc-400 text-xs xl:text-sm font-normal mt-0.5 tracking-wide">
                    American Football Ground
                  </span>
                </div>
              </div>
            </div>

            {/* Primary 'GET YOUR PASS' Button */}
            <div className="mt-5">
              <button
                onClick={onGetPassClick}
                className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-black text-lg xl:text-xl tracking-wider uppercase shadow-xl shadow-red-600/40 hover:shadow-red-600/60 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>GET YOUR PASS</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>
          </div>

          {/* 2. Right Side: Typography Above Cards */}
          <div 
            className="absolute pointer-events-auto text-right"
            style={{
              top: '22%',
              right: '3.6%',
            }}
          >
            <div className="font-condensed font-black text-3xl xl:text-4xl text-white uppercase tracking-wider leading-[1.05] drop-shadow-md">
              <p>PEOPLE</p>
              <p>IDEAS</p>
              <p>MACHINES</p>
              <p>A BIGGER</p>
              <p>TOMORROW</p>
            </div>
          </div>

          {/* 3. Right Side: Caption Below Cards */}
          <div 
            className="absolute pointer-events-auto text-left max-w-[320px] xl:max-w-[360px]"
            style={{
              top: '76%',
              right: '12%',
            }}
          >
            <div className="space-y-1.5 drop-shadow-md">
              <h3 className="font-condensed font-black text-base xl:text-lg tracking-widest uppercase">
                <span className="text-white">JUMAKERSPACE</span>
              </h3>
              <p className="font-sans text-zinc-300 text-xs xl:text-sm font-medium tracking-wide uppercase leading-snug">
                A HIGH-ENERGY EVENT BRINGING TOGETHER ENGINEERING, INNOVATION AND YOUTH CULTURE.
              </p>
            </div>
          </div>

          {/* 4. Interactive Hover Overlays for the 3 Cards */}
          <div
            className="absolute pointer-events-auto grid grid-cols-3 gap-3"
            style={{
              top: '47.3%',
              right: '3.6%',
              width: '27.5%',
              height: '25.5%',
            }}
          >
            {/* Card 1: Offroad Reckoning */}
            <a 
              href="#experience" 
              title="RC Car Race / Offroad Reckoning"
              className="rounded-2xl transition-all duration-300 hover:ring-2 hover:ring-brand-cyan/60 hover:scale-[1.03] group cursor-pointer"
            />
            {/* Card 2: Robo Soccer */}
            <a 
              href="#experience" 
              title="Robo Soccer Fiesta"
              className="rounded-2xl transition-all duration-300 hover:ring-2 hover:ring-amber-400/60 hover:scale-[1.03] group cursor-pointer"
            />
            {/* Card 3: Destroy-a-thon */}
            <a 
              href="#experience" 
              title="Destroy-a-thon Tower Crash"
              className="rounded-2xl transition-all duration-300 hover:ring-2 hover:ring-brand-red/60 hover:scale-[1.03] group cursor-pointer"
            />
          </div>

          {/* 5. Scroll Down Indicator on Far Right */}
          <a
            href="#experience"
            className="absolute pointer-events-auto flex items-center justify-center p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            style={{
              top: '80%',
              right: '2.5%',
            }}
            title="Scroll Down"
          >
            {/* Invisible clickable hit target over the printed 'SCROLL ↓' */}
            <div className="w-8 h-24 flex items-center justify-center" />
          </a>
        </div>

        {/* Mobile & Tablet Responsive Layout (Screen widths < 1024px) */}
        <div className="lg:hidden relative z-10 w-full px-5 pt-28 pb-16 flex flex-col justify-between min-h-screen">
          {/* Top Spacing / Spacer */}
          <div className="h-4" />

          {/* Mobile Center Graphic Accent */}
          <div className="my-auto py-8">
            <div className="inline-block bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-brand-red/30 mb-4">
              <span className="text-xs font-condensed font-bold tracking-widest text-brand-red uppercase">
                JUMAKERSPACE
              </span>
            </div>

            <h1 className="font-condensed font-black text-5xl sm:text-6xl text-white uppercase tracking-tight leading-none drop-shadow-2xl">
              BUILT FOR MORE
            </h1>
            <p className="font-mono text-zinc-400 text-xs sm:text-sm tracking-[0.2em] uppercase mt-2">
              RACE &middot; COMPETE &middot; BREAK &middot; CREATE
            </p>

            {/* Mobile Event Details Box */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border border-white/20 bg-black/70 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded border border-white/70 flex flex-col items-center justify-center p-0.5 shrink-0">
                  <div className="w-full h-0.5 bg-white/70 rounded-t-sm mb-0.5" />
                  <div className="grid grid-cols-3 gap-0.5 w-3/4 h-1/2">
                    <span className="w-0.5 h-0.5 bg-white rounded-full" />
                    <span className="w-0.5 h-0.5 bg-white rounded-full" />
                    <span className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                </div>
                <span className="font-condensed font-extrabold text-white text-base tracking-wider uppercase">
                  12-13 OCTOBER 2026
                </span>
              </div>

              <div className="hidden sm:block w-px h-6 bg-white/30" />

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-white fill-white shrink-0" />
                <div className="flex flex-col">
                  <span className="font-condensed font-extrabold text-white text-sm tracking-wider uppercase leading-tight">
                    JECRC UNIVERSITY
                  </span>
                  <span className="text-zinc-400 text-[11px] font-normal">
                    American Football Ground
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile CTA Button */}
            <div className="mt-6">
              <button
                onClick={onGetPassClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-black text-lg tracking-wider uppercase shadow-xl shadow-red-600/40 active:scale-95 transition-all"
              >
                <span>GET YOUR PASS</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Right Content Stack */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-black/60 backdrop-blur-md p-4 rounded-xl">
            <div className="font-condensed font-black text-xl sm:text-2xl text-white uppercase tracking-wide leading-tight">
              PEOPLE &middot; IDEAS &middot; MACHINES
            </div>
            <p className="text-zinc-400 text-xs uppercase tracking-wide max-w-xs">
              A high-energy event bringing together engineering, innovation and youth culture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
