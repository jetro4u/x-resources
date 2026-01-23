// geocolab-app/src/app/(public)/research/components/ui/MetricsTable.tsx
'use client';

interface MetricsTableProps {
  columns: string[];
  rows: string[][];
  caption?: string;
}

/**
 * Accessible, responsive table for signal metrics
 * WCAG 2.2 AA compliant with proper headers and scope
 */
export function MetricsTable({ columns, rows, caption }: MetricsTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {row.map((cell, cellIndex) => {
                // First column is row header
                const CellTag = cellIndex === 0 ? 'th' : 'td';
                
                return (
                  <CellTag
                    key={cellIndex}
                    scope={cellIndex === 0 ? 'row' : undefined}
                    className={`
                      px-6 py-4 text-sm
                      ${cellIndex === 0 
                        ? 'font-medium text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    {formatCellContent(cell, cellIndex)}
                  </CellTag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Format cell content with special handling for numbers/metrics
 */
function formatCellContent(content: string, columnIndex: number): React.ReactNode {
  // Check if content is a number
  const numValue = parseFloat(content);
  
  if (!isNaN(numValue)) {
    // Format numbers with appropriate styling
    if (numValue < 0) {
      return (
        <span className="text-red-600 dark:text-red-400 font-semibold">
          {content}
        </span>
      );
    }
    
    if (numValue > 100) {
      return (
        <span className="text-green-600 dark:text-green-400 font-semibold">
          {content}
        </span>
      );
    }
    
    return <span className="font-mono">{content}</span>;
  }
  
  // Return plain text for non-numbers
  return content;
}