# X's Recommendation Algorithm Guide with GEO Signal Metrics Integration

This enhanced guide builds on the previous version by incorporating insights from the "Summary.md" document (e.g., core architectural patterns like multi-stage funneling, dual-model approaches, graph-based embeddings, negative signal amplification, and temporal feature balancing) and the official GitHub repository at https://github.com/twitter/the-algorithm-ml/tree/main (referred to as the "ML Repo"). The ML Repo focuses on Python-based ML models (99.3% Python), with key projects like `projects/home/recap` (Heavy Ranker for timelines) and `projects/twhin` (TwHIN embeddings). It emphasizes modular, configurable models trained with scripts like `run_local.sh` and synthetic data for privacy, often requiring GPU (via `torchrec`). Insights from the repo's READMEs and structures (e.g., features in FEATURES.md, weights in configs) are integrated to refine correlations with GEO metrics, highlighting real-world implementations like engagement probability predictions and weighted scoring.

The guide retains alignment with `x-recommendations.ts` interfaces while adding a new **GEOSignalMetrics** interface from Summary.md for unified signal processing. GEO (GEOMetrics Engine Optimization) now explicitly correlates with repo elements, such as Heavy Ranker's MaskNet for engagement quality and negative penalties. GEOCoLab diagnostics are strengthened with repo-derived actionables (e.g., tuning weights for spam resistance).

## Insights from Official ML Repository and Summary.md

### Repository Structure and Key Projects
- **Overall Structure**: Organized into shared utilities (`common`, `core`, `ml_logging`, `metrics`, `optimizers`, `reader`, `tools`), deployment (`machines`), and specific projects. Includes CI/CD workflows and environment setup (e.g., `init_venv.sh` for Python 3.x with `torchrec` for GPU acceleration).
- **Key Projects**:
  - `projects/home/recap`: Implements the "For You" Heavy Ranker (MaskNet architecture, ~48M params inferred from scale). Focuses on timeline personalization via engagement predictions.
  - `projects/twhin`: Handles TwHIN embeddings for graph-based representations (users, tweets, etc.), enabling similarity and personalization across systems.
  - Other: `projects/timelines` (not detailed in browsed content, but inferred for aggregates/user features supporting timelines); lacks sub-READMEs in some areas.
- **General Insights**: Models use synthetic data for local training (privacy-focused); configs like `local_prod.yaml` allow dynamic tuning. No explicit Grok/xAI mentions, but evolutions imply iterative weight adjustments (e.g., for negative feedback). Correlates with Summary.md's dual-models (online real-time vs. offline batch) and graph embeddings.

### Integrated Patterns from Summary.md and Repo
- **Multi-Stage Funneling**: Repo's Heavy Ranker exemplifies the funnel (post-candidate retrieval → ranking → heuristics), aligning with Summary.md's wide-net candidate generation to final mixing.
- **Dual-Model Approach**: Repo's online/offline distinction (real-time engagement vs. batch quality) matches Summary.md; e.g., Heavy Ranker combines probabilities in ensemble scores.
- **Graph-Based Embeddings**: TwHIN (dense, heterogeneous graphs) complements SimClusters (sparse communities); used for network authority in GEO.
- **Negative Signal Amplification**: Heavy Ranker assigns large negative weights (e.g., -369 for reports), echoing Summary.md's 2-5x emphasis on dislikes/blocks.
- **Temporal Feature Balance**: Repo features like recency in predictions align with Summary.md's windows (0-8hr real-time, 1-7d short-term, 28-90d long-term).
- **GEO Correlations**: Repo's dwell time (`good_click_v2`: ≥2 min) ties to engagement quality; report probabilities to negative signals; user-tweet features to semantic relevance.

## Key Additions from ML Repo:

 - Heavy Ranker uses MaskNet architecture (~48M parameters)
 - Training uses synthetic data for privacy (create_random_data.sh)
 - Config-driven weight tuning via local_prod.yaml
 - Real-time online learning vs. batch offline models
 - Explicit weight values: reply_engaged_by_author: 75.0, negative_feedback_v2: -74.0, report: -369.0

