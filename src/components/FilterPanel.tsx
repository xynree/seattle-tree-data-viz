import { useMemo, useRef } from "react";
import type { TreeFeature } from "../types";
import { COMMON_GENUS_NAME_LOOKUP } from "../constants";

type FilterPanelProps = {
  trees: TreeFeature[];
  selectedGenuses: string[];
  setSelectedGenuses: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function FilterPanel({
  trees,
  selectedGenuses,
  setSelectedGenuses,
}: FilterPanelProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function handleWheelEvent(e: React.WheelEvent) {
    if (e.deltaY !== 0) {
      e.preventDefault();
      scrollContainerRef.current.scrollLeft += e.deltaY;
    }
  }

  // Calculate top genuses from the trees data
  const topGenuses = useMemo(() => {
    const genusCounts = new Map<string, number>();

    // Count occurrences of each genus
    trees.forEach((tree) => {
      const genus = tree.properties.GENUS;
      if (genus) {
        genusCounts.set(genus, (genusCounts.get(genus) || 0) + 1);
      }
    });

    return Array.from(genusCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .filter(([genus]) => genus !== "Planting")
      .map(([genus, count]) => ({ genus, count }));
  }, [trees]);

  const nonVisibleSelectedGenuses = useMemo(() => {
    return selectedGenuses
      .filter((genus) => !topGenuses.some((g) => g.genus === genus))
      .map((g) => ({
        genus: g,
        count: 0,
      }));
  }, [selectedGenuses, topGenuses]);

  function handleGenusToggle(genus: string) {
    setSelectedGenuses((prev) => {
      if (prev.includes(genus)) {
        // Remove genus from selection
        return prev.filter((g) => g !== genus);
      } else {
        // Add genus to selection
        return [...prev, genus];
      }
    });
  }

  return (
    topGenuses.length > 0 && (
      <div
        ref={scrollContainerRef}
        onWheel={handleWheelEvent}
        className="scrollbar-hide flex gap-2 z-10 relative overflow-x-auto"
      >
        <div className="flex gap-2">
          {[...nonVisibleSelectedGenuses, ...topGenuses].map(({ genus }) => (
            <div
              key={genus}
              onClick={() => handleGenusToggle(genus)}
              className={`whitespace-nowrap shadow-md border border-gray-300 bg-white text-sm font-medium p-2 px-3 rounded-2xl h-min cursor-pointer ${selectedGenuses.includes(genus) ? "border border-green-700 bg-green-600! text-white" : ""}`}
            >
              {COMMON_GENUS_NAME_LOOKUP[genus]
                ? COMMON_GENUS_NAME_LOOKUP[genus]
                : genus}
            </div>
          ))}
        </div>

        {selectedGenuses.length > 0 && (
          <button
            onClick={() => setSelectedGenuses([])}
            className="p-2 px-4 text-sm rounded-2xl flex items-center gap-2 text-green-800 bg-green-100 border-green-500 border font-medium"
          >
            Clear
          </button>
        )}
      </div>
    )
  );
}
