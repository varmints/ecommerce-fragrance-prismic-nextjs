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

import { TranslationsProvider } from '@/components/TranslationsProvider';
import { Content } from '@prismicio/client';

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
    throw new Error(`Could not find Prismic locale for: ${lang}`);
  }

  const [settings, locales, translationsDoc] = await Promise.all([
    client.getSingle('settings', { lang: prismicLang }),
    getLocales(client, prismicLang),
    client.getSingle('translations', { lang: prismicLang }).catch(error => {
      console.error('Failed to fetch translations:', error);
      return null; // Gracefully handle error so Promise.all doesn't fail
    }),
  ]);

  const translations = translationsDoc ? translationsDoc.data : null;

  return (
    <ViewTransitions>
      <html lang={lang} className={`${raleway.variable} ${gambarino.variable} antialiased`}>
        <body className="bg-neutral-900 text-white">
          <TranslationsProvider value={translations}>
            <NavBar settings={settings} locales={locales} />
            <main className="pt-14 md:pt-16">{children}</main>
            <Footer />
          </TranslationsProvider>
          <PrismicPreview repositoryName={repositoryName} />
        </body>
      </html>
    </ViewTransitions>
  );
}
