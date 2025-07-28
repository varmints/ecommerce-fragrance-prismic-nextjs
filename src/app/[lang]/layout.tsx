import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import { getLocales } from "@/utils/getLocales";
import { reverseLocaleLookup } from "@/i18n";

import { TranslationsProvider } from "@/components/TranslationsProvider";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    notFound();
  }

  const settings = await client
    .getSingle("settings", { lang: prismicLang })
    .catch(() => notFound());

  return {
    title: settings.data.site_title || "Côte Royale Paris",
    description:
      settings.data.meta_description ||
      "Discover the exquisite collection of luxury fragrances by Côte Royale Paris",
    openGraph: {
      images: isFilled.image(settings.data.fallback_og_image)
        ? [settings.data.fallback_og_image.url]
        : ["/og-image.png"],
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    notFound();
  }

  const [settings, locales, translationsDoc] = await Promise.all([
    client.getSingle("settings", { lang: prismicLang }).catch(() => null),
    getLocales(client, prismicLang),
    client.getSingle("translations", { lang: prismicLang }).catch(() => null),
  ]);

  if (!settings) {
    notFound();
  }

  const translations = translationsDoc ? translationsDoc.data : null;

  return (
    <TranslationsProvider value={translations}>
      <NavBar settings={settings} locales={locales} />
      <main>{children}</main>
      <Footer />
    </TranslationsProvider>
  );
}
