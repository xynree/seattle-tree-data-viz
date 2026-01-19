import { useRef, useState } from "react";
import DeckGL, { type DeckGLRef } from "@deck.gl/react";
import { BaseMapLayer } from "../layers/BaseMapLayer";
import { TreeLayer } from "../layers/TreeLayer";
import { useUserLocation } from "../hooks/useUserLocation";
import { useTreesInView } from "../hooks/useTreesInView";
import TreePopup from "./TreePopup";

export default function MapView() {
  const [viewState, setViewState] = useUserLocation();
  const trees = useTreesInView(viewState);
  const [popup, setPopup] = useState<any>(null);

  const layers = [
    BaseMapLayer(),
    TreeLayer({
      trees,
      sizeScale: 1,
    }),
  ].filter(Boolean);

  return (
    <DeckGL
      initialViewState={viewState}
      controller={{ dragRotate: false }}
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
      {popup && (
        <TreePopup
          x={popup.x}
          y={popup.y}
          feature={popup.feature}
          onClose={() => setPopup(null)}
        />
      )}
    </DeckGL>
  );
}