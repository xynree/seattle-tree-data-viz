import { useMemo, useState } from "react";
import type { ControlOptions, TreeFeature } from "../types";
import { COMMON_GENUS_NAME_LOOKUP } from "../constants";
import ControlsCard from "./ControlsCard";
import { Divider } from "@mui/material";

const FilterItem = ({
  label,
  count,
  checked,

  onToggle,
}: {
  label: string;
  count?: number;
  checked: boolean;

  onToggle: () => void;
}) => (
  <label
    className={`flex items-center gap-3 p-2 px-3 rounded-xl cursor-pointer transition-all duration-200 group ${
      checked ? "bg-green-50/50 hover:bg-green-50" : "hover:bg-black/5"
    }`}
  >
    <div className="relative flex items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
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
        checked ? "text-green-800" : "text-slate-600 group-hover:text-black"
      }`}
    >
      {label}
    </span>
    {count > 0 && (
      <span
        className={`ml-auto text-[10px] font-bold px-2 py-1 rounded-full transition-colors ${
          checked
            ? "bg-green-100 text-green-700"
            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
        }`}
      >
        {count}
      </span>
    )}
  </label>
);

type FilterPanelProps = {
  trees: TreeFeature[];
  selectedGenuses: string[];
  setSelectedGenuses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatus: string[];
  setSelectedStatus: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOwnership: string[];
  setSelectedOwnership: React.Dispatch<React.SetStateAction<string[]>>;
  options: ControlOptions;
  setOptions: React.Dispatch<React.SetStateAction<ControlOptions>>;
};

export default function FilterPanel({
  trees,
  selectedGenuses,
  setSelectedGenuses,
  selectedStatus,
  setSelectedStatus,
  selectedOwnership,
  setSelectedOwnership,
  options,
  setOptions,
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

  const displayedGenuses = useMemo(() => {
    const baseList = visibleGenuses;

    // Identify selected items that aren't in the current view
    const extraSelected = selectedGenuses
      .filter((genus) => !baseList.some((g) => g.genus === genus))
      .map((genus) => ({
        genus,
        count: allGenuses.find((g) => g.genus === genus)?.count || 0,
      }));

    return [...extraSelected, ...baseList];
  }, [visibleGenuses, selectedGenuses, allGenuses]);

  function handleToggle(
    value: string,
    _selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  return (
    <div className="flex flex-col gap-12 overflow-y-auto scrollbar-hide pb-6">
      <div className="flex flex-col gap-4">
        <ControlsCard options={options} setOptions={setOptions} />

        <Divider />

        <div className="flex justify-between items-center h-8">
          <h3 className="subtitle px-4">Species</h3>

          {selectedGenuses.length > 0 && (
            <button
              onClick={() => setSelectedGenuses([])}
              className="mt-2 cursor-pointer h-6 p-3 px-4 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-colors uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search species.."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-9 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500/20 transition-all"
          />
          <span className="text-md! material-symbols-outlined text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4">
            search
          </span>
        </div>

        <div className="flex flex-col gap-1 overflow-y-auto scrollbar-hide pr-1 cursor-pointer">
          {displayedGenuses.map(({ genus, count }) => (
            <FilterItem
              key={genus}
              label={COMMON_GENUS_NAME_LOOKUP[genus] || genus}
              count={count}
              checked={selectedGenuses.includes(genus)}
              onToggle={() =>
                handleToggle(genus, selectedGenuses, setSelectedGenuses)
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="subtitle px-4">Ownership</h3>
        <div className="flex flex-col gap-2">
          <FilterItem
            label="SDOT"
            checked={selectedOwnership.includes("SDOT")}
            onToggle={() =>
              handleToggle("SDOT", selectedOwnership, setSelectedOwnership)
            }
          />
          <FilterItem
            label="Private"
            checked={selectedOwnership.includes("PRIV")}
            onToggle={() =>
              handleToggle("PRIV", selectedOwnership, setSelectedOwnership)
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="subtitle px-4">Status</h3>
        <div className="flex flex-col gap-2">
          <FilterItem
            label="In Service"
            checked={selectedStatus.includes("INSVC")}
            onToggle={() =>
              handleToggle("INSVC", selectedStatus, setSelectedStatus)
            }
          />
          <FilterItem
            label="Planned"
            checked={selectedStatus.includes("PLANNED")}
            onToggle={() =>
              handleToggle("PLANNED", selectedStatus, setSelectedStatus)
            }
          />
          <FilterItem
            label="Removed"
            checked={selectedStatus.includes("REMOVED")}
            onToggle={() =>
              handleToggle("REMOVED", selectedStatus, setSelectedStatus)
            }
          />
        </div>
      </div>
    </div>
  );
}
