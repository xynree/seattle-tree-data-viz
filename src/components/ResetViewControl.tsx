import type { MapViewState } from "deck.gl";

type ResetViewControlProps = {
  viewState: MapViewState;
  setViewState: (vs: MapViewState) => void;
  userLocation: { longitude: number; latitude: number } | null;
};

export default function ResetViewControl({
  viewState,
  setViewState,
  userLocation,
}: ResetViewControlProps) {
  const handleLocate = () => {
    if (userLocation) {
      setViewState({
        ...viewState,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 18,
        transitionDuration: 1000,
      });
    }
  };

  if (!userLocation) return null;

  function handleOrthographicView() {
    if (userLocation) {
      if (viewState.pitch) {
        setViewState({
          ...viewState,
          pitch: 0,
          bearing: 0,
          transitionDuration: 300,
        });
      } else {
        setViewState({
          ...viewState,
          pitch: 180,
          transitionDuration: 300,
        });
      }
    }
  }

  return (
    <div className="flex gap-2 ">
      <button
        onClick={handleLocate}
        className="w-full flex min-w-18 md:w-auto bg-white p-2.5 rounded-xl shadow-md z-10 hover:bg-gray-100 transition-colors items-center justify-center text-blue-600"
        title="Go to my location"
      >
        <span className="material-symbols-outlined">location_searching</span>
      </button>

      <button
        onClick={handleOrthographicView}
        className="w-full flex min-w-18 bg-white p-2.5 rounded-xl shadow-md z-10 hover:bg-gray-100 transition-colors items-center justify-center text-blue-600"
        title="Toggle orthographic view"
      >
        <span className="material-symbols-outlined">recenter</span>
      </button>
    </div>
  );
}
