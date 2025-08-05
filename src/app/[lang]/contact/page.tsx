import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import { reverseLocaleLookup } from "@/i18n";
import { isFilled } from "@prismicio/client";

type Params = Promise<{ lang: string }>;

export default async function ContactPage({ params }: { params: Params }) {
  const { lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();
  const page = await client
    .getSingle("contact_page", {
      lang: prismicLang,
    })
    .catch(() => notFound());

  return (
    <Bounded className="py-12">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="mb-8 text-center">
            {isFilled.richText(page.data.title) && (
              <div className="mx-auto mb-8">
                <PrismicRichText
                  field={page.data.title}
                  components={{
                    heading1: ({ children }) => (
                      <h1 className="font-display text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl">
                        {children}
                      </h1>
                    ),
                  }}
                />
              </div>
            )}
            {isFilled.richText(page.data.description) && (
              <div className="mx-auto max-w-2xl text-lg text-balance text-gray-300">
                <PrismicRichText
                  field={page.data.description}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="mb-4 last:mb-0">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                  }}
                />
              </div>
            )}
          </div>
          <SliceZone slices={page.data.slices} components={components} />
        </FadeIn>
      </div>
    </Bounded>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lang } = await params;
  const prismicLang = reverseLocaleLookup(lang);
  const client = createClient();

  try {
    const page = await client.getSingle("contact_page", {
      lang: prismicLang,
    });

    return {
      title: page.data.meta_title || "Contact",
      description: page.data.meta_description || "Contact us - Côte Royale",
    };
  } catch {
    return {
      title: "Contact",
      description: "Contact us - Côte Royale",
    };
  }
}
