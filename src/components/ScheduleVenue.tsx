import React, { useState, useEffect } from 'react';
import { TICKET_WINDOWS, getWindowStatus } from '../utils/tickets';

export const ScheduleVenue: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="relative w-full p-0 m-0 overflow-hidden bg-black select-none leading-none border-t border-white/10"
    >
      {/* Target Anchors for Navbar Links */}
      <div id="schedule" className="absolute top-0" />
      <div id="venue" className="absolute top-[38%]" />

      {/* Full-width aspect-ratio container preserving 1920x607 */}
      <div className="relative w-full aspect-[1920/607] block">
        {/* Base Background Image */}
        <img
          src="/images/venue.png"
          alt="04 Schedule & 05 Venue"
          className="w-full h-full object-cover block"
        />

        <div 
          className="absolute z-10 flex flex-col justify-center gap-1 sm:gap-2 pl-3 sm:pl-6 border-l-2 border-black/10"
          style={{
            top: '0%',
            height: '38.2%',
            left: '56.2%',
            width: '40%',
            overflow: 'hidden'
          }}
        >
          {TICKET_WINDOWS.map(window => {
            const status = getWindowStatus(window, now);
            const isActive = status === 'active';
            
            return (
              <div 
                key={window.id} 
                className={`flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border ${
                  isActive 
                    ? 'border-[#9b3322] bg-[#9b3322] shadow-md' 
                    : 'border-black/10 bg-black/5 opacity-[0.85]'
                } transition-all`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`font-condensed font-black uppercase text-[clamp(9px,1.3vw,20px)] leading-none ${isActive ? 'text-white' : 'text-black/85'}`}>
                      {window.name}
                    </span>
                    {isActive && (
                      <span className="text-[7px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-white text-[#9b3322] uppercase font-bold tracking-wider animate-pulse leading-none">
                        Active - Buy Now
                      </span>
                    )}
                  </div>
                  <div className={`text-[clamp(7px,0.9vw,14px)] font-mono leading-none mt-1 ${isActive ? 'text-white/80' : 'text-black/60'}`}>
                    {window.startDate.getDate()} {window.startDate.toLocaleString('default', { month: 'short' })} - {window.endDate.getDate()} {window.endDate.toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
                
                <div className="text-right flex flex-col gap-0.5">
                  <div className={`font-condensed font-bold text-[clamp(9px,1.1vw,18px)] leading-none ${isActive ? 'text-white' : 'text-black/60'}`}>
                    Ind: ₹{window.prices.individual}
                  </div>
                  <div className={`font-condensed font-bold text-[clamp(9px,1.1vw,18px)] leading-none ${isActive ? 'text-white' : 'text-black/60'}`}>
                    Team: ₹{window.prices.team}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- 05 VENUE (Bottom Row) --- */}
        {/* Interactive hotspot over JECRC UNIVERSITY text to open Google Maps */}
        <a
          href="https://maps.google.com/?q=JECRC+University+Jaipur"
          target="_blank"
          rel="noopener noreferrer"
          title="Open JECRC University in Google Maps"
          className="absolute z-10 cursor-pointer rounded-lg hover:bg-black/[0.04] transition-colors"
          style={{
            top: '60%',
            left: '9%',
            width: '23%',
            height: '35%',
          }}
        />


      </div>
    </section>
  );
};
