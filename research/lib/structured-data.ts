// geocolab-app/src/app/(public)/research/lib/structured-data.ts
import type { ContentMetadata } from '../_data/schema';

/**
 * Generate Schema.org JSON-LD for SEO and AI crawlers
 * Based on GEO Blueprint requirements
 */
export function generateStructuredData(metadata: ContentMetadata): Record<string, unknown> {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': metadata.schema.type,
    name: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    dateModified: metadata.lastmod,
    author: {
      '@type': 'Person',
      name: metadata.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'GEOCoLab',
      url: 'https://geocolab.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://geocolab.com/logo.png',
      },
    },
    url: metadata.canonical,
    keywords: metadata.keywords.join(', '),
  };

  // Add type-specific properties
  switch (metadata.schema.type) {
    case 'Article':
      return {
        ...baseSchema,
        headline: metadata.title,
        articleSection: metadata.breadcrumb[metadata.breadcrumb.length - 2]?.name,
        wordCount: estimateWordCount(metadata),
      };

    case 'HowTo':
      return {
        ...baseSchema,
        estimatedCost: {
          '@type': 'MonetaryAmount',
          currency: 'USD',
          value: metadata.schema.estimatedCost || '0',
        },
        totalTime: metadata.schema.performTime || 'PT15M',
      };

    case 'FAQPage':
      return {
        ...baseSchema,
        mainEntity: generateFAQEntities(metadata),
      };

    case 'Event':
      return {
        ...baseSchema,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        organizer: {
          '@type': 'Organization',
          name: 'GEOCoLab',
          url: 'https://geocolab.com',
        },
      };

    default:
      return baseSchema;
  }
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbStructuredData(
  breadcrumb: ContentMetadata['breadcrumb']
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumb.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate organization JSON-LD (for homepage)
 */
export function generateOrganizationStructuredData(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GEOCoLab',
    url: 'https://geocolab.com',
    logo: 'https://geocolab.com/logo.png',
    description: 'AI and Generative Engine Optimization consulting platform',
    sameAs: [
      'https://x.com/geocolab',
      'https://linkedin.com/company/geocolab',
      'https://github.com/jetro4u',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@geocolab.com',
    },
  };
}

/**
 * Helper: Estimate word count from metadata
 */
function estimateWordCount(metadata: ContentMetadata): number {
  const descWords = metadata.description.split(/\s+/).length;
  return descWords * 50; // Rough estimate
}

/**
 * Helper: Generate FAQ entities (placeholder - enhance with actual FAQ data)
 */
function generateFAQEntities(metadata: ContentMetadata): Array<Record<string, unknown>> {
  // In production, parse sections for FAQ items
  return [
    {
      '@type': 'Question',
      name: `What is ${metadata.title}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: metadata.description,
      },
    },
  ];
}