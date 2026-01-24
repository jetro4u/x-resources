import clsx from 'clsx';
import 'src/styles/splash-screen.css';
import 'src/styles/index.css';
import '../../public/assets/fonts/material-design-icons/MaterialIconsOutlined.css';
import '../../public/assets/fonts/Geist/geist.css';
import '../../public/assets/fonts/meteocons/style.css';
import '../../public/assets/styles/prism.css';

import { SessionProvider } from 'next-auth/react';

import { auth } from '@auth/authServer';
import generateMetadata from '../utils/generateMetadata';
import App from './App';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = await generateMetadata({
	title: 'GEOCoLab - AI Authority & GEO Strategy Lab',
	description: 'Research-driven consulting for AI Visibility, GEO Authority Index™, Signal Formation optimization, and algorithmic positioning.',
	keywords: ['AI optimization', 'GEO', 'ChatGPT', 'Claude', 'AI search', 'SEO'],
	authors: [{ name: 'GEOCoLab' }],
	creator: 'Jetro Olowole',
	publisher: 'GEOCoLab',
	metadataBase: new URL('https://geocolab.com'),
	alternates: {
	  canonical: '/',
	},
	openGraph: {
	  type: 'website',
	  locale: 'en_US',
	  url: 'https://geocolab.com',
	  title: 'GEOCoLab - Dominate AI-Powered Search Results',
	  description: 'The first AI optimization platform for ChatGPT, Claude, and other AI engines.',
	  siteName: 'GEOCoLab',
	},
	twitter: {
	  card: 'summary_large_image',
	  title: 'GEOCoLab - Dominate AI-Powered Search Results',
	  description: 'The first AI optimization platform for ChatGPT, Claude, and other AI engines.',
	  creator: '@geocolab',
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
	cardImage: '/card.png',
	favicon: '/favicon.ico',
	url: 'https://geocolab.com'
});

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta
					name="theme-color"
					content="#000000"
				/>
				<base href="/" />
				{/*
					manifest.json provides metadata used when your web app is added to the
					homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
				*/}
				<link
					rel="manifest"
					href="/manifest.json"
				/>
				<link
					rel="shortcut icon"
					href="/favicon.ico"
				/>
				<noscript id="emotion-insertion-point" />
			</head>
			<body
				id="root"
				className={clsx('loading')}
			>
				<SessionProvider
					basePath="/auth"
					session={session}
				>
					<App>{children}</App>
				</SessionProvider>
			</body>
		</html>
	);
}
