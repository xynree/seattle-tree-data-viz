export default function AttributionChip() {
  return (
    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 bg-white/70 backdrop-blur-sm px-3 rounded-lg whitespace-nowrap z-10 select-none pointer-events-auto transition-all">
      {/* Personal Credits */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium lowercase  text-slate-400">
          made by xynree
        </span>

        <div className="flex gap-2 items-center border-l border-slate-100 pl-2 text-slate-300">
          {/* Portfolio */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.xinrui.work"
            className="hover:text-slate-500 transition-colors"
            title="Portfolio"
          >
            <span className="material-symbols-outlined mt-[6px]! text-[15px]! block">
              language
            </span>
          </a>

          {/* Instagram */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://instagram.com/xynree"
            className="hover:text-slate-500 transition-colors"
            title="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Github */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/xynree"
            className="hover:text-slate-500 transition-colors"
            title="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-3 bg-slate-100" />

      {/* Detailed Data Attribution */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400 ">
        <span className="opacity-60 text-[10px] md:text-xs">Tree data via</span>
        <a
          href="https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-trees/about"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-600 underline decoration-slate-200"
        >
          SDOT
        </a>
        <span className="opacity-30">|</span>
        <span className="opacity-60 text-[10px] md:text-xs">Map Tiles</span>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-600 underline decoration-slate-200"
        >
          © OpenStreetMap
        </a>
      </div>
    </div>
  );
}
