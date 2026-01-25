import { useState } from "react";
import DeckGL from "@deck.gl/react";
import type { MapViewState, PickingInfo } from "deck.gl";
import { DEFAULT_CONTROLS } from "../config";
import type { TreeFeature } from "../types";

import { useUserLocation, useTreesInView } from "../hooks";
import { BaseMapLayer, TreeLayer } from "../layers";

import FeatureCard from "./FeatureCard";
import ControlsCard from "./ControlsCard";
import WelcomeOverlay from "./WelcomeOverlay";
import AttributionChip from "./AttributionChip";
import MousePopup from "./MousePopup";
import AggregationCard from "./AggregationCard";

export default function MapView() {
  const [viewState, setViewState] = useUserLocation();
  const trees = useTreesInView(viewState);
  const [selected, setSelected] = useState<TreeFeature>(null);
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    feature: TreeFeature;
  }>(null);

  const [options, setOptions] = useState(DEFAULT_CONTROLS);

  const layers = [
    BaseMapLayer(),
    TreeLayer({
      trees,
      options,
      selectedId: selected?.id,
    }),
  ];

  return (
    <div className="w-screen h-screen">
      {/* Left Panels */}
      <div className="absolute flex flex-col gap-4 top-4 left-4 max-h-[90vh] overflow-hidden">
        <FeatureCard feature={selected} />
        <AggregationCard features={trees} />
      </div>

      <WelcomeOverlay />
      <AttributionChip />
      {popup ? <MousePopup popup={popup} /> : ""}

      {/* Right Panels */}
      <div className="absolute top-4 right-4">
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
