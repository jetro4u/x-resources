// geocolab-app/src/app/(public)/research/components/layout/ResearchFooter.tsx
'use client';

import Link from 'next/link';
import type { ContentMetadata } from '../../_data/schema';

interface ResearchFooterProps {
  metadata: ContentMetadata;
}

/**
 * Page footer with edit links and metadata
 */
export function ResearchFooter({ metadata }: ResearchFooterProps) {
  const lastUpdated = new Date(metadata.lastmod).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Metadata */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              Last updated: <time dateTime={metadata.lastmod}>{lastUpdated}</time>
            </span>
            <span>•</span>
            <span>Author: {metadata.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              GEO Score: {metadata.geo.geoScore}/100
            </span>
          </div>
        </div>
        
        {/* Citations */}
        {metadata.citations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Citations & References
            </h3>
            <ul className="space-y-1 text-sm">
              {metadata.citations.map((citation, index) => (
                <li key={index}>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {citation.title}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4 pb-8 text-sm">
          <Link
            href={`https://github.com/jetro4u/geocolab-app/edit/main/src/app/(public)/research/_data/${metadata.slug}.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit on GitHub
          </Link>
          
          <Link
            href={`https://x.com/intent/tweet?url=${encodeURIComponent(metadata.canonical)}&text=${encodeURIComponent(metadata.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            Share on X
          </Link>
          
          <button
            type="button"
            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            onClick={() => {
              const issue = `**Page**: ${metadata.canonical}%0A**Issue**: [Describe the issue]`;
              window.open(`https://github.com/jetro4u/geocolab-app/issues/new?title=Issue with ${encodeURIComponent(metadata.title)}&body=${issue}`, '_blank');
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Report Issue
          </button>
        </div>
        
        {/* Copyright */}
        <div className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
          <p>
            © {new Date().getFullYear()} GEOCoLab. Licensed under{' '}
            <Link
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="license noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              CC BY 4.0
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}