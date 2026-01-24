// geocolab-app/src/app/(public)/research/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllContentPaths } from './api/content';

/**
 * Generate dynamic sitemap for research portal
 * Crawlable by search engines and AI agents
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://geocolab.com';
  const paths = await getAllContentPaths();
  
  // Research hub landing page
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
  
  // Section index pages
  const sections = [
    'x-algorithm',
    'signal-frameworks',
    'competitions',
    'panels',
    'playbooks',
    'glossary',
  ];
  
  sections.forEach((section) => {
    pages.push({
      url: `${baseUrl}/research/${section}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });
  
  // All content pages
  paths.forEach((path) => {
    const url = `${baseUrl}/research/${path.section}/${path.slug.join('/')}`;
    
    // Priority based on section
    let priority = 0.8;
    if (path.section === 'x-algorithm') priority = 0.9; // Higher for core algorithm docs
    if (path.section === 'glossary') priority = 0.85; // High for AI citation
    
    pages.push({
      url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority,
    });
  });
  
  return pages;
}