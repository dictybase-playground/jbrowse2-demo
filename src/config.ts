import dictyAssemblies from "./configurations/assemblies/dicty"
import dictyTracks from "./configurations/tracks/dicty"

export default {
  assemblies: dictyAssemblies,
  tracks: dictyTracks,
  defaultSession: {
    drawerPosition: "right",
    drawerWidth: 384,
    widgets: {
      GridBookmark: {
        id: "GridBookmark",
        type: "GridBookmarkWidget"
      },
      hierarchicalTrackSelector: {
        id: "hierarchicalTrackSelector",
        type: "HierarchicalTrackSelectorWidget",
        view: "GnTQEX6v53lnmmuQbHFuO",
        faceted: {
          filterText: "",
          showSparse: false,
          showFilters: true,
          showOptions: false,
          panelWidth: 400
        }
      }
    },
    activeWidgets: {
      hierarchicalTrackSelector: "hierarchicalTrackSelector"
    },
    minimized: false,
    id: "ZKpk_P6a2Bj7C8lrbLnVO",
    name: "NewSession",
    margin: 0,
    views: [
      {
        id: "GnTQEX6v53lnmmuQbHFuO",
        minimized: false,
        type: "LinearGenomeView",
        offsetPx: -162,
        bpPerPx: 10979.591497451018,
        displayedRegions: [
          {
            reversed: false,
            refName: "DDB0166986",
            start: 0,
            end: 8467571,
            assemblyName: "Dictyostelium Discoideum"
          }
        ],
        tracks: [
          {
            id: "mH78H7N39SBamrxpX6BXV",
            type: "FeatureTrack",
            configuration: "DDB0166986_features",
            minimized: false,
            pinned: false,
            displays: [
              {
                id: "SxQzWtJfSeBFAQFsT0Bb3",
                type: "LinearBasicDisplay",
                configuration: "DDB0166986_features-LinearBasicDisplay"
              }
            ]
          }
        ],
        hideHeader: false,
        hideHeaderOverview: false,
        hideNoTracksActive: false,
        trackSelectorType: "hierarchical",
        showCenterLine: false,
        showCytobandsSetting: true,
        trackLabels: "",
        showGridlines: true,
        highlight: [],
        colorByCDS: false,
        showTrackOutlines: true,
        bookmarkHighlightsVisible: true,
        bookmarkLabelsVisible: true
      }
    ],
    stickyViewHeaders: true,
    sessionTracks: [],
    sessionAssemblies: [],
    temporaryAssemblies: [],
    connectionInstances: [],
    sessionConnections: [],
    focusedViewId: "GnTQEX6v53lnmmuQbHFuO",
    sessionPlugins: []
  }
}
