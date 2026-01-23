// geocolab-app/src/app/(public)/research/api/content.ts
import { 
  ContentDocument, 
  SectionIndex,
  validateContentDocument,
  validateSectionIndex 
} from '../_data/schema';

/**
 * Get content document by section and slug
 * Simulates API fetch - will be replaced with real API call
 * 
 * Migration path:
 * Current: await import(`../_data/${section}/${slug}.json`)
 * Future: await fetch(`/api/research/${section}/${slug}`)
 */
export async function getContent(
  section: string,
  slug: string
): Promise<ContentDocument | null> {
  try {
    // Simulate network delay for realistic API feel
    await new Promise(resolve => setTimeout(resolve, 50));

    // Normalize paths
    const normalizedSlug = slug.endsWith('.json') ? slug : `${slug}.json`;
    
    // Dynamic import based on section/slug
    const content = await import(`../_data/${section}/${normalizedSlug}`);
    
    // Validate against schema (catches malformed JSON early)
    const validated = validateContentDocument(content.default);
    
    return validated;
  } catch (error) {
    console.error(`Failed to fetch content: ${section}/${slug}`, error);
    return null;
  }
}

/**
 * Get section index (for section landing pages)
 */
export async function getSectionIndex(section: string): Promise<SectionIndex | null> {
  try {
    const index = await import(`../_data/${section}/index.json`);
    return validateSectionIndex(index.default);
  } catch (error) {
    console.error(`Failed to fetch section index: ${section}`, error);
    return null;
  }
}

/**
 * Get all content paths for static generation
 * This will be used by Next.js generateStaticParams
 */
export async function getAllContentPaths(): Promise<
  Array<{ section: string; slug: string[] }>
> {
  // In production, this would query your CMS/database
  // For now, manually define all paths
  
  const paths: Array<{ section: string; slug: string[] }> = [
    // X Algorithm (6 pages)
    { section: 'x-algorithm', slug: ['for-you-timeline'] },
    { section: 'x-algorithm', slug: ['phoenix-scorer'] },
    { section: 'x-algorithm', slug: ['weighted-scoring'] },
    { section: 'x-algorithm', slug: ['filters-and-gates'] },
    { section: 'x-algorithm', slug: ['hydration-and-embeddings'] },
    { section: 'x-algorithm', slug: ['signals-taxonomy'] },
    
    // Signal Frameworks (5 pages)
    { section: 'signal-frameworks', slug: ['signal-vs-spam'] },
    { section: 'signal-frameworks', slug: ['532-soccer-formation', 'overview'] },
    { section: 'signal-frameworks', slug: ['532-soccer-formation', 'formation-roles'] },
    { section: 'signal-frameworks', slug: ['532-soccer-formation', 'modifiers-and-guards'] },
    { section: 'signal-frameworks', slug: ['532-soccer-formation', 'variants'] },
    
    // Competitions (6 pages)
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'overview'] },
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'rules-and-scoring'] },
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'formations-and-tactics'] },
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'tournaments-and-leagues'] },
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'leaderboards'] },
    { section: 'competitions', slug: ['x-algo-soccer-formation', 'prizes-and-sponsors'] },
    
    // Panels (6 pages)
    { section: 'panels', slug: ['signal-panel-series', 'overview'] },
    { section: 'panels', slug: ['signal-panel-series', 'season-1', 'index'] },
    { section: 'panels', slug: ['signal-panel-series', 'season-1', 'discussion-guide'] },
    { section: 'panels', slug: ['signal-panel-series', 'season-1', 'timeline'] },
    { section: 'panels', slug: ['signal-panel-series', 'season-1', 'moderation-strategy'] },
    { section: 'panels', slug: ['signal-panel-series', 'season-1', 'panelist-playbook'] },
    
    // Playbooks (9 pages)
    { section: 'playbooks', slug: ['growth', 'daily-engagement'] },
    { section: 'playbooks', slug: ['growth', 'in-network-expansion'] },
    { section: 'playbooks', slug: ['growth', 'oon-discovery'] },
    { section: 'playbooks', slug: ['tactics', 'tiki-taka'] },
    { section: 'playbooks', slug: ['tactics', 'high-press'] },
    { section: 'playbooks', slug: ['tactics', 'park-the-bus'] },
    { section: 'playbooks', slug: ['risk', 'spam-avoidance'] },
    { section: 'playbooks', slug: ['risk', 'cooldown-cycles'] },
    
    // Glossary (4 pages)
    { section: 'glossary', slug: ['signal-metrics'] },
    { section: 'glossary', slug: ['soccer-formation-terms'] },
    { section: 'glossary', slug: ['x-algorithm-terms'] },
  ];
  
  return paths;
}

