"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSearch } from "@/context/SearchContext";
import { useDebounce } from "use-debounce";
import { HiXMark, HiMagnifyingGlass } from "react-icons/hi2";
import { PrismicNextImage } from "@prismicio/next";
import { TransitionLink } from "./TransitionLink";
import { asText, Content } from "@prismicio/client";
import { formatPrice } from "@/utils/formatters";

type SearchResult = Content.FragranceDocument;

export const SearchModal = () => {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const lang = params.lang as string;

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(
            searchQuery,
          )}&lang=${encodeURIComponent(lang)}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setResults(data);
      } catch (e) {
        setError("Failed to fetch search results.");
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [lang],
  );

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSearch]);

  if (!isSearchOpen) {
    return null;
  }

  return (
    <div
      className="animate-in fade-in-0 fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="container mx-auto max-w-3xl p-4">
        <div className="flex justify-end">
          <button
            onClick={closeSearch}
            className="cursor-pointer p-2 text-white/80 hover:text-white"
            aria-label="Close search"
          >
            <HiXMark size={32} />
          </button>
        </div>
        <div className="mt-8">
          <div className="relative">
            <HiMagnifyingGlass
              size={24}
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white/50"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a fragrance..."
              className="w-full border-b-2 border-white/50 bg-transparent py-4 pr-4 pl-14 text-2xl text-white placeholder:text-white/50 focus:border-white focus:outline-none"
            />
          </div>
          <div className="mt-8 h-[60vh] overflow-y-auto">
            {isLoading && (
              <p className="text-center text-white/80">Loading...</p>
            )}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!isLoading &&
              !error &&
              results.length === 0 &&
              debouncedQuery.length > 1 && (
                <p className="text-center text-white/80">
                  No results found for &quot;{debouncedQuery}&quot;
                </p>
              )}
            <ul className="space-y-4">
              {results.map((result) => (
                <li key={result.id}>
                  <TransitionLink
                    href={`/${lang}/fragrance/${result.uid}`}
                    className="flex items-center gap-4 rounded-lg p-4 transition-colors duration-200 hover:bg-white/10"
                    onClick={closeSearch}
                  >
                    <div className="h-20 w-20 flex-shrink-0 rounded-md bg-white/10">
                      <PrismicNextImage
                        field={result.data.bottle_image}
                        className="h-full w-full object-contain"
                        width={80}
                        height={80}
                        alt=""
                      />
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl font-bold">
                        {asText(result.data.title)}
                      </h3>
                      <span className="text-sm text-white/80">
                        {formatPrice(result.data.price)}
                      </span>
                    </div>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
