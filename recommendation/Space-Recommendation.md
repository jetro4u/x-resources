# Enhanced Spaces Recommendations → GEO & GEOMetrics Extension

Spaces is not just “audio discovery”—it is a **high-signal trust laboratory**. Compared to the Home Timeline, Spaces introduces **time-anchored, commitment-heavy signals**, which makes it extremely valuable for GEO calibration.

## Graph Extraction:

```
┌────────────────────────────────────────────────────────────────┐
│              SPACES RECOMMENDATION SYSTEM                      │
└────────────────────────────────────────────────────────────────┘

User Event Flow:
┌────────────┐
│   User     │──1. Open Spaces Tab───┐
│  (Mobile)  │                       │
└────────────┘                       ▼
       ▲                    ┌─────────────────┐
       │                    │    Proxsee      │
       │  2. Get list       │  (Backend)      │
       │     of Spaces      │                 │
       │                    │                 │
       │  3. Start watch ──→│                 │
       │                    └────┬────────┬───┘
       │                         │        │
       │  4. End watch session   │        │  2. Produce server
       │                         │        │     log for tab
       └─────────────────────────┘        │     response
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    DATA STORAGE LAYER                        │
└──────────────────────────────────────────────────────────────┘

┌────────────────────┐  2. Get broadcast    ┌──────────────────┐
│ Broadcast Service  │←─────────────────────│   Escherbird     │
│                    │    metadata          │                  │
│  Host tags space ─→│                      │ Annotate space   │
│  with topics       │                      │ title with       │
└────────────────────┘                      │ entity id        │
         │                                  └──────────────────┘
         │ 5. Write user's watch
         │    duration and session
         ▼    info
┌────────────────────────────────────────────────────────────┐
│              BigQuery Storage                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Table:BroadcastViewEndedDay                      │     │
│  │ • User watch duration per Space                  │     │
│  │ • Session info (entry point, dwell time)         │     │
│  │ • Tagged topics/entities                         │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Table:SpacesMLCandidateFeatures                  │     │
│  │ • Space metadata (title, language, duration)     │     │
│  │ • Real-time metrics (n_watchers, n_stickers)     │     │
│  │ • Host/speaker info (verified, follower counts)  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                            │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Table:SpacesMLRequesterFeatures                  │     │
│  │ • User language, locale                          │     │
│  │ • Historical watch data per topic/category       │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
         │
         │ 6. Aggregate user's watch time per
         │    entity/topic with current session
         │    and watch history
         ▼
┌────────────────────────────────────────────────────────────┐
│         Redis RankDb (User Feature Store)                  │
│  • Historical watch duration by topic/category             │
│  • Aggregated engagement metrics                           │
│  • Real-time preference signals                            │
└────────────┬───────────────────────────────────────────────┘
             │
             │ 7. Broadcast end,
             │    write broadcast
             │    metadata
             ▼
┌────────────────────────────────────────────────────────────┐
│              BigQuery Storage                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Table:BroadcastEnd                               │     │
│  │ • Final Space metadata                           │     │
│  │ • Total engagement metrics                       │     │
│  │ • Performance data for ML training               │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘
                         │
                         │ 2.5 Client scribe events
                         ▼
┌────────────────────────────────────────────────────────────┐
│              BigQuery Storage                              │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Table:ClientEvent                                │     │
│  │ • User interaction events (enters, exits, etc.)  │     │
│  └──────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────┘

ML PREDICTION FLOW:
┌────────────────────────────────────────────────────────────┐
│         NEURAL NET PREDICTION (f: inputs → probability)    │
│                                                            │
│  Key Features:                                             │
│  • title (Space title text)                               │
│  • is_verified_user (Host verified status)                │
│  • locale (User language)                                 │
│  • broadcast_language (Space language)                    │
│  • is_trending (Weighted: listeners + host/speaker follows)│
│  • is_featured (Human curator flag)                       │
│  • duration (Broadcast runtime)                           │
│  • n_watchers (App viewers)                               │
│  • n_stickers (>15s engaged viewers)                      │
│  • n_entrants (Total unique listeners)                    │
│  • n_watchers_web (Web viewers)                           │
│  • n_hearts (Emoji reactions)                             │
│  • n_comments (Shared posts in Space)                     │
│  • n_guests_followed (Followed speakers)                  │
│  • n_admins_followed (Followed hosts)                     │
│  • n_participants_followed (Followed listeners)           │
│  • session_count (User's past Spaces engagement)          │
│  • n_overlapped_topics (Topic match with past Spaces)     │
│  • avg_overlapped_topics_watch_time (Avg watch time)      │
│  • n_uninterested (Negative feedback count)               │
│  • audio_space_type (Live vs. Recorded)                   │
│                                                            │
│  Output: P(user will listen | features)                   │
└────────────────────────────────────────────────────────────┘
```

