// geocolab-app/src/app/(public)/research/components/layout/ResearchLayout.tsx
'use client';

import { ReactNode } from 'react';
import { ResearchSidebar } from './ResearchSidebar';
import { ResearchHeader } from './ResearchHeader';
import { ResearchFooter } from './ResearchFooter';
import type { ContentMetadata } from '../../_data/schema';

interface ResearchLayoutProps {
  children: ReactNode;
  metadata: ContentMetadata;
  tableOfContents?: Array<{ id: string; title: string; level: number }>;
}

/**
 * Main layout for research portal pages
 * Follows Fuse React structure with sidebar + main content
 */
export function ResearchLayout({
  children,
  metadata,
  tableOfContents,
}: ResearchLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <ResearchSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 lg:ml-64">
        {/* Header with breadcrumbs */}
        <ResearchHeader metadata={metadata} />

        {/* Content + TOC */}
        <main className="flex-1 px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Main Content */}
            <article className="lg:col-span-9">
              {/* Article Header */}
              <header className="mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {metadata.title}
                </h1>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  {metadata.description}
                </p>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <span>By {metadata.author}</span>
                  <span>•</span>
                  <time dateTime={metadata.lastmod}>
                    Updated {new Date(metadata.lastmod).toLocaleDateString()}
                  </time>
                  <span>•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {calculateReadingTime(metadata)} min read
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </header>

              {/* Dynamic Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {children}
              </div>
            </article>

            {/* Table of Contents Sidebar */}
            {tableOfContents && tableOfContents.length > 0 && (
              <aside className="hidden lg:block lg:col-span-3">
                <div className="sticky top-24">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                    On this page
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                          item.level === 2
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-500 dark:text-gray-400 pl-4'
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </main>

        {/* Footer */}
        <ResearchFooter metadata={metadata} />
      </div>
    </div>
  );
}

/**
 * Helper: Calculate reading time (placeholder)
 */
function calculateReadingTime(metadata: ContentMetadata): number {
  // In production, this would come from content parser
  return 15; // Default 15 min
}