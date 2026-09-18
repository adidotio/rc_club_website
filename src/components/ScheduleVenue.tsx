import React from 'react';

export const ScheduleVenue: React.FC = () => {
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
          src="/images/venue_img.png"
          alt="04 Schedule & 05 Venue"
          className="w-full h-full object-cover block"
        />

        {/* --- 04 SCHEDULE (Top Row Overlay) --- */}
        {/* Right Area: Analog Clock + Announcement Text (Right of vertical divider at 56.2%) */}
        <div 
          className="absolute z-10 flex items-center gap-3 sm:gap-4 md:gap-5"
          style={{
            top: '0%',
            height: '38.2%',
            left: '58.8%',
            width: '39%',
          }}
        >
          {/* Custom Minimalist Analog Clock Matching Reference (Hands at ~7:00 / 12:00) */}
          <div 
            className="rounded-full border-[1.5px] sm:border-2 border-black flex items-center justify-center shrink-0 relative"
            style={{
              width: 'clamp(26px, 3.7vw, 68px)',
              height: 'clamp(26px, 3.7vw, 68px)',
            }}
          >
            {/* Center Pivot Dot */}
            <div className="w-1.5 h-1.5 bg-black rounded-full z-10" />

            {/* Minute Hand: Pointing straight UP (12:00) */}
            <div 
              className="absolute bg-black rounded-full"
              style={{
                bottom: '50%',
                left: 'calc(50% - 1px)',
                width: 'clamp(1.5px, 0.15vw, 2.5px)',
                height: '36%',
              }}
            />

            {/* Hour Hand: Pointing down-left (~7:00 / ~215 degrees) */}
            <div 
              className="absolute bg-black rounded-full origin-bottom"
              style={{
                bottom: '50%',
                left: 'calc(50% - 1px)',
                width: 'clamp(1.5px, 0.15vw, 2.5px)',
                height: '24%',
                transform: 'rotate(-140deg)',
              }}
            />
          </div>

          {/* Schedule Announcement Text */}
          <div className="flex flex-col justify-center">
            <p className="font-sans text-[#18181b] font-normal leading-[1.3] tracking-tight text-[clamp(8px,1.15vw,22px)]">
              Schedule will be announced soon.<br />
              Follow our channels for the latest updates.
            </p>
          </div>
        </div>

        {/* --- 05 VENUE (Bottom Row) --- */}
        {/* Note: As requested, the JECRC image space is kept completely empty */}
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
