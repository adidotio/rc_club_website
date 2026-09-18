import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FooterProps {
  onGetPassClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGetPassClick }) => {
  return (
    <footer 
      id="faq" 
      className="relative w-full p-0 m-0 overflow-hidden bg-black select-none leading-none border-t border-white/10"
    >
      {/* Full-width Aspect Ratio Container preserving 1920x872 */}
      <div className="relative w-full aspect-[1920/872] block">
        {/* Base Background Image */}
        <img
          src="/images/footer_img.png"
          alt="07 Ready to Enter? - Same People. Bigger Machines. See you at the arena."
          className="w-full h-full object-cover block"
        />

        {/* 'GET YOUR PASS ->' Button Overlay matching the reference design */}
        <div 
          className="absolute z-10 -translate-x-1/2"
          style={{
            top: '48.2%',
            left: '50%',
            width: '18%',
            height: '7.0%',
          }}
        >
          <button
            type="button"
            onClick={onGetPassClick}
            className="w-full h-full rounded-xl sm:rounded-2xl bg-[#ff0000] hover:bg-[#e00000] text-black font-condensed font-black tracking-wider uppercase flex items-center justify-center gap-2 sm:gap-3 shadow-2xl shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer text-[clamp(10px,1.22vw,24px)]"
          >
            <span>GET YOUR PASS</span>
            <ArrowRight className="w-[1.2em] h-[1.2em] stroke-[2.5] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};
