import React, { useEffect } from 'react';
import { SITE_CONFIG } from '../../config/site';

export interface FAQItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  faqs?: FAQItem[];
  noindex?: boolean;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = SITE_CONFIG.description,
  canonicalPath = '/',
  ogType = 'website',
  ogImage = SITE_CONFIG.ogImage,
  faqs,
  noindex = false,
  noIndex = false,
}) => {
  const effectiveNoIndex = noindex || noIndex;
  const fullTitle = title 
    ? (title.includes('Watermark AI') ? title : `${title} | ${SITE_CONFIG.name}`)
    : `${SITE_CONFIG.name} - Free AI Watermark & Object Remover`;

  const canonicalUrl = `${SITE_CONFIG.url}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (nameAttr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    setMeta('name', 'description', description);
    setMeta('name', 'robots', effectiveNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setLink('canonical', canonicalUrl);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', SITE_CONFIG.name);
    setMeta('property', 'og:image', fullOgImage);

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', fullOgImage);

    // Schema.org structured data (JSON-LD)
    const structuredDataArray: any[] = [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.url,
        'logo': `${SITE_CONFIG.url}/favicon.svg`
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': SITE_CONFIG.name,
        'url': SITE_CONFIG.url,
        'description': SITE_CONFIG.description
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': SITE_CONFIG.name,
        'operatingSystem': 'Any (Web Browser)',
        'applicationCategory': 'MultimediaApplication',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': SITE_CONFIG.description
      }
    ];

    if (faqs && faqs.length > 0) {
      structuredDataArray.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.question || f.q || '',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.answer || f.a || ''
          }
        }))
      });
    }

    let scriptTag = document.getElementById('structured-data-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'structured-data-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredDataArray, null, 2);

  }, [fullTitle, description, canonicalUrl, fullOgImage, ogType, effectiveNoIndex, JSON.stringify(faqs)]);

  return null;
};
