import { featureTextFormatters } from "../config";
import type { TreeFeature, TreeProperties } from "../types";

export default function MousePopup({
  popup,
}: {
  popup: {
    x: number;
    y: number;
    feature: TreeFeature;
  };
}) {
  const p = popup.feature.properties;

  const VIEWABLE_PROPS: (keyof TreeProperties)[] = [
    "DIAM",
    "SCIENTIFIC_NAME",
    "PLANTED_DATE",
  ];

  return (
    <div
      className="fixed text-white border border-black bg-black/80 p-2 px-3 rounded-xl text-sm z-10"
      style={{ top: popup.y + 15, left: popup.x + 10 }}
    >
      <div className="font-bold text-sm">{p.COMMON_NAME || "Unknown Tree"}</div>
      {VIEWABLE_PROPS.map((prop) => (
        <div className="text-xs" key={prop}>
          <span className="font-medium">{prop}</span>:{" "}
          {featureTextFormatters?.[prop]?.(p[prop] ?? "") ?? p[prop]}
        </div>
      ))}
    </div>
  );
}
