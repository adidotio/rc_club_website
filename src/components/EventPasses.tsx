import React from 'react';
import { ArrowRight } from 'lucide-react';

interface EventPassesProps {
  onSelectPass: (event: 'destroy' | 'soccer' | 'rc_race') => void;
  onExploreClick: () => void;
}

export const EventPasses: React.FC<EventPassesProps> = ({ onSelectPass, onExploreClick }) => {
  return (
    <section 
      id="schedule" 
      className="relative w-full p-0 m-0 overflow-hidden bg-black select-none leading-none border-t border-white/10"
    >
      {/* Aspect Ratio Container preserving 1920x528 */}
      <div className="relative w-full aspect-[1920/528] block">
        {/* Background Graphic */}
        <img
          src="/images/event_img.png"
          alt="03 Event Passes - Your Access To The Arena"
          className="w-full h-full object-cover block"
        />

        {/* Left Side Text Content Overlay */}
        <div 
          className="absolute z-10 flex flex-col justify-between"
          style={{
            top: '43.5%',
            left: '5.2%',
            maxWidth: '13.5%',
            bottom: '10%',
          }}
        >
          {/* Headline & Subtitle */}
          <div>
            <h2 className="font-condensed font-black tracking-tight text-white uppercase leading-[0.92] text-[clamp(11px,1.42vw,28px)]">
              YOUR ACCESS<br />TO THE ARENA
            </h2>
            <p className="font-sans text-zinc-300 font-normal leading-tight text-[clamp(7.5px,0.85vw,16px)] mt-2 sm:mt-2.5">
              Three unique experiences.<br />One epic day.
            </p>
          </div>

          {/* EXPLORE PASSES -> CTA */}
          <div>
            <button
              type="button"
              onClick={onExploreClick}
              className="group font-condensed font-bold uppercase tracking-wider text-white hover:text-brand-red text-[clamp(8px,0.92vw,17px)] border-b border-white hover:border-brand-red transition-all duration-200 inline-flex items-center gap-1.5 cursor-pointer pb-0.5 whitespace-nowrap"
            >
              <span>EXPLORE PASSES</span>
              <ArrowRight className="w-[1.1em] h-[1.1em] transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Interactive Clickable Hotspots for the 3 Tilted Passes */}
        {/* Pass 1: Soccer Fiesta */}
        <button
          type="button"
          onClick={() => onSelectPass('soccer')}
          title="Get Soccer Fiesta Pass"
          className="absolute rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all duration-300"
          style={{
            top: '25%',
            left: '21%',
            width: '24%',
            height: '65%',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* Pass 2: Destroy-a-thon */}
        <button
          type="button"
          onClick={() => onSelectPass('destroy')}
          title="Get Destroy A-Thon Pass"
          className="absolute rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all duration-300"
          style={{
            top: '25%',
            left: '43%',
            width: '24%',
            height: '65%',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* Pass 3: Offroad Reckoning */}
        <button
          type="button"
          onClick={() => onSelectPass('rc_race')}
          title="Get Offroad Reckoning Pass"
          className="absolute rounded-2xl cursor-pointer hover:bg-white/[0.04] transition-all duration-300"
          style={{
            top: '25%',
            left: '65%',
            width: '24%',
            height: '65%',
            transform: 'rotate(-25deg)',
          }}
        />
      </div>
    </section>
  );
};