## New Unified Signal Interface: GEOSignalMetrics

From Summary.md, this interface standardizes signals across systems, correlating with GEO metrics (e.g., `toxicityScore` to negative signals, `semanticRelevance` to content quality). It enhances `XUnifiedSignals` for implementation in @dndhub/geo.

This interface enables cross-system fusion in GEOCoLab (e.g., temporal windows for decay rules).

## Unified Interface: XRecommendationMetrics

This top-level interface encapsulates all surfaces, unified signals, and GEO scoring:

Each sub-interface reflects X's multi-stage architecture, with metrics quantifying signal strength at choke-points. Final scores (0–100) and bands/tiers guide GEOCoLab diagnostics.

## 1. Timeline Recommendations (XTimelineMetrics)

Refer to the 

## 2. Account Recommendations (XAccountMetrics)

Maps to Who to Follow: Candidate generation (activity/geo/social/topic) → blending → ML ranker → filtering. RealGraph for reciprocity (correlates to `realGraphReciprocity`). Negative amplification via author penalties.

**Key Signals**: RealGraph reciprocity, SimClusters similarity, PMI (social co-occurrence).


(Interface unchanged; add: TwHIN embeddings for `pmi` calculations.)

**GEO Integration**: Trust allocation via binary gates and penalties. GEOCoLab: Reverse-engineering (e.g., "Low geoSourceWeight: Build local follows").

## 3. Communities Recommendations (XCommunityMetrics)

Maps to graph-embeddings: Follow Graph → KnownFor clusters (~145K) → InterestedIn → real-time fav updates.

Enhanced: SimClusters from Summary.md (~145K clusters) via graph clustering; TwHIN for dense multi-modal (users/topics). Repo's TwHIN enables sparse-to-dense fusion for `simClusterOverlap`.

**Key Signals**: Cosine similarity, community embeddings, single-affiliation sparsity.


(Interface unchanged; correlate `nicheCoherence` to single-affiliation sparsity.)

**GEO Integration**: Niche coherence rewards focused signals. GEOCoLab: "Weak simClusterOverlap: Increase fav momentum".

## 4. Conversations Recommendations (XConversationMetrics)

Maps to thread linearization: Candidates → hydration → light/heavy rank → filters → branch scoring.

Enhanced: Summary.md's branch scoring (avg node scores) with repo's dwell predictions (e.g., good_click_v2 for thread longevity).

**Key Signals**: Node/branch scores (fav/reply - mutes/reports), tree depth, health labels.

(Interface unchanged; add `conversationContinuation` tied to reply_engaged_by_author.)

**GEO Integration**: Hierarchical scoring with dual engagement. GEOCoLab: Tiers like 'high-confidence' for notifications.

## 5. Explore Recommendations (XExploreMetrics)

Maps to aggregation: Mixer sources (trends/events/videos) → YML config → fetch/filter/rank → post-processing.

Enhanced: Summary.md's multi-source (trends/videos) with repo's engagement weights for diversity.

**Key Signals**: Feedback scores, geographic alignment, Grok summaries.

(Interface unchanged; `grokRelevanceBoost` for potential xAI evolutions, though not in repo.)

**GEO Integration**: Multi-source diversity with video priority (1.4–1.8x). GEOCoLab: Negative velocity penalties.

## 6. Notification Recommendations (XNotificationMetrics)

Maps to funnel: Candidates (~1,400) → light rank → heavy rank (dual models) → quality control → delivery → feedback.

Enhanced: Dual-models from Summary.md/repo; negative signals amplified (e.g., dismissRate to -74 weight proxy).

**Key Signals**: Open/engage probs, 14 feedback types, temporal aggregates.
(Interface unchanged; add temporal windows for `feedbackFatigueRisk`.)

**GEO Integration**: Interrupt risk with cold-start fallbacks. GEOCoLab: Surge protection rules.

## 7. Search Recommendations (XSearchMetrics)

Maps to query flow: Mixer → Ranker → retrieval (~440) → hydration → ranking (engagement + health + relevance) → response.

