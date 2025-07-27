import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";

import { createClient } from "@/prismicio";

import { Bounded } from "@/components/Bounded";
import { Quiz } from "./Quiz";
import { reverseLocaleLookup } from "@/i18n";

type PageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();
  const quiz = await client
    .getSingle("quiz", { lang: prismicLang })
    .catch(() => notFound());
  const fragrances = await client.getAllByType("fragrance", {
    lang: prismicLang,
  });

  return (
    <Bounded className="grid min-h-screen place-items-center bg-[url('/background.avif')] bg-cover bg-center text-gray-50">
      <Quiz quizData={quiz} fragrances={fragrances} />
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();
  const page = await client
    .getSingle("quiz", { lang: prismicLang })
    .catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}
