export default function useStreetViewLink(location?: GeoJSON.Position) {
  if (!location) return "";
  const [lng, lat] = location;

  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}
