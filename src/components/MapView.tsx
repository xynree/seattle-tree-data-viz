import { Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import type { MapViewState, PickingInfo } from "deck.gl";
import { defaultControls } from "../config";
import type { TreeFeature } from "../types";

import { useUserLocation, useTreesInView } from "../hooks";
import { BaseMapLayer, TreeLayer, UserLocationLayer } from "../layers";

import FeatureCard from "./FeatureCard/FeatureCard";
import FilterPanel from "./FilterPanel";
import MousePopup from "./MousePopup";
import ResetViewControl from "./ResetViewControl";
import { TreeLabelLayer } from "../layers/TreeLabelLayer";
import TreeList from "./TreeList/TreeList";
import AggregationPanel from "./AggregationPanel";
import SelectionButtonGroup from "./SelectionButtonGroup";
import AttributionChip from "./AttributionChip";

export default function MapView() {
  const { viewState, setViewState, userLocation } = useUserLocation();
  const allTrees = useTreesInView(viewState);
  const [selected, setSelected] = useState<TreeFeature>(null);
  const [hovered, setHovered] = useState<TreeFeature>(null);
  const [sidebarSelection, setSidebarSelection] = useState<
    "filter" | "agg" | "list"
  >("filter");
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    feature: TreeFeature;
  }>(null);

  const [options, setOptions] = useState(defaultControls);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedGenuses, setSelectedGenuses] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["INSVC"]);
  const [selectedOwnership, setSelectedOwnership] = useState<string[]>([
    "SDOT",
    "CITY",
    "PRIV",
  ]);

  const trees = useMemo(() => {
    // First apply control options filters (showRemoved, showPrivate, showPlanned)
    let filtered = allTrees;

    // Apply ownership filter
    if (selectedOwnership.length > 0) {
      filtered = filtered.filter((t) =>
        selectedOwnership.includes(t.properties.OWNERSHIP),
      );
    }

    // Apply status filter
    if (selectedStatus.length > 0) {
      filtered = filtered.filter((t) =>
        selectedStatus.includes(t.properties.CURRENT_STATUS),
      );
    }

    // Then apply genus filter
    if (selectedGenuses.length > 0) {
      filtered = filtered.filter((tree) =>
        selectedGenuses.includes(tree.properties.GENUS),
      );
    }
    return filtered;
  }, [allTrees, selectedOwnership, selectedStatus, selectedGenuses]);

  const layers = useMemo(() => {
    const base = [
      BaseMapLayer(),
      TreeLayer({
        trees,
        options,
        selectedId: selected?.id,
        hoveredId: hovered?.id,
      }),
      options.showUserGPS ? UserLocationLayer({ userLocation }) : [],
    ];

    return options.showLabels
      ? [
          ...base,
          TreeLabelLayer({
            trees,
            options,
            zoom: viewState.zoom,
          }),
        ]
      : base;
  }, [options, selected, trees, viewState, userLocation, hovered]);

  function onSelectTree(tree: TreeFeature) {
    setViewState({
      ...viewState,
      latitude: tree.geometry.coordinates[1],
      longitude: tree.geometry.coordinates[0],
      transitionDuration: 300,
    });
    setSelected(tree);
  }

  return (
    <div className="w-screen h-screen relative bg-slate-50">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-2xl border border-slate-100 material-symbols-outlined text-slate-700 hover:bg-white active:scale-95 transition-all"
        >
          menu
        </button>
      )}

      {/* Main UI Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col md:flex-row">
        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          open={isMobile ? sidebarOpen : true}
          onClose={() => setSidebarOpen(false)}
          anchor="left"
          slotProps={{
            paper: {
              className: isMobile
                ? "w-full"
                : "w-md pointer-events-auto border-none bg-transparent shadow-none",
            },
          }}
          hideBackdrop={!isMobile}
          sx={{
            pointerEvents: isMobile ? "auto" : "none",
            "& .MuiDrawer-paper": {
              boxShadow: "none",
              border: "none",
              background: isMobile ? "white" : "transparent",
            },
          }}
        >
          <div
            className={`flex flex-col h-full drop-shadow-md glass-panel overflow-hidden pointer-events-auto`}
          >
            <div className="flex flex-col gap-1 p-6 pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold tracking-tight text-slate-800">
                  🔎 Seattle Tree Spy
                </h2>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="material-symbols-outlined text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                  >
                    close
                  </button>
                )}
              </div>
              <div className="subtitle">Exploring SDOT Trees</div>
            </div>

            <SelectionButtonGroup
              sidebarSelection={sidebarSelection}
              setSidebarSelection={setSidebarSelection}
            />

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-4">
              {sidebarSelection === "filter" ? (
                <FilterPanel
                  trees={allTrees}
                  selectedGenuses={selectedGenuses}
                  setSelectedGenuses={setSelectedGenuses}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedOwnership={selectedOwnership}
                  setSelectedOwnership={setSelectedOwnership}
                  options={options}
                  setOptions={setOptions}
                />
              ) : sidebarSelection === "agg" ? (
                <AggregationPanel trees={trees} />
              ) : (
                <TreeList
                  trees={trees}
                  onSelectTree={onSelectTree}
                  setHovered={setHovered}
                />
              )}
            </div>
          </div>
        </Drawer>

        {/* Top/Right Controls */}
        <div className="ml-auto flex justify-end items-start">
          <ResetViewControl
            viewState={viewState}
            setViewState={setViewState}
            userLocation={userLocation}
          />
        </div>
      </div>

      <FeatureCard feature={selected} setFeature={setSelected} />

      {/* <WelcomeOverlay /> */}
      {popup ? <MousePopup popup={popup} /> : ""}

      {/* Map */}
      <DeckGL
        initialViewState={viewState}
        controller={{
          dragRotate: true,
          doubleClickZoom: true,
          scrollZoom: true,
          dragPan: true,
          keyboard: true,
        }}
        onViewStateChange={(e) =>
          setViewState(e.viewState as unknown as MapViewState)
        }
        layers={layers}
        getCursor={({ isHovering, isDragging }) =>
          isDragging ? "grabbing" : isHovering ? "pointer" : "grab"
        }
        onHover={(info: PickingInfo<TreeFeature>) => {
          if (info.object) {
            setPopup({
              x: info.x,
              y: info.y,
              feature: info.object,
            });
          } else {
            setPopup(null);
          }
        }}
        onClick={(info: PickingInfo<TreeFeature>) => {
          if (info.object) {
            setSelected(info.object);
          }
        }}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      />

      {/* Attribution */}
      <div className="absolute bottom-0 right-0 z-10 p-4">
        <AttributionChip />
      </div>
    </div>
  );
}
