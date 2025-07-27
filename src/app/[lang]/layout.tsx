import localFont from "next/font/local";
import { Raleway } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PrismicPreview } from "@prismicio/next";
import { repositoryName } from "@/prismicio";
import { createClient } from "@/prismicio";
import { isFilled } from "@prismicio/client";
import { ViewTransitions } from "next-view-transitions";
import { getLocales } from "@/utils/getLocales";
import { reverseLocaleLookup } from "@/i18n";

import { CartProvider } from "@/context/CartContext";
import { TranslationsProvider } from "@/components/TranslationsProvider";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import "../globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const gambarino = localFont({
  src: "../gambarino.woff2",
  display: "swap",
  variable: "--font-gambarino",
});

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
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

export default async function RootLayout({
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
    <ViewTransitions>
      <html
        lang={lang}
        className={`${raleway.variable} ${gambarino.variable} antialiased`}
      >
        <body className="bg-neutral-900 text-white">
          <CartProvider>
            <TranslationsProvider value={translations}>
              <NavBar settings={settings} locales={locales} />
              <main className="">{children}</main>
              <Footer />
            </TranslationsProvider>
          </CartProvider>
          <PrismicPreview repositoryName={repositoryName} />
        </body>
      </html>
    </ViewTransitions>
  );
}
