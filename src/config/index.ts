import type { ControlOptions, TreeProperties } from "../types";

export const defaultControls: ControlOptions = {
  showRemoved: false,
  showPrivate: true,
  showPlanned: false,
  scaleBySize: true,
  showLabels: false,
  showUserGPS: true,
};

export const featureTextFormatters: Partial<
  Record<keyof TreeProperties, (value: string | number | null) => string>
> = {
  CURRENT_STATUS: (value: string) => {
    if (value === "INSVC") return "In Service";
    if (value === "REMOVED") return "Removed";
    if (value === "PLANNED") return "Planned";
  },
  CONDITION_ASSESSMENT_DATE: (value: number) =>
    new Date(value).toLocaleDateString(),
  CURRENT_STATUS_DATE: (value: number) => new Date(value).toLocaleDateString(),
  LAST_VERIFY_DATE: (value: number) => new Date(value).toLocaleDateString(),
  PLANTED_DATE: (value: number) => new Date(value).toLocaleDateString(),
  SHAPE_LNG: (value: number) => `${value.toFixed(4)}°`,
  SHAPE_LAT: (value: number) => `${value.toFixed(4)}°`,
  DIAM: (value: number) => `${value} in`,
  OWNERSHIP: (value: string) => (value === "PRIV" ? "Private" : value),
  PRIMARYDISTRICTCD: (value: string) => value.replace("DISTRICT", "").trim(),
};
