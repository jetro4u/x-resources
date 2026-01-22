// @dndhub/geo/src/types/x-signal-metrics.ts

/**
 * AI Platform Taxonomy
 * Platforms where content is optimized for discovery and citation
 */
export type GEOPlatform = 
  // === EXISTING (Keep) ===
  'geocolab' | 'grok' | 'gemini' | 'chatgpt' | 'perplexity' | 'claude' | 'copilot' | 'searchgpt'
  
  // === CONVERSATIONAL AI (ChatGPT + Grok) ===
  | 'meta_ai'           // WhatsApp/Instagram/Facebook (Gemini: social snippets)
  | 'apple_intelligence' // Siri enhancements (Grok: voice-friendly, local intent)
  
  // === AI-NATIVE SEARCH (Grok) ===
  | 'andi'              // Privacy-focused, answer-first (Grok)
  | 'komo_ai'           // Categorized searches (academic, news) (Grok)
  | 'you_com'           // Customizable modes (research, creative) (Grok)
  | 'arc_search'        // Mobile-focused AI summaries (Grok)
  | 'brave_leo'         // Privacy-centric browser AI (Grok)
  
  // === KNOWLEDGE GRAPH & CITATION (ChatGPT + Gemini) ===
  | 'grokipedia'        // xAI's AI-generated encyclopedia (Gemini: distinct verification layer)
  | 'wikipedia'         // Foundational knowledge source (ChatGPT)
  | 'wikidata'          // Structured knowledge base (ChatGPT)
  
  // === SPECIALIZED PLATFORMS (All Models) ===
  | 'deepseek'          // International (Asian markets) + advanced reasoning (Gemini + Grok)
  | 'yandex_gpt'        // Eastern European markets (Gemini)
  | 'consensus'         // Academic/research (Grok: scholarly sources)
  | 'phind'             // Developer/code-centric (Grok: technical docs)
  | 'felo_ai'           // Multimodal (image/video) (Grok)
  
  // === VERTICAL-SPECIFIC (Grok + Gemini) ===
  | 'amazon_rufus'      // E-commerce discovery (ChatGPT: Shopping AI Agents)
  | 'reddit'            // Feeder platform for AI (Gemini: community-driven)
  | 'youtube'           // Video content discovery (Gemini: multimodal feeder)
  
  // === ENTERPRISE & DEVELOPER (ChatGPT) ===
  | 'notion_ai'         // Enterprise knowledge (ChatGPT)
  | 'slack_ai'          // Workplace search (ChatGPT)
  | 'github_copilot_chat' // Developer docs (ChatGPT)
  // === SOCIAL PLATFORMS (NEW) ===
  | 'x'                    // Twitter/X (primary focus)
  | 'linkedin'             // Professional network
  | 'threads'              // Meta's X competitor
  | 'bluesky'              // Decentralized protocol
  | 'mastodon'             // Federated network
  | 'instagram'            // Visual social (Meta)
  | 'facebook'             // Legacy social (Meta)
  | 'tiktok'               // Short-form video
  | 'youtube_community'    // YouTube's social layer
  | 'reddit';              // Community discussions

export type GEOPlatformCategory =
  | 'conversational-ai'      // ChatGPT, Claude, Meta AI
  | 'ai-search'              // Grok, Perplexity, You.com
  | 'knowledge-graph'        // Wikipedia, Wikidata, Grokipedia
  | 'developer-ai'           // GitHub Copilot, Phind
  | 'enterprise-ai'          // Notion AI, Slack AI
  | 'vertical-specific'      // Amazon Rufus, Consensus
  | 'feeder-platforms'       // Reddit, YouTube
  | 'crawler-index'         // Bingbot, Common Crawl
  | 'social-network'         // X, LinkedIn, Threads, Bluesky
  | 'social-media'           // Instagram, TikTok, Facebook
  | 'social-community';      // Reddit, Mastodon
