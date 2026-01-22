# **Signal Panel Series: The Complete Framework**

*A Grok-Aligned Social Optimization System for X*

---

## **1. SOCIAL SIGNAL: The X Algorithm Context**

### **What is "Signal" on X?**

Signal represents **meaningful, contextual engagement** that X's algorithm (and AI systems like Grok) prioritize for content distribution and recommendation. Think of it as the "semantic weight" of your interactions.

#### **ValueSurplusRule:**

```typescript
/**
 * ValueSurplusRule
 * Algorithm-aligned engagement doctrine based on X OSS (Phoenix Scorer + Weighted Ranker).
 * 5:3:2+ represents priority tiers, NOT raw action counts.
 * Low-signal actions are capped, diversified, and treated as confidence modifiers.
 */
export interface ValueSurplusRule {
  /**
   * Tier 1 — High-Intent / Authority-Building Signals
   * Typical weights: 10x–75x
   */
  tier1: {
    meaningfulReplies: number;        // ≥2 (13.5x, >50 chars, insight-driven)
    authorEngagedReplies?: number;    // ≥1 if achieved (75x)
    conversationEngagement?: number;  // ≥1 multi-turn thread (≈11x)
    bookmarks: number;                // ≥1 (highest implicit intent)
    followAuthor?: number;            // ≥1 (contextual, authority-gated)
  };

  /**
   * Tier 2 — Medium-Intent / Trust & Exploration Signals
   * Typical weights: 1x–12x
   */
  tier2: {
    profileClicks: number;            // ≥1 (≈12x trust signal)
    quotePosts?: number;              // ≥1 (analysis-driven, >100 chars)
    targetedShares?: number;          // ≥1 (selective amplification)
  };

  /**
   * Tier 3 — Low-Intent / Baseline Signals (Symbolic "2")
   * Typical weights: 0.005x–1x
   * CAPPED and pattern-sensitive
   */
  tier3: {
    likes: number;                    // ≤5 per session (strategic only)
    reposts?: number;                 // ≤2 per session
  };

  /**
   * Cross-Cutting Modifiers ("+")
   * Do not count as tiers; increase confidence and retention
   */
  modifiers: {
    dwellInstances?: number;          // ≥1 (>120s linger)
    photoExpands?: number;            // Optional (≈0.5x)
    linkOrMediaClicks?: number;        // Optional (≈0.5x)
    videoViews50pct?: number;          // Optional (≈0.005x, completion-biased)
  };

  /**
   * Negative/Spam Signal Guards (Amplified 2–5x penalties)
   */
  guards: SpamSignals;
}

export interface SpamSignals {
  noGenericReplies: boolean;
  noMassLiking: boolean;             // Pattern-based, not numeric
  noFollowChurn: boolean;
  avoidDismissSignals: boolean;      // scroll-away, rapid skips
  zeroToleranceActions: boolean;     // block, mute, report
  // Automation Red Flags
  perfectTimingPatterns: boolean;   // Robotic posting schedules
  copyPasteDetection: number;       // Duplicate comment text
  massFollowUnfollow: number;       // Churn ratio
  
  // Engagement Gaming
  reciprocalLikeLoops: number;      // Like-for-like patterns
  emptyEngagement: number;          // "Great post!" comments
  selfPromotionRatio: number;       // Link-dropping without value
  
  // Content Quality Issues
  clickbaitScore: number;           // Misleading headlines
  controversialBaiting: number;     // Rage farming
  offTopicDeviation: number;        // Random niche jumping
}
```

---

### **How X/Grok Processes Signal:**

Grok and X's recommendation algorithm use a **multi-factor scoring system**:

1. **Immediate Signals (0-10 minutes):**
   - Like speed (too fast = bot suspicion)
   - Comment depth (character count + question marks + @mentions)
   - Profile click-through (did they actually read your bio?)

2. **Short-Term Signals (10 min - 24 hours):**
   - Bookmark actions (highest intent signal)
   - Quote tweet quality (original analysis vs echo)
   - Reply threading depth (1 comment vs 3-turn conversation)

3. **Long-Term Signals (24 hours - 30 days):**
   - Follow retention rate (do people stick around?)
   - Mutual engagement loops (A ↔ B consistent interactions)
   - Content clustering (your posts form coherent topic graphs)
   - Citation frequency (others linking/mentioning you)

4. **Network Authority Signals:**
   - **Verified follower ratio:** Premium/Premium+ followers weighted 3x
   - **Domain expertise markers:** Keywords in bio + post history coherence
   - **Cross-platform citations:** Links from Substack, LinkedIn, blogs

---

