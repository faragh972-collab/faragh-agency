import { useEffect } from 'react';
import type { SiteData } from '../types';

const SITE_URL = 'https://www.faraghagency.com/';

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function unique(values: string[]) {
  return [...new Set(values.map(cleanText).filter(Boolean))];
}

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

export function useDynamicSeo(siteData: SiteData) {
  useEffect(() => {
    const serviceTerms = siteData.services.flatMap((service) => [
      service.title,
      ...service.features,
    ]);
    const portfolioTerms = siteData.portfolio.flatMap((project) => [
      project.title,
      project.category,
      ...project.tags,
    ]);
    const contentTerms = unique([
      ...serviceTerms,
      ...portfolioTerms,
      ...siteData.aboutCards.flatMap((card) => [card.title, ...card.items]),
      ...siteData.team.map((member) => member.role),
    ]);

    const configuredKeywords = cleanText(siteData.seoSettings?.keywords)
      .split(',')
      .map((keyword) => keyword.trim());
    const keywords = unique([
      'شركة تسويق رقمي في مصر',
      'شركة تسويق إلكتروني',
      'تصميم مواقع في مصر',
      'إدارة سوشيال ميديا',
      'تحسين محركات البحث SEO',
      ...configuredKeywords,
      ...contentTerms,
    ]).slice(0, 40).join(', ');

    const serviceSummary = unique(siteData.services.map((service) => service.title)).slice(0, 7).join('، ');
    const configuredDescription = cleanText(siteData.seoSettings?.metaDescription);
    const description = cleanText(
      `${configuredDescription || 'Faragh Agency شركة تسويق رقمي وتصميم وبرمجة مواقع في مصر والخليج.'} خدماتنا تشمل ${serviceSummary}.`,
    ).slice(0, 260);

    setMeta('meta[name="description"]', description);
    setMeta('meta[name="keywords"]', keywords);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:description"]', description);

    const dynamicSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          '@id': `${SITE_URL}#services-list`,
          name: 'خدمات Faragh Agency للتسويق الرقمي والبرمجة',
          itemListElement: siteData.services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Service',
              name: service.title,
              description: service.description,
              provider: { '@id': `${SITE_URL}#organization` },
              areaServed: ['Egypt', 'Gulf Cooperation Council'],
              url: `${SITE_URL}#services`,
            },
          })),
        },
        {
          '@type': 'ItemList',
          '@id': `${SITE_URL}#portfolio-list`,
          name: 'أعمال ومشروعات Faragh Agency',
          itemListElement: siteData.portfolio.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.title,
            description: project.description,
            url: `${SITE_URL}#portfolio`,
          })),
        },
      ],
    };

    let script = document.querySelector<HTMLScriptElement>('#dynamic-seo-schema');
    if (!script) {
      script = document.createElement('script');
      script.id = 'dynamic-seo-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(dynamicSchema);
  }, [siteData]);
}
