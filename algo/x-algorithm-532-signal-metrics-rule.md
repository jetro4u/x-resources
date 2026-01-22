# X Algorithm 5:3:2+ Growth Soccer Formation Rule**

## Proposed: **The 5:3:2+ X Signal Soccer Formation Rule**

**Core Philosophy**: Weighted signal contributions that mirror X's ranking algorithm priorities.

### Rule Structure

```typescript
/**
 * ValueSurplusRule
 * Algorithm-aligned engagement doctrine based on X OSS (Phoenix Scorer + Weighted Ranker).
 * 5:3:2+ represents priority tiers, NOT raw action counts.
 * Low-signal actions are capped, diversified, and treated as confidence modifiers.
 */
export interface SoccerFormationRule {
  /**
   * Tier 1 — High-Intent / Authority-Building Signals
   * Typical weights: 10x–75x
   */
  attack: {
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
  midfield: {
    profileClicks: number;            // ≥1 (≈12x trust signal)
    quotePosts?: number;              // ≥1 (analysis-driven, >100 chars)
    targetedShares?: number;          // ≥1 (selective amplification)
  };

  /**
   * Tier 3 — Low-Intent / Baseline Signals (Symbolic "2")
   * Typical weights: 0.005x–1x
   * CAPPED and pattern-sensitive
   */
  defence: {
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

### The 5:3:2+ Breakdown

#### **5 Attackers High-Signal Actions (Depth & Trust)**

*(These create surplus value)*

Focus: **10×–75× multipliers**

* 2 **Meaningful replies**

  * > 50 characters
  * Add insight, not agreement
* 1 **Author-engaged reply**

  * OP responds directly (75×)
* 1 **Bookmark**

  * Highest implicit intent
* 1 **Conversation engagement**

  * Multi-turn thread participation **or**
* 1 **Follow (authority-qualified only)**

> 🔑 One Tier-1 action can outweigh dozens of likes.

> These 5 actions account for **~80–90% of session value**

---

#### **3 Mieldfielders Medium-Signal Actions (Authority & Research)**

Focus: **1×–12× multipliers**

* 1 **profile click**
  (research before engagement – 12x signal)
* 1 **quote post with original analysis**
  (>100 chars, reframing or synthesis)
* 1 **share**
  (DM / contextual repost)

> These actions *validate intent* and reduce model uncertainty.

---

#### **2 Defenders Baseline Actions (Symbolic, Not Literal)**

* 5 **likes** (strategic, spaced)
* 2 **reposts** (value amplification only)

> Capped. Diversified. Non-bursty.

**Passive but encouraged (not counted):**

* ≥2 minutes **dwell time**
* ≥1 **video view** ≥50% playback

#### **+ Goalkeeper Modifiers (Encouraged, Never Quota-Driven)**

These **increase confidence**, not rank by themselves:

* 1–2 **dwell events** (>2 min)
* Photo expand / media click
* Video view ≥50% playback

> Dwell is a *multiplier*, not a lever.

---

#### **Effective Daily Shape**

* ~10–12 deliberate actions
* ~80–90% of value from Tier 1 & 2
* Low spam risk, high survivability

---

#### Spoken (panels, workshops, challenges)

> “We use the **5 : 3 : 2+ rule** — five deep signals, three authority signals, two baseline signals.”

#### Written (docs, frameworks, scoring guides)
> **5 : 3 : 2+ is not an engagement tactic.
> It is a behavioral alignment with how X predicts satisfaction under uncertainty.**

#### Enforcement language (moderators / judges)

* Judge **tiers achieved**, not taps counted
* Bonus credit for **dwell + completion**
* Flags triggered by **imbalance**, not volume

#### One-line doctrine to lock this in

> **Low-signal actions are allowed to be many, but only allowed to matter a little.**

That sentence alone will defuse 90% of future confusion.

---

