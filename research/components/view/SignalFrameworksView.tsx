import { useState } from 'react';
import { ChevronDown, Star, Clock, Share2 } from 'lucide-react';

// Sample data for demonstration
const sampleContent = {
  title: "5-3-2 Soccer Formation: X Algorithm Architecture",
  geoScore: 95,
  readingTime: 8,
  introduction: {
    lead: "The X algorithm functions like a 5-3-2 soccer formation: 5 defensive signals filter spam, 3 midfield signals orchestrate engagement, and 2 forward signals drive viral reach.",
    body: "This framework maps X's multi-signal ranking system to soccer tactics, making complex algorithmic behaviors tangible through positional roles, passing patterns, and strategic formations."
  },
  sections: [
    {
      heading: "Why Soccer Formation?",
      type: "text",
      content: "Soccer formations provide a proven mental model for understanding coordinated systems with defensive lines (spam filters), midfield control (engagement prediction), and attacking force (viral amplification)."
    },
    {
      heading: "Formation Breakdown",
      type: "list",
      items: [
        {
          title: "5 Defenders (Spam & Quality Gates)",
          details: "Block offensive content (-80% reach), link spam (-50%), duplicate posts, report flags, and mute/block actions"
        },
        {
          title: "3 Midfielders (Engagement Orchestrators)",
          details: "SimClusters topical relevance, dwell time (2+ min = +10), profile visits (+12), recency bias, media type scoring"
        },
        {
          title: "2 Forwards (Viral Amplifiers)",
          details: "Reply + author response (+75), standalone replies (+13.5), highest-weight signals drive distribution"
        }
      ]
    },
    {
      heading: "Strategic Formations",
      type: "table",
      data: {
        headers: ["Formation", "Tactic", "Use Case"],
        rows: [
          ["5-3-2 (Default)", "Balanced defense + engagement", "Daily tweets, broad audiences"],
          ["4-4-2 (Aggressive)", "More midfield orchestration", "Viral campaigns, trending topics"],
          ["3-5-2 (Ultra-Attack)", "Minimal defense, max replies", "Community threads, AMAs"]
        ]
      }
    }
  ],
  faq: [
    {
      question: "Why does X use a soccer metaphor internally?",
      answer: "The formation framework simplifies signal coordination for engineers. Just as coaches adjust tactics mid-game, X's system dynamically reweights signals based on user behavior patterns."
    },
    {
      question: "Can I 'break' the formation?",
      answer: "No. Spamming replies to game the +75 signal triggers defensive penalties (mute/block actions), collapsing the formation. Authentic engagement sustains the tactic."
    }
  ]
};

export default function InteractiveSignalFrameworksView() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
              <Star className="w-4 h-4 text-green-700" />
              <span className="text-sm font-semibold text-green-700">
                GEO Score: {sampleContent.geoScore}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{sampleContent.readingTime} min read</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {sampleContent.title}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl font-semibold text-gray-800 mb-3">
              {sampleContent.introduction.lead}
            </p>
            <p className="text-gray-700">{sampleContent.introduction.body}</p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                bookmarked 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              {bookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-6">
          {sampleContent.sections.map((section, idx) => (
            <section key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {section.heading}
              </h2>
              
              {section.type === 'text' && (
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              )}

              {section.type === 'list' && section.items && (
                <div className="space-y-4">
                  {section.items.map((item, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-gray-700">{item.details}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.type === 'table' && section.data && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {section.data.headers.map((header, i) => (
                          <th
                            key={i}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.data.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          {row.map((cell, j) => (
                            <td key={j} className="px-6 py-4 text-sm text-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {sampleContent.faq.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-semibold text-gray-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 text-gray-700">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Related Content */}
        <aside className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Continue Learning
          </h3>
          <div className="grid gap-3">
            {["Formation Roles Deep Dive", "Weighted Scoring System", "Daily Engagement Playbook"].map((title, i) => (
              <a
                key={i}
                href="#"
                className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="font-semibold text-gray-900">{title}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {i === 0 ? "Signal Frameworks" : i === 1 ? "X Algorithm" : "Playbooks"}
                </div>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}