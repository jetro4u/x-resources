# SOCIAL METRICS INTEGRATION INTO GEOMetrics**

## **New `social` Property:**

```typescript
interface GEOMetrics {
  // ... existing properties ...
  
  /**
   * Social media signals for AI/human discovery optimization
   * Tracks engagement quality, network authority, and citation patterns
   */
  social?: SocialMetrics;
}

interface SocialMetrics {
  // Platform-Specific Metrics
  platforms: Record<SocialPlatform, PlatformMetrics>;
  
  // Cross-Platform Aggregates
  overall: {
    totalFollowers: number;
    verifiedFollowerRatio: number;    // % Premium/verified
    crossPlatformReach: number;       // Sum of all platforms
    unifiedEngagementRate: number;    // Weighted average
  };
  
  // Signal Quality Metrics (Core for Challenge)
  signalStrength: SignalStrengthMetrics;
  
  // Network Authority
  authority: SocialAuthorityMetrics;
  
  // Content Performance
  content: SocialContentMetrics;
  
  // Citation & Influence
  citations: SocialCitationMetrics;
  
  // Anti-Spam Indicators
  spamRisk: SpamRiskMetrics;
  
  // Challenge-Specific Tracking
  challengePerformance?: ChallengeMetrics;
}
```

---

## **Detailed Type Definitions:**

### **1. Platform Metrics**

```typescript
type SocialPlatform = 'twitter' | 'linkedin' | 'threads' | 'bluesky' | 'mastodon';

interface PlatformMetrics {
  platform: SocialPlatform;
  
  // Basic Stats
  followers: number;
  following: number;
  posts: number;
  accountAge: number;                // Days since creation
  
  // Engagement Metrics (30-day rolling)
  engagement: {
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    averagePerPost: number;
    engagementRate: number;          // (Total / Followers) * 100
    peakEngagementTime: string;      // "3 PM EST Weekdays"
  };
  
  // Content Quality
  content: {
    avgPostLength: number;           // Characters
    mediaUsage: number;              // % with images/video
    linkSharing: number;             // % with external links
    threadUsage: number;             // % multi-tweet threads
    hashtagDensity: number;          // Avg hashtags per post
  };
  
  // Network Quality
  network: {
    verifiedRatio: number;           // % Premium followers
    mutualConnections: number;
    influencerFollowers: number;     // Followers with >10K
    listMemberships: number;
  };
  
  // Verification Status
  verification: {
    isVerified: boolean;
    verificationTier: 'Free' | 'Premium' | 'Premium+' | 'Organization';
    verificationDate?: Date;
  };
}
```

---

### **2. Signal Strength Metrics**

```typescript
interface SignalStrengthMetrics {
  // Composite Score (0-100)
  overallSignal: number;
  
  // Component Scores
  components: {
    semanticRelevance: number;       // Topic coherence (0-100)
    contextDepth: number;            // Engagement quality (0-100)
    conversationQuality: number;     // Reply depth (0-100)
    originalityScore: number;        // Unique insights (0-100)
    consistencyScore: number;        // Posting regularity (0-100)
  };
  
  // High-Intent Actions (30-day)
  highIntentSignals: {
    bookmarks: number;               // Highest intent
    quoteTweetsWithAnalysis: number; // >280 char commentary
    threadStarts: number;            // Long-form content
    profileClicks: number;           // From non-followers
    citationsReceived: number;       // Mentions by others
  };
  
  // Engagement Velocity
  velocity: {
    likesPerHour: number;            // First 24h avg
    commentsPerHour: number;
    sharesPerHour: number;
    viralityIndex: number;           // Exponential growth rate
  };
  
  // Network Effects
  networkAmplification: {
    averageRetweetReach: number;     // Avg follower count of retweeters
    influencerEngagement: number;    // >10K accounts engaging
    crossPlatformMentions: number;   // Links from LinkedIn/blogs
  };
}
```

---

### **3. Social Authority Metrics**

