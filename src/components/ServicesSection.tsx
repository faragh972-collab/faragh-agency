import React from 'react';
import { ServiceItem, AgencyInfo } from '../types';
import { IconRenderer } from './IconRenderer';
import { MessageCircle, ArrowUpLeft, CheckCircle2, Sparkles } from 'lucide-react';

interface ServicesSectionProps {
  services: ServiceItem[];
  agencyInfo: AgencyInfo;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, agencyInfo }) => {
  const getWhatsAppLink = (service: ServiceItem) => {
    const text = service.whatsappMessageCustom || `مرحباً وكالة فراغ، أود طلب خدمة (${service.title}).`;
    const cleanPhone = agencyInfo.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="services" className="py-24 bg-[#004643] text-[#efece5] relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0ff5b0]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0d5f5b]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0ff5b0]/20 text-[#0ff5b0] text-xs font-bold border border-[#0ff5b0]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خدماتنا الاحترافية</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-['Tajawal'] leading-tight">
            حلول تسويقية وبرمجية متكاملة تضمن تفوقك
          </h2>
          <p className="text-base text-[#efece5]/80 font-medium">
            نوفر لك منظومة متكاملة لربط كافة جوانب مشروعك الرقمي، من التصميم إلى البرمجة والحملات الإعلانية المباشرة.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between relative group ${
                service.popular
                  ? 'bg-[#003331] border-[#0ff5b0] shadow-xl shadow-[#0ff5b0]/5'
                  : 'bg-[#003b38] border-white/10 hover:border-[#0ff5b0]/50 shadow-lg'
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3.5 right-6 px-3.5 py-1 bg-[#0ff5b0] text-[#004643] text-xs font-black rounded-full shadow-md">
                  الأكثر طلباً 🌟
                </div>
              )}

              <div>
                {/* Service Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-[#0ff5b0] group-hover:scale-110 group-hover:bg-[#0ff5b0] group-hover:text-[#004643] transition-all">
                    <IconRenderer name={service.iconName} size={28} color={service.popular ? '#0ff5b0' : undefined} />
                  </div>
                  <span className="text-xs font-extrabold text-[#0ff5b0] bg-[#0ff5b0]/10 px-3 py-1 rounded-full border border-[#0ff5b0]/20">
                    Faragh Service
                  </span>
                </div>

                {/* Service Title & Description */}
                <h3 className="text-2xl font-black text-white mb-3 font-['Tajawal']">
                  {service.title}
                </h3>
                <p className="text-sm text-[#efece5]/80 leading-relaxed mb-6 font-medium">
                  {service.description}
                </p>

                {/* Dynamic Features List (Admin can add/remove from Dashboard) */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-3 mb-8 pt-4 border-t border-white/10">
                    <span className="text-xs font-bold text-[#0ff5b0] block">
                      عناصر ومميزات الخدمة:
                    </span>
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0ff5b0] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-[#efece5]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Now Button (Redirects to WhatsApp) */}
              <div className="pt-4 border-t border-white/10">
                <a
                  href={getWhatsAppLink(service)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-5 bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643] font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4 fill-[#004643]/20" />
                  <span>اطلب الآن عبر الواتساب</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
