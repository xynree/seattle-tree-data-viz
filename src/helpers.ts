import { WebMercatorViewport } from "deck.gl";

// Returns bounds in degrees
export function getViewportBounds(viewState: any) {
  const { longitude, latitude, zoom, width, height } = viewState;
  const viewport = new WebMercatorViewport({ longitude, latitude, zoom, width, height });

  // Get the corners in [lng, lat] (degrees)
  const nw = viewport.unproject([0, 0]); // top-left
  const se = viewport.unproject([width, height]); // bottom-right

  return {
    west: nw[0],
    north: nw[1],
    east: se[0],
    south: se[1],
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
