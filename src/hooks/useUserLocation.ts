import type { MapViewState } from "deck.gl";
import { useEffect, useState } from "react";
import { SEATTLE_FALLBACK_VIEW } from "../constants";
import { isWithinSeattle } from "../helpers";

export function useUserLocation() {
  const [viewState, setViewState] = useState<MapViewState>(
    SEATTLE_FALLBACK_VIEW,
  );
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
  } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation({ longitude, latitude });
        if (isWithinSeattle(longitude, latitude)) {
          setViewState((vs: MapViewState) => ({
            ...vs,
            longitude,
            latitude,
          }));
        }
      },
      () => {},
      { enableHighAccuracy: true },
    );

    // Watch position
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
        setUserLocation({ longitude, latitude });
      },
      () => {},
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { viewState, setViewState, userLocation };
}
