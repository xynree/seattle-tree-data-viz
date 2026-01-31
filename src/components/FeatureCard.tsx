import { useMemo } from "react";
import type { TreeFeature } from "../types";
import useStreetViewLink from "../hooks/useStreetViewLink";
import { featureTextFormatters } from "../config";
import { formatDate, snakeToTitleCase } from "../helpers";
import WikipediaSummary from "./WikipediaSummary";
import TreeSizeTimeline from "./TreeSizeTimeline";

export default function FeatureCard({
  feature,
  setFeature,
}: {
  feature: TreeFeature | null;
  setFeature: (feature: TreeFeature | null) => void;
}) {
  const streetViewLink = useStreetViewLink(feature?.geometry.coordinates);

  const properties = useMemo(() => {
    if (feature) {
      return Object.entries(feature.properties).filter(([, value]) => value);
    } else return null;
  }, [feature]);

  return properties ? (
    <div className="flex flex-col gap-2 overflow-auto relative w-110 h-full bg-white p-4 rounded-2xl z-10 mr-auto">
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
        <div className="flex gap-1">
          <div className="button">
            <a
              href={streetViewLink}
              target="_blank"
              className="flex whitespace-nowrap items-center gap-1"
            >
              <span>Map View</span>
              <span className="material-symbols-outlined mt-[0.5] !text-[18px]">
                image_search
              </span>
            </a>
          </div>

          <span
            className="hover:bg-gray-100 transition px-3 py-2 rounded-full material-symbols-outlined cursor-pointer "
            onClick={() => setFeature(null)}
          >
            close
          </span>
        </div>
      </div>

      <WikipediaSummary
        key={feature.properties.SCIENTIFIC_NAME}
        scientificName={feature.properties.SCIENTIFIC_NAME}
      />

      {/* Dates */}
      <div className="flex gap-2 w-full">
        <div className="property-feature py-3!">
          <span className="text-xs font-medium text-gray-500">Planted</span>
          <span className="text-xl font-semibold">
            {formatDate(feature.properties.PLANTED_DATE)}
          </span>
        </div>
        <div className="property-feature py-3!">
          <span className="text-xs font-medium text-gray-500">
            Last Verified
          </span>
          <span className="text-xl font-semibold">
            {formatDate(feature.properties.LAST_VERIFY_DATE)}
          </span>
        </div>
      </div>

      {/* Size */}
      <TreeSizeTimeline diameter={feature.properties.DIAM} />

      {/* Properties */}

      <div className="flex flex-col overflow-auto gap-1 p-3 py-2 outline outline-gray-300 rounded-lg">
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
