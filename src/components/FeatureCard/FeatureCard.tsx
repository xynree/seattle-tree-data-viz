import { useMemo, useState } from "react";
import type { TreeFeature, TreeProperties } from "../../types";
import useStreetViewLink from "../../hooks/useStreetViewLink";
import { featureTextFormatters } from "../../config";
import { formatDate, snakeToTitleCase, timeAgo } from "../../helpers";
import WikipediaSummary from "./components/WikipediaSummary";
import TreeSizeTimeline from "./components/TreeSizeTimeline";
import FeaturePanel from "./components/FeaturePanel";
import { Drawer, useMediaQuery, useTheme } from "@mui/material";

export default function FeatureCard({
  feature,
  setFeature,
}: {
  feature: TreeFeature | null;
  setFeature: (feature: TreeFeature | null) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const streetViewLink = useStreetViewLink(feature?.geometry.coordinates);

  const properties = useMemo(() => {
    if (feature?.properties) {
      return Object.entries(feature.properties).filter(([, value]) => value);
    } else return [];
  }, [feature]) as [
    keyof TreeProperties,
    TreeProperties[keyof TreeProperties],
  ][];

  const [showMoreInfo, setShowMoreInfo] = useState(true);

  return (
    <Drawer
      anchor="left"
      open={!!feature}
      onClose={() => setFeature(null)}
      variant={isMobile ? "temporary" : "persistent"}
      slotProps={{
        paper: {
          className:
            "w-full md:w-md bg-white/95 backdrop-blur-xl border-r border-gray-200 shadow-none pointer-events-auto",
        },
      }}
      sx={{
        pointerEvents: isMobile ? "auto" : "none",
      }}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <div className="flex flex-col gap-3 p-6 h-full overflow-y-auto scrollbar-hide">
        <div className="flex justify-between items-center">
          {/* Header Left */}
          <div className="flex gap-4 items-center">
            {/* Back Button */}
            <button
              onClick={() => setFeature(null)}
              className="cursor-pointer hover:bg-black/5 p-2 rounded-full transition-colors material-symbols-outlined text-gray-500 text-[28px]"
            >
              arrow_back
            </button>

            {/* Title & Subtitle */}
            <div className="flex flex-col">
              <div className="font-bold text-xl text-slate-800 leading-tight">
                {feature?.properties.COMMON_NAME || "Unknown Tree"}
              </div>
              <div className="italic text-xs text-slate-500">
                {feature?.properties.SCIENTIFIC_NAME || "—"}
              </div>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex gap-2">
            {/* Street View Button */}
            <a
              href={streetViewLink}
              target="_blank"
              title="View on Google Maps"
              className="flex items-center justify-center bg-green-50 hover:bg-green-100 border border-emerald-900/20 text-green-800 transition-colors p-3 rounded-full h-12 w-12 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                map_search
              </span>
            </a>
          </div>
        </div>

        <WikipediaSummary
          key={feature?.properties.SCIENTIFIC_NAME}
          scientificName={feature?.properties.SCIENTIFIC_NAME}
        />

        {/* Info Grid */}
        <div className="flex flex-col gap-4">
          {/* Address & District */}
          <div className="flex flex-col gap-3">
            <FeaturePanel
              title="Address"
              content={feature?.properties.UNITDESC}
              style="content"
            />
            <div className="grid grid-cols-2 gap-3">
              <FeaturePanel
                title="District"
                content={featureTextFormatters.PRIMARYDISTRICTCD(
                  feature?.properties.PRIMARYDISTRICTCD,
                )}
                style="content"
              />
              {feature?.properties.OWNERSHIP && (
                <FeaturePanel
                  title="Ownership"
                  content={featureTextFormatters.OWNERSHIP(
                    feature?.properties.OWNERSHIP,
                  )}
                  style="content"
                />
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <FeaturePanel
              title="Planted"
              content={formatDate(feature?.properties.PLANTED_DATE)}
            />
            <FeaturePanel
              title="Last Verified"
              content={timeAgo(feature?.properties.LAST_VERIFY_DATE)}
            />
          </div>

          {/* Size */}
          <TreeSizeTimeline diameter={feature?.properties.DIAM} />
        </div>

        {/* Properties Section */}
        <div className="flex flex-col gap-2 mt-4 border-t border-gray-100 pt-6">
          <button
            className="cursor-pointer flex items-center justify-between p-2 hover:bg-black/5 rounded-xl transition-colors"
            onClick={() => setShowMoreInfo(!showMoreInfo)}
          >
            <span className="subtitle">Detailed Tree Data</span>
            <span className="material-symbols-outlined text-gray-400">
              {showMoreInfo ? "expand_less" : "expand_more"}
            </span>
          </button>

          <div
            className={`flex flex-col gap-0 px-2 pb-6 ${showMoreInfo ? "block" : "hidden"}`}
          >
            {properties.map(([title, value]) => (
              <div
                className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
                key={title}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {snakeToTitleCase(title)}
                </span>
                <span className="text-sm text-slate-700 font-medium">
                  {featureTextFormatters[title]?.(value) ?? value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
}
