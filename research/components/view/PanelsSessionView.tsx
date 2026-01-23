import { useState } from 'react';
import { Calendar, Clock, Users, PlayCircle, Download, ChevronRight } from 'lucide-react';

const panelData = {
  title: "Session 1: The 5-3-2 Formation Revealed",
  sessionNumber: 1,
  date: "January 18, 2026",
  duration: "90 min",
  geoScore: 87,
  summary: {
    lead: "In our inaugural session, panelists decoded X's newly open-sourced algorithm, mapping 100+ signals to the 5-3-2 soccer formation framework.",
    keyTakeaways: [
      "Reply + Author Response signal (+75) is 150x more powerful than likes (+0.5)",
      "Link penalties (-50% reach) can be avoided by placing URLs in bio or first reply",
      "SimClusters topical matching determines 70% of For You feed distribution",
      "Spam penalties are cumulative — a single flag can suppress reach for 30 days"
    ]
  },
  panelists: [
    {
      name: "Sarah Chen",
      role: "X Growth Strategist",
      handle: "@sarahchengrowth",
      bio: "Scaled 12 accounts to 100K+ followers using algorithmic tactics."
    },
    {
      name: "Marcus Williams",
      role: "ML Engineer",
      handle: "@marcuswilliamsAI",
      bio: "Contributed to open-source algorithm analysis at Meta."
    },
    {
      name: "Elena Rodriguez",
      role: "Content Creator",
      handle: "@elenaonX",
      bio: "250K followers in tech/AI niche."
    }
  ],
  segments: [
    {
      title: "Opening: Why Soccer Formation?",
      timestamp: "00:00-15:00",
      summary: "Marcus explains how X's multi-signal architecture mirrors coordinated team sports with defenders, midfielders, and forwards."
    },
    {
      title: "Defensive Signals Deep Dive",
      timestamp: "15:00-40:00",
      summary: "Sarah shares case studies of link tax recovery and duplicate post shadow bans."
    },
    {
      title: "Midfield Orchestration (SimClusters)",
      timestamp: "40:00-65:00",
      summary: "Elena demonstrates live SimClusters analysis and dwell time engineering tactics."
    },
    {
      title: "Forward Amplification (Reply Strategy)",
      timestamp: "65:00-85:00",
      summary: "All panelists share reply velocity tactics and multi-turn conversation techniques."
    }
  ],
  templates: [
    {
      name: "Reply Velocity Tracker",
      description: "Monitor comment response times and +75 signal capture"
    },
    {
      name: "SimClusters Audit Worksheet",
      description: "Identify your top 3 clusters and align content strategy"
    }
  ]
};

export default function InteractivePanelView() {
  const [showRecording, setShowRecording] = useState(false);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Session Header */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur">
              Session {panelData.sessionNumber}
            </span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur">
              <span className="text-sm font-semibold">
                GEO Score: {panelData.geoScore}
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-6">
            {panelData.title}
          </h1>

          <div className="flex flex-wrap gap-6 mb-6 text-white/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{panelData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{panelData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{panelData.panelists.length} Panelists</span>
            </div>
          </div>

          <button
            onClick={() => setShowRecording(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-colors font-semibold shadow-lg"
          >
            <PlayCircle className="w-5 h-5" />
            Watch Recording (Pro/Premium)
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Session Summary
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            {panelData.summary.lead}
          </p>
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              🎯 Key Takeaways
            </h3>
            <div className="space-y-2">
              {panelData.summary.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-purple-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700 flex-1">{takeaway}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panelists */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Panel Experts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {panelData.panelists.map((panelist, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {panelist.name.charAt(0)}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">
                  {panelist.name}
                </h3>
                <p className="text-sm text-purple-600 font-medium mb-2">
                  {panelist.role}
                </p>
                <a
                  href={`https://x.com/${panelist.handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mb-3 block"
                >
                  {panelist.handle}
                </a>
                <p className="text-sm text-gray-600">
                  {panelist.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Session Segments */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Session Segments
          </h2>
          <div className="space-y-3">
            {panelData.segments.map((segment, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setActiveSegment(activeSegment === idx ? null : idx)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-mono rounded">
                          {segment.timestamp}
                        </span>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {segment.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">{segment.summary}</p>
                    </div>
                    <ChevronRight
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        activeSegment === idx ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                {activeSegment === idx && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <div className="p-4 bg-white rounded-lg">
                      <p className="text-gray-700">
                        💡 This segment covered practical tactics and real-world case studies. 
                        Watch the full recording to see live demonstrations and Q&A.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Templates */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Download Tactical Templates</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {panelData.templates.map((template, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-lg p-5">
                <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-white/90 text-sm mb-4">{template.description}</p>
                <button className="text-sm font-semibold hover:underline">
                  Download →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recording Modal */}
        {showRecording && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Access Recording</h3>
                <p className="text-gray-600">
                  Session recordings are available for Pro and Premium subscribers.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  ✨ Upgrade to access all past sessions + tactical templates + exclusive Q&A
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRecording(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}