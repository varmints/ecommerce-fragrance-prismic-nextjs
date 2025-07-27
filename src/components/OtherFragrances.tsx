"use client";

import { formatPrice } from "@/utils/formatters";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicText } from "@prismicio/react";
import { TransitionLink } from "./TransitionLink";
import { Content } from "@prismicio/client";
import { useTranslations } from "@/hooks/useTranslations";

type OtherFragrancesProps = {
  fragrances: Content.FragranceDocument[];
};

export function OtherFragrances({ fragrances }: OtherFragrancesProps) {
  const translations = useTranslations();

  return (
    <div className="container mx-auto px-4">
      <h2 className="font-display mb-8 text-3xl text-white md:text-4xl">
        {translations.you_may_also_like || "You may also like"}
      </h2>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fragrances.map((fragrance) => (
          <li key={fragrance.id}>
            <TransitionLink document={fragrance} className="group">
              <div className="relative aspect-square w-full transition-transform duration-500 group-hover:scale-105">
                <PrismicNextImage
                  field={fragrance.data.bottle_image}
                  alt=""
                  width={600}
                  height={600}
                  className="h-auto w-full"
                />
              </div>

              <div className="mt-8 space-y-1 text-white">
                <h3 className="font-display text-2xl">
                  <PrismicText field={fragrance.data.title} />
                </h3>
                <p className="text-sm text-neutral-400">Eau de Parfum</p>
                <p className="text-base font-light">
                  {formatPrice(fragrance.data.price)}
                </p>
              </div>
            </TransitionLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
