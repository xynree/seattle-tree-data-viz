import type { TreeFeature } from "../types";

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

  return (
    <div
      className="fixed bg-white p-2 rounded-md text-sm z-10"
      style={{ top: popup.y, left: popup.x }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        {p.COMMON_NAME || "Unknown Tree"}
      </div>
      <div>Diameter: {p.DIAM ? `${p.DIAM} in` : "—"}</div>
    </div>
  );
}
