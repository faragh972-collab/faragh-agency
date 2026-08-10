import React, { lazy, Suspense, useState, useEffect } from 'react';
import { SiteData } from './types';
import { initialSiteData } from './initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { StatsSection } from './components/StatsSection';
import { PortfolioSection } from './components/PortfolioSection';
import { WhyUsSection } from './components/WhyUsSection';
import { TeamSection } from './components/TeamSection';
import { ContactFooter } from './components/ContactFooter';
import { FaqSection } from './components/FaqSection';
import { Loader2, Lock, KeyRound, X, ShieldCheck } from 'lucide-react';
import { useDynamicSeo } from './hooks/useDynamicSeo';

const AdminDashboard = lazy(() => import('./components/AdminDashboard').then((module) => ({
  default: module.AdminDashboard,
})));

export default function App() {
  const isAdminHostname = window.location.hostname === 'admin.faraghagency.com';
  const [siteData, setSiteData] = useState<SiteData>(initialSiteData);
  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardOpen, setDashboardOpen] = useState<boolean>(false);

  // Admin Auth States
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useDynamicSeo(siteData);

  useEffect(() => {
    if (!isAdminHostname) return;
    document.title = 'لوحة إدارة Faragh Agency';
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    robots?.setAttribute('content', 'noindex, nofollow, noarchive');
  }, [isAdminHostname]);

  // Fetch initial site data from backend API
  useEffect(() => {
    async function loadContent() {
      try {
        const res = await fetch('/api/content');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setSiteData(json.data);
          }
        }
      } catch (err) {
        console.warn('Could not load content from API, using default data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  useEffect(() => {
    fetch('/api/admin-session')
      .then((res) => res.json())
      .then((json) => setIsAuthenticated(Boolean(json.authenticated)))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Check URL hash (#admin or ?admin) or key combination (Ctrl+Shift+A) for owner access
  useEffect(() => {
    const checkAdminTrigger = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (isAdminHostname || hash === '#admin' || search.includes('admin=true')) {
        handleOpenAdminRequest();
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdminRequest();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthenticated, isAdminHostname]);

  const handleOpenAdminRequest = () => {
    if (isAuthenticated) {
      setDashboardOpen(true);
    } else {
      setAuthModalOpen(true);
      setAuthError('');
      setPasswordInput('');
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setAuthError(json.error || 'تعذر تسجيل الدخول');
        return;
      }
      setIsAuthenticated(true);
      setAuthModalOpen(false);
      setDashboardOpen(true);
      setAuthError('');
    } catch {
      setAuthError('تعذر الاتصال بالخادم. حاول مرة أخرى.');
    }
  };

  // Handle Save Content from Dashboard
  const handleSaveSiteData = async (updatedData: SiteData): Promise<boolean> => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (json.success) {
        setSiteData(updatedData);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error saving site data:', err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#efece5] flex flex-col items-center justify-center text-[#004643] p-4 font-['IBM_Plex_Sans_Arabic',sans-serif]">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0ff5b0]" />
        <h1 className="text-xl font-bold font-['IBM_Plex_Sans_Arabic',sans-serif]">Faragh Agency</h1>
        <p className="text-xs font-semibold opacity-80 mt-1">جاري تحميل موقع وكالة فراغ للتسويق الرقمي...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#efece5] text-[#111827] font-['IBM_Plex_Sans_Arabic',sans-serif] selection:bg-[#004643] selection:text-[#efece5] dir-rtl text-right">
      
      {/* Navbar */}
      <Navbar
        agencyInfo={siteData.agencyInfo}
        onOpenDashboard={handleOpenAdminRequest}
      />

      {/* Main Agency Sections */}
      <main>
        {/* Section 1: Hero */}
        <HeroSection
          hero={siteData.hero}
          agencyInfo={siteData.agencyInfo}
        />

        {/* Section 2: About Us */}
        <AboutSection
          aboutCards={siteData.aboutCards}
        />

        {/* Section 3: Services */}
        <ServicesSection
          services={siteData.services}
          agencyInfo={siteData.agencyInfo}
        />

        {/* Section 4: Customer Satisfaction Stats */}
        <StatsSection
          stats={siteData.stats}
        />

        {/* Section 5: Portfolio */}
        <PortfolioSection
          portfolio={siteData.portfolio}
          agencyInfo={siteData.agencyInfo}
        />

        {/* Section 6: Why Choose Us, Goals & Values */}
        <WhyUsSection
          data={siteData.whyUsSection}
          agencyInfo={siteData.agencyInfo}
        />

        {/* Section 7: Our Team */}
        <TeamSection
          team={siteData.team}
        />

        <FaqSection />
      </main>

      {/* Contact & Footer with discreet owner login */}
      <ContactFooter
        agencyInfo={siteData.agencyInfo}
        onOpenDashboard={handleOpenAdminRequest}
      />

      {/* Admin Authentication Modal (Private Owner Access) */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#004643]/20 shadow-2xl relative">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3 mb-6">
              <div className="w-14 h-14 bg-[#004643] rounded-2xl flex items-center justify-center mx-auto text-[#0ff5b0] shadow-lg">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-[#004643]">تسجيل دخول مالك الموقع</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                لوحة التحكم خاصة بمالك الموقع فقط وغير ظاهرة للزوار. أدخل كلمة المرور للمتابعة.
              </p>
            </div>

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">كلمة المرور الخاصة بالإدارة</label>
                <div className="relative">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="أدخل كلمة مرور الإدارة"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-[#004643] font-mono text-center tracking-widest"
                    autoFocus
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {authError && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-xl text-center border border-red-200">
                  {authError}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#004643] hover:bg-[#003331] text-[#efece5] font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5 text-[#0ff5b0]" />
                  <span>دخول لوحة التحكم</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <span className="text-2xs text-slate-400 font-medium">
                  ملاحظة: يمكنك استخدام الاختصار (Ctrl + Shift + A) في أي وقت للدخول.
                </span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Dashboard Modal */}
      {dashboardOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-white/80 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#004643]" /></div>}>
          <AdminDashboard
            siteData={siteData}
            onSave={handleSaveSiteData}
            onClose={() => setDashboardOpen(false)}
          />
        </Suspense>
      )}

    </div>
  );
}
