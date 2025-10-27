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
          // Can be BgzipFastaAdapter (.fa.gz, fa.gz.gzi, .fa.gz.fai), IndexedFastaAdapter (.fa, .fai), UnindexedFastaAdapter (.fa), ChromSizesAdapter, or TwoBitAdapter (2bit).
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
      // Why is this property needed? What does it affect?
      type: "FeatureTrack",
      // Other tracks or components might interact with this track and need an id to do so.
      trackId: "ncbi_genes",
      // Determines the display name of this track in the track selector.
      name: "NCBI RefSeq Genes",
      // Determines which assemblies the track applies to.
      assemblyNames: ["hg38"],
      adapter: {
        // An appropriate adapter type needs to be specified for the provided data to be parsed properly: Gff3TabixAdapter (gff.gz, gff.gz.tbi) or Gff3Adapter (gff.gz).
        // The .gff.gz.tbi file is assumed to be the `{uri below}.tbi`
        type: "Gff3TabixAdapter",
        uri: "http://localhost:8080/GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz"
      }
    },
    {
      type: "VariantTrack",
      trackId:
        "ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf",
      name: "1000 Genomes Variant Calls",
      assemblyNames: ["hg38"],
      category: ["1000 Genomes", "Variants"],
      adapter: {
        type: "VcfTabixAdapter",
        uri: "http://localhost:8080/ALL.wgs.shapeit2_integrated_snvindels_v2a.GRCh38.27022019.sites.vcf.gz",
      },
    },
    {
      type: "FeatureTrack",
      trackId: "sparql_test_features",
      name: "SPARQL Test Features",
      assemblyNames: ["hg38"],
      category: ["SPARQL", "Testing"],
      adapter: {
        type: "SPARQLAdapter",
        endpoint: {
          uri: "http://localhost:8090/sparql",
          locationType: "UriLocation"
        },
        queryTemplate: "SELECT ?uniqueId ?start ?end ?name ?note ?strand ?type WHERE { FILTER ( (?start >= {start}) && (?end <= {end}) ) }",
        additionalQueryParams: []
      }
    },
  ],
  // Allows text searching by gene names.
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
