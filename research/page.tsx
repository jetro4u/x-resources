// geocolab-app/src/app/(public)/research/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllSections } from './api/content';
import { generateOrganizationStructuredData } from './lib/structured-data';

/**
 * Research Hub landing page
 * Entry point for all research content
 */
export const metadata: Metadata = {
  title: 'GEOCoLab Research Hub | X Algorithm, Signal Frameworks & Growth Strategies',
  description: 'Comprehensive research on X algorithm, signal optimization, growth competitions, and tactical playbooks for creators and enterprises.',
  keywords: ['x algorithm', 'signal vs spam', 'geo optimization', 'growth strategies', 'phoenix scorer'],
  openGraph: {
    title: 'GEOCoLab Research Hub',
    description: 'Authority on X algorithm research and signal optimization',
    url: 'https://geocolab.com/research',
    siteName: 'GEOCoLab',
    type: 'website',
  },
  alternates: {
    canonical: 'https://geocolab.com/research',
  },
};

export default async function ResearchPage() {
  const sections = await getAllSections();
  
  return (
    <>
      {/* Schema.org Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationStructuredData()),
        }}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-900 dark:to-gray-900">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                GEOCoLab Research Hub
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                Authoritative research on X algorithm mechanics, signal optimization frameworks,
                and growth strategies for creators and enterprises.
              </p>
              
              {/* Search Bar */}
              <div className="mt-8 max-w-xl mx-auto">
                <form className="flex gap-2">
                  <input
                    type="search"
                    placeholder="Search research topics..."
                    className="flex-1 px-4 py-3 rounded-lg border-2 border-blue-500 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Search research"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sections Grid */}
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.id}
                href={`/research/${section.id}`}
                className="group p-6 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {section.description}
                    </p>
                    
                    <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                      Explore research
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Featured Content */}
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Featured Research
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/research/x-algorithm/weighted-scoring"
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                X Algorithm
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Weighted Scoring System
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How X assigns numerical weights to every user action
              </p>
            </Link>
            
            <Link
              href="/research/signal-frameworks/532-soccer-formation/overview"
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Signal Frameworks
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                5:3:2:1+ Soccer Formation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Proprietary framework for Signal > Spam optimization
              </p>
            </Link>
            
            <Link
              href="/research/competitions/x-algo-soccer-formation/rules-and-scoring"
              className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <span className="inline-block px-3 py-1 mb-3 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Competitions
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Growth Competition Rules
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Detailed scoring, penalties, and formation tactics
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}