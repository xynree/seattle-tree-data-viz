import { useState } from "react";


export default function WelcomeOverlay() {
  const [closed, setClosed] = useState(false)

  return closed ? <>:</> : (
    <div className="absolute top-0 w-screen h-screen bg-black/20 z-10">
      <div className="max-w-md flex justify-between bg-white rounded-3xl z-10 absolute left-2/5 top-1/3 p-6 text-center shadow-lg">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold" >
            Exploring Seattle's Trees
          </h2>

          <p className="font-medium">Welcome!</p>

          <div className="text-gray-700 text-sm">

            <p >
              This realtime interactive map provides a view of all current trees along public roadways tracked by SDOT (Seattle Department of Transportation) in the Seattle metro area.
            </p>

            <p>
              Data is thanks to the City of Seattle's <a className="text-blue-700 underline" href="https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-trees">SDOT Trees</a> aggregation.
            </p>
          </div>


        </div>
        <span onClick={() => setClosed(true)} className="material-symbols-outlined hover:bg-gray-100 h-min p-2 rounded-xl cursor-pointer">
          close
        </span>
      </div>
    </div>

  )
}