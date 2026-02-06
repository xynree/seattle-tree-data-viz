import { useMemo } from "react";
import FeaturePanel from "./FeaturePanel";

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function TreeSizeTimeline({ diameter }: { diameter: number }) {
  const { category, progress } = useMemo(() => {
    // Thresholds (inches)
    if (diameter <= 0) return { category: "Unknown", progress: 0 };
    if (diameter < 6)
      return {
        category: "Extra Small",
        progress: Math.min(0, (diameter / 6) * 20),
      };
    if (diameter < 12)
      return { category: "Small", progress: 20 + ((diameter - 6) / 6) * 20 };
    if (diameter < 24)
      return { category: "Medium", progress: 40 + ((diameter - 12) / 6) * 20 };
    if (diameter < 36)
      return { category: "Large", progress: 60 + ((diameter - 24) / 6) * 20 };
    return {
      category: "Extra Large",
      progress: Math.min(100, 80 + ((diameter - 24) / 6) * 20),
    };
  }, [diameter]);

  return (
    <FeaturePanel
      title="Diameter"
      subtitle={`${category} (${diameter}")`}
      content={
        <div className="relative mt-4 mb-2">
          {/* Track */}
          <div className="h-1.5 w-full bg-green-800/30 rounded-full" />

          {/* Labels and Ticks */}
          <div className="flex justify-between mt-2 px-1">
            {SIZES.map((s) => (
              <div key={s} className="flex flex-col items-center">
                <div className="h-1.5 w-0.5 bg-gray-300 mb-1" />
                <span className="text-[10px] font-semibold text-gray-400">
                  {s}
                </span>
              </div>
            ))}
          </div>

          {/* Marker */}
          <div
            className="absolute -top-7 transition-all duration-500 ease-out flex flex-col items-center"
            style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
          >
            <span className="text-2xl drop-shadow-sm">🌳</span>
            <div className="h-[8px] w-[3px] bg-green-700 z-1 mt-[2px]" />
          </div>
        </div>
      }
    />
  );
}
