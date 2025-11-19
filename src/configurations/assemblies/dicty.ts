export default [
  {
    name: "Dictyostelium Discoideum",
    sequence: {
      type: "ReferenceSequenceTrack",
      trackId: "P6R5xbRqRr",
      adapter: {
        // Can be BgzipFastaAdapter (.fa.gz, fa.gz.gzi, .fa.gz.fai), IndexedFastaAdapter (.fa, .fai), UnindexedFastaAdapter (.fa), ChromSizesAdapter, or TwoBitAdapter (2bit).
        type: "IndexedFastaAdapter",
        fastaLocation: {
          uri: "http://localhost:8080/canonical_core.fa",
          locationType: "UriLocation"
        },
        faiLocation: {
          uri: "http://localhost:8080/canonical_core.fa.fai",
          locationType: "UriLocation"
        },
      }
    }
  }
]

