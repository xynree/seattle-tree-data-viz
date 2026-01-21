import DeckGL from "@deck.gl/react";
import { BaseMapLayer } from "../layers/BaseMapLayer";
import { TreeLayer } from "../layers/TreeLayer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTreesInView } from "../hooks/useTreesInView";
import TreePopup from "./TreePopup";
import ControlsOverlay from "./ControlsOverlay";
import { useState } from "react";
import WelcomeOverlay from "./WelcomeOverlay";

export default function MapView() {
  const [viewState, setViewState] = useUserLocation();
  const trees = useTreesInView(viewState);
  const [popup, setPopup] = useState<any>(null);
  const [showRemoved, setShowRemoved] = useState(false);

  const layers = [
    BaseMapLayer(),
    TreeLayer({
      trees,
      sizeScale: 1,
      showRemoved,
    }),
  ].filter(Boolean);

  return (
    <div className="w-screen h-screen">
      <WelcomeOverlay/>
      <ControlsOverlay onStateChange={(state) => setShowRemoved(state.showRemoved)} />
      <DeckGL
        initialViewState={viewState}
        controller={{
          dragRotate: true,  // allow the user to rotate bearing/pitch
          doubleClickZoom: true,
          scrollZoom: true,
          dragPan: true,
          keyboard: true,
        }}
        onViewStateChange={e => setViewState(e.viewState)}
        layers={layers}
        onHover={info => {
          if (info.object) {
            console.log(info.object)
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
        {popup && (
          <TreePopup
            x={popup.x}
            y={popup.y}
            feature={popup.feature}
            onClose={() => setPopup(null)}
          />
        )}
      </DeckGL>
    </div>
  );
}