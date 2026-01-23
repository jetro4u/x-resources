// api/related.ts
import { getContent } from './content';

interface RelatedItem {
  title: string;
  slug: string;
  category: string;
  description?: string;
  geoScore?: number;
}

/**
 * Fetch related content based on current page metadata
 * Mimics API experience for future database migration
 */
export async function getRelatedContent(
  currentSlug: string,
  section: string,
  limit: number = 3
): Promise<RelatedItem[]> {
  try {
    // Get current page content
    const current = await getContent(section, currentSlug);
    if (!current?.content?.relatedContent) {
      return await getRecommendedContent(section, limit);
    }

    // Fetch detailed info for related items
    const related = await Promise.all(
      current.content.relatedContent.slice(0, limit).map(async (item) => {
        const slug = item.slug.split('/').pop() || item.slug;
        const category = item.category.toLowerCase().replace(/\s+/g, '-');
        
        try {
          const content = await getContent(category, slug);
          return {
            title: item.title,
            slug: item.slug,
            category: item.category,
            description: content?.content?.introduction?.lead,
            geoScore: content?.geoScore
          };
        } catch {
          // Fallback if content not found
          return {
            title: item.title,
            slug: item.slug,
            category: item.category
          };
        }
      })
    );

    return related.filter(Boolean);
  } catch (error) {
    console.error('Error fetching related content:', error);
    return [];
  }
}

/**
 * Get recommended content when no explicit related items exist
 */
async function getRecommendedContent(
  section: string,
  limit: number
): Promise<RelatedItem[]> {
  // Recommendation logic based on section
  const recommendations: Record<string, RelatedItem[]> = {
    'x-algorithm': [
      {
        title: '5-3-2 Soccer Formation Framework',
        slug: '/research/signal-frameworks/532-soccer-formation/overview',
        category: 'Signal Frameworks',
        description: 'X algorithm mapped to soccer tactics'
      },
      {
        title: 'Daily Engagement Playbook',
        slug: '/research/playbooks/growth/daily-engagement',
        category: 'Playbooks',
        description: '30-min X optimization routine'
      },
      {
        title: 'Signal Metrics Glossary',
        slug: '/research/glossary/signal-metrics',
        category: 'Glossary',
        description: 'Complete signal definitions'
      }
    ],
    'signal-frameworks': [
      {
        title: 'Weighted Scoring System',
        slug: '/research/x-algorithm/weighted-scoring',
        category: 'X Algorithm',
        description: 'How X ranks 100M daily posts'
      },
      {
        title: 'Tiki-Taka Engagement Tactic',
        slug: '/research/playbooks/tactics/tiki-taka',
        category: 'Playbooks',
        description: 'Reply-based viral strategy'
      }
    ],
    'playbooks': [
      {
        title: 'Formation Roles Deep Dive',
        slug: '/research/signal-frameworks/532-soccer-formation/formation-roles',
        category: 'Signal Frameworks',
        description: 'Defender, midfielder, forward signals'
      },
      {
        title: 'X Algorithm Overview',
        slug: '/research/x-algorithm/for-you-timeline',
        category: 'X Algorithm',
        description: 'How the For You feed works'
      }
    ],
    'panels': [
      {
        title: '5-3-2 Formation Overview',
        slug: '/research/signal-frameworks/532-soccer-formation/overview',
        category: 'Signal Frameworks',
        description: 'Core framework explained'
      },
      {
        title: 'Competition Rules',
        slug: '/research/competitions/x-algo-soccer-formation/rules-and-scoring',
        category: 'Competitions',
        description: 'Apply tactics competitively'
      }
    ],
    'competitions': [
      {
        title: 'Daily Engagement Playbook',
        slug: '/research/playbooks/growth/daily-engagement',
        category: 'Playbooks',
        description: 'Practice tactics daily'
      },
      {
        title: 'Panel Session 1 Recap',
        slug: '/research/panels/signal-panel-series/season-1/session-1',
        category: 'Panels',
        description: 'Formation tactics breakdown'
      }
    ]
  };

  return (recommendations[section] || recommendations['x-algorithm']).slice(0, limit);
}

/**
 * Get popular content across all sections
 */
export async function getPopularContent(limit: number = 6): Promise<RelatedItem[]> {
  const popular: RelatedItem[] = [
    {
      title: 'The 5-3-2 Formation Revealed',
      slug: '/research/signal-frameworks/532-soccer-formation/overview',
      category: 'Signal Frameworks',
      geoScore: 95
    },
    {
      title: 'Daily Engagement Playbook',
      slug: '/research/playbooks/growth/daily-engagement',
      category: 'Playbooks',
      geoScore: 94
    },
    {
      title: 'Weighted Scoring Deep Dive',
      slug: '/research/x-algorithm/weighted-scoring',
      category: 'X Algorithm',
      geoScore: 93
    },
    {
      title: 'Formation Roles & Responsibilities',
      slug: '/research/signal-frameworks/532-soccer-formation/formation-roles',
      category: 'Signal Frameworks',
      geoScore: 93
    },
    {
      title: 'Tiki-Taka Engagement Tactic',
      slug: '/research/playbooks/tactics/tiki-taka',
      category: 'Playbooks',
      geoScore: 91
    },
    {
      title: 'Signal Metrics Glossary',
      slug: '/research/glossary/signal-metrics',
      category: 'Glossary',
      geoScore: 91
    }
  ];

  return popular.slice(0, limit);
}

/**
 * Get content by category for section landing pages
 */
export async function getContentByCategory(
  section: string,
  category?: string
): Promise<RelatedItem[]> {
  // Future: Query database with filters
  // For now, return section-specific content
  const allContent = await getRecommendedContent(section, 10);
  
  if (category) {
    return allContent.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  return allContent;
}