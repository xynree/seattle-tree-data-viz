import type { ControlOptions } from "../types";

type ControlsCardProps = {
  options: ControlOptions;
  setOptions: React.Dispatch<React.SetStateAction<ControlOptions>>;
};

export default function ControlsCard({
  options,
  setOptions,
}: ControlsCardProps) {
  function handleChange(checked: boolean, id: string) {
    setOptions({
      showRemoved: id === "show-removed" ? checked : options.showRemoved,
      showPrivate: id === "show-private" ? checked : options.showPrivate,
      showPlanned: id === "show-planned" ? checked : options.showPlanned,
      scaleBySize: id === "scale-by-size" ? checked : options.scaleBySize,
      showLabels: id === "show-labels" ? checked : options.showLabels,
      showUserGPS: id === "show-user-gps" ? checked : options.showUserGPS,
    });
  }

  return (
    <div className="flex flex-col gap-1 bg-white whitespace-nowrap rounded-xl z-10 relative p-4 shadow-md h-full md:h-min">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-removed"
          checked={options.showRemoved}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />

        <label htmlFor="show-removed" className="text-sm">
          Removed
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-planned"
          checked={options.showPlanned}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />
        <label htmlFor="show-planned" className="text-sm">
          Planned
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-private"
          checked={options.showPrivate}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />
        <label htmlFor="show-private" className="text-sm">
          Privately Owned
        </label>
      </div>

      <hr className="my-1" />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="scale-by-size"
          checked={options.scaleBySize}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />
        <label htmlFor="scale-by-size" className="text-sm">
          Scale By Size
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-user-gps"
          checked={options.showUserGPS}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />
        <label htmlFor="show-user-gps" className="text-sm">
          Show User Location
        </label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="show-labels"
          checked={options.showLabels}
          onChange={(e) => handleChange(e.target.checked, e.target.id)}
        />
        <label htmlFor="show-labels" className="text-sm">
          Show Labels
        </label>
      </div>
    </div>
  );
}
