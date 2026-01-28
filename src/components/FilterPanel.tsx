import { useMemo } from "react";
import type { TreeFeature } from "../types";

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
      .filter(([genus, _]) => genus !== 'Planting')
      .map(([genus, count]) => ({ genus, count }));
  }, [trees]);

  const handleGenusToggle = (genus: string) => {
    setSelectedGenuses((prev) => {
      if (prev.includes(genus)) {
        // Remove genus from selection
        return prev.filter((g) => g !== genus);
      } else {
        // Add genus to selection
        return [...prev, genus];
      }
    });
  };

  const clearFilters = () => {
    setSelectedGenuses([]);
  };

  return (
    <div className="flex flex-col gap-2 bg-white rounded-xl z-10 relative p-4 shadow-md">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-gray-700">Filter by Genus</h3>
        {selectedGenuses.length > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-blue-600 hover:text-blue-800 underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {topGenuses.map(({ genus, count }) => (
          <div key={genus} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`genus-${genus}`}
              checked={selectedGenuses.includes(genus)}
              onChange={() => handleGenusToggle(genus)}
              className="cursor-pointer"
            />
            <label
              htmlFor={`genus-${genus}`}
              className="text-sm cursor-pointer flex-1"
            >
              <span className="font-medium">{genus}</span>
              <span className="text-gray-500 ml-1">({count.toLocaleString()})</span>
            </label>
          </div>
        ))}
      </div>

      {selectedGenuses.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            {selectedGenuses.length} genus{selectedGenuses.length !== 1 ? "es" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
}
