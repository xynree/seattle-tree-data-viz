import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM } from "deck.gl";
import { hashToUnit } from "../helpers";
import type { ControlOptions } from "../types/controls.types";

const treeModel = "/seattle-tree-data-viz/models/tree2.glb";

type TreeLayerProps = {
  trees: any[];
  options: ControlOptions
};

export function TreeLayer({ trees, options}: TreeLayerProps) {
  if (!trees.length) return null;

  if (!options.showRemoved) {
    trees = trees.filter((t) => t.properties.CURRENT_STATUS !== "REMOVED")
  }

  if (!options.showPrivate) {
    trees = trees.filter((t) => t.properties.OWNERSHIP !== "PRIV" )
  }

  if (!options.showPlanned) {
    trees = trees.filter((t) => t.properties.CURRENT_STATUS !== "PLANNED" )
  }

  return new ScenegraphLayer({
    id: "trees",
    data: trees,
    pickable: true,
    scenegraph: treeModel,
    getPosition: f => [f.geometry.coordinates[0], f.geometry.coordinates[1], 0],
    getOrientation: f => {
      const id = f.properties?.id || f.id; // whatever uniquely identifies the tree
      const yaw = hashToUnit(id) * 360;   // 0..360 degrees
      return [yaw, 0, 0];                 // yaw, pitch, roll
    },    
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    sizeScale: 1,
    getColor: f => {
      const isPlanned = f.properties?.CURRENT_STATUS === "PLANNED";
      if (isPlanned) {
        // Gray color with reduced opacity for planned trees
        return [255, 255, 255, 120] as [number, number, number, number]; 
      }
      // Normal trees - full opacity
      return [255, 255, 255, 255] as [number, number, number, number];
    },
    getScale: f => {
      if (!options.scaleBySize) return [1, 1, 1] as [number, number, number];
      
      const diameter = f.properties?.DIAM;
      if (!diameter || diameter <= 0) return [1, 1, 1] as [number, number, number];
      
      // Normalize diameter to a reasonable scale range
      // Trees typically range from 2-50 inches diameter
      // Scale from 0.3 to 3.0 for good visual range
      const normalizedScale = 0.3 + (diameter / 50) * 2.7;
      
      // Clamp the final scale to min/max values
      const minScale = 0.1;
      const maxScale = 6.0;
      const clampedScale = Math.max(minScale, Math.min(maxScale, normalizedScale));
      
      return [clampedScale, clampedScale, clampedScale] as [number, number, number];
    },
    _lighting: "pbr",
  });
}
