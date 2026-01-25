import { useMemo } from "react";
import type { TreeFeature } from "../types";
import WikipediaImage from "./WikipediaImage";
import useStreetViewLink from "../hooks/useStreetViewLink";

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
    <div className="flex flex-col overflow-auto relative min-w-96 bg-white p-3 rounded-xl max-w-2xl z-10 shadow-md">
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

      <WikipediaImage scientificName={feature.properties.SCIENTIFIC_NAME} />

      <div className="flex flex-col overflow-auto gap-1">
        {properties.map(([title, value]) => (
          <div className="text-sm" key={title}>
            <span className="font-medium">{title}</span>:{" "}
            <span className="whitespace-break-spaces">{value}</span>
          </div>
        ))}
      </div>
    </div>
  ) : (
    ""
  );
}
