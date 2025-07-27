import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { reverseLocaleLookup } from "@/i18n";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) notFound();

  const page = await client
    .getSingle("homepage", { lang: prismicLang })
    .catch(() => notFound());
  return <SliceZone slices={page.data.slices} components={components} />;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) notFound();

  const page = await client
    .getSingle("homepage", { lang: prismicLang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
