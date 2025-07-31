import { Client } from "@prismicio/client";
import { linkResolver } from "@/prismicio";

/**
 * Pobiera listę dostępnych języków z repozytorium Prismic dla globalnego przełącznika.
 * Zawsze linkuje do strony głównej w danym języku.
 *
 * @param client - Klient Prismic.
 * @param currentPrismicLang - Aktualny język Prismic (np. "en-us"), aby oznaczyć go jako aktywny.
 * @returns Lista obiektów locale dla LanguageSwitcher.
 */
export async function getLocales(client: Client, currentPrismicLang: string) {
  const repository = await client.getRepository();

  const locales = repository.languages
    .map((lang) => {
      const url = linkResolver({ lang: lang.id, type: "homepage" });

      if (url) {
        return {
          lang: lang.id,
          lang_name: lang.name,
          url,
        };
      }

      return null;
    })
    .filter(
      (locale): locale is { lang: string; lang_name: string; url: string } =>
        Boolean(locale),
    );

  const activeLangIndex = locales.findIndex(
    (loc) => loc.lang === currentPrismicLang,
  );

  if (activeLangIndex > -1) {
    const activeLang = locales.splice(activeLangIndex, 1)[0];
    locales.unshift(activeLang);
  }

  return locales;
}
