import { useEffect, useRef, useState } from "react";
import { getViewportBounds, makeArcGISViewportQuery } from "../helpers";
import type { TreeFeature, TreeFeatureCollection } from "../types";
import type { MapViewState } from "deck.gl";

const TREE_ZOOM_THRESHOLD = 12;
const DEBOUNCE_MS = 300;

export function useTreesInView(viewState: MapViewState) {
  const [trees, setTrees] = useState<TreeFeature[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (viewState.zoom < TREE_ZOOM_THRESHOLD) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTrees([]);
      return;
    }

    if (timer.current) window.clearTimeout(timer.current);

    timer.current = window.setTimeout(() => {
      const bounds = getViewportBounds(viewState);
      const url = makeArcGISViewportQuery(bounds);

      fetch(url)
        .then((r) => r.json())
        .then((d: TreeFeatureCollection) => setTrees(d.features ?? []))
        .catch(console.error);
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [viewState]);

  return trees;
}
