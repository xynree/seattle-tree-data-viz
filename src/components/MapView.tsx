import { useMemo, useState } from "react";
import DeckGL from "@deck.gl/react";
import type { MapViewState, PickingInfo } from "deck.gl";
import { defaultControls } from "../config";
import type { TreeFeature } from "../types";

import { useUserLocation, useTreesInView } from "../hooks";
import { BaseMapLayer, TreeLayer } from "../layers";

import FeatureCard from "./FeatureCard";
import ControlsCard from "./ControlsCard";
import FilterPanel from "./FilterPanel";
import WelcomeOverlay from "./WelcomeOverlay";
import AttributionChip from "./AttributionChip";
import MousePopup from "./MousePopup";
import { TreeLabelLayer } from "../layers/TreeLabelLayer";

export default function MapView() {
  const [viewState, setViewState] = useUserLocation();
  const allTrees = useTreesInView(viewState);
  const [selected, setSelected] = useState<TreeFeature>(null);
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    feature: TreeFeature;
  }>(null);

  const [options, setOptions] = useState(defaultControls);
  const [selectedGenuses, setSelectedGenuses] = useState<string[]>([]);

  // Filter trees based on selected genuses
  const trees = useMemo(() => selectedGenuses.length ? allTrees.filter((tree) =>
      selectedGenuses.includes(tree.properties.GENUS)) : allTrees, [allTrees, selectedGenuses]);


  const layers = useMemo(() => {
    const base = [
      BaseMapLayer(),
      TreeLayer({
        trees,
        options,
        selectedId: selected?.id,
      }),
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
  }, [options, selected, trees, viewState]);

  return (
    <div className="w-screen h-screen">
      {/* Left Panels */}
      <div className="absolute flex flex-col gap-4 top-4 left-4 max-h-[90vh] overflow-hidden">
        <FeatureCard feature={selected} />
        {/* <AggregationCard features={trees} /> */}
      </div>

      <WelcomeOverlay />
      <AttributionChip />
      {popup ? <MousePopup popup={popup} /> : ""}

      {/* Right Panels */}
      <div className="absolute top-4 right-4 flex flex-col gap-4">
        <FilterPanel
          trees={allTrees}
          selectedGenuses={selectedGenuses}
          setSelectedGenuses={setSelectedGenuses}
        />
        <ControlsCard options={options} setOptions={setOptions} />
      </div>

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
    </div>
  );
}
