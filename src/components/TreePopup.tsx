import { useEffect, useState } from "react";
import type { TreeFeature } from "../types/types";
import WikipediaImage from "./WikipediaImage";
import { formatDate } from "../helpers";

export default function TreePopup({
  popup
}: { popup: { x: number, y: number, feature: TreeFeature } | null }) {
  const [lastFeature, setLastFeature] = useState(null)
  const p = lastFeature?.properties

  useEffect(() => {
    if (popup?.feature) {
      setLastFeature(popup.feature)
    }

  }, [popup?.feature])

  return (
    <>
      {/* // Upper Right Feature Card */}
      {lastFeature ?

        <div
          className="min-w-72 absolute top-12 right-12 bg-white p-3 rounded-xl max-w-2xl z-10 shadow-md"
        >

          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            🌳 {p.COMMON_NAME || "Unknown Tree"}
          </div>

          <div className="italic"> {p.SCIENTIFIC_NAME || "—"}</div>
          {/* Wikipedia image */}
          {p.SCIENTIFIC_NAME && <WikipediaImage scientificName={p.SCIENTIFIC_NAME} width={150} />}

          <div><b>Genus:</b> {p.GENUS || "—"}</div>
          <div><b>Diameter:</b> {p.DIAM ? `${p.DIAM} in` : "—"}</div>
          <div><b>Grow space:</b> {p.GROWSPACE ?? "—"} ft²</div>
          <div><b>Condition rating:</b> {p.CONDITION_RATING || "—"}</div>

          <hr style={{ margin: "6px 0" }} />

          <div><b>Ownership:</b> {p.OWNERSHIP || "—"}</div>
          <div><b>Status:</b> {p.CURRENT_STATUS || "—"}</div>
          <div><b>Planted:</b> {formatDate(p.PLANTED_DATE)}</div>
          <div><b>Last verified:</b> {formatDate(p.LAST_VERIFY_DATE)}</div>

          <hr style={{ margin: "6px 0" }} />

          <div><b>Rank:</b>{p.TOTAL_RANK}</div>
          <div><b>Total count:</b>{p.TOTAL_COUNT}</div>
        </div> : ""
      }

      {/* Hovered Over Element */}
      {popup ?
        <div className="absolute bg-white p-2 rounded-md text-sm" style={{ top: popup.y, left: popup.x }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            {popup.feature.properties.COMMON_NAME || "Unknown Tree"}
          </div>
          <div>Diameter: {popup.feature.properties.DIAM ? `${popup.feature.properties.DIAM} in` : "—"}</div>

        </div>
        : ""}

    </>
  )
}