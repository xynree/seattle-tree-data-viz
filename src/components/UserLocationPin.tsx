import type { MapViewState } from "deck.gl";

type UserLocationPinProps = {
  viewState: MapViewState;
  setViewState: (vs: MapViewState) => void;
  userLocation: { longitude: number; latitude: number } | null;
};

export default function UserLocationPin({
  viewState,
  setViewState,
  userLocation,
}: UserLocationPinProps) {
  const handleLocate = () => {
    if (userLocation) {
      setViewState({
        ...viewState,
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        zoom: 17,
        transitionDuration: 1000,
      });
    }
  };

  if (!userLocation) return null;

  return (
    <button
      onClick={handleLocate}
      className="bg-white p-2.5 rounded-xl shadow-md z-10 hover:bg-gray-100 transition-colors flex items-center justify-center text-blue-600"
      title="Go to my location"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-6 h-6"
      >
        <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
      </svg>
    </button>
  );
}
