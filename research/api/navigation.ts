// geocolab-app/src/app/(public)/research/api/navigation.ts

export interface NavigationItem {
    id: string;
    title: string;
    href: string;
    icon?: string;
    badge?: string;
    children?: NavigationItem[];
  }
  
  export interface NavigationSection {
    title: string;
    items: NavigationItem[];
  }
  
  /**
   * Get research portal navigation structure
   * Future: Fetch from CMS or database
   */
export async function getResearchNavigation(): Promise<NavigationSection[]> {
    return [
      {
        title: 'X Algorithm',
        items: [
          {
            id: 'x-algo-overview',
            title: 'Overview',
            href: '/research/x-algorithm',
            icon: 'heroicons-outline:academic-cap',
          },
          {
            id: 'for-you-timeline',
            title: 'For You Timeline',
            href: '/research/x-algorithm/for-you-timeline',
            icon: 'heroicons-outline:presentation-chart-line',
          },
          {
            id: 'phoenix-scorer',
            title: 'Phoenix Scorer',
            href: '/research/x-algorithm/phoenix-scorer',
            icon: 'heroicons-outline:fire',
          },
          {
            id: 'weighted-scoring',
            title: 'Weighted Scoring',
            href: '/research/x-algorithm/weighted-scoring',
            icon: 'heroicons-outline:scale',
          },
          {
            id: 'filters-gates',
            title: 'Filters & Gates',
            href: '/research/x-algorithm/filters-and-gates',
            icon: 'heroicons-outline:shield-check',
          },
          {
            id: 'hydration-embeddings',
            title: 'Hydration & Embeddings',
            href: '/research/x-algorithm/hydration-and-embeddings',
            icon: 'heroicons-outline:cube-transparent',
          },
          {
            id: 'signals-taxonomy',
            title: 'Signals Taxonomy',
            href: '/research/x-algorithm/signals-taxonomy',
            icon: 'heroicons-outline:adjustments-horizontal',
            badge: 'Complete',
          },
        ],
      },
      {
        title: 'Signal Frameworks',
        items: [
          {
            id: 'signal-frameworks-overview',
            title: 'Overview',
            href: '/research/signal-frameworks',
            icon: 'heroicons-outline:light-bulb',
          },
          {
            id: '532-formation',
            title: '5:3:2:1+ Soccer Formation',
            href: '/research/signal-frameworks/532-soccer-formation',
            icon: 'heroicons-outline:trophy',
            children: [
              {
                id: '532-overview',
                title: 'Overview',
                href: '/research/signal-frameworks/532-soccer-formation/overview',
              },
              {
                id: '532-roles',
                title: 'Formation Roles',
                href: '/research/signal-frameworks/532-soccer-formation/formation-roles',
              },
              {
                id: '532-modifiers',
                title: 'Modifiers & Guards',
                href: '/research/signal-frameworks/532-soccer-formation/modifiers-and-guards',
              },
              {
                id: '532-variants',
                title: 'Tactical Variants',
                href: '/research/signal-frameworks/532-soccer-formation/variants',
              },
            ],
          },
          {
            id: 'signal-vs-spam',
            title: 'Signal vs Spam',
            href: '/research/signal-frameworks/signal-vs-spam',
            icon: 'heroicons-outline:check-badge',
          },
        ],
      },
      {
        title: 'Competitions',
        items: [
          {
            id: 'competitions-overview',
            title: 'Overview',
            href: '/research/competitions',
            icon: 'heroicons-outline:trophy',
          },
          {
            id: 'x-algo-soccer',
            title: 'X Algorithm Soccer Formation',
            href: '/research/competitions/x-algo-soccer-formation',
            icon: 'heroicons-outline:users',
            badge: 'Active',
            children: [
              {
                id: 'competition-overview',
                title: 'Competition Overview',
                href: '/research/competitions/x-algo-soccer-formation/overview',
              },
              {
                id: 'rules-scoring',
                title: 'Rules & Scoring',
                href: '/research/competitions/x-algo-soccer-formation/rules-and-scoring',
              },
              {
                id: 'formations-tactics',
                title: 'Formations & Tactics',
                href: '/research/competitions/x-algo-soccer-formation/formations-and-tactics',
              },
              {
                id: 'tournaments',
                title: 'Tournaments & Leagues',
                href: '/research/competitions/x-algo-soccer-formation/tournaments-and-leagues',
              },
              {
                id: 'leaderboards',
                title: 'Leaderboards',
                href: '/research/competitions/x-algo-soccer-formation/leaderboards',
                badge: 'Live',
              },
              {
                id: 'prizes',
                title: 'Prizes & Sponsors',
                href: '/research/competitions/x-algo-soccer-formation/prizes-and-sponsors',
              },
            ],
          },
        ],
      },
      {
        title: 'Panels',
        items: [
          {
            id: 'panels-overview',
            title: 'Overview',
            href: '/research/panels',
            icon: 'heroicons-outline:chat-bubble-left-right',
          },
          {
            id: 'signal-panel-series',
            title: 'Signal Panel Series',
            href: '/research/panels/signal-panel-series',
            icon: 'heroicons-outline:microphone',
            children: [
              {
                id: 'series-overview',
                title: 'Series Overview',
                href: '/research/panels/signal-panel-series/overview',
              },
              {
                id: 'season-1',
                title: 'Season 1',
                href: '/research/panels/signal-panel-series/season-1',
                children: [
                  {
                    id: 's1-guide',
                    title: 'Discussion Guide',
                    href: '/research/panels/signal-panel-series/season-1/discussion-guide',
                  },
                  {
                    id: 's1-timeline',
                    title: 'Timeline',
                    href: '/research/panels/signal-panel-series/season-1/timeline',
                  },
                  {
                    id: 's1-moderation',
                    title: 'Moderation Strategy',
                    href: '/research/panels/signal-panel-series/season-1/moderation-strategy',
                  },
                  {
                    id: 's1-playbook',
                    title: 'Panelist Playbook',
                    href: '/research/panels/signal-panel-series/season-1/panelist-playbook',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Playbooks',
        items: [
          {
            id: 'playbooks-overview',
            title: 'Overview',
            href: '/research/playbooks',
            icon: 'heroicons-outline:book-open',
          },
          {
            id: 'growth-playbooks',
            title: 'Growth',
            href: '/research/playbooks/growth',
            icon: 'heroicons-outline:arrow-trending-up',
            children: [
              {
                id: 'daily-engagement',
                title: 'Daily Engagement',
                href: '/research/playbooks/growth/daily-engagement',
              },
              {
                id: 'in-network',
                title: 'In-Network Expansion',
                href: '/research/playbooks/growth/in-network-expansion',
              },
              {
                id: 'oon-discovery',
                title: 'OON Discovery',
                href: '/research/playbooks/growth/oon-discovery',
              },
            ],
          },
          {
            id: 'tactics-playbooks',
            title: 'Tactics',
            href: '/research/playbooks/tactics',
            icon: 'heroicons-outline:puzzle-piece',
            children: [
              {
                id: 'tiki-taka',
                title: 'Tiki-Taka',
                href: '/research/playbooks/tactics/tiki-taka',
              },
              {
                id: 'high-press',
                title: 'High Press',
                href: '/research/playbooks/tactics/high-press',
              },
              {
                id: 'park-bus',
                title: 'Park the Bus',
                href: '/research/playbooks/tactics/park-the-bus',
              },
            ],
          },
          {
            id: 'risk-playbooks',
            title: 'Risk Management',
            href: '/research/playbooks/risk',
            icon: 'heroicons-outline:shield-exclamation',
            children: [
              {
                id: 'spam-avoidance',
                title: 'Spam Avoidance',
                href: '/research/playbooks/risk/spam-avoidance',
              },
              {
                id: 'cooldown-cycles',
                title: 'Cooldown Cycles',
                href: '/research/playbooks/risk/cooldown-cycles',
              },
            ],
          },
        ],
      },
      {
        title: 'Glossary',
        items: [
          {
            id: 'glossary-overview',
            title: 'Complete Glossary',
            href: '/research/glossary',
            icon: 'heroicons-outline:book-open',
          },
          {
            id: 'signal-metrics',
            title: 'Signal Metrics',
            href: '/research/glossary/signal-metrics',
            icon: 'heroicons-outline:chart-bar',
          },
          {
            id: 'soccer-terms',
            title: 'Soccer Formation Terms',
            href: '/research/glossary/soccer-formation-terms',
            icon: 'heroicons-outline:document-text',
          },
          {
            id: 'x-algo-terms',
            title: 'X Algorithm Terms',
            href: '/research/glossary/x-algorithm-terms',
            icon: 'heroicons-outline:academic-cap',
          },
        ],
      },
    ];
}