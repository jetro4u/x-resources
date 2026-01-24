// geocolab-app/src/app/(public)/research/[section]/[...slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContent, getAllContentPaths } from '../../api/content';
import { ResearchLayout } from '../../components/layout/ResearchLayout';
import { ContentRenderer } from '../../components/ui/ContentRenderer';
import { generateStructuredData, generateBreadcrumbStructuredData } from '../../lib/structured-data';
import { generateTableOfContents } from '../../lib/content-parser';

interface PageProps {
  params: {
    section: string;
    slug: string[];
  };
}

/**
 * Dynamic research portal page
 * Fetches JSON content and renders with SEO/GEO optimization
 */
export default async function ResearchPage({ params }: PageProps) {
  const { section, slug } = params;
  const slugPath = slug.join('/');
  
  // Fetch content (mimics API call)
  const content = await getContent(section, slugPath);
  
  if (!content) {
    notFound();
  }
  
  // Generate table of contents
  const tableOfContents = generateTableOfContents(content.sections);
  
  return (
    <>
      {/* Schema.org JSON-LD for AI/SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(content.metadata)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData(content.metadata.breadcrumb)
          ),
        }}
      />
      
      <ResearchLayout metadata={content.metadata} tableOfContents={tableOfContents}>
        <ContentRenderer sections={content.sections} />
        
        {/* Related Content */}
        {content.relatedContent.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Related Resources
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {content.relatedContent.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </ResearchLayout>
    </>
  );
}

/**
 * Generate metadata for SEO (Next.js 13+ convention)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = params;
  const slugPath = slug.join('/');
  const content = await getContent(section, slugPath);
  
  if (!content) {
    return {
      title: 'Page Not Found',
    };
  }
  
  const { metadata } = content;
  
  return {
    title: `${metadata.title} | GEOCoLab Research`,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: metadata.author }],
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: metadata.canonical,
      siteName: 'GEOCoLab',
      type: 'article',
      publishedTime: metadata.date,
      modifiedTime: metadata.lastmod,
      authors: [metadata.author],
      tags: metadata.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      creator: '@geocolab',
    },
    alternates: {
      canonical: metadata.canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Generate static paths for all content (ISR/SSG)
 */
export async function generateStaticParams() {
  const paths = await getAllContentPaths();
  
  return paths.map((path) => ({
    section: path.section,
    slug: path.slug.split('/'),
  }));
}