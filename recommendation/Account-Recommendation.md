# X Account Recommendations — GEO-Enhanced System Reference

This document reframes X’s *Who-To-Follow* (Account Recommendations) pipeline as a **distributed signal survivability graph**, aligning it with GEO principles: **Signal > Spam as architecture**.

This account model integrates with the timeline GEOMetricsEngine for a combined Content + Account Survivability Score in GEOCoLab—e.g., 'Your account's recommendation health: 0.78 (High-Confidence Tier) → Feed amplification potential high'.

---

## 1. Account Recommendations Summary

### Graph Extraction:

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ Signals
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│              CANDIDATE GENERATION                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Activity-Based                                      │    │
│  │ • Similar accounts (Sims) recently engaged         │    │
│  │ • RealGraph out-of-network users                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Geo-Based                                          │    │
│  │ • Most followed accounts in geo location/country   │    │
│  │ • Most searched accounts in geo location/country   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Social-Based                                        │    │
│  │ • Similar accounts to recently followed users       │    │
│  │ • Phone/email book contacts (PMI)                  │    │
│  │ • Accounts followed by recent followings           │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Topic-Based                                         │    │
│  │ • Top producers of user-selected topics            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ All Twitter Accounts + ML Feature Store            │    │
│  └─────────────┬──────────────────────────────────────┘    │
└────────────────┼───────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ Candidate Pool │
        └────────┬───────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────────┐
│         BLENDING, RANKING AND FILTERING                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Weighted Down-sampling and Blending                │    │
│  │ • Weights based on candidate source quality        │    │
│  └─────────────┬──────────────────────────────────────┘    │
│                │                                            │
│                ▼                                            │
│       ┌────────────────┐                                   │
│       │ Deduplication  │                                   │
│       └────────┬───────┘                                   │
│                │                                            │
│                ▼                                            │
│    ┌──────────────────────┐                               │
│    │ Meta info features   │                               │
│    └──────────┬───────────┘                               │
│               │                                            │
│               ▼                                            │
│       ┌──────────────┐                                    │
│       │  ML ranker   │                                    │
│       └──────┬───────┘                                    │
│              │                                             │
│              ▼                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Quality Filtering                                   │  │
│  │ • Filter followed/blocked/muted/reported/dismissed  │  │
│  │ • Filter by "Recommendations" visibility           │  │
│  │ • Filter high CSE/NSFW scores                      │  │
│  └─────────────┬──────────────────────────────────────┘  │
└────────────────┼───────────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ K recommended      │
        │ accounts           │
        └────────┬───────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Who-To-Follow      │
        │ module             │
        └────────────────────┘
```

### Mermaid Diagram Refinement

flowchart TD
    A[User Signals] --> B[Candidate Generation]
    B --> C1[Activity-Based<br>SimClusters + RealGraph]
    B --> C2[Geo-Based<br>Local top accounts]
    B --> C3[Social-Based<br>PMI + Follow chains]
    B --> C4[Topic-Based<br>Top topic producers]
    B --> C5[Long-Tail ML Exploration]
    C1 & C2 & C3 & C4 & C5 --> D[Weighted Blending + Down-sampling]
    D --> E[Deduplication]
    E --> F[Meta Features + Grok/xAI Enrichment]
    F --> G[ML Ranker<br>p(follow) + p(engage|follow)]
    G --> H[Quality Filtering<br>Blocked/Muted/NSFW/Grok Toxicity]
    H --> I[K Recommended Accounts]
    I --> J[Who-To-Follow Module]


## 2. Enhanced Implications for GEO & SignalMetrics

### I. Core Architectural Insight

Unlike content ranking, **account recommendations optimize for long-term trust**, not immediate engagement.

> An account recommendation is effectively a *future content bet*.

This means:

* Precision > recall
* Stability > virality
* Network trust > raw activity

From a GEO standpoint, **accounts are scored as persistent signal emitters**, not one-off artifacts.

---

### II. GEO Interpretation of Each Pipeline Stage

#### A. Candidate Generation = *Eligibility Graph Expansion*

Each source introduces candidates with **different priors**:

| Source            | GEO Interpretation          |
| ----------------- | --------------------------- |
| Activity-Based    | Behavioral similarity graph |
| Geo-Based         | Contextual relevance prior  |
| Social-Based      | Trust transitivity          |
| Topic-Based       | Semantic authority          |
| All Accounts + ML | Long-tail exploration       |

**GEO Implication**
Accounts do **not compete globally** at first — they compete *within their source cohort*.
This is critical for **new or niche accounts**.

---

#### B. Blending & Down-Sampling = *Signal Source Trust Weighting*

Weighted blending implies:

> Not all candidates are equal, even before ML ranking.

GEO takeaway:

* **Source-quality matters as much as account-quality**
* GEO must track *where* visibility comes from, not just *how much*

---

#### C. ML Ranking = *Follow Value Prediction*

The ML ranker predicts a score that is a weighted sum of:  
* Follow probability: p(follow|recommendation) — probability user follows the suggested account  
* Retention likelihood: p(positive engagement|follow) — probability of meaningful post-follow interaction (replies, bookmarks, sustained views)
* Negative feedback avoidance

**GEO Implication:** Optimize accounts for retention proxy signals (e.g., historical reply depth, bookmark rate from audience) as much as raw follow probability—Grok/xAI now enriches these predictions for better long-term trust scoring (late 2025+ integration).

This aligns directly with GEO’s **future-signal survivability** model.

[Grok/xAI Enrichment]  
• Semantic authority boost  
• Toxicity/pBlock downranking  
• Retention proxy refinement

---

#### D. Quality Filtering = *Irreversible Trust Gates*

Once filtered:

* Accounts are **not re-ranked**
* They are **removed**

This mirrors the choke-point model used in timeline ranking.

---

## 3. GEOMetrics Scoring Logic

*(Mathematical + Architectural Contract)*

### I. Stage-Based Survivability Model

Account recommendation scoring is **not linear**.

It follows a gated multiplicative model:

```
FinalScore =
  Eligibility
