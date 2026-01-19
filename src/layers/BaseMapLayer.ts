// @ts-nocheck
import { BitmapLayer, TileLayer } from "deck.gl";

export function BaseMapLayer() {
  return new TileLayer({
    id: "osm-tiles",
    data: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 20,
    tileSize: 256,
    renderSubLayers: props =>
      props.data
        ? new BitmapLayer({
            id: `${props.id}-bitmap`,
            image: props.data,
            bounds: [
              props.tile.bbox.west,
              props.tile.bbox.south,
              props.tile.bbox.east,
              props.tile.bbox.north,
            ],
            // optional: pickable, etc.
          })
        : null,
  });
}