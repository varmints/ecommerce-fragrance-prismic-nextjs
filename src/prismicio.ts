import {
  ClientConfig,
  PrismicDocument,
  createClient as prismicCreateClient,
} from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";
import sm from "../slicemachine.config.json";
import { LOCALES } from "./i18n";

/**
 * The project's Prismic repository name.
 */
export const repositoryName =
  process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT || sm.repositoryName;

/**
 * The project's link resolver. This function is used to resolve links to
 * Prismic documents.
 *
 * @see https://prismic.io/docs/route-resolver#link-resolver
 */
export const linkResolver = (
  doc: PrismicDocument | { type: string; lang: string; uid?: string },
): string | null => {
  // Use the `LOCALES` object to get the route prefix for the given language.
  const locale = LOCALES[doc.lang as keyof typeof LOCALES] || LOCALES["en-us"];

  switch (doc.type) {
    case "homepage":
      return `/${locale}`;
    case "fragrance":
      return `/${locale}/fragrance/${doc.uid}`;
    case "quiz":
      return `/${locale}/quiz`;
    case "contact_page":
      return `/${locale}/contact`;
    default:
      return null;
  }
};

/**
 * Creates a Prismic client for the project's repository. The client is used to
 * query content from the Prismic API.
 *
 * @param config - Configuration for the Prismic client.
 */
export const createClient = (config: ClientConfig = {}) => {
  const client = prismicCreateClient(repositoryName, {
    fetchOptions:
      process.env.NODE_ENV === "production"
        ? { next: { tags: ["prismic"] }, cache: "force-cache" }
        : { next: { revalidate: 5 } },
    ...config,
  });

  enableAutoPreviews({ client });

  return client;
};
