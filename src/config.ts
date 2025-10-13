const config = {
  assemblies: [
    {
      name: "hg38",
      // Alternate name for assemblies of the same genome. Can be used to associate a track from a
      // different assembly to this one.
      aliases: ["GRCh38"],
      sequence: {
        type: "ReferenceSequenceTrack",
        trackId: "P6R5xbRqRr",
        adapter: {
          type: "BgzipFastaAdapter",
          fastaLocation: {
            uri: "http://localhost:8080/hg38.prefix.fa.gz",
            locationType: "UriLocation"
          },
          faiLocation: {
            uri: "http://localhost:8080/hg38.prefix.fa.gz.fai",
            locationType: "UriLocation"
          },
          gziLocation: {
            uri: "http://localhost:8080/hg38.prefix.fa.gz.gzi",
            locationType: "UriLocation"
          }
        }
      },
      // Helps resolve differently named assembly regions as the same entity.
      // Removing this property disables the ability to search by alternative names
      // e.g. `1` cannot be searched as `chr 1`
      refNameAliases: {
        adapter: {
          type: "RefNameAliasAdapter",
          location: {
            uri: "http://localhost:8080/hg38_aliases.txt",
            locationType: "UriLocation"
          }
        }
      }
    }
  ],
  tracks: [
    {
      type: "FeatureTrack",
      trackId: "ncbi_genes",
      name: "NCBI RefSeq Genes",
      assemblyNames: ["hg38"],
      adapter: {
        // An appropriate adapter type needs to be specified for the provided data to be parsed properly.
        type: "Gff3TabixAdapter",
        uri: "http://localhost:8080/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz"
      }
    }
  ],
  aggregateTextSearchAdapters: [
    {
      type: "TrixTextSearchAdapter",
      textSearchAdapterId: "hg38-index",
      ixFilePath: {
        uri: "http://localhost:8080/trix/hg38.ix",
        locationType: "UriLocation"
      },
      ixxFilePath: {
        uri: "http://localhost:8080/trix/hg38.ixx",
        locationType: "UriLocation"
      },
      metaFilePath: {
        uri: "http://localhost:8080/trix/hg38_meta.json",
        locationType: "UriLocation"
      },
      assemblyNames: [
        "hg38"
      ]
    }
  ],
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
        view: "5m2YGi1-YcKWPmMIRnv49",
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
    id: "XoH3lXVcjuXCbqrJfnxjs",
    name: "NewSession",
    margin: 0,
    views: [
      {
        id: "5m2YGi1-YcKWPmMIRnv49",
        minimized: false,
        type: "LinearGenomeView",
        offsetPx: 1161591458,
        bpPerPx: 0.020000000000000004,
        displayedRegions: [
          {
            reversed: false,
            refName: "1",
            start: 0,
            end: 248956422,
            assemblyName: "hg38"
          }
        ],
        tracks: [
          {
            id: "pQBGRoGi3lG9nZ08r0B1d",
            type: "ReferenceSequenceTrack",
            configuration: "P6R5xbRqRr",
            minimized: false,
            pinned: false,
            displays: [
              {
                id: "C_cx5u8p1RXwFMNnERdkB",
                type: "LinearReferenceSequenceDisplay",
                heightPreConfig: 120,
                configuration: "P6R5xbRqRr-LinearReferenceSequenceDisplay",
                showForward: true,
                showReverse: true,
                showTranslation: true
              }
            ]
          },
          {
            id: "fQI51BAU9hyQ1tZoS9Xyr",
            type: "FeatureTrack",
            configuration: "ncbi_genes",
            minimized: false,
            pinned: false,
            displays: [
              {
                id: "bmtXgAZjm6GtUDaF59O-T",
                type: "LinearBasicDisplay",
                configuration: "ncbi_genes-LinearBasicDisplay"
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
    focusedViewId: "5m2YGi1-YcKWPmMIRnv49",
    sessionPlugins: []
  }
}

export { config }