```typescript
interface SocialAuthorityMetrics {
  // Overall Authority Score (0-100)
  authorityScore: number;
  
  // Expertise Indicators
  expertise: {
    primaryNiche: string;            // "GEO Consultant"
    nichePurity: number;             // % on-topic (0-100)
    expertiseLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Thought Leader';
    
    topicTags: Array<{
      topic: string;
      relevance: number;             // 0-100
      postCount: number;
    }>;
  };
  
  // Thought Leadership
  thoughtLeadership: {
    originalContentRatio: number;    // % original vs retweets
    longFormPosts: number;           // Threads >5 tweets
    researchCitations: number;       // Links to studies/data
    caseSt udiesShared: number;
    frameworksCreated: number;       // Original methodologies
  };
  
  // Influence Metrics
  influence: {
    followerGrowthRate: number;      // % per month
    mentionFrequency: number;        // Times mentioned/week
    listInclusions: number;          // X Lists featuring account
    guestAppearances: number;        // Podcast/Space invites
  };
  
  // Trust Signals
  trust: {
    accountLongevity: number;        // Years active
    consistentActivity: number;      // Days with posts (last 90)
    brandPartnerships: number;       // Sponsored/collaboration posts
    mediaFeatures: number;           // Press mentions
  };
}
```

---

### **4. Social Content Metrics**

```typescript
interface SocialContentMetrics {
  // Content Performance (30-day)
  performance: {
    topPerformingPosts: Array<{
      postId: string;
      url: string;
      engagement: number;
      impressions: number;
      topic: string;
    }>;
    
    averageImpressions: number;
    averageEngagement: number;
    viralPosts: number;              // >1K engagements
  };
  
  // Content Mix
  contentBreakdown: {
    educational: number;             // % teaching content
    promotional: number;             // % self-promotion
    conversational: number;          // % replies/discussions
    curated: number;                 // % sharing others' content
  };
  
  // Format Analysis
  formatEffectiveness: Array<{
    format: 'Short Tweet' | 'Thread' | 'Poll' | 'Video' | 'Image' | 'Link';
    avgEngagement: number;
    successRate: number;             // % above median
  }>;
  
  // Topic Performance
  topicResonance: Array<{
    topic: string;
    avgEngagement: number;
    postCount: number;
    growthTrend: 'Rising' | 'Stable' | 'Declining';
  }>;
  
  // Timing Optimization
  optimalTiming: {
    bestDays: string[];              // ["Monday", "Wednesday"]
    bestHours: string[];             // ["9 AM", "3 PM", "8 PM"]
    worstTimes: string[];
  };
}
```

---

### **5. Social Citation Metrics**

```typescript
interface SocialCitationMetrics {
  // Citation Counts
  citations: {
    totalMentions: number;           // @mentions received
    quoteRetweetsInbound: number;    // Others quoting you
    threadLinks: number;             // Links in others' threads
    externalCitations: number;       // Blog/article mentions
  };
  
  // Citation Network
  network: {
    citedBy: Array<{
      handle: string;
      followerCount: number;
      citationCount: number;
      lastCitationDate: Date;
      context: string;               // What they said
    }>;
    
    citing: Array<{
      handle: string;
      citationCount: number;
      reciprocal: boolean;           // Do they cite you back?
    }>;
  };
  
  // Citation Quality
  quality: {
    averageCiterFollowers: number;   // Authority of citers
    expertCitations: number;         // From >10K accounts
    crossPlatformCitations: number;  // LinkedIn/blog mentions
  };
  
  // Citation Influence
  influence: {
    citationReach: number;           // Sum of citer followers
    citationVirality: number;        // How far citations spread
    secondaryMentions: number;       // Citer's followers mentioning you
  };
  
  // Reciprocity Score
  reciprocity: {
    mutualCitations: number;         // Accounts you cite back
    oneWayCitationsIn: number;       // They cite you only
    oneWayCitationsOut: number;      // You cite them only
    reciprocityRate: number;         // Mutual / Total
  };
}
```

---

### **6. Spam Risk Metrics**

```typescript
interface SpamRiskMetrics {
  // Overall Risk Score (0-100, lower is better)
  spamRiskScore: number;
  
  // Red Flags
  redFlags: {
    perfectTimingPatterns: boolean;  // Robotic schedules
    copyPasteDetection: number;      // Duplicate comments %
    massFollowUnfollow: number;      // Churn rate
    emptyEngagement: number;         // Generic comments %
    selfPromotionRatio: number;      // % promotional posts
    accountPurchaseSuspicion: number; // Follower spike analysis
  };
  
  // Behavioral Patterns
  behavior: {
    followUnfollowRatio: number;     // Churn indicator
    followBackRate: number;          // % followed back
    engagementConsistency: number;   // Variance in timing
    commentQuality: number;          // Avg comment length
  };
  
  // Automation Detection
  automation: {
    botLikelihood: number;           // ML model score (0-100)
    suspiciousPatterns: string[];    // ["Exact 5-min intervals"]
    humanVerification: boolean;      // Passed CAPTCHA/manual check
  };
  
  // Historical Flags
  history: {
    previousViolations: number;
    shadowBanHistory: boolean;
    accountRestrictions: number;     // Times restricted
    reportedByUsers: number;
  };
}
```

