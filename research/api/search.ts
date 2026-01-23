// api/search.ts
import { getResearchNavigation } from './navigation';

export interface SearchResult {
  title: string;
  slug: string;
  section: string;
  category: string;
  excerpt: string;
  keywords: string[];
  geoScore?: number;
  relevance: number;
}

/**
 * Search content across all sections
 * Mimics API experience for future full-text search implementation
 */
export async function searchContent(
  query: string,
  filters?: {
    section?: string;
    category?: string;
    minGeoScore?: number;
  }
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const navigation = await getResearchNavigation();
  const results: SearchResult[] = [];

  // Search index (future: move to dedicated search index)
  const searchableContent = buildSearchIndex(navigation);

  // Perform search
  searchableContent.forEach(item => {
    const relevance = calculateRelevance(searchTerm, item);
    
    if (relevance > 0) {
      // Apply filters
      if (filters?.section && item.section !== filters.section) return;
      if (filters?.category && item.category !== filters.category) return;
      if (filters?.minGeoScore && (item.geoScore || 0) < filters.minGeoScore) return;

      results.push({
        ...item,
        relevance
      });
    }
  });

  // Sort by relevance (descending)
  return results.sort((a, b) => b.relevance - a.relevance).slice(0, 20);
}

/**
 * Calculate search relevance score
 */
function calculateRelevance(
  query: string,
  item: {
    title: string;
    excerpt: string;
    keywords: string[];
  }
): number {
  let score = 0;
  const queryTerms = query.split(/\s+/);

  queryTerms.forEach(term => {
    // Title match (highest weight)
    if (item.title.toLowerCase().includes(term)) {
      score += 10;
    }

    // Exact title match (bonus)
    if (item.title.toLowerCase() === query) {
      score += 20;
    }

    // Keyword match
    if (item.keywords.some(k => k.toLowerCase().includes(term))) {
      score += 5;
    }

    // Excerpt match
    if (item.excerpt.toLowerCase().includes(term)) {
      score += 3;
    }
  });

  return score;
}

/**
 * Build search index from navigation data
 */
