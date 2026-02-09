import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import type { MapViewState, PickingInfo } from "deck.gl";
import { defaultControls } from "../config";
import type { TreeFeature } from "../types";

import { useUserLocation, useTreesInView } from "../hooks";
import { BaseMapLayer, TreeLayer, UserLocationLayer } from "../layers";

import FeatureCard from "./FeatureCard/FeatureCard";
import ControlsCard from "./ControlsCard";
import FilterPanel from "./FilterPanel";
import AttributionChip from "./AttributionChip";
import MousePopup from "./MousePopup";
import ResetViewControl from "./ResetViewControl";
import { TreeLabelLayer } from "../layers/TreeLabelLayer";
import TreeList from "./TreeList/TreeList";

export default function MapView() {
  const { viewState, setViewState, userLocation } = useUserLocation();
  const allTrees = useTreesInView(viewState);
  const [selected, setSelected] = useState<TreeFeature>(null);
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    feature: TreeFeature;
  }>(null);

  const [options, setOptions] = useState(defaultControls);
  const [selectedGenuses, setSelectedGenuses] = useState<string[]>([]);

  const trees = useMemo(() => {
    // First apply control options filters (showRemoved, showPrivate, showPlanned)
    let filtered = allTrees;

    if (!options.showRemoved) {
      filtered = filtered.filter(
        (t) => t.properties.CURRENT_STATUS !== "REMOVED",
      );
    }

    if (!options.showPrivate) {
      filtered = filtered.filter((t) => t.properties.OWNERSHIP !== "PRIV");
    }

    if (!options.showPlanned) {
      filtered = filtered.filter(
        (t) => t.properties.CURRENT_STATUS !== "PLANNED",
      );
    }

    // Then apply genus filter
    if (selectedGenuses.length > 0) {
      filtered = filtered.filter((tree) =>
        selectedGenuses.includes(tree.properties.GENUS),
      );
    }

    return filtered;
  }, [allTrees, selectedGenuses, options]);

  const layers = useMemo(() => {
    const base = [
      BaseMapLayer(),
      TreeLayer({
        trees,
        options,
        selectedId: selected?.id,
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
  }, [options, selected, trees, viewState, userLocation]);

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
        <div className="flex flex-col gap-2 p-2 sm:mt-auto md:mt-0">
          {/* Top Panel */}
          <FilterPanel
            trees={allTrees}
            selectedGenuses={selectedGenuses}
            setSelectedGenuses={setSelectedGenuses}
          />

          <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto md:mt-0 h-[calc(100vh-64px)] justify-end md:justify-between md:items-start pb-6 md:pb-0">
            {/* Left Panels */}
            <div className="flex flex-col justify-between gap-2 h-1/3 md:h-full">
              {selected ? (
                <FeatureCard feature={selected} setFeature={setSelected} />
              ) : (
                <TreeList trees={trees} onSelectTree={onSelectTree} />
              )}

              <AttributionChip />
            </div>

            {/* Right Panels */}
            <div className="flex flex-col gap-2 md:ml-auto absolute md:static top-14">
              <ResetViewControl
                viewState={viewState}
                setViewState={setViewState}
                userLocation={userLocation}
              />
              <ControlsCard options={options} setOptions={setOptions} />
            </div>
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