/**
 * Base GEO Signal Metrics for Social Platforms
 * Extensible foundation for platform-specific implementations (X, LinkedIn, Threads, etc.)
 * 
 * Core Philosophy:
 * - Signal Strength: Quality over quantity (high-intent actions weighted heavily)
 * - Negative Amplification: Dislikes/blocks weighted 2-5x vs positives
 * - Temporal Windowing: Real-time (0-8h), short-term (1-7d), long-term (28-90d)
 * - Graph-Based Authority: Network position, reciprocity, community embeddings
 */
export interface GEOSignalMetrics {
  // ===== CORE IDENTITY =====
  platformId: GEOPlatform;
  accountId: string;
  contentId?: string;
  timestamp: number;
  
  // ===== CONTENT QUALITY SIGNALS =====
  contentQuality: {
    semanticRelevance: number;        // Topic coherence (0-1)
    contextDepth: number;             // Engagement quality beyond clicks (0-1)
    originalityScore: number;         // Unique insights vs echoing (0-1)
    informationDensity: number;       // Facts/claims per unit (0-1)
    conversationalTone: number;       // Natural prose for AI parsing (0-1)
    multimodalRichness?: number;      // Image/video quality (0-1)
  };
  
  // ===== ENGAGEMENT QUALITY SIGNALS =====
  engagement: {
    // High-Intent Actions (weighted heavily)
    dwellTime: number;                // Seconds spent (>15s threshold)
    clickDepth: number;               // Follow-through actions (0-5+)
    bookmarkRate: number;             // Save for later (highest intent)
    shareQuality: number;             // Reshare with commentary (0-1)
    
    // Interaction Depth
    replyDepth: number;               // Comment engagement quality (0-1)
    threadParticipation: number;      // Multi-turn conversation (0-1)
    completionRate: number;           // Task/content completion (0-1)
    
    // Velocity Metrics
    immediateEngagement: number;      // <1min actions
    sustainedEngagement: number;      // >15min session depth
    viralityIndex: number;            // Exponential growth rate (0-1)
  };
  
  // ===== NETWORK AUTHORITY SIGNALS =====
  authority: {
    // Account Authority
    followerVerifiedRatio: number;    // % Premium/verified followers (0-1)
    mutualConnectionDensity: number;  // Reciprocal network strength (0-1)
    authorityAdjacency: number;       // Proximity to trusted nodes (0-1)
    
    // Content Authority
    citationFrequency: number;        // Mentions/links from others
    reshareQuality: number;           // Who amplifies (authority of sharers)
    crossPlatformMentions: number;    // External references
    
    // Graph Positioning
    graphCentrality: number;          // Network position score (0-1)
    communityEmbeddings: number[];    // Cluster assignments (sparse vector)
    realGraphScore: number;           // Genuine connection strength (0-1)
  };
  
  // ===== BEHAVIORAL CONSISTENCY SIGNALS =====
  consistency: {
    postingCadence: number;           // Regular activity pattern (0-1)
    nicheCoherence: number;           // Topic stability over time (0-1)
    responseLatency: number;          // Timely but not spam-fast (0-1)
    sessionDepth: number;             // Sustained usage vs hit-and-run (0-1)
    accountLongevity: number;         // Days since creation
    activityConsistency: number;      // Days active / total days (0-1)
  };
  
  // ===== NEGATIVE SIGNALS (AMPLIFIED 2-5x) =====
  negativeSignals: {
    // User Reports (Highest Weight)
    blockRate: number;                // User blocks (penalty: -369x in X)
    reportRate: number;               // Spam/abuse reports (penalty: -74x)
    dismissRate: number;              // "Not interested" (penalty: -22x)
    
    // Implicit Dislikes
    scrollPastRate: number;           // Ignored in feed (penalty: -5x)
    immediateExitRate: number;        // <2s engagement
    feedbackFatigueRate: number;      // Over-serving penalty
    
    // Content Safety
    toxicityScore: number;            // Language/content toxicity (0-1)
    spamMarkers: number;              // Coordinated behavior flags
    misinformationFlags: number;      // Fact-check warnings
    policyViolations: number;         // Moderation flags
    
    // Author Credibility
    botProbability: number;           // Automation likelihood (0-1)
    manipulationRisk: number;         // Coordinated inauthentic (0-1)
  };
  
