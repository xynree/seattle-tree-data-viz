import { useMemo, useState } from "react";
import type { TreeFeature, TreeProperties } from "../../types";
import useStreetViewLink from "../../hooks/useStreetViewLink";
import { featureTextFormatters } from "../../config";
import { formatDate, snakeToTitleCase, timeAgo } from "../../helpers";
import WikipediaSummary from "./components/WikipediaSummary";
import TreeSizeTimeline from "./components/TreeSizeTimeline";
import FeaturePanel from "./components/FeaturePanel";

export default function FeatureCard({
  feature,
  setFeature,
}: {
  feature: TreeFeature | null;
  setFeature: (feature: TreeFeature | null) => void;
}) {
  const streetViewLink = useStreetViewLink(feature?.geometry.coordinates);

  const properties = useMemo(() => {
    if (feature?.properties) {
      return Object.entries(feature.properties).filter(([, value]) => value);
    } else return [];
  }, [feature]) as [
    keyof TreeProperties,
    TreeProperties[keyof TreeProperties],
  ][];

  const [showMoreInfo, setShowMoreInfo] = useState(true);

  return (
    <div
      className={`flex flex-col gap-2 overflow-auto w-full h-min max-h-full md:w-120 p-6 rounded-4xl z-10 mr-auto transition-all duration-500 ease-in-out glass-panel
        ${feature ? "opacity-100 transform translate-x-0 pointer-events-auto" : "opacity-0 transform translate-x-full pointer-events-none"}`}
    >
      <div className="flex justify-between items-center">
        {/* Header Left */}
        <div className="flex gap-2">
          {/* Map View Button */}
          <div className="flex items-center bg-green-50 hover:bg-green-100 text-green-800 transition-colors px-3 py-2 text-sm rounded-full cursor-pointer">
            <a
              href={streetViewLink}
              target="_blank"
              title="View on Google Maps"
              className="flex whitespace-nowrap items-center gap-1"
            >
              <span className="material-symbols-outlined mt-[0.5] !text-[18px]">
                map_search
              </span>
            </a>
          </div>

          {/* Title & Subtitle */}
          <div className="flex flex-col text-md">
            <div className="font-bold">
              {feature?.properties.COMMON_NAME || "Unknown Tree"}
            </div>

            <div className="italic text-xs">
              {feature?.properties.SCIENTIFIC_NAME || "—"}
            </div>
          </div>
        </div>

        {/* Header Right */}
        <div className="flex gap-1">
          <span
            className="hover:bg-white/20 hover:border-gray-600/20 hover:text-gray-800 transition-all px-3 py-2 rounded-xl material-symbols-outlined cursor-pointer !text-[24px] border border-gray-300 text-gray-400"
            onClick={() => setFeature(null)}
          >
            close
          </span>
        </div>
      </div>

      <WikipediaSummary
        key={feature?.properties.SCIENTIFIC_NAME}
        scientificName={feature?.properties.SCIENTIFIC_NAME}
      />

      {/* Address */}
      <div className="flex gap-2 flex-wrap overflow-clip">
        <FeaturePanel
          title="Address"
          content={feature?.properties.UNITDESC}
          style="content"
        />
        <FeaturePanel
          title="District"
          content={featureTextFormatters.PRIMARYDISTRICTCD(
            feature?.properties.PRIMARYDISTRICTCD,
          )}
          style="content"
        />
        {feature?.properties.OWNERSHIP ? (
          <FeaturePanel
            title="Ownership"
            content={featureTextFormatters.OWNERSHIP(
              feature?.properties.OWNERSHIP,
            )}
            style="content"
          />
        ) : (
          ""
        )}
      </div>

      {/* Dates */}
      <div className="flex gap-2 w-full">
        <FeaturePanel
          title="Planted"
          content={formatDate(feature?.properties.PLANTED_DATE)}
        />
        <FeaturePanel
          title="Last Verified"
          content={timeAgo(feature?.properties.LAST_VERIFY_DATE)}
        />
      </div>

      {/* Size */}
      <TreeSizeTimeline diameter={feature?.properties.DIAM} />

      {/* Properties */}

      <button
        className="cursor-pointer flex items-center justify-between px-2"
        onClick={() => setShowMoreInfo(!showMoreInfo)}
      >
        <span className="subtitle">More Info</span>
        <span className="material-symbols-outlined text-gray-600">
          {showMoreInfo ? "arrow_drop_down" : "arrow_drop_up"}
        </span>
      </button>

      <div
        className={`flex flex-col md:overflow-auto gap-1 surface-100 ${showMoreInfo ? "" : "hidden"}`}
      >
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
  );
}
