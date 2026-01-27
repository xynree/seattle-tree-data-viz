import { useMemo } from "react";
import type { TreeFeature } from "../types";
import useStreetViewLink from "../hooks/useStreetViewLink";
import { featureTextFormatters } from "../config";
import { snakeToTitleCase } from "../helpers";
import WikipediaSummary from "./WikipediaSummary";

export default function FeatureCard({
  feature,
}: {
  feature: TreeFeature | null;
}) {
  const streetViewLink = useStreetViewLink(feature?.geometry.coordinates);

  const properties = useMemo(() => {
    if (feature) {
      return Object.entries(feature.properties).filter(([, value]) => value);
    } else return null;
  }, [feature]);

  return properties ? (
    <div className="flex flex-col gap-2 overflow-auto relative min-w-96  bg-white p-4 rounded-2xl max-w-xl z-10">
      <div className="flex justify-between items-center">
        {/* Header Left */}
        <div className="flex flex-col">
          <div className="font-bold">
            🌳 {feature.properties.COMMON_NAME || "Unknown Tree"}
          </div>

          <div className="italic">
            {" "}
            {feature.properties.SCIENTIFIC_NAME || "—"}
          </div>
        </div>

        {/* Header Right */}
        <div className="bg-gray-100 hover:bg-gray-200 transition px-4 py-2 text-sm rounded-full">
          <a
            href={streetViewLink}
            target="_blank"
            className="flex items-center gap-2"
          >
            <span>View in Maps</span>
            <span className="material-symbols-outlined">image_search</span>
          </a>
        </div>
      </div>

      <WikipediaSummary scientificName={feature.properties.SCIENTIFIC_NAME} />

      {/* Properties */}

      <div className="flex flex-col overflow-auto gap-1 p-3 py-2 outline outline-gray-300 rounded-lg max-h-96">
        {properties.map(([title, value]) => (
          <div className="text-sm title-case" key={title}>
            <span className="font-medium">{snakeToTitleCase(title)}</span>:{" "}
            <span className="whitespace-break-spaces">
              {featureTextFormatters[title]?.(value) ?? value}
            </span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    ""
  );
}