  // ===== TEMPORAL FEATURES =====
  temporal: {
    // Real-Time (0-8 hours)
    recentVelocity: number;           // 1-hour engagement rate
    currentSessionDepth: number;      // Active browsing depth
    last30MinEngagements: number;     // Immediate context
    
    // Short-Term (1-7 days)
    weeklyEngagementRate: number;     // 7-day rolling average
    dailyPostingRhythm: number;       // Consistent pattern score (0-1)
    topicShiftVelocity: number;       // Interest drift (lower is better)
    
    // Long-Term (28-90 days)
    stableInterestEmbeddings: number[]; // 90-day user vector
    historicalAuthority: number;      // 90-day authority metrics
    retentionRate: number;            // Follower/audience retention (0-1)
  };
  
  // ===== PERSONALIZATION FEATURES =====
  personalization: {
    userContentSimilarity: number;    // Embedding cosine similarity (0-1)
    userAuthorRelationship: number;   // Follow/mutual history (0-1)
    temporalRelevance: number;        // Recency decay (exponential)
    geographicAlignment: number;      // Location relevance (0-1)
    languageMatch: number;            // Content language preference (0-1)
  };
  
  // ===== PLATFORM-SPECIFIC METADATA =====
  platformSpecific?: Record<string, unknown>; // Extensible for platform features
  
  // ===== DERIVED SCORES =====
  derivedScores: {
    overallSignalScore: number;       // Composite 0-100
    spamRisk: number;                 // Aggregate spam likelihood (0-1)
    trustScore: number;               // Aggregate trust (0-1)
    viralPotential: number;           // Predicted amplification (0-1)
  };
}

/**
 * Simplified X Social Metrics
 * Focus: Observable signals affecting candidate survival & scoring
 * Aligned to: Thunder (in-network) + Phoenix (out-network) retrieval
 */
export interface XSocialMetrics {
  platformId: 'x';
  accountId: string;
  
  // Core engagement observables (pre-transformer)
  engagement: {
    velocity: number;                    // Δ engagements/time (sourcing priority)
    diversity: number;                   // unique_engagers/total (anti-bot signal)
    reciprocalRate: number;              // RealGraph proxy (mutual interactions)
    authorAffinity: number;              // Historical user-author interaction strength
    sessionFreshness: number;            // Recency relative to viewer context
  };
  
  // Graph positioning (for candidate eligibility)
  graph: {
    realGraphDensity: number;            // Reciprocal follow strength (0-1)
    simClusterMemberships: number[];     // Community assignments (sparse vector)
    twhinEmbeddings: number[];           // Dense heterogeneous graph position
    frsScore: number;                    // Follow recommendation potential
  };
  
  // Verification context (trust signal)
  verification: {
    isVerified: boolean;
    tier: 'Free' | 'Premium' | 'Premium+' | 'Organization';
    verifiedSince?: Date;
  };
  
  // Basic stats (backward compatibility)
  followers: number;
  following: number;
  posts: number;
  accountAge: number;
}

/**
 * X-Specific GEO Signal Metrics
 * Extends base GEOSignalMetrics with X's multi-system architecture
 * 
 * Maps to X's 9 recommendation surfaces:
 * - Timeline (For You feed)
 * - Account (Who to Follow)
 * - Communities (Topic discovery)
 * - Conversations (Reply ranking)
 * - Explore (Trending aggregation)
 * - Notifications (Push alerts)
 * - Search (Query results)
 * - Trends (Trending topics)
 * - Spaces (Audio rooms)
 */
/**
 * X GEO Signal Metrics - Unified Timeline Focus
 * Extends base GEO with X's multi-action prediction model
 * Aligned to: Phoenix Grok Transformer + Weighted Scorer
 */
export interface XGEOSignalMetrics extends GEOSignalMetrics {
  platformId: 'x';
  
