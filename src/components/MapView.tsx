import DeckGL from "@deck.gl/react";
import { BaseMapLayer } from "../layers/BaseMapLayer";
import { TreeLayer } from "../layers/TreeLayer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTreesInView } from "../hooks/useTreesInView";
import TreePopup from "./TreePopup";
import ControlsOverlay from "./ControlsOverlay";
import { useState } from "react";
import WelcomeOverlay from "./WelcomeOverlay";
import { DEFAULT_CONTROLS } from "../config/controls.config";
import AttributionOverlay from "./AttributionOverlay";
import type { TreeFeature } from "../types/types";


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
      <WelcomeOverlay />
      <AttributionOverlay />
      <ControlsOverlay options={options} setOptions={setOptions} />
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
      >

        <TreePopup
          popup={popup}
        />
      </DeckGL>
    </div>
  );
}