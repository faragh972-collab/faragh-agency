export interface AgencyInfo {
  name: string;
  logoText: string;
  logoUrl?: string;
  tagline: string;
  whatsappNumber: string; // e.g. "201000000000" or "+20..."
  contactEmail: string;
  phone: string;
  location?: string;
  domain: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
}

export interface HeroSection {
  badgeText: string;
  mainTitle: string;
  highlightedText: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  heroImageUrl: string;
  statsPillText: string;
}

export interface AboutCard {
  id: string;
  type: 'about' | 'mission' | 'values' | 'custom';
  title: string;
  iconName: string;
  description: string;
  items: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[]; // List of items/elements inside this service
  whatsappMessageCustom?: string;
  popular?: boolean;
}

export interface StatMetric {
  id: string;
  value: string;
  label: string;
  description: string;
  iconName: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  clientName: string;
  description: string;
  fullDetails?: string;
  category: string;
  imageUrl: string;
  tags: string[];
  results?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface WhyUsPillar {
  id: string;
  type: 'why_us' | 'goals' | 'values' | string;
  title: string;
  badgeText?: string;
  description: string;
  iconName: string;
  points: string[];
}

export interface WhyUsSectionData {
  badgeText: string;
  mainTitle: string;
  subtitle: string;
  pillars: WhyUsPillar[];
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}

export interface SiteData {
  agencyInfo: AgencyInfo;
  hero: HeroSection;
  aboutCards: AboutCard[];
  services: ServiceItem[];
  stats: StatMetric[];
  portfolio: PortfolioProject[];
  whyUsSection?: WhyUsSectionData;
  team: TeamMember[];
  seoSettings: SeoSettings;
}
