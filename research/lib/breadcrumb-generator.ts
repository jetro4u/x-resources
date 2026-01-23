// geocolab-app/src/app/(public)/research/lib/breadcrumb-generator.ts
import type { ContentMetadata } from '../_data/schema';

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

/**
 * Generate breadcrumb trail from URL path
 * Falls back to metadata breadcrumb if available
 */
export function generateBreadcrumbs(
  section: string,
  slug: string[],
  metadata?: ContentMetadata
): BreadcrumbItem[] {
  // Use metadata breadcrumb if available (more accurate)
  if (metadata?.breadcrumb) {
    return metadata.breadcrumb.map((item, index, arr) => ({
      ...item,
      current: index === arr.length - 1,
    }));
  }
  
  // Otherwise, construct from path
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: 'https://geocolab.com' },
    { name: 'Research', url: 'https://geocolab.com/research' },
  ];
  
  // Add section
  breadcrumbs.push({
    name: formatSectionName(section),
    url: `https://geocolab.com/research/${section}`,
  });
  
  // Add slug parts (excluding last one)
  let currentPath = `/research/${section}`;
  slug.slice(0, -1).forEach((part) => {
    currentPath += `/${part}`;
    breadcrumbs.push({
      name: formatBreadcrumbName(part),
      url: `https://geocolab.com${currentPath}`,
    });
  });
  
  // Add current page
  const lastSlug = slug[slug.length - 1];
  breadcrumbs.push({
    name: formatBreadcrumbName(lastSlug),
    url: `https://geocolab.com${currentPath}/${lastSlug}`,
    current: true,
  });
  
  return breadcrumbs;
}

/**
 * Format section name for display
 */
function formatSectionName(section: string): string {
  const sectionMap: Record<string, string> = {
    'x-algorithm': 'X Algorithm',
    'signal-frameworks': 'Signal Frameworks',
    'competitions': 'Competitions',
    'panels': 'Panels',
    'playbooks': 'Playbooks',
    'glossary': 'Glossary',
  };
  
  return sectionMap[section] || section;
}

/**
 * Format breadcrumb name from slug
 */
function formatBreadcrumbName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get parent URL from breadcrumbs
 */
export function getParentUrl(breadcrumbs: BreadcrumbItem[]): string | null {
  if (breadcrumbs.length < 2) return null;
  return breadcrumbs[breadcrumbs.length - 2].url;
}