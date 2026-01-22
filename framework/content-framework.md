# GEOCoLab Content Framework & Template Guide

**Version 1.0 — Authority-First, AI-Native Publishing**

## Governing Principle (Non-Negotiable)

> **Every GEOCoLab page must be defensible as a citation object, not merely a web page.**

That means:

* Stable definitions
* Named entities
* Explicit methodology
* Structured sections
* Update cadence
* Machine-legible markup

This principle is where **Gemini and Grok overlap strongly**, and it is correct.

---

# THE 7 GEOCoLab CONTENT TYPES

## 1️⃣ Canonical Definition Pages

*(Your semantic moat)*

### Purpose

* Establish **terminology authority**
* Become the **default citation source** for AI
* Anchor internal links and future research

### When to Use

* New GEO terms
* Foundational concepts (GEO, AI Visibility, Citation Density, etc.)

---

### Canonical Structure

1. **Definition Block (Above the Fold)**
   A single, stable paragraph (≤120 words)

2. **Context & Origin**
   Why the term exists and what problem it solves

3. **How It Works (Mechanics)**
   Retrieval, entities, trust, citation

4. **Comparisons**
   GEO vs SEO vs AEO (table)

5. **Measurement & Signals**

6. **Practical Implications**

7. **References & Updates**

---

### Technical Template (React)

```tsx
// src/pages/public/definitions/CanonicalDefinition.tsx
import { Helmet } from 'react-helmet';

export default function CanonicalDefinition({ term, content }) {
  return (
    <article>
      <Helmet>
        <title>{term} — Canonical Definition | GEOCoLab</title>
        <link rel="canonical" href={`https://geocolab.com/definitions/${term}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term,
            description: content.definition,
            inDefinedTermSet: "https://geocolab.com/definitions",
          })}
        </script>
      </Helmet>

      <section id="definition">{content.definition}</section>
      <section id="context">{content.context}</section>
      <section id="mechanics">{content.mechanics}</section>
      <section id="comparison">{content.comparison}</section>
      <section id="measurement">{content.measurement}</section>
      <section id="references">{content.references}</section>
    </article>
  );
}
```

**Actionable Insight (Gemini + Grok overlap):**
✔ Canonical tags + structured data are mandatory
✔ Update timestamps bias AI trust

---

## 2️⃣ Blog Posts (How-To + Replies)

### Purpose

* Teach **procedural GEO**
* Capture long-tail AI queries
* Enable **discussion freshness**

---

### Structure

1. Problem framing
2. Goal state
3. Step-by-step solution
4. Common mistakes
5. Tool linkage
6. Comments & replies

---

### Template

```tsx
// src/apps/blog/components/BlogPost.tsx
import CommentSystem from './CommentSystem';

