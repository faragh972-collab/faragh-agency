import React from 'react';
import { TeamMember } from '../types';
import { Users, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { useDraggableScroll } from '../hooks/useDraggableScroll';

interface TeamSectionProps {
  team: TeamMember[];
}

export const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  const { ref: scrollContainerRef, events: dragEvents, scrollBy } = useDraggableScroll();

  const handleScroll = (direction: 'prev' | 'next') => {
    const scrollAmount = 340;
    // In RTL layout, scrolling to 'next' item moves left (negative value)
    const amount = direction === 'next' ? -scrollAmount : scrollAmount;
    scrollBy(amount);
  };

  return (
    <section id="team" className="py-24 bg-[#004643] text-[#efece5] relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#0ff5b0]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header & Control Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0ff5b0]/20 text-[#0ff5b0] text-xs font-bold border border-[#0ff5b0]/30">
              <Users className="w-3.5 h-3.5" />
              <span>عقول إبداعية تقود النمو</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-['Tajawal'] leading-tight">
              فريق نخبة المتخصصين والخبراء
            </h2>
            <p className="text-base text-[#efece5]/80 font-medium">
              يجمع فريقنا أفضل الكفاءات في مجالات التسويق، التصميم، كتابة المحتوى والبرمجة لضمان نجاح مشروعك.
            </p>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center justify-center gap-2 shrink-0 self-center md:self-auto">
            <button
              onClick={() => handleScroll('prev')}
              className="w-12 h-12 rounded-2xl bg-[#003b38] border border-white/10 text-white hover:bg-[#0ff5b0] hover:text-[#004643] shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="الموظف السابق (يمين)"
              aria-label="الموظف السابق"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleScroll('next')}
              className="w-12 h-12 rounded-2xl bg-[#0ff5b0] text-[#004643] hover:bg-[#00d898] shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
              title="الموظف التالي (شمال)"
              aria-label="الموظف التالي"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Team Cards Horizontal Slider */}
        <div
          ref={scrollContainerRef}
          {...dragEvents}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-8 pt-2 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {team.map((member, idx) => (
            <div
              key={member.id || idx}
              className="shrink-0 w-[80vw] sm:w-[320px] lg:w-[340px] snap-start bg-[#003b38] rounded-3xl overflow-hidden border border-white/10 hover:border-[#0ff5b0]/50 shadow-xl transition-all duration-300 hover:-translate-y-2 group flex flex-col justify-between"
            >
              <div>
                {/* Photo Container */}
                <div className="relative h-72 overflow-hidden bg-[#003331]">
                  <img
                    src={member.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003b38] via-transparent to-transparent opacity-80" />
                </div>

                {/* Info Content */}
                <div className="p-6 space-y-2">
                  <span className="text-xs font-black text-[#0ff5b0] uppercase tracking-wider block">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-extrabold text-white font-['Tajawal']">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#efece5]/80 font-medium leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-4 border-t border-white/5 bg-[#003331]/50 flex items-center justify-between text-2xs font-semibold text-[#efece5]/60">
                <span>Faragh Agency Team</span>
                <Sparkles className="w-3.5 h-3.5 text-[#0ff5b0]" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

