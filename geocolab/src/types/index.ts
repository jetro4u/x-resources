/**
 * Shared TypeScript types for GEOCoLab Landing Page
 * Compatible with Next.js 15 and React 19
 */

export type WaitlistStatus = 'idle' | 'loading' | 'success' | 'error';

export interface WaitlistEntry {
  email: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export interface WaitlistRequest {
  email: string;
  timestamp: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  price: string;
  iconColor: string;
}

export interface ValueProposition {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}