× SourceTrust
× AccountQuality
× NetworkAlignment
× (1 - SuppressionRisk)
```

Where:

* Any zero term collapses the score
* Suppression dominates late stages

---

### II. Stage Contracts

#### Stage 1: Eligibility (Binary Gate)

```
Eligibility = 
  isVisible
∧ notFollowed
∧ notBlocked
∧ notMuted
∧ policySafe
```

Fail = permanent removal.

---

#### Stage 2: Source Trust Weighting

Each candidate source contributes a **prior weight**:

```
SourceTrust =
  Σ (source_i_weight × source_i_confidence)
```

Examples:

* Social-based > Geo-based > Long-tail ML exploration

---

#### Stage 3: Account Quality Scoring

```
AccountQuality =
  w1·semanticAuthority
+ w2·postingConsistency
+ w3·engagementIntegrity
+ w4·profileCompleteness
```

---

#### Stage 4: Network Alignment

```
NetworkAlignment =
  f(mutualConnections,
    RealGraphReciprocity,
    PMI,
    authorityAdjacency)
```

This favors:

* Trust propagation
* Non-sybil growth

---

#### Stage 5: Suppression Risk (Penalty)

```
SuppressionRisk =
  spamProximity
+ followChurnRisk
+ reportLikelihood
+ aggressiveGrowthPenalty
```

High suppression collapses ranking even if quality is high.

---

## 4. Mapping to GEOCoLab Observable Signals

| GEOMetric               | GEOCoLab Observable          |
| ----------------------- | ---------------------------- |
| semanticAuthority       | Topic dominance across posts |
| postingConsistency      | Cadence variance             |
| engagementIntegrity     | Like/reply ratio vs churn    |
| mutualConnectionDensity | Graph overlap                |
| authorityAdjacency      | Proximity to trusted nodes   |
| spamProximityRisk       | Follower graph contamination |
| followChurnRisk         | Follow → unfollow rate       |
| nicheCoherence          | Topic entropy                |
| geoSourceWeight         | Location relevance           |
| pmiScore                | Social co-occurrence         |

---

## 5. GEO Takeaway (Account Systems)

**Account recommendation is trust allocation, not popularity detection.**

X is asking:

> “Which accounts can safely shape this user’s future experience?”

GEO systems must therefore:

* Optimize **long-term signal reliability**
* Penalize unstable growth
* Reward consistent semantic authority

In other words:

> Content wins attention.
> Accounts earn trust.

---

## 6. "Reverse-Engineering: Why Am I (Not) Recommended?" Section 
  A short, creator-facing table to make the doc more GEOCoLab-usable:  

  | Symptom                              | Likely Dominant Gate/Source | GEO Fix Priority                              |
  |--------------------------------------|-----------------------------|-----------------------------------------------|
  | Rarely appear in similar users' WTF  | Failed Source Trust / Suppression | Boost RealGraph reciprocity + reduce churn    |
  | Appear only in geo/local recs        | Geo-Based heavy             | Layer in topic/activity signals for broader reach |
  | High impressions but low follow-through | ML ranker low retention proxy | Increase author-engaged threads & reply depth |
  | Sudden drop in recs                  | Grok/xAI toxicity or churn flag | Audit profile/posts for low-toxicity alignment |

### Summary:

**X's Account Recommendation System** uses a multi-stage pipeline to suggest accounts users might want to follow:

**Key Insights for GEO/Signal Framework:**

1. **Signal Sources (Candidate Generation)**:
   - **Activity-Based**: Engagement patterns (likes, reposts, mentions) drive similarity clustering
   - **Geo-Based**: Location signals prioritize local relevance
   - **Social-Based**: Network effects via phone/email contacts and follow graphs
   - **Topic-Based**: Content alignment with user interests

2. **Signal Processing**:
   - **Weighted Blending**: Different signal sources have quality-based weights
   - **ML Ranking**: Combines user state, language, geo, engagement history, and real-time features
   - **Quality Filters**: Removes spam, NSFW, and low-quality accounts

3. **Critical Signals for Your SignalMetrics**:
   - **Network Authority**: Follow relationships, verified status, mutual connections
   - **Engagement Quality**: Like/repost patterns, profile views, post impressions
   - **Behavioral Consistency**: Login frequency, post cadence, interaction patterns
   - **Contextual Relevance**: Language, location, topics, interests

**Mapping to Your SignalMetrics Interface**:
- `semanticRelevance` ← Topic-based signals, interest alignment
- `followerVerifiedRatio` ← Verified user status filtering
- `mutualConnectionDensity` ← Social-based PMI (Pointwise Mutual Information)
- `citationFrequency` ← Mention tracking, profile view signals
- `nicheCoherence` ← Topic consistency in followed accounts
- `postingCadence` ← User state (DAU/MAU patterns)

**Key Takeaway**: X prioritizes **multi-signal fusion** with quality gates—your GEO framework should similarly blend content, engagement, and network signals while filtering spam through behavioral consistency checks.

---


### Ready Next (Recommended Order)

1. **Mermaid diagram for Account Recommendations**
2. **Unified GEO Scorecard (Content + Account)**
3. **GEOCoLab dashboard mock for “Why am I recommended?”**
4. **Creator playbook: “How to become recommendable”**

Say the word — we keep building.
