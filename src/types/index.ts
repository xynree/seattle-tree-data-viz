export type ControlOptions = {
  showRemoved: boolean;
  showPrivate: boolean;
  showPlanned: boolean;
  scaleBySize: boolean;
  showLabels: boolean;
};

export type TreeFeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  TreeProperties
>;

export type TreeFeature = GeoJSON.Feature<GeoJSON.Point, TreeProperties>;

export interface TreeProperties {
  OBJECTID: number;
  COMPKEY: number;
  UNITID: string;
  UNITDESC: string;
  CONDITION: string | null;
  CONDITION_ASSESSMENT_DATE: number | null;
  CURRENT_STATUS: "INSVC" | "REMOVED" | "PLANNED";
  PRIMARYDISTRICTCD: string;
  SECONDARYDISTRICTCD: string | null;
  OVERRIDEYN: "Y" | "N";
  COMPTYPE: number;
  SEGKEY: number;
  UNITTYPE: string;
  OWNERSHIP: "PRIV" | "CITY";
  CURRENT_STATUS_DATE: number | null;
  LAST_VERIFY_DATE: number | null;
  PLANTED_DATE: number | null;
  BOTANICAL_NAME: string;
  SCIENTIFIC_NAME: string;
  HERITAGE: "Y" | "N";
  EXCEPTIONAL: "Y" | "N";
  CODEREQ: "Y" | "N";
  GSI: "Y" | "N";
  GREEN_FACTOR: "Y" | "N";
  WIRES: "Y" | "N";
  CABLED: "Y" | "N";
  CLEARANCE_PROBLEM: "Y" | "N";
  SPACETYPE: string | null;
  SITETYPE: string | null;
  GROWSPACE: number;
  DIAM: number;
  CONDITION_RATING: string;
  FUNDING_SOURCE: string;
  WATER_THROUGH_YR1: number;
  WATER_THROUGH_YR2: number;
  WATER_THROUGH_YR3: number;
  OWNERDIAM: string;
  EXPDATE: number | null;
  COMMON_NAME: string;
  TREEHEIGHT: number;
  ASBUILTPLANNO: string | null;
  LANDSCAPEAREAASSOC: number;
  COMMENTS: string | null;
  OVERRIDECOMMENT: string | null;
  SHAPE_LNG: number;
  SHAPE_LAT: number;
  IRRIGATESYSYN: "Y" | "N";
  ASSETGROUPID: string;
  ASSETGROUPDESC: string;
  MODDATE: number;
  TOTAL_RANK: number;
  TOTAL_COUNT: number;
  GENUS: string;
  UFMAINTMGMTUNIT: number;
}

export interface WikipediaPageSummary {
  titles: {
    // the DB key (non-prefixed), e.g. may have _ instead of spaces, best for making request URIs, still requires Percent-encoding
    canonical: string;
    // the normalized title (https://www.mediawiki.org/wiki/API:Query#Example_2:_Title_normalization), e.g. may have spaces instead of _
    normalized: string;
    // the title as it should be displayed to the user
    display: string;
  };
  pageid: number;
  // First several sentences of an article in plain text
  extract: string;
  // First several sentences of an article in simple HTML format
  extract_html: string;
  thumbnail: {
    source: string;
    width: number;
    height: number;
  };
  originalimage: {
    source: string;
    width: number;
    height: number;
  };
  // Page language code
  lang: string;
  // Language direction code
  dir: string;
  // The time when the page was last edited in the ISO 8601 format
  timestamp: string;
  // Wikidata description for the page
  description: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}
