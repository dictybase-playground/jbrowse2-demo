export default [
  {
    type: "FeatureTrack",
    trackId: "DDB0166986_features",
    name: "DDB0166986 Features",
    assemblyNames: ["Dictyostelium Discoideum"],
    adapter: {
      type: "Gff3TabixAdapter",
      uri: "http://localhost:8080/DDB0166986.sorted.gff3.gz"
    }
  },
]
