import { useMemo } from "react";
import type { TreeFeature } from "../types";
import WikipediaImage from "./WikipediaImage";
import { formatDate } from "../helpers";

export default function FeatureCard({
  feature,
}: {
  feature: TreeFeature | null;
}) {
  const properties = useMemo(() => {
    if (feature) {
      return feature.properties;
    } else return null;
  }, [feature]);

  return (
    <>
      {/* // Upper Right Feature Card */}
      {properties ? (
        <div className="relative min-w-96 bg-white p-3 rounded-xl max-w-2xl z-10 shadow-md">
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            🌳 {properties.COMMON_NAME || "Unknown Tree"}
          </div>

          <div className="italic"> {properties.SCIENTIFIC_NAME || "—"}</div>
          {/* Wikipedia image */}
          <WikipediaImage scientificName={properties.SCIENTIFIC_NAME} />

          <div>
            <b>Genus:</b> {properties.GENUS || "—"}
          </div>
          <div>
            <b>Diameter:</b> {properties.DIAM ? `${properties.DIAM} in` : "—"}
          </div>
          <div>
            <b>Grow space:</b> {properties.GROWSPACE ?? "—"} ft²
          </div>
          <div>
            <b>Condition rating:</b> {properties.CONDITION_RATING || "—"}
          </div>

          <hr style={{ margin: "6px 0" }} />

          <div>
            <b>Ownership:</b> {properties.OWNERSHIP || "—"}
          </div>
          <div>
            <b>Status:</b> {properties.CURRENT_STATUS || "—"}
          </div>
          <div>
            <b>Planted:</b> {formatDate(properties.PLANTED_DATE)}
          </div>
          <div>
            <b>Last verified:</b> {formatDate(properties.LAST_VERIFY_DATE)}
          </div>

          <hr style={{ margin: "6px 0" }} />

          <div>
            <b>Rank:</b>
            {properties.TOTAL_RANK}
          </div>
          <div>
            <b>Total count:</b>
            {properties.TOTAL_COUNT}
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
