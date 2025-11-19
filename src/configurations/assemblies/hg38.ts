export default [
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
]
