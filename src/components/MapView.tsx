import DeckGL from "@deck.gl/react";
import { BaseMapLayer } from "../layers/BaseMapLayer";
import { TreeLayer } from "../layers/TreeLayer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTreesInView } from "../hooks/useTreesInView";
import FeatureCard from "./FeatureCard";
import ControlsOverlay from "./ControlsOverlay";
import { useState } from "react";
import WelcomeOverlay from "./WelcomeOverlay";
import { DEFAULT_CONTROLS } from "../config";
import AttributionOverlay from "./AttributionOverlay";
import type { TreeFeature } from "../types";
import MousePopup from "./MousePopup";
import AggregationOverlay from "./AggregationOverlay";
import type { MapViewState, PickingInfo } from "deck.gl";

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
      <div className="absolute flex flex-col gap-4 top-4 left-4">
        <FeatureCard feature={selected} />
        <AggregationOverlay features={trees} />
      </div>

      <WelcomeOverlay />
      <AttributionOverlay />
      {popup ? <MousePopup popup={popup} /> : ""}

      {/* Right Panels */}
      <div className="absolute top-4 right-4">
        <ControlsOverlay options={options} setOptions={setOptions} />
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
