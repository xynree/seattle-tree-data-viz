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
import AggregationCard from "./AggregationCard";
import { Divider } from "@mui/material";
import SelectionButtonGroup from "./SelectionButtonGroup";

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

  const [options] = useState(defaultControls);

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
      zoom: 20,
    });
    setSelected(tree);
  }

  return (
    <div className="w-screen h-screen">
      {/* Overlays */}
      <div className="absolute flex flex-col gap-2 h-full w-full overflow-hidden">
        <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto md:mt-0 h-full justify-end md:justify-between md:items-start">
          {/* Left Panels */}
          <div className="flex flex-col z-2 w-md overflow-hidden gap-2 h-1/3 md:h-full glass-panel">
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-xl font-semibold">🔎 Seattle Tree Spy </h2>
              <div className="subtitle">Exploring SDOT Trees</div>
            </div>
            <Divider />
            <SelectionButtonGroup
              sidebarSelection={sidebarSelection}
              setSidebarSelection={setSidebarSelection}
            />

            <div className="flex flex-col p-4">
              {sidebarSelection === "filter" ? (
                <FilterPanel
                  trees={allTrees}
                  selectedGenuses={selectedGenuses}
                  setSelectedGenuses={setSelectedGenuses}
                  selectedStatus={selectedStatus}
                  setSelectedStatus={setSelectedStatus}
                  selectedOwnership={selectedOwnership}
                  setSelectedOwnership={setSelectedOwnership}
                />
              ) : sidebarSelection === "agg" ? (
                <AggregationCard trees={trees} />
              ) : (
                <TreeList
                  trees={trees}
                  onSelectTree={onSelectTree}
                  setHovered={setHovered}
                />
              )}
            </div>
          </div>

          <ResetViewControl
            viewState={viewState}
            setViewState={setViewState}
            userLocation={userLocation}
          />

          {/* Right Panels */}
          <div className="flex h-full gap-2 md:ml-auto absolute md:static top-14 p-4">
            <FeatureCard feature={selected} setFeature={setSelected} />
          </div>
        </div>
      </div>

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

      {/* Open Street Map Attribution */}
      <div className="absolute bottom-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-1 text-xs z-10 rounded-tl-md">
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 hover:underline"
        >
          Map data © OpenStreetMap
        </a>
      </div>
    </div>
  );
}
