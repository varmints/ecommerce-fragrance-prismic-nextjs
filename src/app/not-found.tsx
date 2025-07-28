import { cookies } from "next/headers";
import { Content, isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { LOCALES, reverseLocaleLookup } from "@/i18n";
import { Bounded } from "@/components/Bounded";
import { FadeIn } from "@/components/FadeIn";
import { RevealText } from "@/components/RevealText";
import { ButtonLink } from "@/components/ButtonLink";

type NotFoundDocument = Content.NotFoundPageDocument;

export default async function NotFound() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("NEXT_LOCALE");
  const lang = langCookie ? langCookie.value : LOCALES["en-us"];
  const prismicLang = reverseLocaleLookup(lang);

  const client = createClient();
  const page = await client
    .getSingle<NotFoundDocument>("not_found_page", {
      lang: prismicLang,
    })
    .catch(() => null);

  if (!page) {
    return (
      <Bounded className="relative grid min-h-screen items-center overflow-hidden bg-neutral-950">
        <div className="relative flex-col justify-center">
          <RevealText
            field={[
              { type: "heading1", text: "404 Page Not Found", spans: [] },
            ]}
            id="hero-heading"
            className="font-display max-w-2xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
            staggerAmount={0.2}
            duration={1.7}
            as="h1"
          />

          <FadeIn
            className="mt-6 max-w-md translate-y-8 text-lg text-neutral-100"
            vars={{ delay: 1, duration: 1.3 }}
          >
            <p>
              The page with the specified address was not found. Return to the
              home page by clicking the button below.
            </p>
          </FadeIn>

          <FadeIn
            className="mt-8 translate-y-5"
            vars={{ delay: 1.5, duration: 1.1 }}
          >
            <ButtonLink href="/" className="w-fit" variant="Secondary">
              {"Return Home"}
            </ButtonLink>
          </FadeIn>
        </div>
      </Bounded>
    );
  }

  return (
    <Bounded className="relative grid min-h-screen items-center overflow-hidden bg-neutral-950">
      {isFilled.image(page.data.image) && (
        <FadeIn
          vars={{ scale: 1, opacity: 0.5 }}
          className="absolute inset-0 opacity-0 motion-safe:scale-125"
        >
          <PrismicNextImage
            field={page.data.image}
            alt=""
            priority
            fill
            className="-scale-y-100 object-cover motion-reduce:opacity-50"
          />
        </FadeIn>
      )}

      <div className="relative flex-col justify-center">
        <RevealText
          field={page.data.heading}
          id="hero-heading"
          className="font-display max-w-2xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
          staggerAmount={0.2}
          duration={1.7}
          as="h1"
        />

        <FadeIn
          className="mt-6 max-w-md translate-y-8 text-lg text-neutral-100"
          vars={{ delay: 1, duration: 1.3 }}
        >
          <PrismicRichText field={page.data.body} />
        </FadeIn>

        <FadeIn
          className="mt-8 translate-y-5"
          vars={{ delay: 1.5, duration: 1.1 }}
        >
          {isFilled.link(page.data.button) && (
            <ButtonLink
              field={page.data.button}
              className="w-fit"
              variant="Secondary"
            >
              {"Return Home"}
            </ButtonLink>
          )}
        </FadeIn>
      </div>
    </Bounded>
  );
}
