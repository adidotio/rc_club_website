import React from 'react';


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

        {/* Invisible hotspot for EXPLORE PASSES text on the image */}
        <button
          type="button"
          onClick={onExploreClick}
          title="Explore Passes"
          className="absolute z-10 cursor-pointer rounded hover:bg-white/[0.04] transition-all duration-300"
          style={{
            bottom: '8%',
            left: '3%',
            width: '18%',
            height: '10%',
          }}
        />

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
