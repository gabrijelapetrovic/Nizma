import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { SiteBoot } from '../src/components/SiteBoot';
import { Providers } from '../src/components/Providers';
import { loadPublishedSiteContent } from '../src/content/loadPublished';
import { faviconHref } from '../src/utils/images';
import './globals.css';

const title = 'Nokti & Trepavice | Užice • Nokti, trepavice i nega';
const description =
  'Studio za nokte i trepavice u Užicu. Gel, french, nail art, klasične i volume trepavice. Termin se potvrđuje porukom.';

export async function generateMetadata(): Promise<Metadata> {
  const content = await loadPublishedSiteContent();
  const icon = faviconHref(content.favicon || '/favicon.svg');
  return {
    title,
    description,
    keywords: [
      'nokti Užice',
      'trepavice Užice',
      'gel nokti',
      'french',
      'nail art',
      'volume trepavice',
      'salon lepote Užice',
    ],
    authors: [{ name: 'Ognjen Dabić' }],
    publisher: 'Nokti & Trepavice',
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://example.com/' },
    openGraph: {
      title,
      description,
      locale: 'sr_RS',
      type: 'website',
    },
    icons: { icon, shortcut: icon, apple: icon },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2A1520',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const content = await loadPublishedSiteContent();
  return (
    <html lang="sr" className="scroll-smooth">
      <body>
        <SiteBoot />
        <Providers initialContent={content}>{children}</Providers>
      </body>
    </html>
  );
}
