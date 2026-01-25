import type { MapViewState } from "deck.gl";
import { useEffect, useState } from "react";
import { SEATTLE_FALLBACK_VIEW } from "../constants";

export function useUserLocation() {
  const [viewState, setViewState] = useState<MapViewState>(
    SEATTLE_FALLBACK_VIEW,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setViewState((vs: MapViewState) => ({
          ...vs,
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        }));
      },
      () => {},
      { enableHighAccuracy: true },
    );
  }, []);

  return [viewState, setViewState] as const;
}
