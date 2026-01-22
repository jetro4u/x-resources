# X For You and Recommendation Algorithm Blueprint Guide

**Version:** 2.0 (Enterprise Production)  
**Authors:** xAI Team, Claude, ChatGPT, GROK, GEMINI  
**Date:** 2025-01-20  
**Purpose:** Unified reference for @dndhub/xdk, @dndhub/geo, Signal > Spam Panel Series, GEOCoLab UI

---

## Executive Summary

This blueprint merges the official **X For You Feed Algorithm** (xAI open-source release) with curated **GEO Signal Metrics Integration** (aggregated from X's ML Repo, community research, and AI model feedback). It serves as the definitive guide for:

1. **X Algorithm Implementation** (`@dndhub/xdk`)
2. **GEO Optimization** (`@dndhub/geo`)
3. **Creator Education** (Signal > Spam Panel Series)
4. **Enterprise Tooling** (GEOCoLab UI)

**Key Evolution (2024-2025):** X eliminated hand-engineered features in favor of a **Grok-based Transformer** (Phoenix Scorer) that predicts 15+ engagement actions. The pipeline is now fully data-driven with candidate isolation and multi-action weighting.

---

## 1. Core Architecture

### 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      FOR YOU FEED REQUEST                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         HOME MIXER                               │
│                    (Orchestration Layer)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                   QUERY HYDRATION                         │  │
│   │  ┌──────────────────┐    ┌────────────────────────────┐  │  │
│   │  │ User Action      │    │ User Features              │  │  │
│   │  │ Sequence         │    │ (following, preferences)   │  │  │
│   │  └──────────────────┘    └────────────────────────────┘  │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                  CANDIDATE SOURCES                        │  │
│   │         ┌──────────────┐    ┌──────────────────────┐     │  │
│   │         │   THUNDER    │    │ PHOENIX RETRIEVAL    │     │  │
│   │         │ (In-Network) │    │ (Out-of-Network)     │     │  │
│   │         └──────────────┘    └──────────────────────┘     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                     HYDRATION                             │  │
│   │  Fetch: metadata, author info, media entities, etc.      │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                  PRE-SCORING FILTERS                      │  │
│   │  Remove: duplicates, old posts, self-posts, blocked,     │  │
│   │          muted keywords, previously seen/served, etc.     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                       SCORING                             │  │
│   │  ┌──────────────────┐                                     │  │
│   │  │ Phoenix Scorer   │  Grok Transformer predicts:        │  │
│   │  │ (ML Predictions) │  P(like), P(reply), P(repost)...   │  │
│   │  └──────────────────┘                                     │  │
│   │               │                                            │  │
│   │               ▼                                            │  │
│   │  ┌──────────────────┐                                     │  │
│   │  │ Weighted Scorer  │  Score = Σ(weight × P(action))     │  │
│   │  └──────────────────┘                                     │  │
│   │               │                                            │  │
│   │               ▼                                            │  │
│   │  ┌──────────────────┐                                     │  │
│   │  │ Author Diversity │  Attenuate repeated authors        │  │
│   │  │ Scorer           │                                     │  │
│   │  └──────────────────┘                                     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                      SELECTION                            │  │
│   │           Sort by score, select top K                     │  │
│   └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │              POST-SELECTION FILTERS                       │  │
│   │  Visibility filtering (deleted/spam/violence/gore)        │  │
│   └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     RANKED FEED RESPONSE                         │
└─────────────────────────────────────────────────────────────────┘
```

---

### 1.2 Technology Stack

**Backend (Rust - 62.9%)**
- **candidate-pipeline**: Modular pipeline framework
- **home-mixer**: gRPC orchestration service
- **thunder**: Kafka consumer for in-network ingestion

**ML (Python - 37.1%)**
- **phoenix**: Grok transformer (ported from Grok-1)
- **Two-tower retrieval**: Hash-based embeddings

**Infrastructure**
- Kafka for event streams
- In-memory stores (Thunder)
- Hash-based embedding lookups (no FAISS/vector DB)

---

## 2. Pipeline Stages (Detailed)

### Stage 1: Query Hydration

**Purpose:** Fetch user context for personalization

**Inputs:**
- User ID
- Session metadata

**Outputs:**
- User action sequence (engagement history)
- User features (following list, preferences, language, location)

**GEO Impact:**
- Complete engagement history → Better predictions
- Sparse history → Cold-start challenges

**Measurability:** Via public API (user's own actions)

---

#### User Action Sequences
Question: What User Action Sequence contribute to positive and negative query hydration?

**Positive Contributors:**
- **High-Dwell Sessions** (>15s threshold): Signals genuine interest, feeds into context quality
- **Deep Replies**: Multi-turn conversations that generate further engagement
- **Consistent Bookmarking**: Highest intent signal (save-for-later behavior)
- **Profile Clicks → Follow**: Complete user journey indicating authority recognition
- **Sustained Engagement**: >15min session depth without rapid exits
- **Topical Coherence**: Interactions clustered within semantic themes

**Negative Contributors:**
- **Rapid Scroll-Past** (high `scrollPastRate`): Implicit rejection signal
- **Immediate Exits**: <2s engagement before app backgrounding
- **Repeated "Not Interested"**: Explicit negative feedback
- **Mute/Block Actions**: Hard negative signals
- **Erratic Topic Switching**: High `topicShiftVelocity` increases model uncertainty
- **Feedback Fatigue**: Over-serving same content type

**GEO Insight:** X scores *what you linger on*, not what you claim to like. Dwell time > explicit likes.

---

#### User Features

Question: What User Features (following, preferences) contribute to positive and negative query hydration?

**Positive Contributors:**
- **Stable Follow Graph**: Clear `nicheCoherence` (semantic cluster stability)
- **High `followerVerifiedRatio`**: Premium/verified follower concentration
- **Strong `realGraphScore`**: Reciprocal connection strength
- **Consistent Preferences**: Stable language, geo, topic signals
- **High `mutualConnectionDensity`**: Trust network indicator

**Negative Contributors:**
- **Sparse Follow Graph**: Limited context for personalization
- **Noisy Following List**: Disparate, unrelated topics reduce coherence
- **High Mute/Block Rate**: Indicates poor network curation
- **Contradictory Signals**: Liking + muting same topic
- **High `botProbability`**: User account automation risk

**System Behavior:** Sparse hydration = lower retrieval confidence = conservative, repetitive feeds

---

#### Panel Topics:
- "You Train Your Feed Every Second" - The myth of neutral scrolling
- "Why Scrolling Past Is Louder Than Liking" - Implicit vs explicit signals
- "Mitigating Cold-Start for New Users" - Context bootstrapping strategies

#### Break Room Topics:
- Debugging hydration failures in @dndhub/xdk
- Ethical implications of action sequence tracking
- Chronological feed nostalgia vs ML reality

### Stage 2: Candidate Sourcing

**A. Thunder (In-Network)**

**How it works:**
- Kafka consumer tracks posts from followed accounts
- Per-user stores: original posts, replies, reposts, video posts
- Sub-millisecond lookups (in-memory)
- Auto-trim posts older than retention period

**Source Type:** `in_network`

**GEO Optimization:**
- Follow high-quality accounts → Better in-network pool
- Engage with followed content → Stronger RealGraph scores

**B. Phoenix Retrieval (Out-of-Network)**

**How it works:**
1. **Two-Tower Model:**
   - User tower: Encodes user features + history → embedding
   - Candidate tower: Encodes all posts → embeddings
   - Similarity: Dot product (top-K retrieval)

2. **Hash-Based Embeddings:**
   - Multiple hash functions (no learned embeddings)
   - Fast lookup (no vector database)

**Source Type:** `out_of_network`

**GEO Optimization:**
- Strong topic coherence → Better embedding matches
- Niche expertise → Higher out-network discovery

**Measurability:** Via Grok API (predicted retrieval scores)

---

#### In-Network Thunder - Positive Signals

Question: What user actions and metrics contribute to positive In-Network thunder score?

**Strong Contributors:**
- **`realGraphScore`**: Reciprocal follow strength (mutual interactions)
- **Recent Author Interaction**: Reply/like history with followed accounts
- **`reciprocalRate`**: Bidirectional engagement frequency
- **`authorAffinity`**: Historical user-author interaction strength
- **`sessionFreshness`**: Recency relative to viewer context
- **Sustained Engagement Over Time**: Consistent interaction pattern

**System Design:** Thunder uses in-memory stores (sub-millisecond lookups), auto-trims posts >48-72h

---

#### In-Network Thunder - Negative Signals

Question: What user actions and metrics contribute to negative In-Network thunder score?

**Strong Detractors:**
- **Ignoring Followed Authors**: Repeated scroll-past reduces Thunder score (fatigue decay)
- **Follow Churn**: Follow → unfollow loops signal unreliable interest
- **Muting Followed Accounts**: Hard filter exclusion
- **Low Engagement Probability**: Following many, engaging with few
- **Blocking Followed Users**: Immediate removal from candidate pool

**Penalty:** Reduced in-network candidate density → lower priority within followed content

---

#### Out-of-Network Phoenix - Positive Signals

Question: What user actions and metrics contribute to positive Out-of-Network phonix retrival score?

**Critical Factors:**
- **`retrievalSimilarity`**: Two-tower dot product (user embedding × candidate embedding)
- **`simClusterMemberships`**: Community assignment alignment (e.g., "TypeScript Developers")
- **Strong `nicheCoherence`**: Consistent topic focus over time
- **`authorityAdjacency`**: Proximity to trusted nodes in graph
- **`frsScore`**: Follow recommendation potential
- **Social Proof**: Second-degree connection engagement

**Technical Detail:** Hash-based embeddings (no vector DB) for fast lookup

---

#### Out-of-Network Phoenix - Negative Signals

Question: What user actions and metrics contribute to negative Out-of-Network phonix retrival score?

**Strong Detractors:**
- **Topic Shift Velocity**: Sudden pivot (e.g., "Coding" → "Politics") breaks embeddings
- **Broad, Unfocused Posting**: Weak semantic consistency
- **Low `authorityAdjacency`**: Isolated from trust networks
- **Clickbait Semantics**: Detected pattern suppression
- **High `spamMarkers`**: Coordinated behavior flags

**Penalty:** OON posts fail retrieval threshold → never reach scoring (hard gate)

**GEO Strategy:** Out-network discovery is a *trust loan* - niche authority beats virality

---

#### Panel Topics:
- "Discovery Is a Trust Loan" - Why OON requires credibility
- "Balancing In-Network vs OON for Discovery"
- "Why Niche Beats Virality" - Embedding coherence advantage

#### Break Room Topics:
- Implementing Thunder-like in-memory stores in @dndhub/xdk
- Enhancing GEO for embedding coherence
- Analyzing bot impact on sourcing

**Complaints Applied:**
- *"Why am I stuck in an echo chamber?"* → Strong Thunder + weak OON trust
- *"One click floods my feed"* → High embedding confidence + low diversity attenuation
- *"Small accounts get throttled"* → Low social proof in OON retrieval

### Stage 3: Candidate Hydration

**Purpose:** Enrich candidates with full metadata

**Fetched Data:**
- Core post data (text, media URLs, timestamps)
- Author information (username, verification, follower count)
- Video duration (for video posts)
- Subscription status (paywall check)

**GEO Impact:**
- Complete metadata → Better scoring
- Missing fields → Lower engagement predictions

**Measurability:** Via public API (post metadata endpoints)

---

#### Additional Resources Fetched

Question: Besides metadata, author info, media entities, what other resource are fetched at hydration stage?

**Beyond Core Metadata:**
- **RealGraph Edges**: Connection strength data
- **Author Trust Scores**: Safety/credibility metrics
- **Safety Labels**: From `VFFilter` (violence/gore/spam)
- **Multimodal Embeddings**: Image/video content analysis (not just URLs)
- **Engagement Aggregates**: Historical performance data
- **Community Associations**: Cluster memberships
- **Subscription Eligibility**: Paywall verification
- **Conversation Graph Depth**: Thread context
- **Author Verification Status**: Premium/verified tier
- **Edited Tweet Versions**: Update history

**Technical Detail:** Kafka streams (real-time) + in-memory KV stores (sub-ms latency)

---

#### Determination Logic

Question: How does the system determined what is best served to users at hydration stage?

**Hydration Does Not Rank** - But affects scoring:
- **Missing Metadata** → Hard drop (candidate excluded)
- **Weak Author Context** → Lower ML confidence in predictions
- **Broken Media Entities** → Immediate discard
- **Candidate Isolation**: Each post evaluated on user's temporal freshness needs

**System Behavior:** Prioritizes fully hydrated candidates - incomplete ones risk filter exclusion

---

#### Panel Topics:
- "Invisible Failures Before Ranking" - Hydration as silent killer
- "Why Broken Links Kill Reach" - Technical debt impact
- "Importance of Metadata in AI Readiness"

#### Break Room Topics:
- Optimizing API calls for @dndhub/geo
- Visualizing hydration in GEOCoLab UI
- Hydration bottlenecks in high-volume systems

**Complaints Applied:**
- *"Content Flooding"* → Incomplete hydration → repetitive similar content
- *"Overall Degradation"* → Slow/failed fetches degrade feed quality

---

### Stage 4: Pre-Scoring Filters (Hard Gates)

**Filter** | **Purpose** | **GEO Bypass Strategy**
---|---|---
`DropDuplicatesFilter` | Remove duplicate post IDs | N/A (system-level)
`AgeFilter` | Remove posts older than threshold | Post consistently (stay fresh)
`SelfpostFilter` | Remove user's own posts | N/A (system-level)
`AuthorSocialgraphFilter` | Remove blocked/muted authors | Build positive network
`MutedKeywordFilter` | Remove muted keywords | Avoid controversial terms
`PreviouslySeenPostsFilter` | Remove already-seen posts | N/A (session-level)
`PreviouslyServedPostsFilter` | Remove session-served posts | N/A (session-level)
`IneligibleSubscriptionFilter` | Remove paywalled content (if not subscribed) | Offer free value
`RepostDeduplicationFilter` | Dedupe reposts of same content | Original content > reposting
`CoreDataHydrationFilter` | Remove posts with failed metadata fetch | Ensure valid media/links

**GEO Critical:** Pass 100% of these filters to enter scoring

**Measurability:** Via Grok API (filter failure reasons)

---

#### Additional Removals

Question: Besides duplicates, old posts, self-posts, blocked, muted keywords, previously seen/served, what other posts are removed at Pre-Scoring Filters stage?

**Beyond Listed Filters:**
- **NSFW Content** (without user toggle)
- **Failed Hydration**: Missing required fields
- **Paywalled Content** (if not subscribed)
- **Reposts Without Originality**: Exact duplicates
- **Restricted Replies**: Conversation access limits
- **Safety-Flagged Authors**: Spam/abuse history
- **Shadowed Spam Clusters**: Coordinated inauthentic behavior
- **De-amplified Domains**: Untrusted link sources
- **High `toxicityScore`**: Language/content safety
- **Invalid Media Entities**: Broken assets

**System Design:** Hard gates - 0% progression if failed

---

#### "Old Post" Threshold

Question: How long is a post before it is considered old posts?

**Not Fixed - Context-Dependent:**
- **Thunder**: Auto-trims >48-72 hours aggressively
- **Fast Feeds**: Hours to days
- **Evergreen Content**: Days to weeks
- **Viral Velocity Exception**: Extreme engagement bypasses age filter

**GEO Insight:** Freshness beats perfection in modern feeds

---

#### Previously Seen/Served Threshold

Question: How many times will a post be seen or served before it is considered previously seen/served posts?

**Session-Level Logic:**
- **1-2 Impressions** per session without engagement
- **Multiple Sessions**: Rolling window tracking
- **Fatigue Prevention**: X avoids over-serving
- **Post-Negative Feedback**: Immediate suppression

**Technical Detail:** Cached counters + in-memory aggregates (no expensive recomputation)

---

#### Metric Retrieval Method

Question: How does the system retrieve post metrics at Pre-Scoring Filters stage?

**Efficient Lookups:**
- **Kafka Event Streams**: Real-time engagement data
- **In-Memory KV Stores** (Redis-like): Sub-millisecond filtering
- **Cached Engagement Counters**: No recomputation overhead
- **RealGraph Lookups**: Pre-computed connection strength

---

#### Panel Topics:
- "You Never Even Entered the Race" - Pre-scoring elimination
- "Why Freshness Beats Perfection"
- "Fairness in Hard Gates" - Creator reach impact

#### Break Room Topics:
- Custom filter implementations in @dndhub/xdk
- GEO bypass strategies (ethical limits)
- Integrating filters into Signal > Spam series

**Complaints Applied:**
- *"My followers don't see my posts"* → Filtered before scoring (fatigue/duplication)
- *"Reduced Visibility"* → Over-filtering throttles small accounts
- *"Content Flooding"* → Ineffective seen filters allow repeats

**Penalties:**
- **Filter Failure**: Hard exclusion (0 score, no progression)
- **Indirect**: Reduces overall candidate quality by -10-20% prediction confidence

---

### Stage 5: Scoring (Phoenix Grok Transformer + Weighted Scorer)

This is the **core intelligence layer** of the X recommendation system. All candidates that pass hard filters are evaluated here.

---

#### 5.1 Phoenix Scorer (Grok-Based Transformer)

**Purpose:**
Predict the likelihood of *multiple user actions* for each candidate post using a Grok-derived transformer model.

**Model Characteristics:**

* Ported from **Grok-1** (xAI open source)
* Transformer with **candidate isolation**
* Fully data-driven (no hand-engineered relevance features)

**Inputs:**

* User engagement sequence (likes, replies, reposts, dwell)
* User metadata (follows, preferences, language)
* Candidate post content + metadata

**Critical Design Detail — Candidate Isolation:**

* Each candidate attends **only to user context**
* Candidates **cannot attend to each other**
* Ensures:

  * Stable scores
  * Batch independence
  * Cacheability

**Predicted Action Probabilities:**

```
P(like)
P(reply)
P(repost)
P(quote)
P(click)
P(profile_click)
P(video_view)
P(photo_expand)
P(share)
P(dwell)
P(follow_author)
P(not_interested)
P(block_author)
P(mute_author)
P(report)
```

**GEO Signal Insight:**

* Rich profiles, bios, and work history improve:

  * `P(profile_click)`
  * `P(follow_author)`
  * Downstream engagement confidence

##### 5.1.1 Full Engagement Metrics 
**Question:**
Besides P(like), P(reply), P(repost) what other engagement metrics are computed by Grok Transformer predicts?

**Positive Actions:**
- `P(favorite/like)` - Weight: **1.0**
- `P(reply)` - Weight: **13.5** (high intent)
- `P(repost)` - Weight: **1.0**
- `P(quote)` - Weight: **1.0**
- `P(click)` - Weight: **0.5** (photo click)
- `P(profile_click)` - Weight: **12.0** (authority signal)
- `P(video_view)` - Weight: **0.005** (playback50 threshold)
- `P(photo_expand)` - Weight: **0.5**
- `P(share)` - Weight: **1.0**
- `P(dwell)` - Weight: **0.1** (long linger >2min)
- `P(follow_author)` - Weight: **varies** (context-dependent)
- `P(bookmark)` - **Implicit highest intent** (inferred from patterns)

**Negative Actions (Amplified 2-5×):**
- `P(not_interested)` - Penalty: **varies**
- `P(block_author)` - Penalty: **-369.0** (maximum)
- `P(mute_author)` - Penalty: **varies**
- `P(report)` - Penalty: **-74.0 to -369.0**
- `P(dismiss)` - Penalty: **-22x** (inferred)

**Special Cases:**
- **Author Reply Engagement**: Weight: **75x** (highest positive signal)
- **Conversation Engagement**: Weight: **11x**

---

##### 5.1.2 Probability Calculation Method 
**Question:** 
How is the probability of each of the engagement metrics calculated?

**Grok-Based Transformer (Phoenix Scorer):**
1. **Candidate Isolation**: Each candidate attends *only* to user context
2. **No Inter-Candidate Attention**: Prevents batch dependencies
3. **Input Features**:
   - User engagement sequence
   - User metadata (follows, preferences, language)
   - Candidate post content + metadata
4. **Output**: Sigmoid probabilities for each action
5. **Training**: Historical engagement outcomes
6. **Optimization**: "Unregretted User Seconds" (satisfaction without fatigue)

**Critical Design:** Stable scores, batch-independent, cacheable predictions

---

#### 5.2 Weighted Scorer

**Purpose:**
Convert multi-action probabilities into a single ranking score.

**Formula:**

```
Final Score = Σ (weight_i × P(action_i))
```

**Weighting Logic:**

* Positive actions → positive weights
  (like, reply, repost, dwell, follow)
* Negative actions → negative weights
  (mute, block, report, not_interested)

**Key Insight:**

> X optimizes for **expected future satisfaction**, not raw engagement.

**GEO Optimization:**

* Content that causes *follows* and *profile clicks* is disproportionately rewarded
* Authority signals compound across sessions

** Weight Derivation Question:**
What is the weighted score of each of the engagement metrics above? 

**Official Weights (From Open Source):**
As documented above - these are the *only* published weights from X's codebase.

**Relative Hierarchy (Conservative):**
| Tier | Actions | Philosophy |
|------|---------|------------|
| **Maximum** | Author Reply (75x), Block (-369x) | Relationship signals |
| **Very High** | Reply (13.5x), Profile Click (12x) | Deep engagement |
| **Medium** | Repost, Like, Share (1.0x) | Surface engagement |
| **Low** | Dwell, Video View (<1.0x) | Passive signals |
| **Negative** | Not Interested, Mute, Report | Strong penalties |

**Note:** Exact weights for unlisted actions are **not published** - only relative order is documented.

---

##### 5.2.1  Weighted Scorer - Weight Derivation

**Question:**
Where is the weight and action derived from and how are they calculated?

**Sources:**
- **Offline Training**: Historical satisfaction data
- **A/B Testing**: Manual tuning for platform goals
- **Safety Calibration**: Policy compliance adjustments
- **Business Goals**: Retention vs engagement balance

**Formula:**
```
FinalRankScore = Σ(weight × P(action)) - Σ(penalties)
```

**Optimization Target:** Future satisfaction (not raw engagement)

---

#### 5.3 Author Diversity Scorer

**Purpose:**
Prevent feed monopolization by a single author.

**Mechanism:**

* Attenuates scores for repeatedly surfaced authors
* Encourages creator diversity per session
- If Author A has **3 posts in top 10**:
  - Post #1: Full score
  - Post #2: Score × 0.5-0.8 (attenuated)
  - Post #3: Score × 0.3-0.5 (further reduced)

**Effect:**

* Even high-performing authors must maintain consistent quality
* Rewards breadth of engagement, not spam volume

**Purpose:**
- Prevent feed monopolization
- Promote content variety
- Reduce echo chamber effects

**GEO Insight:** One viral post ≠ guaranteed next success - each evaluated independently

---

#### 5.4 Out-of-Network (OON) Adjustment Scorer

**Purpose:**
Balance in-network vs out-of-network content.

**Behavior:**

* Slight attenuation or boosting depending on:

  * User exploration tendency
  * Topic novelty
  * Engagement confidence

**GEO Insight:**

* Strong topical authority increases OON survival
* Weak bios reduce OON confidence scores

---

#### Panel Topics:
- "The 75x Rule" - Why replying to commenters triggers heavy ranker
- "Why One Viral Post Doesn't Guarantee the Next"
- "Multi-Action Prediction Ethics" - Optimizing for satisfaction vs engagement
- "Weight Tuning for Fairness" - Balancing creator incentives

#### Break Room Topics:
- Porting Phoenix to @dndhub/geo
- Simulating weights in GEOCoLab
- "The Death of the Hashtag" - Semantic relevance > keyword tagging

**Complaints Applied:**
- *"Echo Chambers"* → Biased predictions amplify similar content
- *"Perceived Bias"* → Weighted scorers favor certain engagement types
- *"Rage Bait"* → High reply weights can reward controversy
- *"Big accounts dominate"* → They don't - diversity attenuation prevents monopoly

**Penalties:**
- **Low Weighted Score**: Negative actions dominate (e.g., P(report) × -369 decimates rank)
- **Diversity Penalty**: -10-20% per repeated author appearance

---

### Stage 6: POST-SELECTION FILTERS (Final Safety)

**Purpose:**
Choose the final set of posts for rendering.

**Process:**

1. Sort candidates by final score
2. Select top **K** posts
3. Enforce diversity and freshness constraints

**Result:**

* A balanced feed of:

  * Followed accounts
  * High-confidence discoveries

---

#### 6.i) Additional Filtering

Question: Besides deleted/spam/violence/gore what other filtering is performed on post at post-selection filter stage?

**Beyond Listed:**
- **Policy Enforcement**: Misinformation, harassment violations
- **Conversation Deduplication**: Branch quality selection (highest signal thread)
- **Legal Takedowns**: Copyright, court orders
- **Sensitive Topic Throttling**: Context-aware suppression
- **Feedback Fatigue Removal**: Post-negative content
- **Community Safety**: Coordinated harm prevention
- **De-amplified Content**: Repeated policy strikes

**System Behavior:** Complete removal - no recovery at this stage

---

#### Panel Topics:
- "Balancing Safety vs Free Speech"
- "Spam Detection Advances" - ML vs rule-based
- "Invisible Failures After Scoring" - Why high scores still fail

#### Break Room Topics:
- Integrating filters into Signal > Spam series
- UI for filter diagnostics in GEOCoLab
- "Shadow-locking vs Shadow-banning" - Understanding suppression mechanics

**Penalties:**
- **Removal**: -100% (no render to user)

---

### Stage 7: Post-Selection Filters

**Purpose:**
Final safety and integrity checks.

**Filters Applied:**

* Deleted posts
* Spam classification
* Violence / gore
* Policy violations
* Conversation deduplication

**Note:**
These filters **do not rescore**—they only remove.

**Question:**
Which of the X recommendation system and their corresponding actions affect each stage?

| System | Query Hydration | Candidate Sources | Hydration | Pre-Scoring | Scoring | Post-Selection |
|--------|----------------|-------------------|-----------|-------------|---------|----------------|
| **Timeline** | All actions | Thunder + Phoenix | All metadata | All filters | All scorers | VF + dedup |
| **Search** | Query context | Keyword-based | Semantic data | Age + seen | Phoenix + health | Safety heavy |
| **Explore** | Preferences | Topic-based | Media priority | Keyword heavy | Velocity boost | Spam heavy |
| **Conversations** | Reply history | Thread context | Branch depth | Dedup focus | Reply scoring | Branch quality |
| **Notifications** | Push context | Engagement-driven | Alert metadata | Mute/block | Interruption risk | Fatigue prevention |
| **Trends** | Topic interests | Velocity-gated | Real-time | Novelty | Acceleration | Legitimacy check |
| **Spaces** | Audio history | Topic overlap | Dwell signals | Author filter | Loyalty bonus | Repeat attendance |
| **Communities** | Cluster align | SimCluster | Topic data | Muted keywords | Coherence | Saturation penalty |
| **Account (Follow)** | Network data | RealGraph | Trust scores | Block/mute | Authority | Spam proximity |

---

---

### Stage 8: Side Effects & Feedback Loop

**Purpose:**
Feed learning systems and future predictions.

**Actions:**

* Cache served posts
* Log impressions
* Track downstream engagements
* Update RealGraph edges

**Critical Loop:**

> Every impression becomes training data.

---

## 2.x Pipeline Summary (End-to-End)

```
User Request
 → Query Hydration
 → Candidate Sourcing
 → Candidate Hydration
 → Hard Filters
 → Phoenix Scoring
 → Weighted Aggregation
 → Diversity Adjustment
 → Selection
 → Safety Filtering
 → Feed Render
 → Learning Feedback
```

---

## Why This Matters for GEO & Rich Bios

From this pipeline, **RichText Bio + Work Experience directly influence**:

* Retrieval confidence (OON discovery)
* `P(profile_click)`
* `P(follow_author)`
* Authority inference across sessions
* Spam vs signal classification

In short:

> **Your profile is now part of the model input—not just decoration.**

Below is a **drop-in documentation section** you can append to the existing **“X For You and Recommendation Algorithm Blueprint Guide”**.
It is written to *merge* the conceptual guide with the **actual type system you shared**, aligning language, stages, and metrics so it can be used consistently across:

* `@dndhub/xdk` (implementation)
* `@dndhub/geo` (signal engine)
* Signal > Spam Panel Series (education)
* GEOCoLab UI (visual diagnostics)

---

## X Recommendation Signal Metrics Guide

This section defines the **canonical signal taxonomy** used across X’s recommendation systems and GEO’s optimization layer. It bridges **conceptual pipeline stages** with **concrete, typed signal representations**, ensuring consistency between algorithm theory, production code, and creator-facing diagnostics.

At its core, X’s recommendation system is no longer feature-driven—it is **signal-driven**. Every surface (Timeline, Explore, Search, Notifications, etc.) consumes variations of the same underlying signals, filtered, weighted, and attenuated at different choke points.

GEO formalizes these signals into a **unified, cross-platform metric model** that mirrors X’s internal scoring logic while remaining observable and optimizable.

---

### 1. Signal Philosophy: From Features to Outcomes

X’s 2024–2025 architecture shift replaced hand-engineered features with:

* **Multi-action probability prediction**
* **Negative-signal amplification**
* **Temporal signal windowing**
* **Graph-position authority inference**

GEO mirrors this by organizing signals into **five orthogonal dimensions**, each directly mapping to Phoenix scoring inputs and post-scoring adjustments:

| Dimension              | Purpose                          | Pipeline Alignment     |
| ---------------------- | -------------------------------- | ---------------------- |
| Content Quality        | Semantic and informational value | Hydration → Scoring    |
| Engagement Quality     | User intent strength             | Phoenix predictions    |
| Network Authority      | Trust and graph position         | Retrieval + Scoring    |
| Behavioral Consistency | Longitudinal reliability         | Query hydration        |
| Negative Signals       | Risk & suppression               | Hard gates + penalties |

This structure allows GEO metrics to **explain why a candidate survived or failed**, not just whether it ranked.

---

### 2. Core Signal Layers (Mapped to Pipeline Stages)

#### 2.1 Query Hydration Signals (Context Quality)

These signals determine **how well the system understands the user** before any candidates are evaluated.

Key metrics:

* `userActionSequence`
* `userFeaturesScore`
* `currentSessionDepth`
* `languageMatch`
* `geographicAlignment`

**Why it matters:**
Sparse or noisy hydration degrades *all* downstream predictions. GEO treats this as *context entropy*—low entropy improves ranking confidence.

---

#### 2.2 Candidate Sourcing Signals (Eligibility & Reach)

Candidate eligibility is governed by **graph and embedding signals**, not content alone.

**In-Network (Thunder):**

* `realGraphScore`
* `reciprocalRate`
* `authorAffinity`
* `sessionFreshness`

**Out-of-Network (Phoenix Retrieval):**

* `retrievalSimilarity`
* `simClusterMemberships`
* `twhinEmbeddings`
* `communityEmbeddings`

**GEO Insight:**
Out-of-network discovery is a *trust bet*. Strong authority and niche coherence dramatically improve survival past scoring.

---

#### 2.3 Content Quality Signals (Semantic Fitness)

These signals influence **engagement probability calibration**, not eligibility.

Key metrics:

* `semanticRelevance`
* `contextDepth`
* `originalityScore`
* `informationDensity`
* `conversationalTone`
* `multimodalRichness`

**Interpretation:**
High content quality does *not* guarantee ranking—but low quality sharply caps predicted engagement probabilities.

---

#### 2.4 Engagement Quality Signals (Intent Strength)

These map **directly** to Phoenix’s multi-action predictions and weighted scorer.

High-intent signals:

* `replyDepth`
* `bookmarkRate`
* `shareQuality`
* `threadParticipation`
* `dwellTime`

Velocity modifiers:

* `immediateEngagement`
* `sustainedEngagement`
* `viralityIndex`

**Critical distinction:**
X optimizes for **future satisfaction**, not surface engagement. GEO therefore weights *depth over volume*.

---

#### 2.5 Network Authority Signals (Trust & Amplification)

Authority is inferred, not declared.

Key signals:

* `followerVerifiedRatio`
* `mutualConnectionDensity`
* `authorityAdjacency`
* `citationFrequency`
* `reshareQuality`
* `graphCentrality`
* `realGraphScore`

**System behavior:**
Authority compounds across sessions and surfaces. It affects:

* Out-of-network boosts
* Profile click → follow loops
* Spam vs signal classification

---

#### 2.6 Behavioral Consistency Signals (Reliability Over Time)

These stabilize predictions across temporal windows.

Metrics include:

* `postingCadence`
* `nicheCoherence`
* `responseLatency`
* `sessionDepth`
* `activityConsistency`
* `accountLongevity`

**GEO framing:**
Consistency reduces model uncertainty. Erratic behavior increases exploration penalties.

---

#### 2.7 Negative Signals (Amplified Suppression Layer)

Negative signals override all positives.

Highest-weight penalties:

* `blockRate` (≈ −369)
* `reportRate`
* `dismissRate`

Implicit penalties:

* `scrollPastRate`
* `immediateExitRate`
* `feedbackFatigueRate`

Risk classifiers:

* `toxicityScore`
* `spamMarkers`
* `botProbability`
* `manipulationRisk`

**Key rule:**
Negative signals are weighted **2–5× stronger** than positive ones. One high-confidence report can negate dozens of likes.

---

### 3. Phoenix Scoring Alignment (Multi-Action Prediction)

All engagement signals converge in the **Phoenix Grok Transformer**, which predicts probabilities for:

* Positive actions (reply, follow, dwell, profile click)
* Neutral actions (view, expand, click)
* Negative actions (mute, block, report)

These probabilities are then aggregated by the **Weighted Scorer**, producing:

```
FinalRankScore = Σ(weight × P(action)) − Σ(penalties)
```

GEO’s `weightedFinalScore`, `rankingProbability`, and `viralPotential` are **direct mirrors** of this internal computation.

---

### 4. Surface-Specific Signal Effects

While signals are unified, **their impact differs by surface**:

* **Timeline** → engagement depth + diversity
* **Search** → semantic consistency + health
* **Explore** → velocity + novelty
* **Conversations** → reply depth + branch quality
* **Notifications** → interruption risk
* **Trends** → velocity + legitimacy
* **Spaces** → dwell + repeat attendance

The `surfaceImpacts` interfaces in `XGEOSignalMetrics` make these differences explicit, enabling GEOCoLab to explain *where* a signal helps or hurts.

---

### 5. GEO Composite Interpretation Layer

At the top level, GEO synthesizes signals into:

* `overallSignalScore` (0–100)
* `trustScore`
* `spamRisk`
* `viralPotential`
* Surface-specific contribution scores
* Actionable recommendations

This layer is **diagnostic, not predictive**—it explains system behavior in human terms while remaining faithful to X’s actual ranking mechanics.

---

### 6. Practical Usage Across Projects

* **@dndhub/xdk**
  Implements pipeline stages using these metrics as typed contracts.

* **@dndhub/geo**
  Computes, normalizes, and explains signals at each choke point.

* **Signal > Spam Panel Series**
  Teaches creators how actions translate into signals and penalties.

* **GEOCoLab UI**
  Visualizes survival rates, penalties, and authority accumulation.

---

### Final Principle

> **X no longer ranks posts. It ranks predicted outcomes under uncertainty.**
> GEO exists to make that uncertainty legible, optimizable, and fair.

This section completes the conceptual–technical bridge, ensuring your blueprint is not just accurate—but operational.



