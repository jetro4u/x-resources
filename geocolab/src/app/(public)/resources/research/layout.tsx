// geocolab-app/src/app/(public)/research/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://geocolab.com'),
  title: {
    default: 'GEOCoLab Research Hub',
    template: '%s | GEOCoLab Research',
  },
  description: 'Authority on X algorithm research, signal optimization, and growth strategies',
  keywords: ['x algorithm', 'signal vs spam', 'geo optimization', 'growth strategies'],
  authors: [{ name: 'Jetro Olowole', url: 'https://geocolab.com' }],
  creator: 'GEOCoLab',
  publisher: 'GEOCoLab',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://geocolab.com/research',
    siteName: 'GEOCoLab Research',
    title: 'GEOCoLab Research Hub',
    description: 'Authority on X algorithm research, signal optimization, and growth strategies',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@geocolab',
    creator: '@geocolab',
  },
  alternates: {
    canonical: 'https://geocolab.com/research',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional meta tags */}
        <meta name="application-name" content="GEOCoLab Research" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GEOCoLab" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}