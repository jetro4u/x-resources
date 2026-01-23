import React, { useState } from 'react';
import { Download, Clock, Target, CheckCircle2, AlertCircle } from 'lucide-react';

const playbookData = {
  title: "Daily Engagement Playbook: 30-Min X Optimization Routine",
  category: "Growth",
  geoScore: 94,
  readingTime: 10,
  objective: "Sustain 5-10% weekly follower growth + 2x engagement rate with 30 min/day investment",
  dailyRoutine: [
    {
      time: "Morning (8-9 AM)",
      duration: "10 min",
      activity: "Reply Blitz",
      signal: "Reply + Author Response (+75)",
      steps: [
        "Check notifications for replies to last 3 posts",
        "Respond to ALL comments within 10 min",
        "Add value: Ask follow-ups or share insights",
        "Track which replies spark secondary threads"
      ]
    },
    {
      time: "Midday (12-1 PM)",
      duration: "10 min",
      activity: "Content Post + Engagement",
      signal: "Dwell Time (+10), Profile Visits (+12)",
      steps: [
        "Compose post with hook and 'Show More' expansion",
        "Add video (10-60 sec) or carousel image",
        "Post with CTA: 'Reply with your [X]'",
        "Engage for 5 min: Like replies, retweet related content"
      ]
    },
    {
      time: "Evening (6-7 PM)",
      duration: "10 min",
      activity: "Conversation Threading",
      signal: "Bookmarks (+50), Conversation Click (+11)",
      steps: [
        "Find posts with 10+ replies",
        "Add 3-5 tweet thread with data/frameworks",
        "End with 'Bookmark this thread for [use case]'",
        "Engage in 2-3 active conversations"
      ]
    }
  ],
  metrics: {
    target: "5-10% weekly follower growth",
    replyRate: ">50%",
    dwellTime: ">90 sec",
    bookmarkRate: ">10% of impressions"
  }
};

export default function InteractivePlaybookView() {
  const [completedSteps, setCompletedSteps] = useState<{[key: string]: boolean}>({});
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [activeSession, setActiveSession] = useState<number | null>(null);

  const toggleStep = (key: string) => {
    setCompletedSteps(prev => ({...prev, [key]: !prev[key]}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Playbook Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {playbookData.category}
                </span>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
                  <span className="text-sm font-semibold text-green-700">
                    GEO Score: {playbookData.geoScore}
                  </span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {playbookData.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{playbookData.readingTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>30 min daily commitment</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Objective Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Playbook Objective</h2>
          </div>
          <p className="text-lg mb-4">{playbookData.objective}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(playbookData.metrics).map(([key, value]) => (
              <div key={key} className="bg-white/10 rounded-lg p-3 backdrop-blur">
                <div className="text-xs uppercase tracking-wide opacity-90">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-lg font-bold mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Routine Sessions */}
        <div className="space-y-4 mb-8">
          {playbookData.dailyRoutine.map((session, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={() => setActiveSession(activeSession === idx ? null : idx)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-blue-600">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {session.activity}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{session.time}</span>
                          <span>•</span>
                          <span>{session.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-blue-600 mb-1">
                      Target Signal
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {session.signal}
                    </div>
                  </div>
                </div>
              </button>

              {activeSession === idx && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="mt-4 space-y-3">
                    {session.steps.map((step, stepIdx) => {
                      const stepKey = `${idx}-${stepIdx}`;
                      const isCompleted = completedSteps[stepKey];
                      
                      return (
                        <div
                          key={stepIdx}
                          onClick={() => toggleStep(stepKey)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                          <span className={`flex-1 ${isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Pro Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Use templates for common replies, but personalize with names</li>
                <li>• Track response times — aim for &lt;30 min average</li>
                <li>• Test different posting times based on your cluster activity</li>
                <li>• Weekly review: Identify top-performing post formats</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download Modal */}
        {showDownloadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Download Playbook</h3>
              <p className="text-gray-700 mb-6">
                PDF downloads with tactical templates are available for Pro and Premium subscribers.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
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