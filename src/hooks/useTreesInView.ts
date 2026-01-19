import { useEffect, useRef, useState } from "react";
import { getViewportBounds, makeArcGISViewportQuery } from "../helpers";

const TREE_ZOOM_THRESHOLD = 16;
const DEBOUNCE_MS = 300;

export function useTreesInView(viewState: any) {
  const [trees, setTrees] = useState<any[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (viewState.zoom < TREE_ZOOM_THRESHOLD) {
      setTrees([]);
      return;
    }

    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      const bounds = getViewportBounds(viewState);
      const url = makeArcGISViewportQuery(bounds);

      fetch(url)
        .then(r => r.json())
        .then(d => setTrees(d.features ?? []))
        .catch(console.error);
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [viewState]);

  return trees;
}