  // === UNIFIED CROSS-SYSTEM SIGNALS ===
  unifiedSignals: {
    realTimeEmbeddings: number[];     // Hash-based from Phoenix/TwHIN
    diversityPenalty: number;         // Author/topic attenuatio
    // Query Hydration Context
    userActionSequence: string[];        // Engagement history (Phoenix input)
    userFeatures: {
      followingList: string[];           // For in-network eligibility
      interests: string[];               // Topic embeddings
      language: string;
      location?: string;
    };
    
    // Hash-Based Embeddings (Phoenix retrieval)
    candidateEmbeddings: number[];       // Post embedding (two-tower user side)
    userEmbeddings: number[];            // User embedding (two-tower candidate side)
    retrievalSimilarity: number;         // Dot product similarity (0-1)
    
    // Grok Transformer Predictions (Phoenix Scorer)
    engagementProbabilities: {
      // Positive actions (weighted heavily)
      favorite: number;                  // Weight: 1.0
      reply: number;                     // Weight: 13.5 (high intent)
      repost: number;                    // Weight: 1.0
      quote: number;                     // Weight: 1.0
      click: number;                     // Weight: 0.5 (photo click)
      profileClick: number;              // Weight: 12.0 (authority signal)
      videoView: number;                 // Weight: 0.005 (playback50)
      photoExpand: number;               // Weight: 0.5
      share: number;                     // Weight: 1.0
      dwell: number;                     // Weight: 0.1 (long linger >2min)
      followAuthor: number;              // Weight: varies
      
      // Negative actions (amplified penalties)
      notInterested: number;             // Penalty: varies
      blockAuthor: number;               // Penalty: -369.0 (highest)
      muteAuthor: number;                // Penalty: varies
      report: number;                    // Penalty: -74.0 to -369.0
    };
    
    // Weighted Scorer Output
    weightedFinalScore: number;          // Σ(weight × P(action)) - Σ(penalties)
    
    // Post-Scoring Adjustments
    authorDiversityPenalty: number;      // Repeated author attenuation
    outOfNetworkBoost: number;           // OON calibration adjustment
    
    // Filter Survival Flags
    filterOutcomes: {
      // Pre-Scoring Filters
      duplicateRemoved: boolean;
      ageExceeded: boolean;
      selfPost: boolean;
      previouslySeen: boolean;
      previouslyServed: boolean;
      mutedKeyword: boolean;
      blockedAuthor: boolean;
      ineligibleSubscription: boolean;
      
      // Post-Selection Filters
      vfFiltered: boolean;               // Visibility/violence/gore/spam
      conversationDeduped: boolean;
      
      // Survival Summary
      preFilterSurvivalRate: number;     // % passing pre-scoring
      postFilterSurvivalRate: number;    // % passing post-selection
    };
  };
  
  // === DERIVED GEO SCORES ===
  derivedScores: {
    overallSignalScore: number;          // Composite from weighted scorer (0-100)
    retrievalEligibility: number;        // Pre-hydration pass rate (0-1)
    rankingProbability: number;          // Post-scoring survival likelihood (0-1)
    filterPassRate: number;              // Overall filter survival (0-1)
    viralPotential: number;              // Predicted amplification (0-1)
    spamRisk: number;                    // Aggregate spam likelihood (0-1)
    trustScore: number;                  // Aggregate trust (0-1)
  };
  
  // === SURFACE-SPECIFIC IMPACTS (Simplified) ===
  surfaceImpacts: {
    timeline: XTimelineImpactMetrics;
    account: XAccountImpactMetrics;
    communities: XCommunityImpactMetrics;
    conversations: XConversationImpactMetrics;
    explore: XExploreImpactMetrics;
    notifications: XNotificationImpactMetrics;
    search: XSearchImpactMetrics;
    trends: XTrendsImpactMetrics;
    spaces: XSpacesImpactMetrics;
  };
  
  // === METADATA ===
  metadata: {
    pipelineVersion: string;             // e.g., "grok-transformer-v1.2"
    modelCheckpoint: string;             // Training checkpoint ID
    featureVersion: string;              // Feature schema version
    computedAt: number;                  // Epoch timestamp
  };
}

