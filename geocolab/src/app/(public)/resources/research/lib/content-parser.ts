// geocolab-app/src/app/(public)/research/lib/content-parser.ts
import type { ContentSection } from '../_data/schema';

/**
 * Parse content sections into React components
 * Maps JSON structure to UI components dynamically
 */
export function parseContentSections(
  sections: ContentSection[]
): Array<{ component: string; props: Record<string, unknown> }> {
  return sections.map((section) => {
    switch (section.type) {
      case 'heading':
        return {
          component: 'SectionHeading',
          props: {
            level: section.level || 2,
            children: section.content,
            id: slugify(section.content),
          },
        };

      case 'text':
        return {
          component: 'TextBlock',
          props: {
            content: section.content,
          },
        };

      case 'table':
        return {
          component: 'MetricsTable',
          props: {
            columns: section.columns || [],
            rows: section.rows || [],
          },
        };

      case 'code':
        return {
          component: 'CodeBlock',
          props: {
            code: section.content,
            language: section.language || 'typescript',
          },
        };

      case 'list':
        return {
          component: 'ListBlock',
          props: {
            items: section.items || [],
            ordered: section.content === 'ordered',
          },
        };

      case 'quote':
        return {
          component: 'QuoteBlock',
          props: {
            content: section.content,
          },
        };

      case 'faq':
        return {
          component: 'FAQItem',
          props: {
            question: section.question,
            answer: section.answer,
          },
        };

      case 'callout':
        return {
          component: 'CalloutBox',
          props: {
            content: section.content,
            type: 'info', // Could be 'warning', 'success', 'error'
          },
        };

      default:
        return {
          component: 'TextBlock',
          props: {
            content: section.content,
          },
        };
    }
  });
}

/**
 * Generate table of contents from sections
 */
export function generateTableOfContents(
  sections: ContentSection[]
): Array<{ id: string; title: string; level: number }> {
  return sections
    .filter((section) => section.type === 'heading')
    .map((section) => ({
      id: slugify(section.content),
      title: section.content,
      level: section.level || 2,
    }));
}

/**
 * Helper: Convert text to URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Extract reading time from content
 */
export function calculateReadingTime(sections: ContentSection[]): number {
  const wordCount = sections.reduce((count, section) => {
    const words = section.content.split(/\s+/).length;
    return count + words;
  }, 0);

  // Average reading speed: 200 words per minute
  return Math.ceil(wordCount / 200);
}