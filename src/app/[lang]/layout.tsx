import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import localFont from 'next/font/local';

import { PrismicPreview } from '@prismicio/next';
import { repositoryName } from '@/prismicio';
import { createClient } from '@/prismicio';
import { isFilled } from '@prismicio/client';
import { ViewTransitions } from 'next-view-transitions';
import { getLocales } from '@/utils/getLocales';
import { reverseLocaleLookup } from '@/i18n';

import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import '../globals.css';

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
  display: 'swap',
});

const gambarino = localFont({
  src: '../gambarino.woff2',
  display: 'swap',
  variable: '--font-gambarino',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const settings = await client.getSingle('settings', {
    lang: reverseLocaleLookup(lang),
  });

  return {
    title: settings.data.site_title || 'Côte Royale Paris',
    description:
      settings.data.meta_description ||
      'Discover the exquisite collection of luxury fragrances by Côte Royale Paris',
    openGraph: {
      images: isFilled.image(settings.data.fallback_og_image)
        ? [settings.data.fallback_og_image.url]
        : ['/og-image.png'],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    // This should not happen if middleware is configured correctly
    throw new Error(`Could not find Prismic locale for: ${lang}`);
  }

  const settings = await client.getSingle('settings', { lang: prismicLang });
  const locales = await getLocales(client, prismicLang);

  return (
    <ViewTransitions>
      <html lang={lang} className={`${raleway.variable} ${gambarino.variable} antialiased`}>
        <body className="bg-neutral-900 text-white">
          <NavBar settings={settings} locales={locales} />
          <main className="pt-14 md:pt-16">{children}</main>
          <Footer />
          <PrismicPreview repositoryName={repositoryName} />
        </body>
      </html>
    </ViewTransitions>
  );
}