// ======== XTimelineMetrics ==========
  
/**
 * X Timeline ("For You") Metrics
 * Maps to Home Timeline recommendation pipeline
 */
/**
 * X Timeline ("For You") Metrics
 * Maps 1:1 to Home Mixer pipeline stages
 * Reference: x-algorithm-README.md (github.com/xai-org/x-algorithm)
 */
export interface XTimelineMetrics {
  // === STAGE 1: QUERY HYDRATION ===
  queryHydration: {
    userContextCompleteness: number;     // % engagement history hydrated (0-1)
    userFeaturesScore: number;           // Following/preferences quality (0-1)
    hydratedAt: number;                  // Timestamp
  };
  
  // === STAGE 2: CANDIDATE SOURCING ===
  candidateSourcing: {
    // Thunder (In-Network)
    inNetwork: {
      candidateCount: number;            // Posts from followed accounts
      recencyScore: number;              // Temporal freshness (0-1)
      authorDiversity: number;           // Unique authors in batch (0-1)
    };
    
    // Phoenix Retrieval (Out-of-Network)
    outNetwork: {
      candidateCount: number;            // ML-discovered posts
      retrievalSimilarity: number;       // Two-tower dot product avg (0-1)
      diversityScore: number;            // Topic/author spread (0-1)
    };
    
    // Source Mix
    sourceType: 'in_network' | 'out_of_network' | 'mixed';
    totalCandidates: number;             // Combined count
  };
  
  // === STAGE 3: CANDIDATE HYDRATION ===
  candidateHydration: {
    metadataCompleteness: number;        // % fields populated (0-1)
    mediaHydrated: boolean;              // Image/video data fetched
    authorHydrated: boolean;             // User info fetched
    subscriptionChecked: boolean;        // Paywall eligibility verified
  };
  
  // === STAGE 4: PRE-SCORING FILTERS ===
  preScoringFilters: {
    // Binary Gates (from home-mixer)
    isDuplicate: boolean;
    isTooOld: boolean;                   // Age > threshold
    isSelfPost: boolean;
    isBlockedAuthor: boolean;
    hasMutedKeyword: boolean;
    wasPreviouslySeen: boolean;
    wasPreviouslyServed: boolean;
    isIneligibleSubscription: boolean;
    
    // Filter Survival
    passedAllFilters: boolean;
    filterSurvivalRate: number;          // % candidates surviving (0-1)
  };
  
  // === STAGE 5: SCORING (Phoenix Grok Transformer) ===
  scoring: {
    // Grok Transformer Predictions (MaskNet with candidate isolation)
    predictions: {
      favorite: number;                  // P(like) - Weight: 1.0
      reply: number;                     // P(reply) - Weight: 13.5
      repost: number;                    // P(repost) - Weight: 1.0
      quote: number;                     // P(quote) - Weight: 1.0
      click: number;                     // P(click) - Weight: 0.5
      profileClick: number;              // P(profile_click) - Weight: 12.0
      videoView: number;                 // P(video_view) - Weight: 0.005
      photoExpand: number;               // P(photo_expand) - Weight: 0.5
      share: number;                     // P(share) - Weight: 1.0
      dwell: number;                     // P(dwell >2min) - Weight: 0.1
      followAuthor: number;              // P(follow_author)
      notInterested: number;             // P(not_interested) - Negative
      blockAuthor: number;               // P(block_author) - Penalty: -369
      muteAuthor: number;                // P(mute_author) - Negative
      report: number;                    // P(report) - Penalty: -74 to -369
    };
    
    // Weighted Scorer
    weightedScore: number;               // Σ(weight × P(action))
    positiveScore: number;               // Sum of positive predictions
    negativeScore: number;               // Sum of negative predictions
    
    // Post-Scoring Adjustments
    authorDiversityAdjustedScore: number; // After repeated author attenuation
    outOfNetworkBoost: number;           // OON calibration (if applicable)
    
    // Final Ranking Score
    finalRankScore: number;              // Post-mixing composite
  };
  
