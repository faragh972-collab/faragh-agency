import React, { useState } from 'react';
import { upload } from '@vercel/blob/client';
import { SiteData, ServiceItem, AboutCard, PortfolioProject, TeamMember, StatMetric } from '../types';
import {
  X,
  Save,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  Sparkles,
  CheckCircle,
  Building2,
  Briefcase,
  Users,
  BarChart2,
  PhoneCall,
  Globe,
  Bot,
  Layout,
  Layers,
  ArrowRight,
  Upload,
  Compass
} from 'lucide-react';

interface MediaUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  placeholder?: string;
}

const MediaUploadInput: React.FC<MediaUploadInputProps> = ({
  label,
  value,
  onChange,
  accept = 'image/*,video/*',
  placeholder = 'أدخل رابط أو ارفع ملف من جهازك...',
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const blob = await upload(`faragh/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      onChange(blob.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'تعذر رفع الملف');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isVideo = value?.startsWith('data:video') || value?.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-bold text-xs">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-2xs text-red-600 hover:text-red-800 font-bold bg-red-50 px-2 py-0.5 rounded-md"
          >
            مسح الملف
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#004643]"
        />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2.5 bg-[#004643] hover:bg-[#003331] text-[#0ff5b0] text-xs font-black rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-all hover:scale-102 active:scale-98"
          title="اختيار صورة أو فيديو من جهازك مباشرة"
        >
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'جاري الرفع...' : 'رفع من الجهاز'}</span>
        </button>
      </div>

      {uploadError && <p className="text-xs font-bold text-red-600">{uploadError}</p>}

      {value && (
        <div className="mt-2 relative inline-block">
          {isVideo ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black max-w-xs">
              <video src={value} controls className="h-28 w-full object-cover" />
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-1.5 max-w-xs flex items-center justify-center">
              <img src={value} alt="معاينة" className="h-20 w-auto max-w-full object-contain rounded-lg" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AdminDashboardProps {
  siteData: SiteData;
  onSave: (updatedData: SiteData) => Promise<boolean>;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  siteData: initialSiteData,
  onSave,
  onClose,
}) => {
  // Main Site Data copy for editing
  const [data, setData] = useState<SiteData>(JSON.parse(JSON.stringify(initialSiteData)));
  
  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState<
    'general' | 'hero' | 'about' | 'services' | 'stats' | 'portfolio' | 'why-us' | 'team' | 'ai'
  >('general');

  // Saving state & notification
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // AI Assistant generator state
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiResult, setAiResult] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Save changes to backend API
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const ok = await onSave(data);
      if (ok) {
        setSaveMessage({ type: 'success', text: 'تم حفظ والتغييرات بنجاح في قاعدة البيانات!' });
      } else {
        setSaveMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ التغييرات' });
      }
    } catch {
      setSaveMessage({ type: 'error', text: 'تعذر الاتصال بالخادم لحفظ التغييرات' });
    } finally {
      setIsSaving(false);
    }
  };

  // --- Helper Functions for Nested Arrays ---

  // Services: Add item/feature to service
  const addFeatureToService = (serviceId: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => {
        if (s.id === serviceId) {
          return { ...s, features: [...(s.features || []), 'عنصر جديد للخدمة'] };
        }
        return s;
      }),
    }));
  };

  const removeFeatureFromService = (serviceId: string, featureIdx: number) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => {
        if (s.id === serviceId) {
          const newF = [...s.features];
          newF.splice(featureIdx, 1);
          return { ...s, features: newF };
        }
        return s;
      }),
    }));
  };

  const updateFeatureInService = (serviceId: string, featureIdx: number, value: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.map((s) => {
        if (s.id === serviceId) {
          const newF = [...s.features];
          newF[featureIdx] = value;
          return { ...s, features: newF };
        }
        return s;
      }),
    }));
  };

  // About Cards: Add item/point to about card
  const addItemToAboutCard = (cardId: string) => {
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.map((c) => {
        if (c.id === cardId) {
          return { ...c, items: [...(c.items || []), 'نقطة جديدة مخصصة'] };
        }
        return c;
      }),
    }));
  };

  const removeItemFromAboutCard = (cardId: string, itemIdx: number) => {
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.map((c) => {
        if (c.id === cardId) {
          const newI = [...c.items];
          newI.splice(itemIdx, 1);
          return { ...c, items: newI };
        }
        return c;
      }),
    }));
  };

  const updateItemInAboutCard = (cardId: string, itemIdx: number, value: string) => {
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.map((c) => {
        if (c.id === cardId) {
          const newI = [...c.items];
          newI[itemIdx] = value;
          return { ...c, items: newI };
        }
        return c;
      }),
    }));
  };

  // Add new Service
  const handleAddNewService = () => {
    const newService: ServiceItem = {
      id: 'srv-' + Date.now(),
      title: 'خدمة جديدة مخصصة',
      description: 'وصف مختصر للخدمة الجديدة',
      iconName: 'Sparkles',
      features: ['العنصر الأول', 'العنصر الثاني'],
      whatsappMessageCustom: 'مرحباً وكالة فراغ، أود طلب هذه الخدمة الجديدة.',
    };
    setData((prev) => ({ ...prev, services: [...prev.services, newService] }));
  };

  // Remove Service
  const handleRemoveService = (id: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s.id !== id),
    }));
  };

  // Add new About Card
  const handleAddNewAboutCard = () => {
    const newCard: AboutCard = {
      id: 'about-' + Date.now(),
      type: 'custom',
      title: 'عنوان القسم الجديد',
      iconName: 'Building2',
      description: 'وصف ومقدمة للقسم الجديد',
      items: ['عنصر رقم 1', 'عنصر رقم 2'],
    };
    setData((prev) => ({ ...prev, aboutCards: [...prev.aboutCards, newCard] }));
  };

  const handleRemoveAboutCard = (id: string) => {
    setData((prev) => ({
      ...prev,
      aboutCards: prev.aboutCards.filter((c) => c.id !== id),
    }));
  };

  // Portfolio Management
  const handleAddNewProject = () => {
    const newProject: PortfolioProject = {
      id: 'proj-' + Date.now(),
      title: 'مشروع جديد مميز',
      clientName: 'اسم العميل الموقر',
      description: 'وصف مختصر للمشروع والنتائج',
      fullDetails: 'تفاصيل كاملة حول كيفية تنفيذ هذا المشروع والحلول المقدمة.',
      category: 'التسويق الرقمي',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      tags: ['تسويق', 'برمجة'],
      results: 'زيادة المبيعات +150%',
    };
    setData((prev) => ({ ...prev, portfolio: [...prev.portfolio, newProject] }));
  };

  const handleRemoveProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((p) => p.id !== id),
    }));
  };

  // Team Management
  const handleAddNewTeamMember = () => {
    const newMember: TeamMember = {
      id: 'team-' + Date.now(),
      name: 'اسم الموظف الجديد',
      role: 'المسمى الوظيفي (مثلاً: مطور/مصمم)',
      bio: 'نبذة عن خبرات ومهارات الموظف.',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    };
    setData((prev) => ({ ...prev, team: [...prev.team, newMember] }));
  };

  const handleRemoveTeamMember = (id: string) => {
    setData((prev) => ({
      ...prev,
      team: prev.team.filter((t) => t.id !== id),
    }));
  };

  // AI Content Generator Call
  const handleGenerateAiText = async () => {
    if (!aiPrompt) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          context: 'لوحة تحكم وكالة فراغ للتسويق الرقمي والبرمجة',
        }),
      });
      const resultData = await res.json();
      if (resultData.success) {
        setAiResult(resultData.text);
      } else {
        setAiResult('تنبيه: ' + (resultData.error || 'تعذر التوليد'));
      }
    } catch {
      setAiResult('خطأ أثناء الاتصال بخدمة الذكاء الاصطناعي');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="bg-[#004643] text-[#efece5] px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            {data.agencyInfo.logoUrl ? (
              <img
                src={data.agencyInfo.logoUrl}
                alt="شعار"
                className="w-10 h-10 object-contain rounded-xl bg-white/10 border border-white/20 p-1 shadow-md shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#0ff5b0] text-[#004643] flex items-center justify-center font-black shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-black text-white font-['Tajawal'] flex items-center gap-2">
                لوحة التحكم الإدارية الكاملة
                <span className="text-2xs font-bold px-2 py-0.5 rounded-md bg-[#0ff5b0] text-[#004643]">
                  Full CMS
                </span>
              </h2>
              <p className="text-2xs text-[#efece5]/70">تعديل وإضافة الصور، الشعار، الفيديوهات وكافة أقسام الموقع</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-5 py-2.5 bg-[#0ff5b0] hover:bg-[#00d898] text-[#004643] font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات الآن'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 text-[#efece5] hover:bg-white/10 rounded-xl transition-colors"
              title="إغلاق اللوحة"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Save Notification Banner */}
        {saveMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-bold text-center border-b shrink-0 flex items-center justify-center gap-2 ${
              saveMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Dashboard Body Grid */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0 flex md:flex-col gap-1 md:gap-0">
            {[
              { id: 'general', label: 'البيانات والواتساب', icon: PhoneCall },
              { id: 'hero', label: 'قسم الهيرو الرئيسية', icon: Layout },
              { id: 'about', label: 'من نحن ورسالتنا وقيمنا', icon: Building2 },
              { id: 'services', label: 'خدماتنا وعناصرها', icon: Layers },
              { id: 'stats', label: 'نسبة الإحصائيات (رضا العملاء)', icon: BarChart2 },
              { id: 'portfolio', label: 'معرض الأعمال (المشاريع)', icon: Briefcase },
              { id: 'why-us', label: 'لماذا تختارنا وأهدافنا وقيمنا', icon: Compass },
              { id: 'team', label: 'فريق العمل (الموظفين)', icon: Users },
              { id: 'ai', label: 'مساعد الذكاء الاصطناعي', icon: Bot },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-right ${
                    activeTab === tab.id
                      ? 'bg-[#004643] text-[#efece5] shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-[#0ff5b0]' : 'text-[#004643]'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-100/50 space-y-6">
            
            {/* TAB 1: GENERAL AGENCY & WHATSAPP INFO */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#004643] border-b pb-3 flex items-center gap-2 font-['Tajawal']">
                    <PhoneCall className="w-5 h-5 text-[#0ff5b0]" />
                    إعدادات الوكالة ورقم الواتساب الرئيسي
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="md:col-span-2">
                      <MediaUploadInput
                        label="شعار الوكالة العلوي (Logo) - ارفع صورة الشعار لتظهر في شريط الهيدر واللوحة"
                        value={data.agencyInfo.logoUrl || ''}
                        onChange={(val) => setData({ ...data, agencyInfo: { ...data.agencyInfo, logoUrl: val } })}
                        accept="image/*"
                        placeholder="أدخل رابط صورة الشعار أو ارفعها مباشرة من الجهاز..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">اسم الوكالة</label>
                      <input
                        type="text"
                        value={data.agencyInfo.name}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, name: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">النص المكتوب على اللوجو</label>
                      <input
                        type="text"
                        value={data.agencyInfo.logoText}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, logoText: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">رقم الواتساب المباشر للطلبات (مثال: 201099887766)</label>
                      <input
                        type="text"
                        value={data.agencyInfo.whatsappNumber}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, whatsappNumber: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl font-mono text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">البريد الإلكتروني للتواصل</label>
                      <input
                        type="email"
                        value={data.agencyInfo.contactEmail}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, contactEmail: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">رقم الهاتف أو الواتساب الظاهر</label>
                      <input
                        type="text"
                        value={data.agencyInfo.phone}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, phone: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">رابط صفحة فيسبوك (Facebook URL)</label>
                      <input
                        type="text"
                        value={data.agencyInfo.facebookUrl || ''}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, facebookUrl: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 font-mono text-xs"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">رابط حساب تيك توك (TikTok URL)</label>
                      <input
                        type="text"
                        value={data.agencyInfo.tiktokUrl || ''}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, tiktokUrl: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 font-mono text-xs"
                        placeholder="https://tiktok.com/@youraccount"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">رابط حساب انستجرام (Instagram URL)</label>
                      <input
                        type="text"
                        value={data.agencyInfo.instagramUrl || ''}
                        onChange={(e) => setData({ ...data, agencyInfo: { ...data.agencyInfo, instagramUrl: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800 font-mono text-xs"
                        placeholder="https://instagram.com/youraccount"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#004643] border-b pb-3 flex items-center gap-2 font-['Tajawal']">
                    <Globe className="w-5 h-5 text-[#0ff5b0]" />
                    إعدادات محركات البحث SEO والدومين (https://faraghagency.com)
                  </h3>

                  <div className="space-y-3 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-700 mb-1">عنوان الصفحة الرئيسية Meta Title</label>
                      <input
                        type="text"
                        value={data.seoSettings.metaTitle}
                        onChange={(e) => setData({ ...data, seoSettings: { ...data.seoSettings, metaTitle: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">وصف الصفحة لنقل البحث Meta Description</label>
                      <textarea
                        rows={2}
                        value={data.seoSettings.metaDescription}
                        onChange={(e) => setData({ ...data, seoSettings: { ...data.seoSettings, metaDescription: e.target.value } })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-800"
                      />
                    </div>

                    <div>
                      <MediaUploadInput
                        label="صورة الماركة والمشاركة بالفيسبوك والواتساب (OG Image)"
                        value={data.seoSettings.ogImage || ''}
                        onChange={(val) => setData({ ...data, seoSettings: { ...data.seoSettings, ogImage: val } })}
                        accept="image/*"
                        placeholder="أدخل رابط أو ارفع صورة المعاينة من الجهاز..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: HERO SECTION */}
            {activeTab === 'hero' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-[#004643] border-b pb-3 font-['Tajawal']">
                  تعديل سكشن الصفحة الرئيسية (الهيرو)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1">الشعار العلمي العلوي Badge</label>
                    <input
                      type="text"
                      value={data.hero.badgeText}
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, badgeText: e.target.value } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">العنوان الرئيسي الأول</label>
                    <input
                      type="text"
                      value={data.hero.mainTitle}
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, mainTitle: e.target.value } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">النص البارز باللون المميز</label>
                    <input
                      type="text"
                      value={data.hero.highlightedText}
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, highlightedText: e.target.value } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-[#004643] font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-slate-700 mb-1">الوصف الفرعي للهيرو</label>
                    <textarea
                      rows={3}
                      value={data.hero.subtitle}
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">نص زر الطلب المباشر</label>
                    <input
                      type="text"
                      value={data.hero.primaryButtonText}
                      onChange={(e) => setData({ ...data, hero: { ...data.hero, primaryButtonText: e.target.value } })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <MediaUploadInput
                      label="صورة أو فيديو سكشن الهيرو الرئيسي (Hero Media)"
                      value={data.hero.heroImageUrl}
                      onChange={(val) => setData({ ...data, hero: { ...data.hero, heroImageUrl: val } })}
                      accept="image/*,video/*"
                      placeholder="أدخل رابط أو ارفع صورة/فيديو من جهازك مباشرة..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ABOUT US, MISSION & VALUES */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                    إدارة سكشن من نحن ورسالتنا وقيمنا
                  </h3>
                  <button
                    onClick={handleAddNewAboutCard}
                    className="px-4 py-2 bg-[#004643] text-[#efece5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#0ff5b0]" />
                    <span>إضافة مربع جديد</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {data.aboutCards.map((card, cIdx) => (
                    <div key={card.id || cIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative">
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-xs font-black text-[#004643] bg-[#004643]/10 px-3 py-1 rounded-md">
                          مربع رقم #{cIdx + 1} ({card.title})
                        </span>
                        <button
                          onClick={() => handleRemoveAboutCard(card.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف المربع</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-700 mb-1">العنوان الرئيسي للمربع</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const newCards = [...data.aboutCards];
                              newCards[cIdx].title = e.target.value;
                              setData({ ...data, aboutCards: newCards });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">اسم الأيقونة (Lucide Icon)</label>
                          <input
                            type="text"
                            value={card.iconName}
                            onChange={(e) => {
                              const newCards = [...data.aboutCards];
                              newCards[cIdx].iconName = e.target.value;
                              setData({ ...data, aboutCards: newCards });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">الوصف العام</label>
                          <textarea
                            rows={2}
                            value={card.description}
                            onChange={(e) => {
                              const newCards = [...data.aboutCards];
                              newCards[cIdx].description = e.target.value;
                              setData({ ...data, aboutCards: newCards });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                      {/* DYNAMIC CONTENT ITEMS INSIDE EACH ABOUT CARD */}
                      <div className="pt-4 border-t space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#004643]">
                            محتويات وعناصر المربع الداخلية (النقاط والمميزات):
                          </span>
                          <button
                            onClick={() => addItemToAboutCard(card.id)}
                            className="px-3 py-1 bg-[#004643] text-white text-2xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-[#0ff5b0]" />
                            <span>إضافة عنصر للمربع</span>
                          </button>
                        </div>

                        {card.items && card.items.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => updateItemInAboutCard(card.id, itemIdx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border rounded-lg text-xs font-medium"
                            />
                            <button
                              onClick={() => removeItemFromAboutCard(card.id, itemIdx)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              title="حذف هذا العنصر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: SERVICES & DYNAMIC SERVICE ITEMS */}
            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                      إدارة قسم خدماتنا والعناصر المخصصة لكل خدمة
                    </h3>
                    <p className="text-2xs text-slate-600">يمكنك تعديل أي خدمة أو إضافة/حذف عناصرها الداخلية بسهولة</p>
                  </div>
                  <button
                    onClick={handleAddNewService}
                    className="px-4 py-2 bg-[#004643] text-[#efece5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#0ff5b0]" />
                    <span>إضافة خدمة جديدة</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {data.services.map((service, sIdx) => (
                    <div key={service.id || sIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-[#004643] text-[#0ff5b0] flex items-center justify-center font-bold text-xs">
                            0{sIdx + 1}
                          </span>
                          <span className="text-sm font-black text-[#004643]">
                            {service.title}
                          </span>
                        </div>

                        <button
                          onClick={() => handleRemoveService(service.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف الخدمة</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-700 mb-1">اسم الخدمة</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              const newS = [...data.services];
                              newS[sIdx].title = e.target.value;
                              setData({ ...data, services: newS });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">اسم أيقونة الخدمة (Icon)</label>
                          <input
                            type="text"
                            value={service.iconName}
                            onChange={(e) => {
                              const newS = [...data.services];
                              newS[sIdx].iconName = e.target.value;
                              setData({ ...data, services: newS });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">الوصف العام للخدمة</label>
                          <textarea
                            rows={2}
                            value={service.description}
                            onChange={(e) => {
                              const newS = [...data.services];
                              newS[sIdx].description = e.target.value;
                              setData({ ...data, services: newS });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">رسالة الطلب المخصصة للواتساب</label>
                          <input
                            type="text"
                            value={service.whatsappMessageCustom || ''}
                            onChange={(e) => {
                              const newS = [...data.services];
                              newS[sIdx].whatsappMessageCustom = e.target.value;
                              setData({ ...data, services: newS });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                      {/* DYNAMIC ELEMENTS/FEATURES INSIDE THIS SERVICE */}
                      <div className="pt-4 border-t space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#004643]">
                            عناصر ومميزات الخدمة الداخلية (اقدر اضيف او احذف براحتي):
                          </span>
                          <button
                            onClick={() => addFeatureToService(service.id)}
                            className="px-3 py-1 bg-[#004643] text-white text-2xs font-bold rounded-lg flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-[#0ff5b0]" />
                            <span>إضافة عنصر جديد للخدمة</span>
                          </button>
                        </div>

                        {service.features && service.features.map((feature, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={feature}
                              onChange={(e) => updateFeatureInService(service.id, fIdx, e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border rounded-lg text-xs font-medium"
                            />
                            <button
                              onClick={() => removeFeatureFromService(service.id, fIdx)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              title="حذف هذا العنصر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: STATS */}
            {activeTab === 'stats' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <h3 className="text-base font-black text-[#004643] border-b pb-3 font-['Tajawal']">
                  تعديل أرقام قسم رضا العملاء والمشاريع
                </h3>

                <div className="space-y-4">
                  {data.stats.map((stat, idx) => (
                    <div key={stat.id || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold">
                      <div>
                        <label className="block text-slate-700 mb-1">الرقم / النسبة (مثال: 96% أو 60+ أو 24H)</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...data.stats];
                            newStats[idx].value = e.target.value;
                            setData({ ...data, stats: newStats });
                          }}
                          className="w-full px-3 py-2 bg-white border rounded-lg font-bold text-[#004643]"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">عنوان الرقم (مثلاً: نسبة رضا العملاء)</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...data.stats];
                            newStats[idx].label = e.target.value;
                            setData({ ...data, stats: newStats });
                          }}
                          className="w-full px-3 py-2 bg-white border rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 mb-1">الوصف المكتوب تحت الرقم</label>
                        <input
                          type="text"
                          value={stat.description}
                          onChange={(e) => {
                            const newStats = [...data.stats];
                            newStats[idx].description = e.target.value;
                            setData({ ...data, stats: newStats });
                          }}
                          className="w-full px-3 py-2 bg-white border rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: PORTFOLIO / PROJECTS */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                    إدارة معرض الأعمال (المشاريع والعملاء)
                  </h3>
                  <button
                    onClick={handleAddNewProject}
                    className="px-4 py-2 bg-[#004643] text-[#efece5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#0ff5b0]" />
                    <span>إضافة مشروع جديد</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {data.portfolio.map((project, pIdx) => (
                    <div key={project.id || pIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm font-black text-[#004643]">
                          مشروع #{pIdx + 1}: {project.title}
                        </span>
                        <button
                          onClick={() => handleRemoveProject(project.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف المشروع</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-700 mb-1">اسم المشروع</label>
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].title = e.target.value;
                              setData({ ...data, portfolio: newP });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">اسم العميل</label>
                          <input
                            type="text"
                            value={project.clientName}
                            onChange={(e) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].clientName = e.target.value;
                              setData({ ...data, portfolio: newP });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">التصنيف (مثلاً: التسويق الرقمي)</label>
                          <input
                            type="text"
                            value={project.category}
                            onChange={(e) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].category = e.target.value;
                              setData({ ...data, portfolio: newP });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <MediaUploadInput
                            label="صورة أو فيديو المشروع (Image / Video)"
                            value={project.imageUrl}
                            onChange={(val) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].imageUrl = val;
                              setData({ ...data, portfolio: newP });
                            }}
                            accept="image/*,video/*"
                            placeholder="أدخل رابط أو ارفع صورة/فيديو للمشروع من جهازك..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">وصف مختصر للمشروع</label>
                          <textarea
                            rows={2}
                            value={project.description}
                            onChange={(e) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].description = e.target.value;
                              setData({ ...data, portfolio: newP });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">تفاصيل كاملة تظهر عند الضغط على المشروع</label>
                          <textarea
                            rows={3}
                            value={project.fullDetails || ''}
                            onChange={(e) => {
                              const newP = [...data.portfolio];
                              newP[pIdx].fullDetails = e.target.value;
                              setData({ ...data, portfolio: newP });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: WHY CHOOSE US, GOALS & VALUES */}
            {activeTab === 'why-us' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-black text-[#004643] font-['Tajawal'] border-b pb-3">
                    إعدادات عنوان ونصوص سكشن (لماذا تختارنا، أهدافنا، قيمنا)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <label className="block text-slate-700 mb-1">الشارة العلوية (Badge Text)</label>
                      <input
                        type="text"
                        value={data.whyUsSection?.badgeText || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            whyUsSection: {
                              ...(data.whyUsSection || {
                                badgeText: '',
                                mainTitle: '',
                                subtitle: '',
                                pillars: [],
                              }),
                              badgeText: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                        placeholder="✨ التميز والرؤية المستقبلية"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1">العنوان الرئيسي</label>
                      <input
                        type="text"
                        value={data.whyUsSection?.mainTitle || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            whyUsSection: {
                              ...(data.whyUsSection || {
                                badgeText: '',
                                mainTitle: '',
                                subtitle: '',
                                pillars: [],
                              }),
                              mainTitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                        placeholder="لماذا تختارنا، ما هي أهدافنا، وما هي القيم التي تقودنا؟"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-slate-700 mb-1">الوصف الفرعي التوضيحي</label>
                      <textarea
                        rows={2}
                        value={data.whyUsSection?.subtitle || ''}
                        onChange={(e) =>
                          setData({
                            ...data,
                            whyUsSection: {
                              ...(data.whyUsSection || {
                                badgeText: '',
                                mainTitle: '',
                                subtitle: '',
                                pillars: [],
                              }),
                              subtitle: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                        placeholder="أدخل النص التوضيحي تحت عنوان السكشن..."
                      />
                    </div>
                  </div>
                </div>

                {/* Pillars / Cards */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                      محاور السكشن (لماذا تختارنا، أهدافنا، قيمنا)
                    </h3>
                    <button
                      onClick={() => {
                        const curPillars = data.whyUsSection?.pillars || [];
                        const newPillar = {
                          id: `pillar-${Date.now()}`,
                          type: 'custom',
                          title: 'محور جديد',
                          badgeText: `0${curPillars.length + 1}`,
                          iconName: 'Sparkles',
                          description: 'أدخل وصف المحور هنا...',
                          points: ['نقطة رئيسية أولى', 'نقطة رئيسية ثانية'],
                        };
                        setData({
                          ...data,
                          whyUsSection: {
                            ...(data.whyUsSection || {
                              badgeText: '✨ التميز والرؤية المستقبلية',
                              mainTitle: 'لماذا تختارنا، أهدافنا، قيمنا',
                              subtitle: '',
                              pillars: [],
                            }),
                            pillars: [...curPillars, newPillar],
                          },
                        });
                      }}
                      className="px-4 py-2 bg-[#004643] text-[#efece5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-4 h-4 text-[#0ff5b0]" />
                      <span>إضافة محور/بطاقة جديدة</span>
                    </button>
                  </div>

                  {(data.whyUsSection?.pillars || []).map((pillar, pilIdx) => (
                    <div
                      key={pillar.id || pilIdx}
                      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm font-black text-[#004643]">
                          محور #{pilIdx + 1}: {pillar.title}
                        </span>
                        <button
                          onClick={() => {
                            const curPillars = [...(data.whyUsSection?.pillars || [])];
                            curPillars.splice(pilIdx, 1);
                            setData({
                              ...data,
                              whyUsSection: {
                                ...(data.whyUsSection!),
                                pillars: curPillars,
                              },
                            });
                          }}
                          className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف المحور</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-700 mb-1">عنوان المحور</label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const curPillars = [...(data.whyUsSection?.pillars || [])];
                              curPillars[pilIdx].title = e.target.value;
                              setData({
                                ...data,
                                whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                              });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">شارة البادج (مثلاً 01. الشغف)</label>
                          <input
                            type="text"
                            value={pillar.badgeText || ''}
                            onChange={(e) => {
                              const curPillars = [...(data.whyUsSection?.pillars || [])];
                              curPillars[pilIdx].badgeText = e.target.value;
                              setData({
                                ...data,
                                whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                              });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">اسم الأيقونة (Lucide Icon)</label>
                          <input
                            type="text"
                            value={pillar.iconName}
                            onChange={(e) => {
                              const curPillars = [...(data.whyUsSection?.pillars || [])];
                              curPillars[pilIdx].iconName = e.target.value;
                              setData({
                                ...data,
                                whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                              });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-mono text-2xs"
                            placeholder="ShieldCheck, Target, Award, Sparkles"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-slate-700 mb-1">الوصف العام للمحور</label>
                          <textarea
                            rows={2}
                            value={pillar.description}
                            onChange={(e) => {
                              const curPillars = [...(data.whyUsSection?.pillars || [])];
                              curPillars[pilIdx].description = e.target.value;
                              setData({
                                ...data,
                                whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                              });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Points / Items inside Pillar */}
                      <div className="pt-3 border-t space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-800 font-bold text-2xs">
                            النقاط الرئيسية والمميزات داخل المحور:
                          </label>
                          <button
                            onClick={() => {
                              const curPillars = [...(data.whyUsSection?.pillars || [])];
                              curPillars[pilIdx].points = [
                                ...(curPillars[pilIdx].points || []),
                                'نقطة رئيسية جديدة',
                              ];
                              setData({
                                ...data,
                                whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                              });
                            }}
                            className="text-xs font-bold text-[#004643] hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5 text-[#0ff5b0]" />
                            <span>إضافة نقطة جديدة</span>
                          </button>
                        </div>

                        {(pillar.points || []).map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const curPillars = [...(data.whyUsSection?.pillars || [])];
                                const curPoints = [...curPillars[pilIdx].points];
                                curPoints[ptIdx] = e.target.value;
                                curPillars[pilIdx].points = curPoints;
                                setData({
                                  ...data,
                                  whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                                });
                              }}
                              className="flex-1 px-3 py-1.5 bg-slate-50 border rounded-xl text-xs"
                            />
                            <button
                              onClick={() => {
                                const curPillars = [...(data.whyUsSection?.pillars || [])];
                                const curPoints = [...curPillars[pilIdx].points];
                                curPoints.splice(ptIdx, 1);
                                curPillars[pilIdx].points = curPoints;
                                setData({
                                  ...data,
                                  whyUsSection: { ...(data.whyUsSection!), pillars: curPillars },
                                });
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg shrink-0"
                              title="حذف هذه النقطة"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: TEAM MEMBERS */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                    إدارة أعضاء فريق العمل والموظفين
                  </h3>
                  <button
                    onClick={handleAddNewTeamMember}
                    className="px-4 py-2 bg-[#004643] text-[#efece5] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-[#0ff5b0]" />
                    <span>إضافة موظف جديد</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {data.team.map((member, tIdx) => (
                    <div key={member.id || tIdx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                      
                      <div className="flex items-center justify-between border-b pb-3">
                        <span className="text-sm font-black text-[#004643]">
                          موظف #{tIdx + 1}: {member.name}
                        </span>
                        <button
                          onClick={() => handleRemoveTeamMember(member.id)}
                          className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>حذف الموظف</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                          <label className="block text-slate-700 mb-1">اسم الموظف</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => {
                              const newT = [...data.team];
                              newT[tIdx].name = e.target.value;
                              setData({ ...data, team: newT });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-1">المسمى الوظيفي</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => {
                              const newT = [...data.team];
                              newT[tIdx].role = e.target.value;
                              setData({ ...data, team: newT });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <MediaUploadInput
                            label="صورة الموظف الشخصية (Photo)"
                            value={member.photoUrl}
                            onChange={(val) => {
                              const newT = [...data.team];
                              newT[tIdx].photoUrl = val;
                              setData({ ...data, team: newT });
                            }}
                            accept="image/*"
                            placeholder="أدخل رابط أو ارفع صورة الموظف من جهازك مباشرة..."
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-slate-700 mb-1">وصف الموظف وخبراته</label>
                          <textarea
                            rows={2}
                            value={member.bio}
                            onChange={(e) => {
                              const newT = [...data.team];
                              newT[tIdx].bio = e.target.value;
                              setData({ ...data, team: newT });
                            }}
                            className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 8: AI ASSISTANT / GENERATOR */}
            {activeTab === 'ai' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3 border-b pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#004643] text-[#0ff5b0] flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#004643] font-['Tajawal']">
                      مساعد الذكاء الاصطناعي الذكي (Gemini AI Copywriter)
                    </h3>
                    <p className="text-2xs text-slate-600">اكتب طلبك وسيقوم النظام بتوليد محتوى تسويقي إبداعي لموقعك</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-700 mb-1">اكتب ما تود إنشائه (مثال: اكتب لي وصف خدمة تسويق برمجيات جديدة):</label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="مثال: اكتب لي 3 نقاط رئيسية مميزة لخدمة إنتاج الموشن جرافيك..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <button
                    onClick={handleGenerateAiText}
                    disabled={aiLoading || !aiPrompt}
                    className="px-6 py-3 bg-[#004643] hover:bg-[#003331] text-[#efece5] font-black rounded-xl shadow-md flex items-center gap-2 text-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 text-[#0ff5b0]" />
                    <span>{aiLoading ? 'جاري التوليد بالذكاء الاصطناعي...' : 'توليد المحتوى الآن'}</span>
                  </button>

                  {aiResult && (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-[#004643] block">النتيجة المولدة:</span>
                      <p className="text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                        {aiResult}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
