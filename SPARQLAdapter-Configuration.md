# SPARQLAdapter Configuration Guide

## Overview

The SPARQLAdapter allows JBrowse to display genomic information stored in RDF data stores by accessing them via SPARQL endpoints. It can be used with FeatureTrack to display features from semantic web databases.

**Source Location:** `plugins/rdf/src/SPARQLAdapter/`

## Compatible Track Types

- **FeatureTrack** (recommended for most use cases)
- **VariantTrack** (if query provides REF, ALT, QUAL, etc.)
- Other track types (as long as the SPARQL query provides required fields)

## Basic Configuration

```json
{
  "type": "FeatureTrack",
  "trackId": "my_sparql_track",
  "name": "SPARQL Features",
  "assemblyNames": ["hg38"],
  "adapter": {
    "type": "SPARQLAdapter",
    "endpoint": {
      "uri": "https://www.ebi.ac.uk/rdf/services/sparql",
      "locationType": "UriLocation"
    },
    "queryTemplate": "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX faldo: <http://biohackathon.org/resource/faldo#> PREFIX dc: <http://purl.org/dc/elements/1.1/> SELECT DISTINCT ?gene (?id AS ?uniqueId) (?label AS ?name) (?desc AS ?note) ?strand ?start ?end WHERE { VALUES ?location_type { faldo:ForwardStrandPosition faldo:ReverseStrandPosition faldo:BothStrandsPosition } ?location faldo:begin _:b0 . _:b0 rdf:type ?location_type ; faldo:position ?faldo_begin . ?location faldo:end _:b1 . _:b1 rdf:type ?location_type ; faldo:position ?faldo_end . ?location faldo:reference <http://rdf.ebi.ac.uk/resource/ensembl/97/homo_sapiens/GRCh38/{refName}> . ?gene rdf:type ?type ; rdfs:label ?label ; dc:description ?desc ; dc:identifier ?id ; faldo:location ?location BIND(if(( ?location_type = faldo:ForwardStrandPosition ), 1, if(( ?location_type = faldo:ReverseStrandPosition ), -1, 0)) AS ?strand) BIND(if(( ?strand = -1 ), ?faldo_end, ?faldo_begin) AS ?start) BIND(if(( ?strand = -1 ), ?faldo_begin, ?faldo_end) AS ?end) FILTER ( ( ?start >= {start} ) && ( ?end <= {end} ) ) }",
    "additionalQueryParams": ["format=json"]
  }
}
```

## Configuration Schema

Source: `plugins/rdf/src/SPARQLAdapter/configSchema.ts:3-40`

### Required Fields

#### **endpoint**
- **Type:** fileLocation object
- **Description:** URL of the SPARQL endpoint
- **Example:**
  ```json
  "endpoint": {
    "uri": "https://somesite.com/sparql",
    "locationType": "UriLocation"
  }
  ```

#### **queryTemplate**
- **Type:** text/string
- **Description:** SPARQL query where `{start}`, `{end}`, and `{refName}` will be replaced for each call
- **Example:** See SPARQL Query Template section below

### Optional Fields

#### **refNamesQueryTemplate**
- **Type:** text/string
- **Default:** empty string
- **Description:** SPARQL query that returns possible refNames in a `?refName` column
- **Example:**
  ```sparql
  SELECT DISTINCT ?refName WHERE {
    ?s faldo:reference ?refName
  }
  ```

#### **refNames**
- **Type:** string array
- **Default:** `[]`
- **Description:** Possible refNames used by the SPARQL endpoint (ignored if "refNamesQueryTemplate" is provided)
- **Example:**
  ```json
  "refNames": ["chr1", "chr2", "chr3", "chrX", "chrY"]
  ```

#### **additionalQueryParams**
- **Type:** string array
- **Default:** `[]`
- **Description:** Additional parameters to add to the query (e.g., for specifying response format)
- **Example:**
  ```json
  "additionalQueryParams": ["format=json"]
  ```

## SPARQL Query Template Requirements

Source: `plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts:136-142`

Your SPARQL query **must** return these variables:

- **?start** - Start position of the feature (required)
- **?end** - End position of the feature (required)
- **?uniqueId** - Unique identifier for the feature (required)

Any additional variables will be added to the feature data (e.g., `?name`, `?note`, `?strand`, `?type`, etc.).

### Template Placeholders

The query template supports these dynamic placeholders:

- **{refName}** - Replaced with the reference sequence name (e.g., "chr1")
- **{start}** - Replaced with the query start position
- **{end}** - Replaced with the query end position

### Example Query Template

```sparql
PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX  faldo: <http://biohackathon.org/resource/faldo#>
PREFIX  dc:   <http://purl.org/dc/elements/1.1/>

SELECT DISTINCT  ?gene (?id AS ?uniqueId) (?label AS ?name) (?desc AS ?note) ?strand ?start ?end
WHERE
  { VALUES ?location_type { faldo:ForwardStrandPosition faldo:ReverseStrandPosition faldo:BothStrandsPosition }
    ?location  faldo:begin     _:b0 .
    _:b0      rdf:type         ?location_type ;
              faldo:position   ?faldo_begin .
    ?location  faldo:end       _:b1 .
    _:b1      rdf:type         ?location_type ;
              faldo:position   ?faldo_end .
    ?location  faldo:reference  <http://rdf.ebi.ac.uk/resource/ensembl/97/homo_sapiens/GRCh38/{refName}> .
    ?gene     rdf:type         ?type ;
              rdfs:label       ?label ;
              dc:description   ?desc ;
              dc:identifier    ?id ;
              faldo:location   ?location
    BIND(if(( ?location_type = faldo:ForwardStrandPosition ), 1, if(( ?location_type = faldo:ReverseStrandPosition ), -1, 0)) AS ?strand)
    BIND(if(( ?strand = -1 ), ?faldo_end, ?faldo_begin) AS ?start)
    BIND(if(( ?strand = -1 ), ?faldo_begin, ?faldo_end) AS ?end)
    FILTER ( ( ?start >= {start} ) && ( ?end <= {end} ) )
  }
```

