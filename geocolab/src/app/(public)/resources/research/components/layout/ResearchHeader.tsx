// geocolab-app/src/app/(public)/research/components/layout/ResearchHeader.tsx
'use client';

import Link from 'next/link';
import type { ContentMetadata } from '../../_data/schema';
import { GEOScoreBadge } from '../ui/GEOScoreBadge';

interface ResearchHeaderProps {
  metadata: ContentMetadata;
}

/**
 * Page header with breadcrumbs and metadata
 */
export function ResearchHeader({ metadata }: ResearchHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex items-center space-x-2 text-sm">
            {metadata.breadcrumb.map((item, index, arr) => (
              <li key={item.url} className="flex items-center">
                {index < arr.length - 1 ? (
                  <>
                    <Link
                      href={item.url}
                      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <svg
                      className="w-4 h-4 mx-2 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <span
                    className="text-gray-900 dark:text-white font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        
        {/* GEO Score Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GEOScoreBadge score={metadata.geo.geoScore} size="sm" />
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Share page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>
            
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Print page"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}