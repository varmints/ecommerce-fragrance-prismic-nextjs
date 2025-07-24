import { PrismicNextLink } from '@prismicio/next';
import { LOCALES } from '@/i18n';
import clsx from 'clsx';

export interface LanguageSwitcherProps {
  locales: {
    lang: string;
    lang_name: string;
    url: string;
  }[];
  className?: string;
}

export const LanguageSwitcher = ({ locales, className }: LanguageSwitcherProps) => (
  <div className={clsx('flex flex-wrap', className)}>
    <ul className="flex gap-3">
      {locales.map(locale => (
        <li
          key={locale.lang}
          className="text-neutral-400 uppercase first:font-bold first:text-white"
        >
          <PrismicNextLink href={locale.url} aria-label={`Change language to ${locale.lang_name}`}>
            {LOCALES[locale.lang] || locale.lang}
          </PrismicNextLink>
        </li>
      ))}
    </ul>
  </div>
);
