import { ScatterplotLayer } from "@deck.gl/layers";

type UserLocationLayerProps = {
  userLocation: { longitude: number; latitude: number } | null;
};

export function UserLocationLayer({ userLocation }: UserLocationLayerProps) {
  if (!userLocation) return [];

  const { longitude, latitude } = userLocation;

  return [
    // Pulse effect
    new ScatterplotLayer<{ position: [number, number] }>({
      id: "user-location-pulse",
      data: [{ position: [longitude, latitude] }],
      getPosition: (d) => d.position,
      getRadius: 6,
      getFillColor: [0, 150, 255, 100],
      stroked: false,
      pickable: false,
    }),
    // Center dot
    new ScatterplotLayer<{ position: [number, number] }>({
      id: "user-location-dot",
      data: [{ position: [longitude, latitude] }],
      getPosition: (d) => d.position,
      getRadius: 2,
      getFillColor: [255, 255, 255, 255],
      getLineColor: [0, 120, 255, 255],
      lineWidthMinPixels: 2,
      stroked: true,
      pickable: false,
    }),
  ];
}
