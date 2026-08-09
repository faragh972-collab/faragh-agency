import React from 'react';
import { StatMetric } from '../types';
import { IconRenderer } from './IconRenderer';
import { Award, Sparkles } from 'lucide-react';

interface StatsSectionProps {
  stats: StatMetric[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section id="stats" className="py-20 bg-[#efece5] relative overflow-hidden border-y border-[#004643]/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004643]/10 text-[#004643] text-xs font-bold border border-[#004643]/20">
            <Award className="w-4 h-4 text-[#0ff5b0]" />
            <span>أرقامنا تتحدث عن ثقة عملائنا</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={stat.id || idx}
              className="bg-white rounded-3xl p-8 border border-[#004643]/15 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-center relative group"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[#004643]/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#004643] mx-auto mb-6 flex items-center justify-center text-[#0ff5b0] shadow-lg group-hover:scale-110 transition-transform">
                <IconRenderer name={stat.iconName} size={32} color="#0ff5b0" />
              </div>

              {/* Metric Big Value */}
              <div className="text-4xl sm:text-5xl font-black text-[#004643] mb-2 font-['Tajawal'] tracking-tight flex items-center justify-center gap-1">
                <span>{stat.value}</span>
                <Sparkles className="w-5 h-5 text-[#0ff5b0]" />
              </div>

              {/* Metric Title Label */}
              <h3 className="text-xl font-bold text-[#004643] mb-2 font-['Tajawal']">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#004643]/70 font-medium leading-relaxed">
                {stat.description}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