  // === STAGE 6: SELECTION ===
  selection: {
    topKRank: number;                    // Position after sorting (1-based)
    selectedForFeed: boolean;            // Made top-K cutoff
    diversityEnforced: boolean;          // Author diversity applied
  };
  
  // === STAGE 7: POST-SELECTION FILTERS ===
  postSelectionFilters: {
    // Visibility Filters
    vfFilterPassed: boolean;             // Deleted/spam/violence/gore check
    conversationDedupPassed: boolean;    // Multiple thread branches removed
    
    // Final Survival
    passedAllPostFilters: boolean;
    postFilterSurvivalRate: number;      // % of selected surviving (0-1)
  };
  
  // === FINAL OUTCOME ===
  finalScore: number;                    // 0-100 GEO composite
  classificationBand: 
    | 'not-eligible'                     // Failed pre-scoring filters
    | 'low-priority'                     // Low weighted score
    | 'competitive'                      // Mid-range score
    | 'amplified'                        // High score + OON boost
    | 'system-favored';                  // Top diversity/quality
  
  // === EXECUTION METADATA ===
  executionMetadata: {
    pipelineLatencyMs: number;           // Total execution time
    cacheHitRate: number;                // Feature cache efficiency (0-1)
    featureVersion: string;              // Feature schema version
    modelCheckpoints: {
      retrieval: string;                 // Two-tower model ID
      ranking: string;                   // Grok transformer ID
    };
  };
}

/**
 * Timeline Impact Metrics (for surfaceImpacts)
 * Simplified surface-specific contribution to timeline visibility
 */
export interface XTimelineImpactMetrics {
  contributionScore: number;             // How much this surface aids timeline (0-100)
  keyDrivers: string[];                  // Top signals from this surface
}

// ======== XAccountImpactMetrics ==========
  
/**
 * Account Recommendations Impact on Timeline
 * Focus: How "Who to Follow" affects For You content discovery
 */
export interface XAccountImpactMetrics {
  // Author Eligibility (affects pre-scoring filters)
  authorEligibility: {
    isBlockedByViewer: boolean;          // Hard filter out
    isMutedByViewer: boolean;            // Hard filter out
    subscriptionRequired: boolean;       // Eligibility gate
    blockedMutedRate: number;         // Impacts pre-scoring filters
    subscriptionStatus: boolean;      // Affects hydration
  };
  
  // Network Alignment (affects sourcing & scoring)
  networkAlignment: {
    realGraphScore: number;              // Reciprocal follow strength (in-network boost)
    authorityDiversity: number;          // Impact on diversity scorer
    mutualConnectionDensity: number;     // Trust signal in weighted scorer
  };
  
  // Suppression Factors (negative penalties)
  suppression: {
    reportPenalty: number;               // From engagement predictions
    diversityPenalty: number;            // Repeated author attenuation
    spamProximityRisk: number;           // Network contamination
  };
  
  // Timeline Contribution
  finalImpactScore: number;              // 0-100 (how account affects visibility)
  keyDrivers: string[];                  // E.g., ["realGraphScore", "diversityPenalty"]
}

// ======== XCommunityImpactMetrics ==========

/**
 * Communities Impact on Timeline
 * Focus: Topic cluster alignment in retrieval & scoring
 */
export interface XCommunityImpactMetrics {
  // Community Alignment (affects out-network retrieval)
  communityAlignment: {
    simClusterMatch: number;             // Embedding overlap for Phoenix retrieval
    topicRelevance: number;              // Hydration enrichment
    nicheCoherence: number;              // Single-affiliation sparsity
  };
  
