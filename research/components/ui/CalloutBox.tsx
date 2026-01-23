// geocolab-app/src/app/(public)/research/components/ui/CalloutBox.tsx
'use client';

import { ReactNode } from 'react';

interface CalloutBoxProps {
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
  children: ReactNode;
}

/**
 * Styled callout box for important information
 * Accessible with proper ARIA roles
 */
export function CalloutBox({
  type = 'info',
  title,
  children,
}: CalloutBoxProps) {
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-300',
      content: 'text-blue-800 dark:text-blue-200',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      title: 'text-yellow-900 dark:text-yellow-300',
      content: 'text-yellow-800 dark:text-yellow-200',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-300',
      content: 'text-green-800 dark:text-green-200',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      title: 'text-red-900 dark:text-red-300',
      content: 'text-red-800 dark:text-red-200',
      iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  };
  
  const currentStyle = styles[type];
  
  const roleMap = {
    info: 'note',
    warning: 'alert',
    success: 'status',
    error: 'alert',
  };
  
  return (
    <div
      className={`my-6 p-4 rounded-lg border-l-4 ${currentStyle.container}`}
      role={roleMap[type]}
      aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start gap-3">
        <svg
          className={`w-6 h-6 flex-shrink-0 mt-0.5 ${currentStyle.icon}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={currentStyle.iconPath}
          />
        </svg>
        
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold mb-1 ${currentStyle.title}`}>
              {title}
            </h4>
          )}
          <div className={`text-sm leading-relaxed ${currentStyle.content}`}>
            {typeof children === 'string' ? (
              <p>{children}</p>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}