import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM } from "deck.gl";
import { hashToUnit } from "../helpers";

const treeModel = "./models/tree2.glb";

type TreeLayerProps = {
  trees: any[];
  sizeScale?: number;
  showRemoved?: boolean
};

export function TreeLayer({ trees, sizeScale = 1, showRemoved = false }: TreeLayerProps) {
  if (!trees.length) return null;

  if (!showRemoved) {
    trees = trees.filter((t) => t.properties.CURRENT_STATUS !== "REMOVED")
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
    sizeScale,
    _lighting: "pbr",
  });
}