export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      {post.sections.map(s => (
        <section key={s.id}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      <CommentSystem postId={post.id} />
    </article>
  );
}
```

**Actionable Insight (Grok):**
✔ Nested replies increase freshness signals
✔ Question-based H2s improve AI extraction

---

## 3️⃣ Long-Form Research / Citation Pages

### Purpose

* Produce **citable evidence**
* Replace whitepapers
* Anchor original frameworks

---

### Structure

1. Abstract (bullet summary)
2. Research question
3. Methodology
4. Findings (numbered)
5. Implications
6. Limitations
7. References

---

### Template

```tsx
// src/pages/public/research/ResearchPaper.tsx
export default function ResearchPaper({ paper }) {
  return (
    <article>
      <section id="abstract">{paper.abstract}</section>
      <section id="methodology">{paper.methodology}</section>
      <section id="findings">{paper.findings}</section>
      <section id="implications">{paper.implications}</section>
      <section id="limitations">{paper.limitations}</section>
    </article>
  );
}
```

**Actionable Insight (Gemini):**
✔ Data tables + metrics panels dramatically improve citation likelihood
✔ Neutral tone > marketing tone

---

## 4️⃣ Case Studies

### Purpose

* Demonstrate **causality**
* Support consulting conversions
* Feed example-based AI reasoning

---

### Structure

1. Context
2. Problem
3. Intervention
4. Results
5. Learnings

---

### Template

```tsx
// src/apps/case-studies/components/CaseStudyDetail.tsx
export default function CaseStudy({ data }) {
  return (
    <article>
      <h1>{data.title}</h1>
      <section>{data.problem}</section>
      <section>{data.solution}</section>
      <section>{data.results}</section>
    </article>
  );
}
```

**Actionable Insight (Grok):**
✔ Before/after metrics outperform testimonials alone

---

## 5️⃣ Consulting Service Pages

### Purpose

* Convert **high-intent AI referrals**
* Clarify scope & outcomes

---

### Structure

1. Who it’s for
2. Problem it solves
3. Process
4. Deliverables
5. Proof
6. CTA

---

### Template

```tsx
// src/pages/public/services/GEOConsulting.tsx
export default function GEOConsulting() {
  return (
    <section>
      <h1>GEO Consulting Services</h1>
      <ol>
        <li>Audit</li>
        <li>Optimize</li>
        <li>Track</li>
      </ol>
    </section>
  );
}
```

**Actionable Insight (Gemini):**
✔ Services tied to **index inclusion** convert better than generic audits

---

## 6️⃣ Tools Landing Pages

### Purpose

* Explain **why the tool exists**
* Convert curiosity → usage
* Teach AI what the tool does

---

### Structure

1. What it measures
2. Why it matters
3. How it works
4. Sample output
5. Use cases
6. CTA

---

### Template

```tsx
// src/pages/public/ToolLandingPages/VisibilityScoreLanding.tsx
export default function VisibilityScoreLanding() {
  return (
    <section>
      <h1>AI Visibility Score</h1>
      <p>Measure how AI engines see your business.</p>
    </section>
  );
}
```

---

## 7️⃣ GEO Authority Index™ (City × Industry Rankings)

> **This is the most strategic addition.**

This series is:

* The *opposite* of Local SEO
* A **machine-legible authority dataset**
* A future paid product

---

### Naming (Bias-Aware Synthesis)

Instead of locking into one name, use:

**Primary Brand:**

### **GEO Authority Index™**

**Public Titles (Flexible):**

* “GEO Authority Index™: Law Firms in New York”
* “2026 AI Visibility Index: Healthcare Providers in London”

This incorporates:

* Gemini’s *accessibility concern*
* Grok’s *SEO discoverability*

---

### URL Pattern

```
/geo-authority-index/{city}/{industry}
```

---

### Ranking Page Structure

1. Authority summary
2. Methodology
3. Ranked list (Top 10)
4. Comparison table
5. Observed patterns
6. How to improve ranking
7. Disclosure

---

### Ranking Page Template (with code)

```tsx
// src/pages/public/geo-authority-index/IndexPage.tsx
import { Helmet } from 'react-helmet';

export default function AuthorityIndex({ city, industry, rankings }) {
  return (
    <article>
      <Helmet>
        <title>{`GEO Authority Index™: ${industry} in ${city}`}</title>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: rankings.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: r.name,
            })),
          })}
        </script>
      </Helmet>

      <section id="methodology">
        Ranked using @dndhub/geo metrics: visibility, citation density, entity clarity.
      </section>

      <section id="rankings">
        {rankings.map((r, i) => (
          <div key={r.id}>
            <h3>#{i + 1} {r.name}</h3>
            <p>GEO Score: {r.score}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
```

---

### Actionable Insights from Gemini & Grok (No Bias)

✔ **Gemini is right** about badges
→ Add a `GEOIndexBadge.tsx` component to create backlinks

✔ **Grok is right** about freshness
→ Update rankings quarterly and show timestamps

✔ Both are right about:

* Schema.org ItemList
* Defensible methodology
* Data > opinion

---

# FINAL SUMMARY

You now have:

* A **7-type content constitution**
* A **ranking series that AI engines want**
* A **technical blueprint aligned with your app**
* A framework that can scale into:

  * APIs
  * Subscriptions
  * Paid inclusion audits

This is not content marketing.
This is **infrastructure for AI authority**.

---

## Next (Choose One)

1️⃣ Write the **first GEO Authority Index™ page**
2️⃣ Define the **ranking algorithm & weights**
3️⃣ Create an **admin workflow for publishing these pages**
4️⃣ Integrate this framework into your **30-day campaign calendar**

Say the word — we build.
