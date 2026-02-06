import { useEffect, useRef, useState } from "react";
import { GENUS_LOOKUP } from "../constants";
import { cleanupScientificName } from "../helpers";
import type {
  WikipediaInfo,
  WikipediaMedia,
  WikipediaMediaList,
  WikipediaPageSummary,
} from "../types";

const summaryCache: Record<string, WikipediaInfo> = {};

export function useWikipediaSummary(scientificName: string | null) {
  const cachedMediaList = scientificName
    ? (summaryCache[scientificName]?.media_list ?? null)
    : null;

  // Initialize from cache
  const [mediaList, setMediaList] = useState<WikipediaMedia[]>(cachedMediaList);
  const [isLoading, setIsLoading] = useState(false);
  const [wikipediaData, setWikipediaData] = useState<WikipediaInfo>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMediaList(cachedMediaList);
  }, [cachedMediaList]);

  useEffect(() => {
    setWikipediaData(summaryCache[scientificName] ?? null);
  }, [scientificName]);

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

      Promise.all([
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, {
          signal: controller.signal,
        }),
        fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${title}`, {
          signal: controller.signal,
        }),
      ])
        .then((res) => Promise.all(res.map((r) => r.json())))
        .then((data: [WikipediaPageSummary, WikipediaMediaList]) => {
          const [summary, mediaList] = data;

          const wikipediaData = { ...summary, media_list: mediaList.items };

          summaryCache[scientificName] = wikipediaData;
          setWikipediaData(wikipediaData);
          setMediaList(mediaList.items);
        })
        .catch((err: Error) => {
          if (err.name === "AbortError") return;
          summaryCache[scientificName] = null;
          setWikipediaData(null);
          setMediaList(null);
        })
        .finally(() => setIsLoading(false));
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [scientificName]);

  return { mediaList, isLoading, summary: wikipediaData };
}
