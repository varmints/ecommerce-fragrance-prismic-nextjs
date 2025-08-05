import { cookies } from "next/headers";
import { LOCALES, reverseLocaleLookup } from "@/i18n";

/**
 * Safely retrieves the current locale from cookies with proper validation and fallback
 * @returns Promise<{ lang: string, prismicLang: string | undefined }>
 */
export async function getCurrentLocale(): Promise<{
  lang: string;
  prismicLang: string | undefined;
}> {
  let lang = LOCALES["en-us"]; // Default fallback

  try {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get("NEXT_LOCALE");

    // Validate locale value against allowed locales
    if (
      langCookie?.value &&
      typeof langCookie.value === "string" &&
      Object.values(LOCALES).includes(langCookie.value)
    ) {
      lang = langCookie.value;
    }
  } catch (error) {
    console.warn("Failed to access cookies, using default locale:", error);
  }

  const prismicLang = reverseLocaleLookup(lang);

  return {
    lang,
    prismicLang,
  };
}

/**
 * Validates if a given locale string is supported
 * @param locale - The locale string to validate
 * @returns boolean
 */
export function isValidLocale(locale: string): boolean {
  return Object.values(LOCALES).includes(locale);
}

/**
 * Gets the default locale
 * @returns string
 */
export function getDefaultLocale(): string {
  return LOCALES["en-us"];
}

/**
 * Safely gets locale from a cookie value with validation
 * @param cookieValue - The cookie value to validate
 * @returns string - Valid locale or default
 */
export function validateLocaleFromCookie(
  cookieValue: string | undefined,
): string {
  if (
    cookieValue &&
    typeof cookieValue === "string" &&
    isValidLocale(cookieValue)
  ) {
    return cookieValue;
  }
  return getDefaultLocale();
}

/**
 * Gets Prismic language from URL locale
 * @param urlLang - Language from URL parameters
 * @returns string | undefined - Prismic language format or undefined if invalid
 */
export function getPrismicLangFromUrl(urlLang: string): string | undefined {
  if (!isValidLocale(urlLang)) {
    return undefined;
  }
  return reverseLocaleLookup(urlLang);
}
