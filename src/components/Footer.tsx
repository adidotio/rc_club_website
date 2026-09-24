import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';

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
          src="/images/footer.png"
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

      {/* Contact Section */}
      <div id="contact" className="relative w-full bg-black py-16 px-6 sm:px-12 lg:px-24 border-t border-white/10 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="font-condensed font-black text-3xl sm:text-4xl text-white uppercase tracking-wider mb-2">
              CONTACT <span className="text-brand-red">US</span>
            </h3>
            <p className="text-zinc-400 text-sm font-sans tracking-wide max-w-sm">
              Have questions about the event? Reach out to us through our social channels or drop us an email.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/jumakerspace" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red shadow-lg transition-all duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest font-condensed">Follow Us</span>
                <span className="text-white font-sans font-medium text-sm sm:text-base group-hover:text-brand-red transition-colors">@jumakerspace</span>
              </div>
            </a>

            <div className="hidden sm:block w-px h-12 bg-white/20" />

            {/* Email */}
            <a 
              href="mailto:ju.makerspace@jecrcu.edu.in" 
              className="flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red shadow-lg transition-all duration-300 group-hover:scale-110">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest font-condensed">Email Us</span>
                <span className="text-white font-sans font-medium text-sm sm:text-base group-hover:text-brand-red transition-colors">ju.makerspace@jecrcu.edu.in</span>
              </div>
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};
