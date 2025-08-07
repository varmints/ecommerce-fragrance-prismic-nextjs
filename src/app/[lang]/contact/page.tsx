import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SliceZone, PrismicRichText } from "@prismicio/react";
import { createClient } from "@/prismicio";
import { components } from "@/slices";
import { FadeIn } from "@/components/FadeIn";
import { reverseLocaleLookup } from "@/i18n";
import { isFilled } from "@prismicio/client";
import { RevealText } from "@/components/RevealText";

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
    <div className="mx-auto max-w-4xl py-40">
      <div className="mb-8 flex flex-col items-center text-center">
        <FadeIn vars={{ delay: 0, duration: 1.2 }} className="translate-y-8">
          <p className="mb-4 tracking-widest uppercase">{"Contact Us"}</p>
        </FadeIn>
        {isFilled.richText(page.data.title) && (
          <RevealText
            align="center"
            id="quiz-title"
            field={page.data.title}
            className="font-display text-5xl text-balance sm:text-6xl md:text-7xl"
            duration={2}
            as={"h1"}
          />
        )}
        <FadeIn
          className="mx-auto mb-12 max-w-2xl text-lg text-balance text-gray-300"
          vars={{ delay: 1.3, duration: 1.3 }}
        >
          {isFilled.richText(page.data.description) && (
            <PrismicRichText
              field={page.data.description}
              components={{
                paragraph: ({ children }) => (
                  <p className="mb-4 last:mb-0">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            />
          )}
        </FadeIn>
      </div>
      <FadeIn className="translate-y-8" vars={{ delay: 1.5, duration: 1.3 }}>
        <SliceZone slices={page.data.slices} components={components} />
      </FadeIn>
    </div>
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
