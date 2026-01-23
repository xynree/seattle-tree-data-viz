import DeckGL from "@deck.gl/react";
import { BaseMapLayer } from "../layers/BaseMapLayer";
import { TreeLayer } from "../layers/TreeLayer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTreesInView } from "../hooks/useTreesInView";
import TreePopup from "./FeatureCard";
import ControlsOverlay from "./ControlsOverlay";
import { useState } from "react";
import WelcomeOverlay from "./WelcomeOverlay";
import { DEFAULT_CONTROLS } from "../config/controls.config";
import AttributionOverlay from "./AttributionOverlay";
import type { TreeFeature } from "../types/types";
import MousePopup from "./MousePopup";
import AggregationOverlay from "./AggregationOverlay";


export default function MapView() {
  const [viewState, setViewState] = useUserLocation();
  const trees = useTreesInView(viewState);
  const [popup, setPopup] = useState<{
    x: number,
    y: number,
    feature: TreeFeature
  }>(null);

  const [options, setOptions] = useState(DEFAULT_CONTROLS)

  const layers = [
    BaseMapLayer(),
    TreeLayer({
      trees,
      options
    }),
  ]

  return (
    <div className="w-screen h-screen">

      {/* Left Panels */}
      <div className="absolute flex flex-col gap-4 top-4 left-4">
        <TreePopup
          feature={popup?.feature}
        />
        <AggregationOverlay features={trees} />
      </div>

      <WelcomeOverlay />
      <AttributionOverlay />
      {popup ? <MousePopup popup={popup} />
        : ''}

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
        onViewStateChange={e => setViewState(e.viewState)}
        layers={layers}
        onHover={info => {
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
        style={{
          width: "100vw",
          height: "100vh",
        }}
      />
    </div>
  );
}