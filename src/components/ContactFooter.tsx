import React from 'react';
import { AgencyInfo } from '../types';
import { MessageCircle, Mail, Phone, ArrowUpLeft, Sparkles, Globe, Facebook, Instagram, Lock } from 'lucide-react';

interface ContactFooterProps {
  agencyInfo: AgencyInfo;
  onOpenDashboard?: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ agencyInfo, onOpenDashboard }) => {
  const whatsappUrl = `https://wa.me/${agencyInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('مرحباً وكالة فراغ، أود بدء التنسيق لبناء مشروعي الرقمي.')}`;

  return (
    <footer className="bg-[#003331] text-[#efece5] relative pt-20 pb-10 overflow-hidden border-t border-white/10">
      
      {/* CTA Floating Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-[#004643] via-[#0d5f5b] to-[#004643] rounded-3xl p-8 sm:p-12 border border-[#0ff5b0]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="space-y-3 text-center md:text-right max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0ff5b0]/20 text-[#0ff5b0] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ابدأ رحلة النجاح اليوم</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white font-['Tajawal']">
              هل أنت جاهز لنقل تجارتك لمستوى استثنائي؟
            </h3>
            <p className="text-sm text-[#efece5]/80 font-medium">
              تواصل مع فريقنا في وكالة فراغ فوراً وسنقوم بإعداد خطة مخصصة تلائم أهدافك وميزانيتك.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643] font-black text-base rounded-2xl shadow-xl transition-all hover:scale-105 shrink-0 flex items-center gap-3 group"
          >
            <MessageCircle className="w-5 h-5 fill-[#004643]/20" />
            <span>تواصل مباشرة عبر الواتساب</span>
            <ArrowUpLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </a>

        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Agency Intro */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0ff5b0] text-[#004643] flex items-center justify-center font-black">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-['Tajawal']">
                {agencyInfo.name || 'Faragh Agency'}
              </span>
            </div>
            <p className="text-xs text-[#efece5]/70 leading-relaxed font-medium">
              {agencyInfo.tagline || 'وكالة تسويق رقمي وإبداع برمجي متكامل يهدف لبناء وتطوير العلامات التجارية.'}
            </p>
            <div className="pt-2 text-xs text-[#0ff5b0] font-bold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>https://faraghagency.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0ff5b0] mb-4 font-['Tajawal']">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-xs text-[#efece5]/80 font-semibold">
              <li><a href="#hero" className="hover:text-[#0ff5b0] transition-colors">الرئيسية (الهيرو)</a></li>
              <li><a href="#about" className="hover:text-[#0ff5b0] transition-colors">من نحن ورسالتنا وقيمنا</a></li>
              <li><a href="#services" className="hover:text-[#0ff5b0] transition-colors">خدماتنا والتسويق الرقمي</a></li>
              <li><a href="#portfolio" className="hover:text-[#0ff5b0] transition-colors">معرض الأعمال والنتائج</a></li>
              <li><a href="#why-us" className="hover:text-[#0ff5b0] transition-colors">لماذا نحن وقيمنا</a></li>
              <li><a href="#team" className="hover:text-[#0ff5b0] transition-colors">فريق العمل والخبراء</a></li>
            </ul>
          </div>

          {/* Services List */}
          <div>
            <h4 className="text-sm font-extrabold text-[#0ff5b0] mb-4 font-['Tajawal']">
              خدماتنا الرئيسية
            </h4>
            <ul className="space-y-2 text-xs text-[#efece5]/80 font-medium">
              <li>• التسويق الرقمي والحملات</li>
              <li>• كتابة المحتوى والـ Copywriting</li>
              <li>• تصميم الجرافيك والهويات</li>
              <li>• إنتاج المحتوى والموشن جرافيك</li>
              <li>• البرمجة وتطوير المواقع</li>
              <li>• إدارة الحسابات والتطبيقات</li>
            </ul>
          </div>

          {/* Contact Details & Social Media */}
          <div className="space-y-3">
            <h4 className="text-sm font-extrabold text-[#0ff5b0] mb-4 font-['Tajawal']">
              تواصل معنا
            </h4>

            <div className="flex items-center gap-3 text-xs text-[#efece5]/90 font-semibold">
              <Phone className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span dir="ltr">{agencyInfo.phone}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#efece5]/90 font-semibold">
              <Mail className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span>{agencyInfo.contactEmail}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#efece5]/90 font-semibold">
              <MessageCircle className="w-4 h-4 text-[#0ff5b0] shrink-0" />
              <span>واتساب: <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-[#0ff5b0]">{agencyInfo.whatsappNumber}</a></span>
            </div>

            {/* Social Media Channels */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-2xs font-extrabold text-[#0ff5b0] block uppercase tracking-wider">
                تابعنا على منصات التواصل الاجتماعي:
              </span>
              <div className="flex items-center gap-2 pt-1">
                {agencyInfo.facebookUrl && (
                  <a
                    href={agencyInfo.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0ff5b0] hover:text-[#004643] text-white flex items-center justify-center transition-all"
                    title="فيسبوك"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}

                {agencyInfo.tiktokUrl && (
                  <a
                    href={agencyInfo.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0ff5b0] hover:text-[#004643] text-white flex items-center justify-center transition-all"
                    title="تيك توك"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.35 22a6.33 6.33 0 0 0 6.33-6.33V9.05a8.16 8.16 0 0 0 4.67 1.47V7a4.84 4.84 0 0 1-.76-.31z"/>
                    </svg>
                  </a>
                )}

                {agencyInfo.instagramUrl && (
                  <a
                    href={agencyInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#0ff5b0] hover:text-[#004643] text-white flex items-center justify-center transition-all"
                    title="انستجرام"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-2xs text-[#efece5]/60 gap-4">
        <p className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Faragh Agency - جميع الحقوق محفوظة لـ وكالة فراغ للتسويق الرقمي.</span>
          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className="p-1 rounded text-[#efece5]/30 hover:text-[#0ff5b0] transition-colors"
              title="دخول الإدارة"
            >
              <Lock className="w-3 h-3" />
            </button>
          )}
        </p>
        <p className="flex items-center gap-1 font-bold text-[#0ff5b0]">
          <span>https://faraghagency.com</span>
        </p>
      </div>

      {/* Floating Sticky WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group border-2 border-white"
        title="تواصل معنا عبر الواتساب"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
        <span className="absolute right-16 top-3 bg-[#004643] text-[#efece5] text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none border border-[#0ff5b0]/30">
          اطلب خدمتك الآن 💬
        </span>
      </a>

    </footer>
  );
};
