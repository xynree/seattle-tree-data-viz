import type { MapViewState } from "deck.gl";
import { useEffect, useRef, useState } from "react";
import { SEATTLE_FALLBACK_VIEW } from "../constants";
import { isWithinSeattle } from "../helpers";

export function useUserLocation() {
  const [viewState, setViewState] = useState<MapViewState>(
    SEATTLE_FALLBACK_VIEW,
  );
  const [userLocation, setUserLocation] = useState<{
    longitude: number;
    latitude: number;
    heading: number | null;
  } | null>(null);

  const lastUpdateTime = useRef<number>(0);

  useEffect(() => {
    if (!navigator.geolocation) return;

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude, heading } = pos.coords;
        setUserLocation({ longitude, latitude, heading: heading ?? null });
        lastUpdateTime.current = Date.now();
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

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const now = Date.now();
        const { longitude, latitude, heading } = pos.coords;

        setUserLocation({ longitude, latitude, heading });
        lastUpdateTime.current = now;
      },
      () => {},
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { viewState, setViewState, userLocation };
}
