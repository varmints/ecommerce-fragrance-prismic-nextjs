import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/prismicio";
import { filter } from "@prismicio/client";
import { reverseLocaleLookup } from "@/i18n";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const client = createClient();
  const query = searchParams.get("query");
  const lang = searchParams.get("lang");

  if (!lang) {
    return NextResponse.json(
      { error: "Language parameter is required" },
      { status: 400 },
    );
  }

  const prismicLang = reverseLocaleLookup(lang);

  if (!prismicLang) {
    return NextResponse.json(
      { error: `Invalid language: ${lang}` },
      { status: 400 },
    );
  }

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const fragrances = await client.getAllByType("fragrance", {
      lang: prismicLang,
      fetchOptions: {
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
      filters: [filter.fulltext("document", `${query}`)],
      graphQuery: `
        {
          fragrance {
            title
            bottle_image
            price
          }
        }
      `,
    });

    console.log(`Found ${fragrances} results for query: ${query}`);

    return NextResponse.json(fragrances);
  } catch (error) {
    console.error("Prismic API Error in /api/search:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results from " },
      { status: 500 },
    );
  }
}
