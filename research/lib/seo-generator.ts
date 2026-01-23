// geocolab-app/src/app/(public)/research/lib/seo-generator.ts
import type { Metadata } from 'next';
import type { ContentMetadata } from '../_data/schema';

/**
 * Generate Next.js Metadata object for SEO
 * Follows GEO Blueprint standards for maximum discoverability
 */
export function generateMetadata(metadata: ContentMetadata): Metadata {
  const {
    title,
    description,
    keywords,
    author,
    canonical,
    date,
    lastmod,
    tags,
  } = metadata;

  return {
    title: `${title} | GEOCoLab Research`,
    description,
    keywords,
    authors: [{ name: author }],
    
    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'GEOCoLab Research',
      type: 'article',
      publishedTime: date,
      modifiedTime: lastmod,
      authors: [author],
      tags,
      locale: 'en_US',
      images: [
        {
          url: `https://geocolab.com/api/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@geocolab',
      site: '@geocolab',
      images: [`https://geocolab.com/api/og?title=${encodeURIComponent(title)}`],
    },
    
    // Canonical URL
    alternates: {
      canonical,
    },
    
    // Robots directives
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Additional meta tags
    other: {
      'article:published_time': date,
      'article:modified_time': lastmod,
      'article:author': author,
      'article:section': tags[0] || 'Research',
      'article:tag': tags.join(', '),
    },
  };
}

/**
 * Generate viewport configuration
 */
export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#111827' },
    ],
  };
}

/**
 * Generate meta tags for social sharing
 */
export function generateSocialMeta(metadata: ContentMetadata): Record<string, string> {
  return {
    // Facebook
    'og:title': metadata.title,
    'og:description': metadata.description,
    'og:url': metadata.canonical,
    'og:type': 'article',
    'og:site_name': 'GEOCoLab',
    
    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:site': '@geocolab',
    'twitter:creator': '@geocolab',
    'twitter:title': metadata.title,
    'twitter:description': metadata.description,
    
    // Additional
    'application-name': 'GEOCoLab Research',
    'apple-mobile-web-app-title': 'GEOCoLab',
  };
}