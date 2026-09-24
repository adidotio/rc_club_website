import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onGetPassClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetPassClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', id: 'home' },
    { label: 'EXPERIENCE', id: 'experience' },
    { label: 'SCHEDULE', id: 'schedule' },
    { label: 'VENUE', id: 'venue' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5 md:py-6'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-14 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={() => setActiveSection('home')}
          className="group flex flex-col justify-center transition-transform duration-200 hover:scale-[1.02]"
        >
          <img 
            src="/images/logo.png" 
            alt="JUMakerspace" 
            className="h-16 sm:h-20 lg:h-24 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setActiveSection(link.id)}
                className={`font-condensed text-base lg:text-lg tracking-wider font-semibold uppercase transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-brand-red'
                    : 'text-zinc-200 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-full" />
                )}
              </a>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={onGetPassClick}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-red hover:bg-brand-redDark text-white font-condensed font-bold text-sm lg:text-base tracking-wider uppercase shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>GET YOUR PASS</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={onGetPassClick}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-brand-red text-white font-condensed font-bold text-xs tracking-wider uppercase shadow-md shadow-red-600/30"
          >
            <span>PASS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 transition-all duration-300">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => {
                  setActiveSection(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`font-condensed text-xl tracking-wider font-bold uppercase transition-colors ${
                  activeSection === link.id
                    ? 'text-brand-red'
                    : 'text-zinc-200 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onGetPassClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-brand-red text-white font-condensed font-bold text-base tracking-wider uppercase shadow-lg shadow-red-600/40"
              >
                <span>GET YOUR PASS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
