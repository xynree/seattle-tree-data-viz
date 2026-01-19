import { useEffect, useState } from "react";

const SEATTLE_FALLBACK_VIEW = {
  longitude: -122.335167,
  latitude: 47.608013,
  zoom: 18,
  pitch: 0,
};

export function useUserLocation() {
  const [viewState, setViewState] = useState<any>(SEATTLE_FALLBACK_VIEW);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      pos => {
        setViewState((vs:any) => ({
          ...vs,
          longitude: pos.coords.longitude,
          latitude: pos.coords.latitude,
        }));
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  return [viewState, setViewState] as const;
}