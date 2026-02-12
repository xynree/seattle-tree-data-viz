import { useEffect, useRef } from "react";
import type { TreeFeature } from "../types";
import Chart from "chart.js/auto";
import { COMMON_GENUS_NAME_LOOKUP } from "../constants";

export default function AggregationCard({
  trees,
}: {
  trees: TreeFeature[] | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !trees.length) return;

    const genusCounts = trees.reduce(
      (acc, curr) => {
        if (curr.properties.GENUS) {
          acc[curr.properties.GENUS] = (acc[curr.properties.GENUS] || 0) + 1;
        }

        return acc;
      },
      {} as Record<string, number>,
    );

    const sortedEntries = Object.entries(genusCounts).sort(
      ([, a], [, b]) => b - a,
    );
    const labels = sortedEntries.map(
      ([genus]) => COMMON_GENUS_NAME_LOOKUP[genus] || genus,
    );
    const data = sortedEntries.map(([, count]) => count);

    // Update existing chart or create new one
    if (chartRef.current) {
      // Update existing chart data
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
    } else {
      // Create new chart
      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        options: {
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
              text: "Genuses",
            },
          },
        },
        data: {
          labels,
          datasets: [
            {
              data,
            },
          ],
        },
      });
    }
  }, [trees]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, []);

  return (
    <div className="text-sm flex flex-col items-center gap-2 bg-white border border-slate-100 shadow-xs relative p-3 rounded-xl z-10 h-min px-6 py-4">
      <canvas ref={canvasRef} />
    </div>
  );
}
