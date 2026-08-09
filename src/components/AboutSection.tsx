import React from 'react';
import { AboutCard } from '../types';
import { IconRenderer } from './IconRenderer';
import { Check } from 'lucide-react';

interface AboutSectionProps {
  aboutCards: AboutCard[];
}

export const AboutSection: React.FC<AboutSectionProps> = ({ aboutCards }) => {
  return (
    <section id="about" className="py-24 bg-[#efece5] relative overflow-hidden">
      
      {/* Background Subtle Lines */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004643]/10 text-[#004643] text-xs font-bold">
            <span>من نحن ورسالتنا وقيمنا</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#004643] font-['Tajawal']">
            رؤيتنا وشغفنا لبناء هويتك الرقمية المتكاملة
          </h2>
          <p className="text-base text-[#004643]/80 font-medium">
            تأسست وكالة فراغ لتقدم منظوراً جديداً في سوق التسويق الرقمي والحلول البرمجية، مبنياً على الشفافية والإبداع المستمر.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => (
            <div
              key={card.id || index}
              className="bg-white rounded-3xl p-8 border border-[#004643]/15 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Top Decorative Border */}
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#004643] group-hover:bg-[#0ff5b0] transition-colors" />

              <div>
                {/* Icon Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#004643] flex items-center justify-center text-[#0ff5b0] shadow-md group-hover:rotate-6 transition-transform">
                    <IconRenderer name={card.iconName} size={28} color="#0ff5b0" />
                  </div>
                  <span className="text-xs font-bold text-[#004643]/40 bg-[#004643]/5 px-3 py-1 rounded-full">
                    0{index + 1}
                  </span>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-2xl font-black text-[#004643] mb-3 font-['Tajawal']">
                  {card.title}
                </h3>
                <p className="text-sm text-[#004643]/80 leading-relaxed mb-6 font-medium">
                  {card.description}
                </p>

                {/* Dynamic Content Items / Points */}
                {card.items && card.items.length > 0 && (
                  <div className="pt-4 border-t border-[#004643]/10 space-y-2.5">
                    <span className="text-xs font-bold text-[#004643]/60 block mb-2">
                      العناصر والمميزات الرئيسية:
                    </span>
                    {card.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#0ff5b0]/20 flex items-center justify-center text-[#004643] shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[#004643] stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-[#004643]">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Subtle Tag */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#004643]/60">
                <span>Faragh Agency</span>
                <span className="text-[#0ff5b0] font-bold">جودة واستدامة</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
