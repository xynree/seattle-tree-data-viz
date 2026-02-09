import { useEffect, useRef, useState } from "react";
import { getViewportBounds, makeArcGISViewportQuery } from "../helpers";
import type { TreeFeature, TreeFeatureCollection } from "../types";
import type { MapViewState } from "deck.gl";
import { TREE_ZOOM_THRESHOLD } from "../constants";

const DEBOUNCE_MS = 300;

export function useTreesInView(viewState: MapViewState) {
  const [trees, setTrees] = useState<TreeFeature[]>([]);
  const timer = useRef<number | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  }, [viewState, windowSize]);

  return trees;
}
