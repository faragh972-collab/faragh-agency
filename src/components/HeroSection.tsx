import React from 'react';
import { HeroSection as HeroType, AgencyInfo } from '../types';
import { ArrowUpLeft, Sparkles, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface HeroSectionProps {
  hero: HeroType;
  agencyInfo: AgencyInfo;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero, agencyInfo }) => {
  const whatsappUrl = `https://wa.me/${agencyInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً وكالة فراغ، أود الحصول على استشارة تسويقية وبرمجية مجانية.')}`;

  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-[#004643] text-[#efece5]">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#0ff5b0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#0d5f5b]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-8">
          
          {/* Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#0ff5b0] text-xs sm:text-sm font-bold shadow-xs backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-[#0ff5b0] animate-pulse" />
              <span>{hero.badgeText}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-['Tajawal'] tracking-tight max-w-4xl mx-auto">
            {hero.mainTitle}{' '}
            <span className="relative inline-block text-[#0ff5b0]">
              <span className="relative z-10 underline decoration-white/30 decoration-wavy decoration-2 underline-offset-8">
                {hero.highlightedText}
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-[#efece5]/90 font-medium max-w-3xl mx-auto leading-relaxed">
            {hero.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643] font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 group"
            >
              <span>{hero.primaryButtonText}</span>
              <ArrowUpLeft className="w-5 h-5 text-[#004643] group-hover:-translate-x-1 transition-transform" />
            </a>

            <a
              href="#services"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base sm:text-lg rounded-2xl border border-white/25 transition-all flex items-center justify-center gap-2 shadow-xs backdrop-blur-sm"
            >
              <span>{hero.secondaryButtonText}</span>
            </a>
          </div>

          {/* Value Highlights */}
          <div className="pt-8 border-t border-white/15 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm font-semibold text-[#efece5]/90">
            <div className="flex items-center gap-2 justify-center bg-white/5 py-3 px-4 rounded-xl border border-white/10">
              <CheckCircle className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span>نتائج ملموسة وعائد مضمون</span>
            </div>
            <div className="flex items-center gap-2 justify-center bg-white/5 py-3 px-4 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span>دعم فني استثنائي 24/7</span>
            </div>
            <div className="flex items-center gap-2 justify-center bg-white/5 py-3 px-4 rounded-xl border border-white/10">
              <Zap className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span>خطط تناسب جميع الأعمال</span>
            </div>
          </div>

          {/* Stats Banner Pill */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-[#0ff5b0] flex items-center justify-center text-[#004643] shrink-0 shadow-sm font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#efece5]/70 block">نجاحاتنا المتواصلة</span>
                <span className="text-sm font-extrabold text-white block">
                  {hero.statsPillText || '🚀 أكثر من 60+ مشروع ناجح'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