## Advanced Features

### Subfeatures

Source: `plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts:180-223`

There are two ways to provide subfeature information:

#### Method 1: Parent-Child Relationship via ?parentUniqueId

Include a `?parentUniqueId` variable with a feature. It will be created as a subfeature of the feature with a matching `?uniqueId`.

#### Method 2: Nested Features via Prefixes

Prefix variables with `sub_` for subfeatures:
- **First level subfeatures:** `sub_uniqueId`, `sub_start`, `sub_end`, `sub_type`, etc.
- **Second level subfeatures:** `sub_sub_uniqueId`, `sub_sub_start`, `sub_sub_end`, etc.

**Example:**

Query result:

| uniqueId   | type | start    | end      | sub_uniqueId     | sub_type   | sub_start | sub_end  | sub_sub_uniqueId | sub_sub_type | sub_sub_start | sub_sub_end |
| ---------- | ---- | -------- | -------- | ---------------- | ---------- | --------- | -------- | ---------------- | ------------ | ------------- | ----------- |
| geneId0001 | gene | 10430102 | 10452003 | transcriptId0001 | transcript | 10430518  | 10442405 | exonId0001       | exon         | 10430518      | 10430568    |
| geneId0001 | gene | 10430102 | 10452003 | transcriptId0001 | transcript | 10430518  | 10442405 | exonId0002       | exon         | 10432568      | 10433965    |

Result: One gene feature with one transcript subfeature, which has two exon subfeatures.

### HTTP Request Details

Source: `plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts:106-118`

The adapter constructs requests as:
```
{endpoint}?query={encodedQueryTemplate}{additionalQueryParams}
```

Headers sent:
```
Accept: application/json,application/sparql-results+json
```

## Adding via UI

From the track selector:
1. Click the "+" icon and choose "Add track"
2. Enter the SPARQL endpoint URL
3. If the endpoint ends with `/sparql`, JBrowse will automatically choose SPARQLAdapter
4. Otherwise, manually select "SPARQL adapter"
5. Choose track name, type (use FeatureTrack for most cases), and assembly
6. Click "Add"
7. Open track settings and paste your query template in the "queryTemplate" field

**Example endpoint for testing:** https://www.ebi.ac.uk/rdf/services/sparql

## Complete Configuration Example

```json
{
  "type": "FeatureTrack",
  "trackId": "ensembl_genes_sparql",
  "name": "Ensembl Genes (SPARQL)",
  "assemblyNames": ["hg38"],
  "category": ["Genes", "RDF"],
  "adapter": {
    "type": "SPARQLAdapter",
    "endpoint": {
      "uri": "https://www.ebi.ac.uk/rdf/services/sparql",
      "locationType": "UriLocation"
    },
    "queryTemplate": "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX faldo: <http://biohackathon.org/resource/faldo#> PREFIX dc: <http://purl.org/dc/elements/1.1/> SELECT DISTINCT ?gene (?id AS ?uniqueId) (?label AS ?name) (?desc AS ?note) ?strand ?start ?end WHERE { VALUES ?location_type { faldo:ForwardStrandPosition faldo:ReverseStrandPosition faldo:BothStrandsPosition } ?location faldo:begin _:b0 . _:b0 rdf:type ?location_type ; faldo:position ?faldo_begin . ?location faldo:end _:b1 . _:b1 rdf:type ?location_type ; faldo:position ?faldo_end . ?location faldo:reference <http://rdf.ebi.ac.uk/resource/ensembl/97/homo_sapiens/GRCh38/{refName}> . ?gene rdf:type ?type ; rdfs:label ?label ; dc:description ?desc ; dc:identifier ?id ; faldo:location ?location BIND(if(( ?location_type = faldo:ForwardStrandPosition ), 1, if(( ?location_type = faldo:ReverseStrandPosition ), -1, 0)) AS ?strand) BIND(if(( ?strand = -1 ), ?faldo_end, ?faldo_begin) AS ?start) BIND(if(( ?strand = -1 ), ?faldo_begin, ?faldo_end) AS ?end) FILTER ( ( ?start >= {start} ) && ( ?end <= {end} ) ) }",
    "refNamesQueryTemplate": "SELECT DISTINCT ?refName WHERE { ?location faldo:reference ?refName }",
    "additionalQueryParams": ["format=json"]
  }
}
```

## Source Code References

- Configuration schema: `plugins/rdf/src/SPARQLAdapter/configSchema.ts`
- Adapter implementation: `plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts`
- Test examples: `plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.test.ts`
- Documentation: `plugins/rdf/src/SPARQLAdapter/README.md`
- Track type mapping: `products/jbrowse-cli/src/commands/add-track-utils/adapter-utils.ts:284-307`
