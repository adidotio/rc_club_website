import React from 'react';

export const About: React.FC = () => {
  return (
    <section 
      id="about" 
      className="relative w-full p-0 m-0 overflow-hidden bg-black select-none leading-none"
    >
      {/* Full-width edge-to-edge ticket container without any black margins or padding */}
      <div className="relative w-full aspect-[1920/454] block">
        {/* The Ticket Graphic Image */}
        <img
          src="/images/about_img.png"
          alt="01 About The Event - Engineering In Action"
          className="w-full h-full object-cover block"
        />

        {/* Text Overlay: Aligned strictly beneath 'ENGINEERING IN ACTION.' */}
        <div 
          className="absolute z-10 pointer-events-none"
          style={{
            top: '63.2%',
            left: '20.0%',
            maxWidth: '43%',
          }}
        >
          <p className="font-sans text-black font-normal leading-[1.36] tracking-tight text-[clamp(9px,1.38vw,26px)]">
            JUMakerspace brings competitive engineering challenges<br className="hidden sm:inline" />
            {' '}and interactive technological demonstrations together,<br className="hidden sm:inline" />
            {' '}creating an engaging, spectator-friendly experience.
          </p>
        </div>
      </div>
    </section>
  );
};
