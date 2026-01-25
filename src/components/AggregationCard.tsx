import { useEffect, useRef } from "react";
import type { TreeFeature } from "../types";
import Chart from "chart.js/auto";

export default function AggregationCard({
  features,
}: {
  features: TreeFeature[] | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const DEBOUNCE_DELAY = 1000; // 1s debounce

  useEffect(() => {
    if (!canvasRef.current || !features.length) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      const genusCounts = features.reduce(
        (acc, curr) => {
          if (curr.properties.GENUS) {
            acc[curr.properties.GENUS] = (acc[curr.properties.GENUS] || 0) + 1;
          }

          return acc;
        },
        {} as Record<string, number>,
      );

      chartRef.current = new Chart(canvasRef.current, {
        type: "doughnut",
        options: {
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Distribution of Genuses in View",
            },
          },
        },
        data: {
          labels: Object.keys(genusCounts),
          datasets: [
            {
              label: "Trees in Genus: ",
              data: Object.values(genusCounts).sort((a, b) => b - a),
            },
          ],
        },
      });
    }, DEBOUNCE_DELAY);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [features]);

  return (
    <div className="text-sm flex flex-col items-center gap-2 bg-white shadow-sm relative p-3 rounded-xl z-10 h-min">
      <canvas ref={canvasRef} />
    </div>
  );
}
