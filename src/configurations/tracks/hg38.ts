export default [
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
]