  // Filter Impact
  filterImpact: {
    mutedKeywordRate: number;            // Pre-scoring removal likelihood
    diversityAdjustment: number;         // Scoring penalty for topic saturation
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XConversationImpactMetrics ==========
  
/**
 * Conversations Impact on Timeline
 * Focus: Reply/thread quality in engagement predictions
 */
export interface XConversationImpactMetrics {
  // Thread Eligibility (affects hydration & post-selection)
  threadEligibility: {
    replyDepth: number;                  // Context depth for hydration
    conversationDeduped: boolean;        // Post-selection filter outcome
    branchQuality: number;               // Average node score in thread
  };
  
  // Scoring Impact
  scoring: {
    replyPrediction: number;             // P(reply) - Weight: 13.5
    authorEngagedBonus: number;          // OP reply (implicit high weight)
    reportPrediction: number;            // P(report) - Negative penalty
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XExploreImpactMetrics ==========
  
/**
 * Explore Impact on Timeline
 * Focus: Trending/viral content surfacing in out-network
 */
export interface XExploreImpactMetrics {
  // Explore Relevance (affects retrieval freshness)
  exploreRelevance: {
    temporalFreshness: number;           // Age filter bypass for trending
    mediaHydration: number;              // Enrichment for scoring
    viralVelocity: number;               // Engagement acceleration
  };
  
  // Filter Impact
  filterImpact: {
    vfPassed: boolean;                   // Post-selection spam/violence check
    seenFilterBypass: number;            // Freshness override for previously seen
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XNotificationImpactMetrics ==========
  
/**
 * Notifications Impact on Timeline
 * Focus: Push-driven engagement affecting future predictions
 */
export interface XNotificationImpactMetrics {
  // Notification Eligibility (affects user context hydration)
  notificationEligibility: {
    userPreferencesMatch: number;        // Query hydration alignment
    muteBlockFilter: number;             // Pre-scoring gate
  };
  
  // Engagement Prediction (feeds back to timeline scorer)
  engagementPrediction: {
    openProbability: number;             // Analog to weighted scoring
    dismissRate: number;                 // Negative penalty proxy
    feedbackFatigueRisk: number;         // User context degradation
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XSearchImpactMetrics ==========
  
/**
 * Search Impact on Timeline
 * Focus: Query-driven discovery in Phoenix retrieval
 */
export interface XSearchImpactMetrics {
  // Search Relevance (affects retrieval similarity)
  searchRelevance: {
    queryMatch: number;                  // Embedding similarity for sourcing
    temporalFilter: number;              // Age/seen filters
    semanticConsistency: number;         // Topic alignment in hydration
  };
  
  // Scoring Impact
  scoring: {
    clickPrediction: number;             // P(click) - Weight: 0.5
    reportPrediction: number;            // P(report) - Negative
    healthScore: number;                 // Spam/NSFW penalty
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XTrendsImpactMetrics ==========
  
/**
 * Trends Impact on Timeline
 * Focus: Velocity-gated topics in out-network sourcing
 */
export interface XTrendsImpactMetrics {
  // Trend Eligibility (affects real-time sourcing)
  trendEligibility: {
    velocityMatch: number;               // Engagement acceleration for Phoenix
    keywordFilter: number;               // Muted topic pre-scoring removal
    noveltyScore: number;                // Statistical uniqueness
  };
  
  // Diversity Impact
  diversityImpact: {
    topicAdjustment: number;             // Scoring penalty for trend saturation
    vfFilter: boolean;                   // Post-selection spam/coordinated check
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}

// ======== XSpacesImpactMetrics ==========
  
/**
 * Spaces Impact on Timeline
 * Focus: Audio engagement quality in user context
 */
export interface XSpacesImpactMetrics {
  // Spaces Eligibility (affects user features in hydration)
  spacesEligibility: {
    audioHydration: number;              // Media enrichment for context
    authorFilter: number;                // Blocked/muted check
    topicOverlap: number;                // Interest alignment
  };
  
  // Engagement Impact
  engagement: {
    dwellPrediction: number;             // P(dwell >15s) - Quality signal
    notInterestedRate: number;           // Negative feedback
    repeatListenerBonus: number;         // Loyalty signal
  };
  
  // Timeline Contribution
  finalImpactScore: number;
  keyDrivers: string[];
}