Enhanced: Summary.md's health/relevance models; repo's TwHIN for query embeddings.

**Key Signals**: Weighted models (engagement: 1.0, health: 0.5, relevance: 0.031), feedback loops.

(Interface unchanged; correlate `semanticConsistency` to userContentSimilarity.)

**GEO Integration**: Intent gates with multimodal boosts. GEOCoLab: Category optimizations (e.g., media dwell).


## 8. Trends Recommendations (XTrendsMetrics)

Maps to detection → retrieval → ranking → feedback.

Enhanced: Velocity/novelty from Summary.md; repo's real-time processing inferred for `engagementVelocity`.

**Key Signals**: Velocity/novelty, credibility filters, cross-platform.

(Interface unchanged; add multimedia fusion via TwHIN.)

**GEO Integration**: Legitimacy via external entropy. GEOCoLab: Roadmap phases for multimodal/audits.

## 9. Spaces Recommendations (XSpacesMetrics)

Maps to topic ML: Data (BigQuery/Redis) → features → prediction → ranking.

Enhanced: Topic-centric from Summary.md; dwell thresholds (>15s) align with repo's video_playback50.

**Key Signals**: Watch duration (>15s), topic overlap, social proof.

(Interface unchanged; `retentionProxy` to good_click_v2.)

**GEO Integration**: Depth metrics (sessionDepth). GEOCoLab: EU non-personalized fallbacks.

## 10. Unified Cross-System Signals (XUnifiedSignals)

Aggregates shared signals for consistency (e.g., `recentVelocity` for 1-hr); repo's features for `realGraphScore`.

**GEO Integration**: Fusion for decay rules (e.g., search failure impacts timeline).

## 11. GEO Composite Score (XGEOScore)

Multiplicative optimization metric.

Enhanced: Repo's weighted sum formula for `overallScore`; add `penalty` from negative_feedback_v2.

```typescript
export interface XGEOScore {
  overallScore: number;
  dimensions: {
    contentQuality: { score: number; components: { semanticRelevance: number; contextDepth: number; originalityScore: number; readability: number; }; };
    engagementQuality: { score: number; components: { dwellTime: number; clickDepth: number; bookmarkRate: number; quoteQuality: number; replyDepth: number; }; };
    networkAuthority: { score: number; components: { followerVerifiedRatio: number; mutualConnectionDensity: number; authorityAdjacency: number; citationFrequency: number; }; };
    behavioralConsistency: { score: number; components: { postingCadence: number; nicheCoherence: number; responseLatency: number; sessionDepth: number; }; };
    negativeSignals: { penalty: number; components: { spamRisk: number; feedbackFatigue: number; reportRate: number; toxicityRisk: number; }; };
  };
  platformScores: { timeline: number; account: number; communities: number; conversations: number; explore: number; notifications: number; search: number; trends: number; spaces: number; };
  competitive: { percentile: number; tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'; improvementPotential: number; };
  recommendations: Array<{ dimension: keyof XGEOScore['dimensions']; currentScore: number; targetScore: number; impact: 'high' | 'medium' | 'low'; actions: string[]; }>;
}
```

(Interface unchanged; GEOCoLab recommendations now include repo-inspired actions: "Adjust reply weights for better engagement quality.")

**Implementation Priorities (from Summary.md + Repo)**:
- **Phase 1**: Build funnel with repo scripts (e.g., create_random_data.sh for testing).
- **Phase 2**: Embeddings via TwHIN training.
- **Phase 3**: Dual-models with weight tuning (e.g., periodic for negatives).
- **Phase 4**: Cross-decay using temporal features.

This aligns X's repo (modular ML) with GEO's trust ethos, enabling optimizable, spam-resistant recommendations in GEOCoLab.

**GEO Integration**: Weighted (e.g., engagement 30%) with penalties. GEOCoLab: Actionable insights (e.g., "Boost replyDepth: Engage more").

**Roadmap**: Phase 1 (extraction) → Phase 4 (cross-decay). This aligns X's repo with GEO's trust ethos for optimizable recommendations.