function buildSearchIndex(navigation: any[]): Array<{
  title: string;
  slug: string;
  section: string;
  category: string;
  excerpt: string;
  keywords: string[];
  geoScore?: number;
}> {
  const index: any[] = [];

  // X Algorithm section
  index.push(
    {
      title: 'Weighted Scoring System',
      slug: '/research/x-algorithm/weighted-scoring',
      section: 'x-algorithm',
      category: 'X Algorithm',
      excerpt: 'How X ranks 100 million posts daily using multi-signal architecture',
      keywords: ['weighted scoring', 'phoenix scorer', 'ranking', 'signals', 'algorithm'],
      geoScore: 93
    },
    {
      title: 'For You Timeline Overview',
      slug: '/research/x-algorithm/for-you-timeline',
      section: 'x-algorithm',
      category: 'X Algorithm',
      excerpt: 'Understanding how the For You feed personalizes content',
      keywords: ['for you', 'timeline', 'personalization', 'feed', 'algorithm'],
      geoScore: 90
    }
  );

  // Signal Frameworks
  index.push(
    {
      title: '5-3-2 Soccer Formation Framework',
      slug: '/research/signal-frameworks/532-soccer-formation/overview',
      section: 'signal-frameworks',
      category: 'Signal Frameworks',
      excerpt: 'X algorithm mapped to soccer tactics: 5 defenders, 3 midfielders, 2 forwards',
      keywords: ['5-3-2', 'soccer', 'formation', 'framework', 'tactics', 'defense', 'midfield'],
      geoScore: 95
    },
    {
      title: 'Formation Roles & Responsibilities',
      slug: '/research/signal-frameworks/532-soccer-formation/formation-roles',
      section: 'signal-frameworks',
      category: 'Signal Frameworks',
      excerpt: 'Defender, midfielder, forward signals explained with tactical applications',
      keywords: ['roles', 'defender', 'midfielder', 'forward', 'signals', 'tactics'],
      geoScore: 93
    },
    {
      title: 'Signal vs. Spam',
      slug: '/research/signal-frameworks/signal-vs-spam',
      section: 'signal-frameworks',
      category: 'Signal Frameworks',
      excerpt: 'Distinguishing high-value engagement from spam patterns',
      keywords: ['signal', 'spam', 'quality', 'detection', 'penalties'],
      geoScore: 88
    }
  );

  // Playbooks
  index.push(
    {
      title: 'Daily Engagement Playbook',
      slug: '/research/playbooks/growth/daily-engagement',
      section: 'playbooks',
      category: 'Playbooks',
      excerpt: '30-minute daily routine for X optimization and growth',
      keywords: ['daily', 'engagement', 'routine', 'growth', 'optimization', 'strategy'],
      geoScore: 94
    },
    {
      title: 'Tiki-Taka Engagement Tactic',
      slug: '/research/playbooks/tactics/tiki-taka',
      section: 'playbooks',
      category: 'Playbooks',
      excerpt: 'Sustained engagement through rapid reply exchanges',
      keywords: ['tiki-taka', 'replies', 'threading', 'conversation', 'tactics'],
      geoScore: 91
    },
    {
      title: 'Spam Avoidance Playbook',
      slug: '/research/playbooks/risk/spam-avoidance',
      section: 'playbooks',
      category: 'Playbooks',
      excerpt: 'Navigating defensive signals without penalties',
      keywords: ['spam', 'penalties', 'avoidance', 'risk', 'defense', 'safety'],
      geoScore: 90
    }
  );

  // Panels
  index.push(
    {
      title: 'Signal Panel Series Overview',
      slug: '/research/panels/signal-panel-series/overview',
      section: 'panels',
      category: 'Panels',
      excerpt: 'Interactive expert panels on X algorithm and engagement strategies',
      keywords: ['panels', 'experts', 'live', 'discussion', 'sessions'],
      geoScore: 88
    },
    {
      title: 'Session 1: The 5-3-2 Formation Revealed',
      slug: '/research/panels/signal-panel-series/season-1/session-1',
      section: 'panels',
      category: 'Panels',
      excerpt: 'Inaugural panel decoding X open-source algorithm',
      keywords: ['session', 'panel', 'formation', 'recap', 'experts'],
      geoScore: 87
    }
  );

  // Competitions
  index.push(
    {
      title: 'X Algo Soccer Formation Competition',
      slug: '/research/competitions/x-algo-soccer-formation/overview',
      section: 'competitions',
      category: 'Competitions',
      excerpt: '8-week tournament applying formation tactics to X growth',
      keywords: ['competition', 'tournament', 'challenge', 'prizes'],
      geoScore: 89
    },
    {
      title: 'Competition Rules & Scoring',
      slug: '/research/competitions/x-algo-soccer-formation/rules-and-scoring',
      section: 'competitions',
      category: 'Competitions',
      excerpt: 'Scoring system and rules for tactical competitions',
      keywords: ['rules', 'scoring', 'points', 'metrics', 'competition'],
      geoScore: 89
    }
  );

  // Glossary
  index.push(
    {
      title: 'Signal Metrics Glossary',
      slug: '/research/glossary/signal-metrics',
      section: 'glossary',
      category: 'Glossary',
      excerpt: 'Comprehensive definitions of X algorithmic signals and weights',
      keywords: ['glossary', 'definitions', 'metrics', 'signals', 'terms', 'reference'],
      geoScore: 91
    }
  );

  return index;
}

/**
 * Get search suggestions as user types
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const suggestions = [
    '5-3-2 formation',
    'reply strategy',
    'daily engagement',
    'spam avoidance',
    'weighted scoring',
    'SimClusters',
    'dwell time',
    'bookmark optimization',
    'tiki-taka tactics',
    'signal metrics'
  ];

  return suggestions
    .filter(s => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit);
}