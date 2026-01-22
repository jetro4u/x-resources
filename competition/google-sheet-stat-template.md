# Google Sheet Competition Stat Template Structure

## **Tab 1: Participant Tracker (Replaces Active Batch Tracker)**

| Column | Header | Formula/Type | New Purpose |
|--------|--------|--------------|-------------|
| A | Handle | Text | @username |
| B | Platform | Dropdown (Twitter, LinkedIn, etc.) | Multi-platform support |
| C | Account Type | Auto-fetch | Premium/Free |
| D | Primary Niche | AI-detected | From bio analysis |
| E | Signal Strength | Auto-calc | 0-100 composite score |
| F | Baseline Score | Number | Day 1 snapshot |
| G | Current Score | Auto-update | Real-time |
| H | Improvement | `=G2-F2` | Delta |
| I | Rank | `=RANK(G2,G:G,0)` | Leaderboard |
| J | Spam Risk | Auto-calc | 0-100 (lower better) |
| K | Challenge Points | `=SUMIF('Points'!A:A,A2,'Points'!C:C)` | Total earned |
| L | Deliverables Done | Checkbox count | Progress tracker |
| M | Status | Dropdown (Active, Completed, Dropped) | Lifecycle |

**New Columns vs Old:**
- **Platform** (new): Multi-platform tracking
- **Signal Strength** (replaces "Follow Back Date"): Focus on quality
- **Improvement** (new): Growth metric
- **Spam Risk** (new): Anti-gaming measure

---

## **Tab 2: Signal Metrics Dashboard (Replaces Member Directory)**

| Column | Header | Formula | Purpose |
|--------|--------|---------|---------|
| A | Handle | Text | @username |
| B | Overall Signal | Number (0-100) | Composite score |
| C | Semantic Relevance | Auto-calc | Topic coherence |
| D | Context Depth | Auto-calc | Engagement quality |
| E | Authority Score | Auto-calc | Thought leadership |
| F | Citation Count | Auto-calc | Times mentioned |
| G | Content Quality | Auto-calc | Post analysis |
| H | Network Quality | Auto-calc | Follower verification ratio |
| I | Spam Penalty | Number (0-1) | Multiplier deduction |
| J | Final Score | `=B2*I2` | After penalties |

**New Metrics vs Old:**
- All columns new (old tab was follower-focused)
- Emphasizes **qualitative signals** over follower count

---

## **Tab 3: Competition Deliverables (Replaces Point Leaderboard)**

| Column | Header | Type | Purpose |
|--------|--------|------|---------|
| A | Handle | Text | @username |
| B | Deliverable Type | Dropdown (Thread, Article, etc.) | What was created |
| C | URL | Hyperlink | Link to content |
| D | Submission Date | Date | When submitted |
| E | Grok Score | Auto-calc (0-100) | AI quality rating |
| F | Engagement | Number | Likes + Comments + Shares |
| G | Citations | Number | Times others referenced |
| H | Bonus Points | Number | Extra rewards |
| I | Status | Dropdown (Pending, Approved, Rejected) | Review state |

**New vs Old:**
- **Deliverables focus** (old was points leaderboard)
- **Grok scoring** for quality validation

---

## **Tab 4: Points Log (Enhanced)**

| Column | Header | Type | Changes |
|--------|--------|------|---------|
| A | Timestamp | Auto `=NOW()` | Same |
| B | Handle | Text | Same |
| C | Action Type | **NEW Dropdown** | Added "Citation Received", "Grok Bonus" |
| D | Points Earned | Number | Same |
| E | Description | Text | Same |
| F | Verified By | **NEW Options** | Auto (Grok) / Manual |
| G | Signal Impact | **NEW Number** | +/- to signal score |

**New Point Values:**

| Action | Old Points | New Points | Signal Impact |
|--------|-----------|----------|---------------|
| Follow | 2 | **1** (de-emphasized) | +0.5 |
| High-Quality Comment | 3 | **10** | +3 |
| Cited by Others | N/A | **25** | +10 |
| Grok Bonus (>80 content score) | N/A | **50** | +15 |
| Deliverable (Thread) | N/A | **100** | +20 |
| Profile Optimization | N/A | **50** | +10 |

---

## **Tab 5: Citation Network (New)**

| Column | Header | Type | Purpose |
|--------|--------|------|---------|
| A | Your Handle | Text | Participant |
| B | Cited By | Text | Who mentioned you |
| C | Citation Type | Dropdown (Mention, Quote, Thread Link) | How cited |
| D | Their Follower Count | Number | Authority weight |
| E | Citation URL | Hyperlink | Evidence |
| F | Date | Date | Tracking |
| G | You Cited | Text | Reciprocity tracking |

---