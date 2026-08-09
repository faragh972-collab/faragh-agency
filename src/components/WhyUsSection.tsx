import React from 'react';
import { WhyUsSectionData, AgencyInfo } from '../types';
import { IconRenderer } from './IconRenderer';
import { Check, MessageCircle, ArrowUpLeft, Sparkles, Compass } from 'lucide-react';

interface WhyUsSectionProps {
  data?: WhyUsSectionData;
  agencyInfo: AgencyInfo;
}

export const WhyUsSection: React.FC<WhyUsSectionProps> = ({ data, agencyInfo }) => {
  const badgeText = data?.badgeText || '✨ التميز والرؤية المستقبلية';
  const mainTitle = data?.mainTitle || 'لماذا تختارنا، ما هي أهدافنا، وما هي القيم التي تقودنا؟';
  const subtitle = data?.subtitle || 'في وكالة فراغ، نجمع بين التفكير الاستراتيجي والالتزام الشديد بالجودة لنكون شريكك الأول نحو الريادة والنمو الرقمي المستدام.';

  const defaultPillars = [
    {
      id: 'pillar-1',
      type: 'why_us',
      title: 'لماذا تختارنا؟',
      badgeText: '01. الشغف والخبرة',
      iconName: 'ShieldCheck',
      description: 'نقدم حلولاً رقمية وتسويقية متكاملة تحت سقف واحد بدقة متناهية والتزام كامل بالمواعيد والنتائج القياسية.',
      points: [
        'خبرة واسعة وشاملة في الأسواق الخليجية والعربية',
        'حلول مخصصة تضمن أعلى نسبة عائد على الاستثمار (ROI)',
        'دعم فني واستشاري متواصل على مدار الساعة',
        'شفافية مطلقة وتقارير أداء دورية تفصيلية'
      ]
    },
    {
      id: 'pillar-2',
      type: 'goals',
      title: 'أهدافنا الاستراتيجية',
      badgeText: '02. الطموح والنمو',
      iconName: 'Target',
      description: 'نسعى لتمكين الشركاء والعلامات التجارية من فرض سيادتهم الرقمية وتحقيق قفزات نوعية في المبيعات والانتشار.',
      points: [
        'تحويل الرؤى والأفكار إلى مشاريع واقعية ناجحة',
        'مضاعفة المبيعات والقيمة السوقية لشركائنا بنسب قياسية',
        'التوسع المستمر واستخدام أحدث التقنيات وأدوات الذكاء الاصطناعي',
        'بناء علاقات شراكة مستدامة قائمة على النجاح المتبادل'
      ]
    },
    {
      id: 'pillar-3',
      type: 'values',
      title: 'قيمنا الموجهة',
      badgeText: '03. المبادئ الراسخة',
      iconName: 'Award',
      description: 'قيمنا هي المحرك الأساسي الذي يضمن سلامة مسيرتنا وجودة المخرجات في كل مشروع نعمل عليه.',
      points: [
        'الابتكار المستمر والتجدد الإبداعي',
        'الجودة والاتقان في أصغر التفاصيل',
        'النزاهة والصدق في التعامل والتسعير',
        'الالتزام المطلق بالسرعة والمواعيد المحددة'
      ]
    }
  ];

  const pillars = (data?.pillars && data.pillars.length > 0) ? data.pillars : defaultPillars;

  const whatsappUrl = `https://wa.me/${agencyInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً وكالة فراغ، أود الاستفسار عن تفاصيل خدماتكم وكيفية البدء معنا.')}`;

  return (
    <section id="why-us" className="py-24 bg-gradient-to-b from-[#efece5] via-white to-[#efece5] relative overflow-hidden">
      
      {/* Decorative background glow circles */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#004643]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#0ff5b0]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004643]/10 text-[#004643] text-xs font-black tracking-wide border border-[#004643]/15 shadow-xs">
            <Compass className="w-4 h-4 text-[#004643]" />
            <span>{badgeText}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#004643] font-['Tajawal'] leading-tight">
            {mainTitle}
          </h2>

          <p className="text-base sm:text-lg text-[#004643]/80 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={pillar.id || idx}
              className="bg-white rounded-3xl p-8 border border-[#004643]/15 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 right-0 left-0 h-2 bg-[#004643] group-hover:bg-[#0ff5b0] transition-colors duration-300" />

              <div>
                {/* Pillar Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#004643] flex items-center justify-center text-[#0ff5b0] shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconRenderer name={pillar.iconName || 'Sparkles'} size={28} color="#0ff5b0" />
                  </div>

                  <span className="text-xs font-black text-[#004643] bg-[#004643]/10 px-3.5 py-1.5 rounded-full border border-[#004643]/15">
                    {pillar.badgeText || `0${idx + 1}`}
                  </span>
                </div>

                {/* Pillar Title & Description */}
                <h3 className="text-2xl font-black text-[#004643] mb-3 font-['Tajawal']">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[#004643]/80 leading-relaxed mb-6 font-medium">
                  {pillar.description}
                </p>

                {/* Points List */}
                {pillar.points && pillar.points.length > 0 && (
                  <div className="pt-5 border-t border-[#004643]/10 space-y-3">
                    <span className="text-2xs font-extrabold text-[#004643]/60 block tracking-wider uppercase">
                      المحاور والنقاط الرئيسية:
                    </span>
                    {pillar.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-3 group/pt">
                        <div className="w-5 h-5 rounded-full bg-[#0ff5b0] flex items-center justify-center text-[#004643] shrink-0 mt-0.5 shadow-2xs group-hover/pt:scale-110 transition-transform">
                          <Check className="w-3.5 h-3.5 text-[#004643] stroke-[3]" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#004643] leading-snug">
                          {pt}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Tag */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#004643]/60">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0ff5b0]" />
                  <span>Faragh Agency</span>
                </span>
                <span className="text-[#004643] font-black bg-[#0ff5b0]/20 px-2.5 py-0.5 rounded-md text-2xs">
                  معايير قياسية
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-16 bg-[#004643] rounded-3xl p-8 sm:p-10 text-[#efece5] relative overflow-hidden shadow-xl border border-[#004643]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#0ff5b0]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-right relative z-10 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Tajawal'] flex items-center justify-center md:justify-start gap-2">
              <span>جاهز لبدء مرحلة جديدة من النمو الرقمي؟</span>
              <Sparkles className="w-6 h-6 text-[#0ff5b0] animate-bounce" />
            </h3>
            <p className="text-sm text-[#efece5]/80 font-medium">
              تواصل مع فريق خبراء وكالة فراغ اليوم للحصول على استشارة مجانية وتحويل أهدافك إلى واقع ملموس.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-8 py-4 bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643] font-black text-sm rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shrink-0"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>احصل على استشارة مجانية</span>
            <ArrowUpLeft className="w-5 h-5" />
          </a>
        </div>

      </div>
    </section>
  );
};
