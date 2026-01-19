// src/TreePopup.tsx

type TreePopupProps = {
  x: number;
  y: number;
  feature: any;
  onClose: () => void;
};

function formatDate(ms?: number | null) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString();
}

export default function TreePopup({
  x,
  y,
  feature,
  onClose,
}: TreePopupProps) {
  const p = feature.properties ?? {};

  return (
    <div
    className="absolute bg-white p-6 rounded-md max-w-2xl z-10 shadow-md"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -100%)",
        pointerEvents: "auto",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        🌳 {p.COMMON_NAME || "Unknown Tree"}
      </div>

      <div><b>Scientific:</b> {p.SCIENTIFIC_NAME || "—"}</div>
      <div><b>Genus:</b> {p.GENUS || "—"}</div>
      <div><b>Diameter:</b> {p.DIAM ? `${p.DIAM} in` : "—"}</div>
      <div><b>Grow space:</b> {p.GROWSPACE ?? "—"} ft²</div>
      <div><b>Condition rating:</b> {p.CONDITION_RATING || "—"}</div>

      <hr style={{ margin: "6px 0" }} />

      <div><b>Ownership:</b> {p.OWNERSHIP || "—"}</div>
      <div><b>Status:</b> {p.CURRENT_STATUS || "—"}</div>
      <div><b>Planted:</b> {formatDate(p.PLANTED_DATE)}</div>
      <div><b>Last verified:</b> {formatDate(p.LAST_VERIFY_DATE)}</div>

    </div>
  );
}