import { IconLayer, ScatterplotLayer } from "@deck.gl/layers";

type UserLocationLayerProps = {
  userLocation: {
    longitude: number;
    latitude: number;
    heading: number | null;
  } | null;
};

export function UserLocationLayer({ userLocation }: UserLocationLayerProps) {
  if (!userLocation) return [];

  const { longitude, latitude, heading } = userLocation;

  const layers: (
    | ScatterplotLayer<{ position: [number, number] }>
    | IconLayer<{ position: [number, number]; angle: number }>
  )[] = [
    // Pulse effect (always shown)
    new ScatterplotLayer<{ position: [number, number] }>({
      id: "user-location-pulse",
      data: [{ position: [longitude, latitude] }],
      getPosition: (d) => d.position,
      getRadius: 6,
      getFillColor: [0, 150, 255, 100],
      stroked: false,
      pickable: false,
    }),
    // Center dot (always shown)
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

  // Add directional indicator bar on the rim if heading is available
  if (heading !== null) {
    layers.push(
      new IconLayer<{ position: [number, number]; angle: number }>({
        id: "user-location-heading",
        data: [{ position: [longitude, latitude], angle: heading }],
        getPosition: (d) => d.position,
        getIcon: () => ({
          url:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="2" width="4" height="8" fill="white" stroke="#0078FF" stroke-width="1" rx="2"/>
            </svg>
          `),
          width: 32,
          height: 32,
          anchorY: 16,
        }),
        getSize: 32,
        getAngle: (d) => -(d.angle - 90),
        pickable: false,
      }),
    );
  }

  return layers;
}
