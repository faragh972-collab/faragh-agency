import React, { useState, useEffect } from 'react';
import { AgencyInfo } from '../types';
import { MessageCircle, Settings, Menu, X, ArrowUpLeft, Sparkles } from 'lucide-react';

interface NavbarProps {
  agencyInfo: AgencyInfo;
  onOpenDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ agencyInfo, onOpenDashboard }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'من نحن', href: '#about' },
    { name: 'خدماتنا', href: '#services' },
    { name: 'إحصائياتنا', href: '#stats' },
    { name: 'أعمالنا', href: '#portfolio' },
    { name: 'لماذا نحن وقيمنا', href: '#why-us' },
    { name: 'فريقنا', href: '#team' },
  ];

  const whatsappUrl = `https://wa.me/${agencyInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً وكالة فراغ، أود الاستفسار عن خدمات التسويق والبرمجة.')}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#efece5]/90 backdrop-blur-md shadow-md border-b border-[#004643]/10 py-3'
          : 'bg-[#004643]/90 backdrop-blur-md border-b border-white/10 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            {agencyInfo.logoUrl ? (
              <img
                src={agencyInfo.logoUrl}
                alt={agencyInfo.name}
                className="w-10 h-10 object-contain rounded-xl shadow-md group-hover:scale-105 transition-all bg-white/10 border border-white/20 p-1"
              />
            ) : (
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all ${
                isScrolled ? 'bg-[#004643] text-[#0ff5b0]' : 'bg-white/10 border border-white/20 text-[#0ff5b0]'
              }`}>
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
            )}
            <div>
              <span className={`text-xl font-bold block tracking-tight font-['Tajawal'] ${
                isScrolled ? 'text-[#004643]' : 'text-white'
              }`}>
                {agencyInfo.logoText || 'فراغ إيجنسي'}
              </span>
              <span className={`text-2xs font-medium block ${
                isScrolled ? 'text-[#004643]/70' : 'text-[#efece5]/80'
              }`}>
                {agencyInfo.name || 'Faragh Digital Agency'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full ${
            isScrolled
              ? 'bg-[#004643]/5 border border-[#004643]/10'
              : 'bg-white/10 border border-white/15'
          }`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  isScrolled
                    ? 'text-[#004643] hover:bg-[#004643] hover:text-[#efece5]'
                    : 'text-[#efece5] hover:bg-white/20 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-6 py-2.5 font-extrabold text-sm rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 group ${
                isScrolled
                  ? 'bg-[#004643] hover:bg-[#003331] text-[#efece5]'
                  : 'bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643]'
              }`}
            >
              <MessageCircle className="w-4 h-4 fill-current opacity-80" />
              <span>تواصل معنا</span>
              <ArrowUpLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-xl transition-colors ${
                isScrolled ? 'text-[#004643] bg-[#004643]/10 hover:bg-[#004643]/20' : 'text-white bg-white/10 hover:bg-white/20'
              }`}
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200 ${
          isScrolled ? 'bg-[#efece5] border-[#004643]/10' : 'bg-[#003835] border-white/10 text-white'
        }`}>
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-base font-bold rounded-xl transition-colors ${
                  isScrolled ? 'text-[#004643] hover:bg-[#004643]/10' : 'text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 bg-[#0ff5b0] text-[#004643] font-black rounded-xl shadow-md text-sm"
            >
              <MessageCircle className="w-5 h-5 text-[#004643]" />
              <span>تواصل عبر الواتساب</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
