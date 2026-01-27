import { useEffect, useRef, useState } from "react";
import { GENUS_LOOKUP } from "../constants";
import { cleanupScientificName } from "../helpers";
import type { WikipediaPageSummary } from "../types";

const summaryCache: Record<string, WikipediaPageSummary> = {};

export function useWikipediaSummary(scientificName: string | null) {
  const cachedImage = scientificName
    ? (summaryCache[scientificName]?.thumbnail?.source ?? null)
    : null;

  // Initialize from cache
  const [imageUrl, setImageUrl] = useState<string | null>(cachedImage);
  const [isLoading, setIsLoading] = useState(false);
  const [wikipediaData, setWikipediaData] =
    useState<WikipediaPageSummary>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setImageUrl(cachedImage);
  }, [cachedImage]);

  useEffect(() => {
    if (!scientificName || scientificName in summaryCache) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      let title = scientificName;

      if (scientificName in GENUS_LOOKUP) {
        title = GENUS_LOOKUP[title as keyof typeof GENUS_LOOKUP];
      } else {
        title = encodeURIComponent(cleanupScientificName(scientificName));
      }

      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: WikipediaPageSummary) => {
          console.log(data);
          const url = data.thumbnail?.source ?? null;
          summaryCache[scientificName] = data;
          setImageUrl(url);
          setWikipediaData(data);
        })
        .catch((err: Error) => {
          if (err.name === "AbortError") return;
          summaryCache[scientificName] = null;
          setImageUrl(null);
          setWikipediaData(null);
        })
        .finally(() => setIsLoading(false));
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [scientificName]);

  return { imageUrl, isLoading, summary: wikipediaData };
}
