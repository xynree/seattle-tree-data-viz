import { useMemo, useState } from "react";
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
  const allGenuses = useMemo(() => {
    const genusCounts = new Map<string, number>();

    trees.forEach((tree) => {
      const genus = tree.properties.GENUS;
      if (genus) {
        genusCounts.set(genus, (genusCounts.get(genus) || 0) + 1);
      }
    });

    return Array.from(genusCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .filter(([genus]) => genus !== "Planting")
      .map(([genus, count]) => ({ genus, count }));
  }, [trees]);

  const [search, setSearch] = useState("");

  const visibleGenuses = useMemo(() => {
    if (!search.trim()) {
      return allGenuses.slice(0, 15);
    }
    const searchLower = search.toLowerCase();
    return allGenuses.filter(({ genus }) => {
      const commonName = COMMON_GENUS_NAME_LOOKUP[genus] || "";
      return (
        genus.toLowerCase().includes(searchLower) ||
        commonName.toLowerCase().includes(searchLower)
      );
    });
  }, [allGenuses, search]);

  const topGenuses = useMemo(() => {
    return allGenuses.slice(0, 15);
  }, [allGenuses]);

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
    <div className="flex flex-col gap-4">
      <h3 className="subtitle px-4">Species</h3>
      <div className="relative">
        <input
          type="text"
          placeholder="Search species.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2.5 pl-9 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500/20 transition-all"
        />
        <span className="text-md! material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
          search
        </span>
      </div>

      <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto scrollbar-hide pr-1 cursor-pointer">
        {[...nonVisibleSelectedGenuses, ...visibleGenuses].map(
          ({ genus, count }) => (
            <label
              key={genus}
              className={`flex items-center gap-3 p-2 px-3 rounded-xl cursor-pointer transition-all duration-200 group ${
                selectedGenuses.includes(genus)
                  ? "bg-green-50/50 hover:bg-green-50"
                  : "hover:bg-black/5"
              }`}
            >
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedGenuses.includes(genus)}
                  onChange={() => handleGenusToggle(genus)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 checked:bg-green-600 checked:border-green-600 transition-all duration-200"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span
                className={`text-sm font-medium transition-colors ${
                  selectedGenuses.includes(genus)
                    ? "text-green-800"
                    : "text-slate-600 group-hover:text-black"
                }`}
              >
                {COMMON_GENUS_NAME_LOOKUP[genus] || genus}
              </span>
              {count > 0 && (
                <span
                  className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                    selectedGenuses.includes(genus)
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </label>
          ),
        )}
      </div>

      {selectedGenuses.length > 0 && (
        <button
          onClick={() => setSelectedGenuses([])}
          className="mt-2 w-full p-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors uppercase tracking-wider"
        >
          Clear
        </button>
      )}

      <h3 className="subtitle px-4">Ownership</h3>
    </div>
  );
}
