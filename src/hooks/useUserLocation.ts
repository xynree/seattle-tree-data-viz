import type { MapViewState } from "deck.gl";
import { useEffect, useState } from "react";
import { SEATTLE_FALLBACK_VIEW } from "../constants";
import { isWithinSeattle } from "../helpers";

export function useUserLocation() {
  const [viewState, setViewState] = useState<MapViewState>(
    SEATTLE_FALLBACK_VIEW,
  );

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { longitude, latitude } = pos.coords;
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
  }, []);

  return [viewState, setViewState] as const;
}
