import { useEffect, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { ScenegraphLayer } from "@deck.gl/mesh-layers";
import { BitmapLayer, TileLayer } from "deck.gl";
import { getViewportBounds } from "./helpers";

// Only oak model for now
const treeModels = {
  oak: "./models/tree2.glb",
};

const TREE_ZOOM_THRESHOLD = 16;
const DEBOUNCE_MS = 300;

function makeArcGISViewportQuery(bounds: {
  west: number;
  south: number;
  east: number;
  north: number;
}) {
  const geometry = {
    xmin: bounds.west,
    ymin: bounds.south,
    xmax: bounds.east,
    ymax: bounds.north,
    spatialReference: { wkid: 4326 },
  };

  return (
    "https://services.arcgis.com/ZOyb2t4B0UYuYNYH/arcgis/rest/services/SDOT_Trees_CDL/FeatureServer/0/query" +
    `?geometry=${encodeURIComponent(JSON.stringify(geometry))}` +
    "&geometryType=esriGeometryEnvelope" +
    "&spatialRel=esriSpatialRelIntersects" +
    "&outFields=*" +
    "&outSR=4326" +
    "&f=geojson"
  );
}

export default function App() {
  const [viewState, setViewState] = useState<any>({
    longitude: -122.335167,
    latitude: 47.608013,
    zoom: 16,
    pitch: 0,
  });

  const [visibleFeatures, setVisibleFeatures] = useState<any[]>([]);
  const debounceTimer = useRef<number | null>(null);

  // ---- Debounced fetch on view change ----
  useEffect(() => {
    if (viewState.zoom < TREE_ZOOM_THRESHOLD) {
      setVisibleFeatures([]);
      return;
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      const bounds = getViewportBounds(viewState);
      const url = makeArcGISViewportQuery(bounds);

      console.log("Fetching trees for bounds:", bounds);

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const features = data.features ?? [];
          console.log("Trees in view:", features.length);
          setVisibleFeatures(features);
        })
        .catch(err => console.error("ArcGIS fetch error:", err));
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) {
        window.clearTimeout(debounceTimer.current);
      }
    };
  }, [viewState]);

  // ---- Base map ----
  const tileLayer = new TileLayer({
    id: "osm-tiles",
    data: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 20,
    tileSize: 256,
    renderSubLayers: props =>
      new BitmapLayer(props, {
        data: undefined,
        image: props.data,
        bounds: [
          props.tile.bbox.west,
          props.tile.bbox.south,
          props.tile.bbox.east,
          props.tile.bbox.north,
        ],
      }),
  });

  // ---- Trees ----
  const treeLayer =
    viewState.zoom >= TREE_ZOOM_THRESHOLD
      ? new ScenegraphLayer({
          id: "trees",
          data: visibleFeatures,
          pickable: true,
          scenegraph: treeModels.oak,
          getPosition: f => [
            f.geometry.coordinates[0],
            f.geometry.coordinates[1],
            0,
          ],
          getOrientation: [0, 0, 0],
          getScale: [1, 1, 1],
          sizeScale: 1,
          _lighting: 'pbr'
        })
      : null;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        filter: "brightness(1.15) contrast(1) saturate(0.5)",
      }}
    >
      <DeckGL
        initialViewState={viewState}
        controller={{ dragRotate: false }}
        onViewStateChange={e => setViewState(e.viewState)}
        layers={[tileLayer, treeLayer]}
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}