import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ExperienceProps {
  onSelectEvent: (event: 'destroy' | 'soccer' | 'rc_race' | 'expo') => void;
}

export const Experience: React.FC<ExperienceProps> = ({ onSelectEvent }) => {
  const cards = [
    {
      id: 'rc_race' as const,
      title: 'RC CAR RACE',
      arrowLeft: '35.1%',
      cardLeft: '20.0%',
      cardWidth: '18.5%',
    },
    {
      id: 'soccer' as const,
      title: 'ROBO SOCCER',
      arrowLeft: '55.5%',
      cardLeft: '40.3%',
      cardWidth: '18.5%',
    },
    {
      id: 'destroy' as const,
      title: 'DESTROY-A-THON',
      arrowLeft: '75.9%',
      cardLeft: '60.7%',
      cardWidth: '18.5%',
    },
    {
      id: 'expo' as const,
      title: 'PROJECT-EXPO',
      arrowLeft: '96.2%',
      cardLeft: '81.0%',
      cardWidth: '18.5%',
    },
  ];

  return (
    <section 
      id="experience" 
      className="relative w-full p-0 m-0 overflow-hidden bg-black select-none leading-none border-t border-white/10"
    >
      {/* Aspect Ratio Container preserving 1920x493 */}
      <div className="relative w-full aspect-[1920/493] block">
        {/* Background Graphic */}
        <img
          src="/images/exp_img.png"
          alt="02 Experience"
          className="w-full h-full object-cover block"
        />

        {/* Interactive Overlays for Each Card & Arrow Buttons */}
        {cards.map((card) => (
          <React.Fragment key={card.id}>
            {card.id === 'rc_race' ? (
              <>
                {/* Full Card Clickable Target with Subtle Hover Highlight */}
                <div
                  onClick={() => onSelectEvent(card.id)}
                  title={`View ${card.title} details`}
                  className="absolute top-[6.5%] bottom-[7.5%] rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.015] hover:bg-white/[0.03] active:scale-[0.99]"
                  style={{
                    left: card.cardLeft,
                    width: card.cardWidth,
                  }}
                />

                {/* Square [ → ] Arrow Button in Card Footer */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(card.id);
                  }}
                  title={`Explore ${card.title}`}
                  className="absolute z-20 flex items-center justify-center border border-white/70 hover:border-white rounded-md bg-black/60 hover:bg-white/20 transition-all duration-200 text-white cursor-pointer group shadow-md active:scale-95"
                  style={{
                    top: '81.5%',
                    left: card.arrowLeft,
                    width: '2.55%',
                    height: '10.2%',
                  }}
                >
                  <ArrowRight className="w-3/5 h-3/5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </>
            ) : (
              /* Disabled State Overlay */
              <div
                className="absolute flex items-center justify-center bg-black/50 rounded-[20px] backdrop-blur-[1px] cursor-not-allowed"
                style={{
                  top: '6.5%',
                  bottom: '7.5%',
                  left: card.cardLeft,
                  width: card.cardWidth,
                }}
              >
                <div className="px-3 py-1.5 bg-red-600 border-2 border-red-500 text-white font-condensed font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs md:text-sm lg:text-lg rounded shadow-2xl rotate-[-12deg] shadow-red-900/50 select-none">
                  Not Available
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
