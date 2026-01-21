import { useEffect, useState, useRef } from "react";

const imageCache: Record<string, string | null> = {};

export default function WikipediaImage({ scientificName }: { scientificName: string, width?: number }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const previousNameRef = useRef<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!scientificName) return;

    // If cached, return immediately
    if (scientificName in imageCache) {
      setImageUrl(imageCache[scientificName]);
      previousNameRef.current = scientificName; // track last requested
      return;
    }

    // If it's the same as last request, do nothing
    if (previousNameRef.current === scientificName) return;

    // Clear any pending debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Debounce network request
    debounceRef.current = setTimeout(() => {
      previousNameRef.current = scientificName;

      const title = encodeURIComponent(scientificName);
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`)
        .then(res => res.json())
        .then(data => {
          const url = data.thumbnail?.source || null;
          imageCache[scientificName] = url;
          setImageUrl(url);
        })
        .catch(() => {
          imageCache[scientificName] = null;
          setImageUrl(null);
        });
    }, 800); // debounce

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [scientificName]);

  if (!imageUrl) return null;

  return (
    <div className="bg-gray-200 rounded-lg my-2">
      <img
        src={imageUrl}
        alt={scientificName}
        className="w-full object-contain max-h-48"
      />
    </div>

  );
}