import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { asImageSrc, asText } from '@prismicio/client';
import { PrismicRichText, PrismicText } from '@prismicio/react';

import { createClient } from '@/prismicio';
import { Bounded } from '@/components/Bounded';
import { PrismicNextImage } from '@prismicio/next';
import { FragranceAttributes } from '@/components/FragranceAttributes';
import { formatPrice } from '@/utils/formatters';
import { HiStar } from 'react-icons/hi2';
import { OtherFragrances } from '@/components/OtherFragrances';
import { LOCALES, reverseLocaleLookup } from '@/i18n';
import { AddToCartButton } from '@/components/AddToCartButton';

type Params = { uid: string; lang: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { uid, lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    notFound();
  }

  const page = await client
    .getByUID('fragrance', uid, { lang: prismicLang })
    .catch(() => notFound());

  // Fetch other fragrances on the server
  const allFragrances = await client.getAllByType('fragrance', { lang: prismicLang });
  const otherFragrances = allFragrances.filter(fragrance => fragrance.uid !== uid);

  return (
    <Bounded className="py-10">
      <div className="grid grid-cols-1 items-center gap-10 pb-10 lg:grid-cols-2">
        <div className="relative mb-14 flex justify-center pb-10">
          <PrismicNextImage
            field={page.data.bottle_image}
            width={600}
            height={600}
            priority
            className="pointer-events-none absolute top-[90%] -scale-y-100 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0)_70%,rgba(0,0,0,.15)_100%)]"
          />
          <PrismicNextImage
            field={page.data.bottle_image}
            width={600}
            height={600}
            priority
            className="relative"
          />
        </div>
        {/* Product info section */}

        <div className="text-white">
          <h1 className="font-display mb-4 border-b border-neutral-700 pb-2 text-4xl md:text-5xl">
            <PrismicText field={page.data.title} fallback="Fragrance" />
          </h1>

          <div className="space-y-6">
            <p className="text-md font-semibold">Eau de Parfum Spray</p>

            <PrismicRichText field={page.data.description} />

            <FragranceAttributes mood={page.data.mood} scentProfile={page.data.scent_profile} />
            <p className="mt-10 text-3xl font-light">{formatPrice(page.data.price)}</p>

            <AddToCartButton />

            <div className="flex items-center gap-4 border-t border-neutral-700 pt-6">
              <a href="#" className="hover:text-neutral-300">
                763 total reviews
              </a>

              <div className="flex">
                {[...Array(4)].map((_, index) => (
                  <HiStar className="size-5 text-white" key={index} />
                ))}
                <HiStar className="size-5 text-white/50" />
              </div>
              <span>4.4/5</span>
            </div>
          </div>
        </div>
      </div>

      <OtherFragrances fragrances={otherFragrances} />
    </Bounded>
  );
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { uid, lang } = await params;
  const client = createClient();
  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    notFound();
  }

  const page = await client
    .getByUID('fragrance', uid, { lang: prismicLang })
    .catch(() => notFound());
  const settings = await client.getSingle('settings', { lang: prismicLang });

  return {
    title: asText(page.data.title) + ' | ' + settings.data.site_title,
    description: `Discover ${asText(page.data.title)}, the newest fragrance from Côte Royale Paris.`,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? '' }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType('fragrance', { lang: '*' });

  return pages.map(page => ({ uid: page.uid, lang: LOCALES[page.lang] }));
}
