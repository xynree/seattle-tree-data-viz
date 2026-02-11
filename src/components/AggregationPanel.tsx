import { useMemo } from "react";
import type { TreeFeature } from "../types";
import { COMMON_GENUS_NAME_LOOKUP } from "../constants";
import AggregationCard from "./AggregationCard";

export default function AggregationPanel({
  trees,
}: {
  trees: TreeFeature[] | null;
}) {
  const stats = useMemo(() => {
    if (!trees || trees.length === 0) return null;

    let totalDiameter = 0;
    let diameterCount = 0;
    let totalAge = 0;
    let ageCount = 0;
    const genusCounts: Record<string, number> = {};
    const conditionCounts: Record<string, number> = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };

    trees.forEach((tree) => {
      const p = tree.properties;

      // Diameter
      if (p.DIAM && p.DIAM > 0) {
        totalDiameter += p.DIAM;
        diameterCount++;
      }

      // Age - PLANTED_DATE is a timestamp in ms
      if (p.PLANTED_DATE) {
        const ageInYears =
          (Date.now() - p.PLANTED_DATE) / (1000 * 60 * 60 * 24 * 365.25);
        if (ageInYears > 0) {
          totalAge += ageInYears;
          ageCount++;
        }
      }

      // Genus
      if (p.GENUS) {
        genusCounts[p.GENUS] = (genusCounts[p.GENUS] || 0) + 1;
      }

      // Condition Rating
      if (p.CONDITION_RATING) {
        const rating = p.CONDITION_RATING.trim();
        if (rating in conditionCounts) {
          conditionCounts[rating]++;
        }
      }
    });

    const topSpecies = Object.entries(genusCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([genus, count]) => ({
        name: COMMON_GENUS_NAME_LOOKUP[genus] || genus,
        count,
      }));

    return {
      total: trees.length,
      avgDiameter:
        diameterCount > 0 ? (totalDiameter / diameterCount).toFixed(1) : "—",
      avgAge: ageCount > 0 ? (totalAge / ageCount).toFixed(1) : "—",
      topSpecies,
      conditionCounts,
    };
  }, [trees]);

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
        <span className="material-symbols-outlined text-4xl">analytics</span>
        <span className="text-sm">No trees in view for analysis</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 overflow-y-auto scrollbar-hide pb-6 px-4">
      {/* Overview Stats */}
      <div className="flex flex-col gap-3">
        <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs flex justify-between items-center px-6">
          <span className="subtitle">Total Trees</span>
          <span className="text-xl font-bold text-slate-800">
            {stats.total.toLocaleString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs flex flex-col gap-1 px-6">
            <span className="subtitle">Avg. Age</span>
            <span className="text-lg font-bold text-slate-800">
              {stats.avgAge !== "—" ? `${stats.avgAge} yrs` : "—"}
            </span>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs flex flex-col gap-1 px-6">
            <span className="subtitle">Avg. Diameter</span>
            <span className="text-lg font-bold text-slate-800">
              {stats.avgDiameter !== "—" ? `${stats.avgDiameter}"` : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="flex flex-col gap-3">
        <h3 className="subtitle">Distribution</h3>
        <AggregationCard trees={trees} />
      </div>

      {/* Top Species */}
      <div className="flex flex-col gap-3">
        <h3 className="subtitle">Top Species</h3>
        <div className="flex flex-col gap-2">
          {stats.topSpecies.map((s) => (
            <div
              key={s.name}
              className="flex justify-between items-center bg-white border border-slate-100 p-3 px-4 rounded-xl shadow-xs"
            >
              <span className="text-sm font-medium text-slate-700">
                {s.name}
              </span>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                {s.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Condition Rating */}
      <div className="flex flex-col gap-4">
        <h3 className="subtitle">Condition</h3>
        <div className="flex flex-col gap-6 bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
          <div className="flex flex-col gap-5">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.conditionCounts[rating.toString()] || 0;
              const percentage =
                stats.total > 0 ? (count / stats.total) * 100 : 0;

              const ratingColors: Record<number, string> = {
                5: "bg-emerald-500",
                4: "bg-green-500",
                3: "bg-yellow-500",
                2: "bg-orange-500",
                1: "bg-red-500",
              };

              const ratingLabels: Record<number, string> = {
                5: "Excellent",
                4: "Great",
                3: "Good",
                2: "Fair",
                1: "Poor",
              };

              const color = ratingColors[rating];

              return (
                <div key={rating} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-2 items-center">
                      <span
                        className={`text-sm font-bold text-gray-600 leading-none`}
                      >
                        {rating}
                      </span>
                      {ratingLabels[rating] && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                          {ratingLabels[rating]}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 items-baseline text-xs">
                      <span
                        className={`text-gray-400 text-xs px-2 py-0.5 rounded-full`}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
