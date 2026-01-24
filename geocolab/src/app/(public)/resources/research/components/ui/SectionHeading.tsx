// geocolab-app/src/app/(public)/research/components/ui/SectionHeading.tsx
'use client';

import { ReactNode } from 'react';

interface SectionHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Semantic heading component with anchor links
 * WCAG 2.2 AA compliant with proper heading hierarchy
 */
export function SectionHeading({
  level = 2,
  id,
  children,
  className = '',
}: SectionHeadingProps) {
  const HeadingTag = `h${level}` as const;
  
  const baseStyles = 'font-bold text-gray-900 dark:text-white group relative';
  
  const sizeStyles = {
    1: 'text-4xl sm:text-5xl mt-0 mb-8',
    2: 'text-3xl sm:text-4xl mt-12 mb-6',
    3: 'text-2xl sm:text-3xl mt-10 mb-4',
    4: 'text-xl sm:text-2xl mt-8 mb-3',
    5: 'text-lg sm:text-xl mt-6 mb-2',
    6: 'text-base sm:text-lg mt-4 mb-2',
  };
  
  return (
    <HeadingTag
      id={id}
      className={`${baseStyles} ${sizeStyles[level]} ${className}`}
    >
      {children}
      
      {/* Anchor link (visible on hover) */}
      {id && (
        <a
          href={`#${id}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center"
          aria-label={`Link to ${children}`}
        >
          <svg
            className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      )}
    </HeadingTag>
  );
}