// geocolab-app/src/app/robots.ts
import { MetadataRoute } from 'next';

/**
 * Generate robots.txt for crawler instructions
 * Allows all content for search engines and AI crawlers
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'GPTBot', // OpenAI crawler
        allow: '/research/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ChatGPT-User', // ChatGPT browsing
        allow: '/research/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'ClaudeBot', // Anthropic crawler
        allow: '/research/',
        disallow: ['/api/', '/admin/'],
      },
      {
        userAgent: 'PerplexityBot', // Perplexity AI
        allow: '/research/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://geocolab.com/sitemap.xml',
  };
}