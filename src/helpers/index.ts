import { WebMercatorViewport, type MapViewState } from "deck.gl";
import type { ControlOptions, TreeFeature } from "../types";

// Returns bounds in degrees
export function getViewportBounds(viewState: MapViewState) {
  const vp = new WebMercatorViewport(viewState);

  // screen coordinates of the four corners
  const corners = [
    [0, 0], // top-left
    [vp.width, 0], // top-right
    [vp.width, vp.height], // bottom-right
    [0, vp.height], // bottom-left
  ];

  // unproject to lon/lat
  const lngLats = corners.map(([x, y]) => vp.unproject([x, y]));

  const lons = lngLats.map((c) => c[0]);
  const lats = lngLats.map((c) => c[1]);

  return {
    west: Math.min(...lons),
    east: Math.max(...lons),
    south: Math.min(...lats),
    north: Math.max(...lats),
  };
}

export function filterGeoJSONByBounds(
  features: TreeFeature[],
  bounds: {
    west: number;
    east: number;
    south: number;
    north: number;
  },
) {
  return features.filter((f) => {
    const [lng, lat] = f.geometry.coordinates;
    return (
      lng >= bounds.west &&
      lng <= bounds.east &&
      lat >= bounds.south &&
      lat <= bounds.north
    );
  });
}

// Deterministic hash from a string/number to 0..1
export function hashToUnit(value: string | number) {
  const str = String(value);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % 360; // degrees 0..359
}

export function makeArcGISViewportQuery(bounds: {
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

export function formatDate(ms?: number | null) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString();
}

export function computeScale({
  f,
  scaleBySize,
}: {
  f: TreeFeature | null;
  scaleBySize: boolean;
}) {
  if (!scaleBySize) return [1, 1, 1] as [number, number, number];

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
}

export function cleanupScientificName(string: string) {
  // Strip anything that has a `[name] indicating type
  // or var. indicating variant
  // or sp. indicating specialty
  return string
    .replace(/\s`.*$/, "")
    .replace(/\s'.*$/, "")
    .replace(/\svar\..*$/, "")
    .replace(/\ssp\..*$/, "");
}

export function processTrees(
  trees: TreeFeature[],
  options: ControlOptions,
): TreeFeature[] {
  if (!options.showRemoved) {
    trees = trees.filter((t) => t.properties.CURRENT_STATUS !== "REMOVED");
  }

  if (!options.showPrivate) {
    trees = trees.filter((t) => t.properties.OWNERSHIP !== "PRIV");
  }

  if (!options.showPlanned) {
    trees = trees.filter((t) => t.properties.CURRENT_STATUS !== "PLANNED");
  }

  return trees;
}

export function snakeToTitleCase(input: string): string {
  return input
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
