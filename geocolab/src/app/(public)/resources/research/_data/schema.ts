// geocolab-app/src/app/(public)/research/_data/schema.ts
import { z } from 'zod';

/**
 * Content Metadata Schema
 * All required fields for SEO, GEO, and AI citation
 */
export const ContentMetadataSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(50).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lastmod: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.string().min(1),
  tags: z.array(z.string()).min(1),
  keywords: z.array(z.string()).min(3),
  schema: z.object({
    type: z.enum(['Article', 'HowTo', 'FAQPage', 'Event', 'Course', 'WebPage']),
    name: z.string().optional(),
    estimatedCost: z.string().optional(),
    performTime: z.string().optional(),
  }),
  citations: z.array(
    z.object({
      url: z.string().url(),
      title: z.string(),
    })
  ),
  canonical: z.string().url(),
  breadcrumb: z.array(
    z.object({
      name: z.string(),
      url: z.string().url(),
    })
  ),
  geo: z.object({
    performance: z.object({
      targetLCP: z.number().min(0).max(5),
      targetFID: z.number().min(0).max(300),
      bundleSize: z.number().min(0).max(100),
    }),
    accessibility: z.object({
      wcagLevel: z.enum(['AA', 'AAA']),
      ariaCoverage: z.number().min(0).max(100),
    }),
    geoScore: z.number().min(0).max(100),
  }),
});

/**
 * Content Section Schema
 * Supports multiple content types for dynamic rendering
 */
export const ContentSectionSchema = z.object({
  type: z.enum([
    'heading',
    'text',
    'table',
    'code',
    'list',
    'quote',
    'faq',
    'callout',
    'image',
    'video',
  ]),
  level: z.number().min(1).max(6).optional(),
  content: z.string(),
  language: z.string().optional(),
  items: z.array(z.string()).optional(),
  columns: z.array(z.string()).optional(),
  rows: z.array(z.array(z.string())).optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
  src: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  calloutType: z.enum(['info', 'warning', 'success', 'error']).optional(),
});

/**
 * Related Content Schema
 */
export const RelatedContentSchema = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string(),
  category: z.string().optional(),
});

/**
 * Complete Content Document Schema
 */
export const ContentDocumentSchema = z.object({
  metadata: ContentMetadataSchema,
  sections: z.array(ContentSectionSchema).min(1),
  relatedContent: z.array(RelatedContentSchema).default([]),
});

/**
 * Section Index Schema (for section landing pages)
 */
export const SectionIndexSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  pages: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string(),
      tags: z.array(z.string()),
    })
  ),
});

// Export TypeScript types
export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;
export type RelatedContent = z.infer<typeof RelatedContentSchema>;
export type ContentDocument = z.infer<typeof ContentDocumentSchema>;
export type SectionIndex = z.infer<typeof SectionIndexSchema>;

/**
 * Validation helpers
 */
export function validateContentDocument(data: unknown): ContentDocument {
  return ContentDocumentSchema.parse(data);
}

export function validateSectionIndex(data: unknown): SectionIndex {
  return SectionIndexSchema.parse(data);
}

/**
 * Content type guards
 */
export function isContentDocument(data: unknown): data is ContentDocument {
  return ContentDocumentSchema.safeParse(data).success;
}

export function isSectionIndex(data: unknown): data is SectionIndex {
  return SectionIndexSchema.safeParse(data).success;
}