### Core Architecture Enhancements
- **Hybrid Grok-Powered Prediction Layer:**  
  Integrate a lightweight Grok inference call (or distilled variant) into the neural net prediction step for ambiguous or low-data Spaces. Current X ranking operates almost entirely on learned user preferences without explicit rules—extend this to Spaces by using Grok to enrich title/topic embeddings with semantic context (e.g., resolving "crypto" → specific sub-niches like DeFi vs. memecoins). This boosts cold-start accuracy for untagged/new Spaces and aligns with the 2026 "no manual downranking" ethos.  
  → Expected lift: +15-25% in personalized relevance for niche topics, especially in multilingual or emerging-event Spaces.

- **Real-Time Depth Velocity Tracking:**  
  Add streaming aggregation (e.g., via Kafka/Flink) for **velocity of stickers** (15s+ engagement rate per minute since start) and **repeat listener inflow**. X's 2026 algo heavily weighs early meaningful velocity (thoughtful replies > likes) before wider distribution—mirror this for live Spaces by dynamically boosting trending-but-deep signals in Proxsee/Redis.  
  → Prevents "fake virality" (e.g., bot entrants) while rewarding genuine momentum.

- **Negative Signal Decay & Topic Reshaping:**  
  Your n_uninterested handling is already soft—formalize exponential decay (e.g., half-life 7-14 days) and apply it **only to topic vectors**, not account-level. Combine with cross-surface signals (e.g., if user dislikes a Space on "AI ethics" but engages deeply with the host's text posts on the same topic → reduce penalty). This fits X's behavior-only training shift.

## Enhanced Implications for GEO & SignalMetrics

Spaces is not just “audio discovery”—it is a **high-signal trust laboratory**. Compared to the Home Timeline, Spaces introduces **time-anchored, commitment-heavy signals**, which makes it extremely valuable for GEO calibration.

### Why Spaces Signals Are Stronger Than Feed Signals

| Dimension        | Home Timeline      | Spaces                       |
| ---------------- | ------------------ | ---------------------------- |
| Engagement Cost  | Low (scroll, like) | High (time, attention)       |
| Spam Resistance  | Medium             | High                         |
| Semantic Clarity | Implicit           | Explicit (topics + duration) |
| Trust Signal     | Weak–Medium        | Strong                       |

This means:

> **Spaces signals should be weighted as “high-confidence trust signals” inside GEO.**

### GEO-Specific Implications

#### A. Time-as-Trust

* **Watch duration** is not just engagement—it’s *proof of relevance*
* 15s (`n_stickers`) acts as a **minimum signal validity threshold**
* Long dwell implies:

  * Topic alignment
  * Host credibility
  * Low deception

Your GEO_Spaces_Trust formula is excellent—enhance it to reflect 2026 priorities (sustained attention, network quality via behavior, not just follows):

- **Add ConversationQuality Boost**  
  Introduce a sub-metric for in-Space interactions:  
  ```
  ConversationQuality = 
    (n_comments + weighted_hearts) 
    × (thoughtful_reply_ratio)  // e.g., replies >10 chars or with media/context
  ```  
  Fold into GEO_Spaces_Trust as +w₆ · ConversationQuality (weight ~0.12–0.15).  
  Rationale: X now ranks replies (especially contextual ones) dramatically higher than likes/reposts—Spaces comments/shared posts are high-signal analogs.



- **BehavioralTrust Over NetworkProximity**  
  Evolve NetworkConfidence to discount raw "followed" counts:  
  ```
  BehavioralTrust = 
    α · (repeat_listeners / total_listeners) 
    + β · (listeners_who_later_engaged_host_posts / total_listeners)
  ```  
  (α ≈ 0.7, β ≈ 0.3)  
  This captures post-Space retention—key in X's current system where cross-format trust compounds (e.g., Space listener → timeline engager).

- **Live vs. Recorded Differentiation**  
  Add a binary/live_weight modulator: Live Spaces get temporary +0.2–0.3 uplift in TimeTrust during active window (decays post-end). Recorded get boosted if avg_watch_duration > median for topic.

**GEO implication:**
Time-based signals should **amplify downstream visibility** for both:

* Hosts (account authority)
* Topics (semantic trust graph)

---

#### B. Topic-First Identity Modeling

Spaces uses **explicit topic tagging**, not inferred embeddings alone.

This enables:

* Fast cold-start resolution
* Transparent relevance scoring
* Explainable recommendations

**GEO implication:**
GEO should support **explicit semantic contracts**:

* Topic → Account affinity
* Topic → Session depth
* Topic → Trust accumulation

---

#### C. Social Trust Is Directional

Following a host ≠ trusting a host
But **listening to a host for 20 minutes does**.

Spaces separates:

* **Network proximity** (follows)
* **Behavioral trust** (time + repetition)

**GEO implication:**
Account reputation should be **behaviorally earned**, not socially inherited.

---

#### D. Negative Signals Are Structural, Not Punitive

`n_uninterested` doesn’t ban content—it **reshapes future retrieval**.

**GEO implication:**
Negative signals should:

* Decay gradually
* Apply to *topic vectors*, not global suppression
* Never be binary

---

## GEOMetrics Scoring Logic

*(Mathematical + Architectural Contract)*

### Core GEO Question for Spaces

> *How likely is this account to consistently produce Spaces that users trust with their time?*

We define an **Account-Level GEO Spaces Score**:

---

### A. Primary GEO Spaces Score (Account-Centric)

```
GEO_Spaces_Trust(account) =
  0.30 · TimeTrust 
+ 0.20 · TopicCoherence 
+ 0.18 · SessionDepth 
+ 0.15 · BehavioralTrust          // new emphasis
+ 0.12 · ConversationQuality     // new
− 0.05 · DisinterestPenalty
```

Where weights are normalized:
`Σ wᵢ = 1`

---

### B. Metric Definitions

#### 1. TimeTrust

Measures how much *real attention* the account earns.

```
TimeTrust =
  log(1 + avg_watch_duration_per_space)
  × repeat_listener_ratio
```

* Rewards consistency, not virality
* Log dampens extreme outliers

---

#### 2. TopicCoherence

Measures semantic reliability.

```
TopicCoherence =
  avg(
    cosine_similarity(
      space_topics,
      listener_historical_topics
    )
  )
```

High coherence = predictable value delivery
Low coherence = clickbait or topic drift

---

#### 3. SessionDepth

Distinguishes sampling from commitment.

```
SessionDepth =
  n_stickers / n_entrants
```

Acts as a **signal quality filter**:

* Bots → low
* Curious but irrelevant → low
* Valuable content → high

---

#### 4. NetworkConfidence

Trust via *behavior*, not follower count.

```
NetworkConfidence =
  (listeners_following_host / total_listeners)
  + (repeat_listeners / total_listeners)
```

Encodes:

* Trust retention
* Long-term credibility

---

#### 5. DisinterestPenalty

Soft constraint, not suppression.

```
DisinterestPenalty =
  log(1 + n_uninterested) × topic_overlap_factor
```

Only penalizes **similar future topics**, not the entire account.

---

### C. Architectural Contract (GEO-Compatible)

| Layer             | Responsibility                               |
| ----------------- | -------------------------------------------- |
| Event Layer       | Capture watch, exit, reaction, disinterest   |
| Aggregation Layer | Roll up by **account × topic × time window** |
| Feature Store     | Real-time + historical trust vectors         |
| Scoring Engine    | Deterministic + ML-assisted hybrid           |
| Retrieval         | Use score to bias candidate selection        |
| Ranking           | Combine with session intent & freshness      |

> **Key Principle:**
> GEO scores bias *retrieval*, not just ranking.

---

## TypeScript GEOMetrics Interface (Account-Focused)

This is **not ML output**, but a **stable contract** between:

* Signal ingestion
* Scoring
* UI explainability
* Governance

```ts
/**
 * Account-level GEO Metrics derived from Spaces behavior
 * High-trust, time-weighted signal source
 */
export interface GEOAccountSpacesMetrics {
  accountId: string;

  // Temporal scope
  window: {
    start: number; // epoch ms
    end: number;   // epoch ms
  };

  // Core trust signals
  timeTrust: {
    avgWatchDurationSec: number;
    repeatListenerRatio: number;
    score: number;
  };

  topicCoherence: {
    primaryTopics: string[];
    avgTopicSimilarity: number; // 0–1
    score: number;
  };

  sessionDepth: {
    entrants: number;
    stickers15s: number;
    depthRatio: number; // stickers / entrants
    score: number;
  };

  networkConfidence: {
    listenersFollowingHostRatio: number;
    repeatListenerRatio: number;
    score: number;
  };

  negativeSignals: {
    uninterestedCount: number;
    topicScopedPenalty: number;
  };

  // Final GEO Spaces score
  geoSpacesTrustScore: number; // 0–100

  // Metadata for explainability
  confidenceLevel: 'low' | 'medium' | 'high';
  lastUpdated: number;
}
```

### Why This Interface Matters

* **Composable**: Can merge with Feed GEO metrics
* **Explainable**: Every score is decomposable
* **Auditable**: Supports governance & transparency
* **Product-ready**: Can drive dashboards, badges, throttles

---

## Final GEO Takeaway

> **Spaces proves that Signal > Spam is measurable.**
> Time, repetition, and topic coherence form a **trust triangle** that GEO can formalize across the platform.

Spaces is where:

* Spam dies
* Trust compounds
* GEO metrics become undeniable

### Category & Surface Integration
| Enhancement | Target | Alignment with 2026 X Algo | Expected GEO Impact |
|-------------|--------|-----------------------------|---------------------|
| Cross-Surface Trust Carry-Over | Account-level | Grok unifies signals across feed/Spaces/DMs | Spaces trust boosts timeline authority (and vice versa) |
| Topic Authority Graph | Explicit topics | SimClusters-like but explicit tagging | Faster niche discovery; reduces cold-start penalty |
| Depth-First Retrieval Bias | Candidate selection | Velocity + dwell over raw popularity | Rewards commitment-heavy hosts → higher GEO signal purity |
| Anti-Spectacle Penalty | Trending/viral Spaces | Discourages rage/clickbait | Penalize low SessionDepth despite high n_watchers |

### Implementation Tactics
- **Feature Store Unification:** Merge SpacesMLCandidateFeatures with broader GEO Redis store—add "geo_spaces_trust" vector for fast lookup during Proxsee ranking.
- **Feedback Loop Acceleration:** Use ClientEvent + BroadcastViewEndedDay to retrain bi-weekly (vs. slower batch cycles), feeding into Grok-style preference modeling.
- **Explainability Layer:** Expose decomposed GEO_Spaces_Trust in "Why this Space?" UI (e.g., "High topic match + strong listener retention from your network").
- **EU/Regulatory Mode:** For non-personalized fallback, rely purely on BehavioralTrust + trending depth (n_stickers velocity), avoiding user history entirely.

### Summary:
Your current Spaces setup already outperforms many feed signals in trust quality—lean into that by making GEO **even more depth- and behavior-first**. With X's 2026 direction (pure user-preference learning, no manual tweaks, Grok integration), prioritize **repeat attention + thoughtful interaction** metrics over raw scale. This turns Spaces into the **primary calibration surface** for account-level GEO across the platform: a host who consistently earns 20+ minute listens + substantive comments builds undeniable, decay-resistant trust.

**X's Spaces Recommendation System** predicts user listening intent via a **topic-centric ML model** trained on historical watch patterns:

**Architecture Overview:**

1. **Data Collection Pipeline**:
   - **Proxsee** (backend service): Central hub for user requests (login, follow, watch)
   - **Escherbird**: Annotates Space titles with entity IDs
   - **Broadcast Service**: Collects host-tagged Topics (cryptocurrencies, business, music, gaming, sports)
   - **BigQuery Storage**:
     - `BroadcastViewEndedDay`: Watch duration, session info, tagged topics
     - `SpacesMLCandidateFeatures`: Space metadata + real-time metrics
     - `SpacesMLRequesterFeatures`: User language, historical watch data
     - `ClientEvent`: User interactions (scribe events)
   - **Redis RankDb**: User feature store with aggregated topic watch times

2. **Feature Engineering**:
   - **Space Features** (17 total):
     - Metadata: Title, language, verified host, featured status, type (live/recorded)
     - Engagement: Watchers (app/web), stickers (>15s engaged), hearts, comments
     - Social: Followed hosts/speakers/listeners
     - Trending: Weighted sum of listeners + host/speaker follower counts
   - **User Features**:
     - Historical: Session count, topic overlap, avg watch time per topic
     - Preferences: Locale, language
     - Negative Signals: `n_uninterested` (disinterest feedback)

3. **ML Prediction**:
   - **Neural Network**: `f(features) → P(user will listen)`
   - **Training Data**: Historical watch duration + session engagement
   - **Topic-Centric**: Aggregates watch time by tagged Topics, enabling personalization even for new Spaces

4. **EU Non-Personalized Mode**:
   - Uses **popularity-only signals** (no user features)
   - Likely based on: `is_trending`, `n_watchers`, `is_featured`

**Key Insights for GEO/Signal Framework:**

1. **Topic-Based Personalization**:
   - **Host tags Spaces** with Topics → System tracks user watch time **per Topic**
   - Enables **cold-start for new Spaces** (if tagged with user's preferred topics)
   - Similar to SimClusters but **explicit labeling** vs. implicit clustering

2. **Engagement Depth Metrics**:
   - **n_stickers** (>15s watch) filters casual samplers from engaged listeners
   - **n_entrants vs. n_watchers**: Churn signal (entered but left quickly)
   - **Hearts/comments**: Active participation vs. passive listening

3. **Social Proof Signals**:
   - **Followed hosts/speakers/listeners**: Network-based trust signals
   - **is_trending**: Combines popularity (listeners) + authority (host/speaker follower counts)

4. **Negative Feedback Integration**:
   - **n_uninterested**: Explicit dislike signal (like YouTube's "not interested")
   - Likely **penalizes similar Spaces** in future recommendations

**Mapping to Your SignalMetrics**:
- `dwellTime` ← Watch duration (implicit via `BroadcastViewEndedDay`)
- `semanticRelevance` ← Topic overlap (`n_overlapped_topics`, `avg_overlapped_topics_watch_time`)
- `followerVerifiedRatio` ← `is_verified_user` (host verification)
- `mutualConnectionDensity` ← `n_guests_followed`, `n_admins_followed`, `n_participants_followed`
- `nicheCoherence` ← Topic consistency in watch history
- `sessionDepth` ← `n_stickers` (15s+ engagement) vs. `n_entrants` (brief sampling)
- `citationFrequency` ← `n_comments` (shared posts in Space)

**Technical Patterns**:
- **Real-Time Feature Store**: Redis for fast user feature retrieval during prediction
- **Multi-Table BigQuery**: Separate tables for user features, Space features, events (optimized for batch ML training)
- **Topic Aggregation**: Watch time rolled up by Topics/entities (not individual Spaces)

**Key Takeaway**: Spaces recommendations prioritize **topic coherence** and **engagement depth** (15s+ watch threshold) over raw popularity. Your GEO framework should implement **explicit topic tagging** for content (not just implicit clustering) and **engagement depth metrics** (dwell time thresholds) to distinguish quality signals from spam/bots.

---