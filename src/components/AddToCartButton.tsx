'use client';

import { useTranslations } from '@/hooks/useTranslations';

export function AddToCartButton() {
  const translations = useTranslations();

  return (
    <button className="w-full bg-white py-3 font-medium text-black uppercase transition duration-200 hover:bg-neutral-200">
      {translations.add_to_bag}
    </button>
  );
}