---

### **7. Challenge-Specific Metrics**

```typescript
interface ChallengeMetrics {
  challengeId: string;
  challengeName: string;
  
  // Participation
  participation: {
    startDate: Date;
    daysActive: number;
    completionRate: number;          // % deliverables done
    streakDays: number;              // Consecutive active days
  };
  
  // Point Tracking
  points: {
    totalEarned: number;
    breakdown: Record<string, number>; // {follows: 94, comments: 78}
    rank: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  };
  
  // Engagement Contributions
  contributions: {
    highQualityComments: number;
    thoughtfulQuoteTweets: number;
    profileOptimizationHelp: number;
    networkIntroductions: number;
    contentCreated: number;
  };
  
  // Network Building
  networkGrowth: {
    newFollowers: number;
    newMutualConnections: number;
    challengeParticipantConnections: number;
    influencerConnections: number;   // >10K from challenge
  };
  
  // Signal Improvement
  signalGrowth: {
    beforeScore: number;
    afterScore: number;
    improvement: number;
    improvementRate: number;         // % change
  };
  
  // Deliverables
  deliverables: Array<{
    type: 'Thread' | 'Article' | 'Case Study';
    completionDate: Date;
    grokScore: number;               // 0-100 quality
    engagement: number;
    citations: number;
  }>;
}
```

---

## **Integration with Existing GEOMetrics:**
```

---

### **Storage in Google Sheets (Pre-App):**

#### **New Tab: Social Metrics**

| Column | Header | Formula | Description |
|--------|--------|---------|-------------|
| A | Handle | Text | @username |
| B | Platform | Dropdown | Twitter/LinkedIn/etc |
| C | Signal Strength | Number (0-100) | Calculated score |
| D | Followers | Number | Current count |
| E | Verified Ratio | `=E2/D2` | % Premium followers |
| F | Engagement Rate | `=SUM(G2:I2)/D2` | (Likes+Comments+Shares)/Followers |
| G | Avg Likes | Number | Per post (30d) |
| H | Avg Comments | Number | Per post (30d) |
| I | Avg Shares | Number | Per post (30d) |
| J | Citations Received | Number | Mentions by others |
| K | Spam Risk | Number (0-100) | Lower = better |
| L | Authority Score | Number (0-100) | Thought leadership |
| M | Challenge Points | `=SUMIF('Points'!B:B,A2,'Points'!D:D)` | Total points |
| N | Rank | `=RANK(C2,C:C,0)` | Leaderboard position |

---

### **App Implementation (Future):**

```typescript
// @geocolab/core/src/services/SocialMetricsService.ts
export class SocialMetricsService {
  async calculateSocialMetrics(
    handle: string,
    platform: SocialPlatform
  ): Promise<SocialMetrics> {
    // 1. Fetch platform data via API
    const platformData = await this.fetchPlatformData(handle, platform);
    
    // 2. Calculate signal strength
    const signalStrength = this.calculateSignalStrength(platformData);
    
    // 3. Calculate authority
    const authority = this.calculateAuthority(platformData);
    
    // 4. Analyze content
    const content = this.analyzeContent(platformData.posts);
    
    // 5. Map citation network
    const citations = await this.mapCitations(handle, platform);
    
    // 6. Assess spam risk
    const spamRisk = this.assessSpamRisk(platformData);
    
    return {
      platforms: { [platform]: platformData },
      overall: this.aggregateOverall([platformData]),
      signalStrength,
      authority,
      content,
      citations,
      spamRisk
    };
  }
  
  private calculateSignalStrength(data: PlatformMetrics): SignalStrengthMetrics {
    // Weighted formula based on Grok priorities
    const semanticRelevance = this.calculateTopicCoherence(data);
    const contextDepth = this.calculateEngagementQuality(data);
    
    const overallSignal = (
      semanticRelevance * 0.25 +
      contextDepth * 0.20 +
      // ... other components
    );
    
    return { overallSignal, components: { semanticRelevance, contextDepth, ... } };
  }
}
```

---

