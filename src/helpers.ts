import { WebMercatorViewport } from "deck.gl";

// Returns bounds in degrees
export function getViewportBounds(viewState) {
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
  
  const lons = lngLats.map(c => c[0]);
  const lats = lngLats.map(c => c[1]);

  return {
    west: Math.min(...lons),
    east: Math.max(...lons),
    south: Math.min(...lats),
    north: Math.max(...lats),
  };
}

export function filterGeoJSONByBounds(features: any[], bounds: any) {
  return features.filter(f => {
    const [lng, lat] = f.geometry.coordinates;
    return (
      lng >= bounds.west &&
      lng <= bounds.east &&
      lat >= bounds.south &&
      lat <= bounds.north
    );
  });
}

// Simple deterministic hash from a string/number to 0..1
export function hashToUnit(value: string | number) {
  let str = String(value);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return (hash % 360) ; // degrees 0..359
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