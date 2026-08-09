import React, { useState } from 'react';
import { PortfolioProject, AgencyInfo } from '../types';
import { ExternalLink, X, MessageCircle, ArrowUpLeft, Sparkles, Building, Tag, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface PortfolioSectionProps {
  portfolio: PortfolioProject[];
  agencyInfo: AgencyInfo;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ portfolio, agencyInfo }) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const { ref: scrollContainerRef, events: dragEvents, isDragging, scrollBy } = useDraggableScroll();

  // Extract unique categories
  const categories = ['الكل', ...Array.from(new Set(portfolio.map((p) => p.category).filter(Boolean)))];

  const filteredProjects = activeCategory === 'الكل'
    ? portfolio
    : portfolio.filter((p) => p.category === activeCategory);

  const getWhatsAppLink = (projName: string) => {
    const text = `مرحباً وكالة فراغ، شاهدت مشروعك (${projName}) وأرغب في تنفيذ مشروع مماثل.`;
    const cleanPhone = agencyInfo.whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleScroll = (direction: 'prev' | 'next') => {
    const scrollAmount = 400;
    // In RTL layout, scrolling to 'next' item moves left (negative value)
    const amount = direction === 'next' ? -scrollAmount : scrollAmount;
    scrollBy(amount);
  };

  return (
    <section id="portfolio" className="py-24 bg-[#efece5] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#004643]/10 text-[#004643] text-xs font-bold border border-[#004643]/20">
            <Sparkles className="w-4 h-4 text-[#0ff5b0]" />
            <span>معرض أعمالنا ونتاجاتنا</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#004643] font-['Tajawal'] leading-tight">
            مشاريع قصص النجاح التي نفتخر بها
          </h2>
          <p className="text-base text-[#004643]/80 font-medium">
            استكشف أبرز الأعمال والحلول الرقمية التي طورناها لعملائنا في مختلف المجالات والقطاعات.
          </p>
        </div>

        {/* Category Filter Tabs & Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          {categories.length > 1 ? (
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#004643] text-[#efece5] shadow-md scale-105'
                      : 'bg-white text-[#004643] border border-[#004643]/15 hover:bg-[#004643]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          ) : <div />}

          {/* Navigation Control Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleScroll('prev')}
              className="w-12 h-12 rounded-2xl bg-white border border-[#004643]/20 text-[#004643] hover:bg-[#004643] hover:text-[#0ff5b0] shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="المشروع السابق (يمين)"
              aria-label="المشروع السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleScroll('next')}
              className="w-12 h-12 rounded-2xl bg-[#004643] text-[#0ff5b0] hover:bg-[#003331] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="المشروع التالي (شمال)"
              aria-label="المشروع التالي"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Projects Cards Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          {...dragEvents}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id || idx}
              onClick={() => {
                if (!isDragging) {
                  setSelectedProject(project);
                }
              }}
              className="shrink-0 w-[85vw] sm:w-[380px] md:w-[420px] snap-start bg-white rounded-3xl overflow-hidden border border-[#004643]/15 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Project Image & Overlay */}
              <div className="relative h-64 overflow-hidden bg-[#004643]">
                {project.imageUrl?.startsWith('data:video') || project.imageUrl?.match(/\.(mp4|webm|mov)$/i) ? (
                  <video
                    src={project.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <img
                    src={project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#004643] via-transparent to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />
                
                {/* Category Pill */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#004643] px-3.5 py-1 rounded-full text-xs font-bold border border-[#004643]/10 shadow-xs">
                  {project.category}
                </div>

                {/* View Details Hover Badge */}
                <div className="absolute bottom-4 left-4 bg-[#0ff5b0] text-[#004643] px-4 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 opacity-90 group-hover:scale-105 transition-transform">
                  <span>تفاصيل المشروع</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Project Card Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#004643]/70">
                  <Building className="w-3.5 h-3.5 text-[#0ff5b0]" />
                  <span>العميل: {project.clientName}</span>
                </div>

                <h3 className="text-xl font-black text-[#004643] group-hover:text-[#0d5f5b] transition-colors font-['Tajawal']">
                  {project.title}
                </h3>

                <p className="text-sm text-[#004643]/80 line-clamp-2 font-medium leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-[#004643]/5 text-[#004643] text-2xs px-2.5 py-1 rounded-md font-semibold border border-[#004643]/10"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004643]/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#004643]/20 shadow-2xl relative p-6 sm:p-8">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 left-4 w-10 h-10 rounded-full bg-[#004643]/10 text-[#004643] hover:bg-[#004643] hover:text-[#efece5] flex items-center justify-center transition-colors z-10"
              aria-label="إغلاق Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image/Video */}
            <div className="rounded-2xl overflow-hidden mb-6 h-64 sm:h-80 relative bg-[#004643]">
              {selectedProject.imageUrl?.startsWith('data:video') || selectedProject.imageUrl?.match(/\.(mp4|webm|mov)$/i) ? (
                <video
                  src={selectedProject.imageUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-4 right-4 bg-[#0ff5b0] text-[#004643] px-3.5 py-1 rounded-full text-xs font-black z-10">
                {selectedProject.category}
              </div>
            </div>

            {/* Project Info */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#004643]/10 text-[#004643] text-xs font-bold">
                <Building className="w-3.5 h-3.5 text-[#0ff5b0]" />
                <span>اسم العميل: {selectedProject.clientName}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#004643] font-['Tajawal']">
                {selectedProject.title}
              </h3>

              <div className="border-t border-b border-[#004643]/10 py-4">
                <h4 className="text-xs font-bold text-[#004643]/60 mb-2">وصف ومعلومات المشروع التفصيلية:</h4>
                <p className="text-sm text-[#004643]/90 leading-relaxed font-medium whitespace-pre-line">
                  {selectedProject.fullDetails || selectedProject.description}
                </p>
              </div>

              {selectedProject.results && (
                <div className="bg-[#004643]/5 p-4 rounded-xl border border-[#004643]/10">
                  <span className="text-xs font-bold text-[#0ff5b0] block mb-1">النتائج المحققة:</span>
                  <span className="text-sm font-extrabold text-[#004643]">{selectedProject.results}</span>
                </div>
              )}

              {/* Tags */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedProject.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="inline-flex items-center gap-1 bg-[#004643]/10 text-[#004643] text-xs px-3 py-1 rounded-md font-bold">
                      <Tag className="w-3 h-3 text-[#0ff5b0]" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppLink(selectedProject.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 bg-[#004643] hover:bg-[#003331] text-[#efece5] font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#0ff5b0]" />
                  <span>اطلب مشروعاً مماثلاً عبر الواتساب</span>
                  <ArrowUpLeft className="w-4 h-4 text-[#0ff5b0]" />
                </a>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="py-3.5 px-6 bg-slate-100 hover:bg-slate-200 text-[#004643] font-bold text-sm rounded-xl transition-colors"
                >
                  إغلاق النافذة
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};

