import React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'كيف تختار أفضل شركة تسويق رقمي في مصر لمشروعك؟',
    answer: 'ابدأ بتحديد أهدافك ومؤشرات الأداء، ثم قيّم خبرة الوكالة في الاستراتيجية والمحتوى والإعلانات وتحليل البيانات. في Faragh Agency نبدأ بفهم النشاط والجمهور والمنافسين قبل بناء خطة مخصصة قابلة للقياس بدل الاعتماد على باقات ثابتة.'
  },
  {
    question: 'ما خدمات التسويق الإلكتروني التي تقدمها Faragh Agency؟',
    answer: 'نقدم إدارة حسابات السوشيال ميديا، الحملات الإعلانية على Google وMeta وTikTok، تحسين محركات البحث SEO، كتابة وصناعة المحتوى، التصميم الجرافيكي، الهوية البصرية، الموشن جرافيك، وتصميم وبرمجة المواقع.'
  },
  {
    question: 'هل تقدمون تصميم وبرمجة مواقع متوافقة مع محركات البحث؟',
    answer: 'نعم. نبني مواقع سريعة ومتجاوبة مع الهاتف، بهيكل عناوين واضح، بيانات منظمة، صفحات قابلة للفهرسة وتجربة مستخدم تساعد على تحويل الزيارات إلى استفسارات ومبيعات.'
  },
  {
    question: 'هل تخدم الوكالة الشركات خارج مصر؟',
    answer: 'نعم. نخدم الشركات والعلامات التجارية في مصر ودول الخليج والأسواق العربية، ونكيّف الرسائل التسويقية والمحتوى والحملات حسب الجمهور والثقافة والسوق المستهدف.'
  },
  {
    question: 'متى تظهر نتائج SEO وتحسين محركات البحث؟',
    answer: 'تختلف المدة حسب عمر الموقع والمنافسة وجودة المحتوى والروابط، لكن SEO استثمار تراكمي وليس نتيجة فورية. نتابع الفهرسة والكلمات والزيارات والتحويلات، ونطوّر الخطة بناءً على البيانات الفعلية.'
  },
  {
    question: 'كيف أطلب استشارة تسويق أو عرض سعر؟',
    answer: 'تواصل معنا عبر واتساب وشاركنا نوع نشاطك، السوق المستهدف، الخدمة المطلوبة والهدف التجاري. سيراجع الفريق احتياجك ويقترح نقطة بداية وخطة تناسب مرحلة مشروعك.'
  }
];

export const FaqSection: React.FC = () => (
  <section id="faq" className="py-24 bg-white" aria-labelledby="faq-heading">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004643]/10 text-[#004643] text-xs font-bold mb-4">
          <HelpCircle className="w-4 h-4" />
          دليل خدمات التسويق الرقمي
        </div>
        <h2 id="faq-heading" className="text-3xl sm:text-5xl font-black text-[#004643] font-['Tajawal']">
          أسئلة شائعة عن التسويق الرقمي وتصميم المواقع
        </h2>
        <p className="mt-4 text-slate-600 leading-relaxed">إجابات واضحة تساعدك على اختيار الخدمة المناسبة لنمو مشروعك في مصر والخليج.</p>
      </div>
      <div className="space-y-4">
        {faqs.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-[#004643]/15 bg-[#efece5]/60 p-5 open:bg-white open:shadow-lg transition-all">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-black text-[#004643] text-base sm:text-lg">
              <span>{item.question}</span>
              <ChevronDown className="w-5 h-5 shrink-0 group-open:rotate-180 transition-transform" />
            </summary>
            <p className="pt-4 text-sm sm:text-base text-slate-700 leading-8 font-medium">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);
