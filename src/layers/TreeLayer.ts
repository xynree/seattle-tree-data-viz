import { ScenegraphLayer } from "@deck.gl/mesh-layers";

const treeModel = "./models/tree2.glb";

type TreeLayerProps = {
  trees: any[];
  sizeScale?: number;
};

export function TreeLayer({ trees, sizeScale = 1, }: TreeLayerProps) {
  if (!trees.length) return null;

  return new ScenegraphLayer({
    id: "trees",
    data: trees,
    pickable: true,
    scenegraph: treeModel,
    getPosition: f => [f.geometry.coordinates[0], f.geometry.coordinates[1], 0],
    getOrientation: [0, 0, 0],
    sizeScale,
    _lighting: "pbr",
  });
}