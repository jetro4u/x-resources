import type { Metadata } from 'next';

type AppMetadataInput = {
	title: string;
	description: string;
	keywords?: string[];
	authors?: Array<Record<string, any>>;
	creator?: string;
	publisher?: string;
	metadataBase: URL;
	alternates: Record<string, any>;
	openGraph: Record<string, any>;
	twitter: Record<string, any>;
	robots: Record<string, any>;
	cardImage: string;
	favicon: string;
	url: string;
};  

async function generateMetadata(meta: AppMetadataInput): Promise<Metadata> {
	return {
		title: meta.title,
		description: meta.description,
		referrer: 'origin-when-cross-origin',
		keywords: ['GEOCoLab', 'fdk', 'fdk react', 'saas'],
		authors: [{ name: 'GEOCoLab', url: 'https://geocolab.com/' }],
		creator: 'Jetro Olowole',
		publisher: 'GEOCoLab',
		robots: meta.robots,
		icons: { icon: meta.favicon },
		metadataBase: new URL(meta.url),
		openGraph: {
			url: meta.url,
			title: meta.title,
			description: meta.description,
			images: [meta.cardImage],
			type: 'website',
			siteName: meta.title
		},
		twitter: {
			card: 'summary_large_image',
			site: '@FuseTech',
			creator: '@FuseTech',
			title: meta.title,
			description: meta.description,
			images: [meta.cardImage]
		}
	};
}

export default generateMetadata;
