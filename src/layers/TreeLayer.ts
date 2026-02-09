import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM } from "deck.gl";
import { computeScale, hashToUnit } from "../helpers";
import type { ControlOptions, TreeFeature } from "../types";
import { TREE_MODEL_PATH } from "../constants";

type TreeLayerProps = {
  trees: TreeFeature[];
  options: ControlOptions;
  selectedId: string | number | null;
};

export function TreeLayer({ trees, options, selectedId }: TreeLayerProps) {
  if (!trees.length) return null;

  return new ScenegraphLayer({
    id: "trees",
    data: trees,
    pickable: true,
    scenegraph: TREE_MODEL_PATH,
    getPosition: (f: TreeFeature) => [
      f.geometry.coordinates[0],
      f.geometry.coordinates[1],
      0,
    ],
    getOrientation: (f: TreeFeature) => {
      const yaw = hashToUnit(f.id) * 360; // 0..360 degrees
      return [yaw, 0, 0]; // yaw, pitch, roll
    },
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    sizeScale: 1,
    getColor: (f: TreeFeature) => {
      const isPlanned = f.properties?.CURRENT_STATUS === "PLANNED";
      const isSelected = selectedId && f.id === selectedId;

      if (isPlanned) {
        // Gray color with reduced opacity for planned trees
        return [255, 255, 255, 120] as [number, number, number, number];
      }

      if (isSelected) {
        // Example: bright red for selected tree
        return [255, 100, 255, 255] as [number, number, number, number];
      }

      // Normal trees - full opacity
      return [255, 255, 255, 255] as [number, number, number, number];
    },
    getScale: (f: TreeFeature) => {
      const baseScale = computeScale({ f, scaleBySize: options.scaleBySize });
      if (selectedId && f.id === selectedId) {
        return baseScale.map((s) => s * 1.05) as [number, number, number];
      }
      return baseScale;
    },
    updateTriggers: {
      getColor: [selectedId],
      getScale: [selectedId],
    },
    _lighting: "pbr",
  });
}
