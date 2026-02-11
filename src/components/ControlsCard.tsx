import { Tooltip } from "@mui/material";
import type { ControlOptions } from "../types";

const ControlButton = ({
  label,
  icon,
  checked,
  onToggle,
}: {
  label: string;
  icon: string;
  checked: boolean;
  onToggle: () => void;
}) => (
  <Tooltip title={label} arrow placement="top">
    <button
      onClick={onToggle}
      className={`flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-200 group flex-1 ${
        checked
          ? "bg-green-50 text-green-800 border-green-100 shadow-sm"
          : "bg-transparent text-slate-400 hover:bg-black/5 border-transparent"
      } border`}
    >
      <span
        className={`material-symbols-outlined text-[24px] transition-colors ${
          checked
            ? "text-green-600"
            : "text-slate-400 group-hover:text-slate-500"
        }`}
      >
        {icon}
      </span>
    </button>
  </Tooltip>
);

type ControlsCardProps = {
  options: ControlOptions;
  setOptions: React.Dispatch<React.SetStateAction<ControlOptions>>;
};

export default function ControlsCard({
  options,
  setOptions,
}: ControlsCardProps) {
  function handleToggle(id: keyof ControlOptions) {
    setOptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="subtitle px-4">Controls</h3>
      <div className="flex flex-row gap-2 px-2">
        <ControlButton
          label="Scale Trees By Size"
          icon="expand"
          checked={options.scaleBySize}
          onToggle={() => handleToggle("scaleBySize")}
        />
        <ControlButton
          label="Show User Location"
          icon="my_location"
          checked={options.showUserGPS}
          onToggle={() => handleToggle("showUserGPS")}
        />
        <ControlButton
          label="Toggle Labels"
          icon="label"
          checked={options.showLabels}
          onToggle={() => handleToggle("showLabels")}
        />
      </div>
    </div>
  );
}
