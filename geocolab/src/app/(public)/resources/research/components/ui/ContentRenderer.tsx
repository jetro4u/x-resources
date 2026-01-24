// geocolab-app/src/app/(public)/research/components/ui/ContentRenderer.tsx
'use client';

import type { ContentSection } from '../../_data/schema';
import { SectionHeading } from './SectionHeading';
import { MetricsTable } from './MetricsTable';
import { CodeBlock } from './CodeBlock';
import { FAQAccordion } from './FAQAccordion';
import { CalloutBox } from './CalloutBox';

interface ContentRendererProps {
  sections: ContentSection[];
}

/**
 * Dynamic content renderer - maps JSON sections to React components
 * Follows GEO standards for semantic markup
 */
export function ContentRenderer({ sections }: ContentRendererProps) {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        const key = `section-${index}`;

        switch (section.type) {
          case 'heading':
            return (
              <SectionHeading
                key={key}
                level={section.level || 2}
                id={slugify(section.content)}
              >
                {section.content}
              </SectionHeading>
            );

          case 'text':
            return (
              <div
                key={key}
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            );

          case 'table':
            return (
              <MetricsTable
                key={key}
                columns={section.columns || []}
                rows={section.rows || []}
              />
            );

          case 'code':
            return (
              <CodeBlock
                key={key}
                code={section.content}
                language={section.language || 'typescript'}
              />
            );

          case 'list':
            const ListTag = section.content === 'ordered' ? 'ol' : 'ul';
            return (
              <ListTag
                key={key}
                className="space-y-2 text-gray-700 dark:text-gray-300 ml-6"
              >
                {section.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ListTag>
            );

          case 'quote':
            return (
              <blockquote
                key={key}
                className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6"
              >
                {section.content}
              </blockquote>
            );

          case 'faq':
            return (
              <FAQAccordion
                key={key}
                question={section.question || ''}
                answer={section.answer || ''}
              />
            );

          case 'callout':
            return (
              <CalloutBox key={key} type="info">
                {section.content}
              </CalloutBox>
            );

          default:
            return (
              <p key={key} className="text-gray-700 dark:text-gray-300">
                {section.content}
              </p>
            );
        }
      })}
    </div>
  );
}

/**
 * Helper: Convert text to URL-friendly slug
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}