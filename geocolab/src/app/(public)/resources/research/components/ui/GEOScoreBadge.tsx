// geocolab-app/src/app/(public)/research/components/ui/GEOScoreBadge.tsx
'use client';

interface GEOScoreBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * GEO Score indicator badge
 * Visualizes content optimization score (0-100)
 */
export function GEOScoreBadge({
  score,
  showLabel = true,
  size = 'md',
}: GEOScoreBadgeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'blue';
    if (score >= 70) return 'yellow';
    return 'red';
  };
  
  const color = getScoreColor(score);
  
  const colorStyles = {
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };
  
  return (
    <div className="inline-flex items-center gap-2">
      {showLabel && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          GEO Score:
        </span>
      )}
      
      <div
        className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${colorStyles[color]} ${sizeStyles[size]}`}
        role="status"
        aria-label={`GEO score: ${score} out of 100`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>{score}</span>
      </div>
    </div>
  );
}