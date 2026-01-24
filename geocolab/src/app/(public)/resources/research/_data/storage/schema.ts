{
    "metadata": {
      "id": "signal-metrics",
      "slug": "signal-metrics",
      "title": "Signal Metrics Glossary",
      "description": "Complete reference for all X algorithm signal metrics including dwell time, report rate, virality index, mutual connection density, and engagement probabilities.",
      "date": "2026-01-22",
      "lastmod": "2026-01-22",
      "author": "Jetro Olowole",
      "tags": ["glossary", "signal-metrics", "x-algorithm", "optimization"],
      "keywords": ["signal metrics", "dwell time", "report rate", "virality index", "engagement probability", "mutual connection density"],
      "schema": {
        "type": "WebPage",
        "name": "Signal Metrics Glossary"
      },
      "citations": [
        {
          "url": "https://github.com/twitter/the-algorithm",
          "title": "X Algorithm Repository"
        }
      ],
      "canonical": "https://geocolab.com/research/glossary/signal-metrics",
      "breadcrumb": [
        {
          "name": "Home",
          "url": "https://geocolab.com"
        },
        {
          "name": "Research",
          "url": "https://geocolab.com/research"
        },
        {
          "name": "Glossary",
          "url": "https://geocolab.com/research/glossary"
        },
        {
          "name": "Signal Metrics",
          "url": "https://geocolab.com/research/glossary/signal-metrics"
        }
      ],
      "geo": {
        "performance": {
          "targetLCP": 2.0,
          "targetFID": 80,
          "bundleSize": 38
        },
        "accessibility": {
          "wcagLevel": "AA",
          "ariaCoverage": 100
        },
        "geoScore": 96
      }
    },
    "sections": [
      {
        "type": "heading",
        "level": 2,
        "content": "Core Engagement Metrics"
      },
      {
        "type": "heading",
        "level": 3,
        "content": "Dwell Time"
      },
      {
        "type": "text",
        "content": "<strong>Definition:</strong> The duration (in seconds) a user views a post before scrolling away or taking another action.<br><br><strong>X Stage:</strong> Scoring (post-retrieval)<br><br><strong>Weight:</strong> Positive correlation with engagement probability. Posts with >2 seconds average dwell time receive higher scores.<br><br><strong>GEO Impact:</strong> Higher dwell time signals semantic relevance and content quality, directly boosting trust score and reducing spam classification risk.<br><br><strong>Optimization Strategies:</strong><ul><li>Use conversational hooks in the first line</li><li>Include visual breaks (line breaks, emojis, bullet points)</li><li>Structure content in Q&A format for scannability</li><li>Add multimedia (images, videos) to increase engagement time</li></ul><br><strong>Citation:</strong> <code>geocolab.com/research/glossary/signal-metrics#dwell-time</code>"
      },
      {
        "type": "heading",
        "level": 3,
        "content": "Report Rate"
      },
      {
        "type": "text",
        "content": "<strong>Definition:</strong> The ratio of negative reports (spam, abuse, misinformation flags) to total impressions, expressed as a percentage.<br><br><strong>X Stage:</strong> Filters (pre-mixing)<br><br><strong>Penalty:</strong> -369 weighted score impact per report. Report rates above 2% trigger pre-scoring filters; 5%+ results in shadow-ban from For You timelines.<br><br><strong>GEO Impact:</strong> Trust score degradation. High report rates permanently damage account authority, making future posts less visible even after appeals.<br><br><strong>Mitigation Strategies:</strong><ul><li>Avoid controversial claims in high-risk niches (politics, unverified health advice)</li><li>Use disclaimers for financial/medical content</li><li>Monitor report rate via Twitter Analytics</li><li>Appeal false reports immediately through X's support system</li><li>Build gradual authority before posting polarizing content</li></ul><br><strong>Related:</strong> See <a href='/research/playbooks/risk/spam-avoidance'>Spam Avoidance Playbook</a><br><br><strong>Citation:</strong> <code>geocolab.com/research/glossary/signal-metrics#report-rate</code>"
      },
      {
        "type": "heading",
        "level": 3,
        "content": "Virality Index"
      },
      {
        "type": "text",
        "content": "<strong>Definition:</strong> Viral impressions (from retweets, quote tweets) divided by total impressions. Measures how far content spreads beyond the original author's network.<br><br><strong>X Stage:</strong> Mixing (final ranking adjustment)<br><br><strong>Weight:</strong> Exponential boost above 20% virality. Posts with 40%+ virality index receive 2-3x impression multiplier in For You timelines.<br><br><strong>GEO Impact:</strong> High virality signals social proof and authority, increasing trust score. However, rapid virality (>60% in <1 hour) triggers spam filters for manual review.<br><br><strong>Optimization Strategies:</strong><ul><li>Craft shareable hooks (controversial takes, data visualizations, actionable tips)</li><li>Time posts for peak audience activity (use X Analytics)</li><li>Engage with high-authority accounts to seed retweets</li><li>Use viral formats (threads, polls, memes)</li><li>Balance virality with low report rate (target: >40% virality, <1% reports)</li></ul><br><strong>Citation:</strong> <code>geocolab.com/research/glossary/signal-metrics#virality-index</code>"
      },
      {
        "type": "heading",
        "level": 2,
        "content": "Network Metrics"
      },
      {
        "type": "heading",
        "level": 3,
        "content": "Mutual Connection Density"
      },
      {
        "type": "text",
        "content": "<strong>Definition:</strong> The percentage of your followers who also follow each other (network clustering coefficient). High density (>30%) indicates a tight-knit community.<br><br><strong>X Stage:</strong> Retrieval (candidate selection) and Scoring (real graph score)<br><br><strong>Weight:</strong> Posts from accounts with high mutual connection density receive 1.5-2x boost in For You timelines for users within that network.<br><br><strong>GEO Impact:</strong> Stronger real graph score reduces reliance on virality for visibility. Accounts with 40%+ mutual connection density can achieve consistent reach without going viral.<br><br><strong>Optimization Strategies:</strong><ul><li>Engage consistently with your niche community (replies, quote tweets)</li><li>Host X Spaces or panel discussions to strengthen connections</li><li>Use lists to organize and engage with key mutual connections</li><li>Avoid follow-for-follow schemes (artificially lowers density)</li></ul><br><strong>Citation:</strong> <code>geocolab.com/research/glossary/signal-metrics#mutual-connection-density</code>"
      },
      {
        "type": "heading",
        "level": 2,
        "content": "Engagement Probabilities"
      },
      {
        "type": "text",
        "content": "Phoenix scorer predicts multiple engagement probabilities for each post. These are used in weighted scoring calculations:"
      },
      {
        "type": "table",
        "columns": ["Probability", "Description", "Weight", "Optimization Tip"],
        "rows": [
          ["Reply (author engaged)", "Likelihood original author replies to your reply", "75", "Ask thoughtful questions"],
          ["Reply (general)", "Likelihood of any reply", "13.5", "Use open-ended hooks"],
          ["Retweet probability", "Likelihood of retweet", "20", "Shareable insights"],
          ["Like probability", "Likelihood of like/favorite", "10", "Emotional resonance"],
          ["Profile click probability", "Likelihood user visits profile", "12", "Strong bio + pinned post"],
          ["Video playback (50%)", "Likelihood user watches 50%+ of video", "8", "Hook in first 3 seconds"]
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "content": "Related Resources"
      },
      {
        "type": "list",
        "content": "unordered",
        "items": [
          "<a href='/research/x-algorithm/weighted-scoring'>Weighted Scoring System</a> - How metrics combine into final scores",
          "<a href='/research/x-algorithm/phoenix-scorer'>Phoenix Scorer</a> - Neural network architecture for probability prediction",
          "<a href='/research/playbooks/growth/daily-engagement'>Daily Engagement Playbook</a> - Routines to optimize these metrics"
        ]
      }
    ],
    "relatedContent": [
      {
        "title": "X Algorithm Weighted Scoring",
        "url": "/research/x-algorithm/weighted-scoring",
        "description": "How signal metrics combine into final post scores"
      },
      {
        "title": "Phoenix Scorer Architecture",
        "url": "/research/x-algorithm/phoenix-scorer",
        "description": "Neural network for engagement probability prediction"
      },
      {
        "title": "Daily Engagement Playbook",
        "url": "/research/playbooks/growth/daily-engagement",
        "description": "Tactical routines to optimize signal metrics"
      }
    ]
}