/**
 * Search content (basic implementation)
 * Future: Integrate with Algolia, Meilisearch, or database full-text search
 */
export async function searchContent(query: string): Promise<ContentDocument[]> {
  if (!query || query.length < 3) return [];
  
  const allPaths = await getAllContentPaths();
  const results: ContentDocument[] = [];
  const lowerQuery = query.toLowerCase();
  
  for (const path of allPaths) {
    const content = await getContent(path.section, path.slug.join('/'));
    
    if (!content) continue;
    
    // Search in title, description, tags, keywords
    const matchesTitle = content.metadata.title.toLowerCase().includes(lowerQuery);
    const matchesDescription = content.metadata.description.toLowerCase().includes(lowerQuery);
    const matchesTags = content.metadata.tags.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );
    const matchesKeywords = content.metadata.keywords.some(keyword => 
      keyword.toLowerCase().includes(lowerQuery)
    );
    
    if (matchesTitle || matchesDescription || matchesTags || matchesKeywords) {
      results.push(content);
    }
  }
  
  return results;
}

/**
 * Get related content based on tags/keywords
 */
export async function getRelatedContent(
  currentTags: string[],
  currentSlug: string,
  limit = 3
): Promise<ContentDocument[]> {
  const allPaths = await getAllContentPaths();
  const scoredContent: Array<{ content: ContentDocument; score: number }> = [];
  
  for (const path of allPaths) {
    const slugPath = path.slug.join('/');
    if (slugPath === currentSlug) continue; // Skip current page
    
    const content = await getContent(path.section, slugPath);
    if (!content) continue;
    
    // Calculate relevance score based on tag overlap
    const tagOverlap = content.metadata.tags.filter(tag => 
      currentTags.includes(tag)
    ).length;
    
    if (tagOverlap > 0) {
      scoredContent.push({ content, score: tagOverlap });
    }
  }
  
  // Sort by score and return top N
  return scoredContent
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.content);
}

/**
 * Get all sections metadata
 */
export async function getAllSections(): Promise<
  Array<{ id: string; title: string; description: string; icon?: string }>
> {
  return [
    {
      id: 'x-algorithm',
      title: 'X Algorithm',
      description: 'Deep dives into X\'s For You timeline, Phoenix scorer, and ranking signals',
      icon: 'academic-cap',
    },
    {
      id: 'signal-frameworks',
      title: 'Signal Frameworks',
      description: 'Proprietary frameworks for Signal > Spam optimization',
      icon: 'light-bulb',
    },
    {
      id: 'competitions',
      title: 'Competitions',
      description: 'X Algorithm growth competitions and leaderboards',
      icon: 'trophy',
    },
    {
      id: 'panels',
      title: 'Panels',
      description: 'Signal Panel Series discussions and episode guides',
      icon: 'chat-bubble-left-right',
    },
    {
      id: 'playbooks',
      title: 'Playbooks',
      description: 'Tactical guides for growth, engagement, and risk management',
      icon: 'book-open',
    },
    {
      id: 'glossary',
      title: 'Glossary',
      description: 'Complete reference for signal metrics and X algorithm terminology',
      icon: 'document-text',
    },
  ];
}