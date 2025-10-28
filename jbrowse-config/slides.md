---
theme: default
title: JBrowse 2 Configuration
info: |
  ## JBrowse 2 Configuration Documentation

  A comprehensive guide to configuring JBrowse 2 genome browser instances.
class: text-center
highlighter: shiki
drawings:
  persist: false
transition: slide-left
mdc: true
---

# JBrowse 2 Configuration

A comprehensive guide to `src/config.ts`

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

---
layout: default
---

# Overview

The configuration file defines the complete setup for a JBrowse 2 genome browser instance.

## Key Components

- **Assemblies** - Reference genomes available in the browser
- **Tracks** - Genomic feature tracks (genes, variants, etc.)
- **Text Search** - Search capabilities for gene names
- **Default Session** - Initial browser state and view settings

<br>

<div class="text-sm opacity-75">
File: <code>src/config.ts</code>
</div>

---
layout: two-cols
---

# Assemblies

The `assemblies` array defines reference genomes available in the browser.

## Assembly Properties

- **name** - Primary identifier (e.g., `"hg38"`)
- **aliases** - Alternate names for the same genome
  - Used to associate tracks from different assemblies
  - Example: `["GRCh38"]`

::right::

```typescript
{
  name: "hg38",
  aliases: ["GRCh38"],
  sequence: {
    type: "ReferenceSequenceTrack",
    trackId: "P6R5xbRqRr",
    adapter: { /* ... */ }
  },
  refNameAliases: { /* ... */ }
}
```

---
layout: default
---

# Sequence Configuration

Each assembly includes a `sequence` object defining the reference sequence track.

## Supported Adapter Types

<div class="grid grid-cols-2 gap-4">

<div>

- **BgzipFastaAdapter** - `.fa.gz` files
  - Requires `.fa.gz.gzi` and `.fa.gz.fai` indices
- **IndexedFastaAdapter** - `.fa` with `.fai` index
- **UnindexedFastaAdapter** - `.fa` without indexing

</div>

<div>

- **ChromSizesAdapter** - Chromosome sizes files
- **TwoBitAdapter** - `.2bit` format files

</div>

</div>

---
layout: default
---

# FASTA Format (.fa)

The FASTA format is a text-based format for representing nucleotide or protein sequences.

## Structure

<div class="mt-4">

**Header Line**
- Starts with `>` followed by the contig/sequence name
- Example: `>chr1` or `>NM_001301717.2`

**Sequence Lines**
- Nucleotide bases (A, C, G, T) or amino acids
- Can be split across multiple lines

</div>

---
layout: default
---

# FASTA Index (.fai)

The `.fai` index file enables efficient random access to sequences in FASTA files.

## Index Format (5 columns)

1. **Contig name** - Matches the name after `>` in the FASTA file
2. **Number of bases** - Total length of the contig sequence
3. **Byte offset** - File position where the sequence begins
4. **Bases per line** - Number of bases on each line in the FASTA
5. **Bytes per line** - Total bytes per line (including newline characters)

<div class="text-sm mt-4 opacity-75">
The index allows JBrowse to quickly jump to specific genomic regions without loading the entire file
</div>

---
layout: default
---

# BgzipFastaAdapter Example

```typescript {all|2|3-6|7-10|11-14}
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
```

<div class="text-sm mt-4 opacity-75">
All three files (FASTA, FAI index, and GZI index) are required for BgzipFastaAdapter
</div>

---
layout: default
---

# Reference Name Aliases

Helps resolve differently named assembly regions as the same entity.

<div class="grid grid-cols-2 gap-4">

<div>

## Purpose
- Enables searching by alternative chromosome names
- Example: Search `"1"` as `"chr1"`

## Note
Removing this property disables alternative name searching

</div>

<div>

```typescript
refNameAliases: {
  adapter: {
    type: "RefNameAliasAdapter",
    location: {
      uri: "http://localhost:8080/hg38_aliases.txt",
      locationType: "UriLocation"
    }
  }
}
```

</div>

</div>

---
layout: section
---

# Tracks

Genomic feature tracks available in the browser

---
layout: default
---

# Feature Track Configuration

Display genomic annotations such as genes, transcripts, and other features.

```typescript {all|2|3|4|5|6-9}
{
  type: "FeatureTrack",
  trackId: "ncbi_genes",
  name: "NCBI RefSeq Genes",
  assemblyNames: ["hg38"],
  adapter: {
    type: "Gff3TabixAdapter",
    uri: "http://localhost:8080/file.gff.gz"
  }
}
```
---
layout: default
---

# Feature Track Adapters

## Supported Adapter Types

<div class="grid grid-cols-2 gap-4">

<div class="mt-8">

**Gff3TabixAdapter**
- For indexed GFF3 files (`.gff.gz` with `.gff.gz.tbi` index)
- The `.gff.gz.tbi` file is assumed to be at `{uri}.tbi`
- Recommended for better performance

<br>

**Gff3Adapter**
- For unindexed GFF3 files (`.gff.gz`)
- Simpler setup but slower for large files

</div>

<div class="mt-8">

** Others **

- BedAdapter (explicit)
- GtfAdapter
- BedTabixAdapter
- BigBedAdapter
- NCListAdapter
- SPARQLAdapter

</div>

</div>

---
layout: default
---

# GFF3 Format

GFF3 (General Feature Format version 3) is a tab-delimited text format for describing genomic features.

## Structure

<div class="mt-4">

- Tab-separated columns (9 required columns)
- Plain text or compressed (`.gff` or `.gff.gz`)
- Hierarchical features using Parent-Child relationships
- Commonly used for gene annotations, transcripts, and other genomic features

</div>

<div class="text-sm mt-4 opacity-75">
Example features: genes, mRNAs, exons, CDSs, regulatory elements
</div>

---
layout: default
---

# GFF3 Format - 9 Columns

<div class="text-sm">

| Column | Name | Description |
|--------|------|-------------|
| 1 | **seqid** | Chromosome or scaffold name (e.g., `chr1`) |
| 2 | **source** | Program or data source that generated the feature |
| 3 | **type** | Feature type - must be a SOFA ontology term (e.g., `gene`, `mRNA`) |
| 4 | **start** | Start position (1-based, inclusive) |
| 5 | **end** | End position (1-based, inclusive) |
| 6 | **score** | Floating point value (or `.` if not applicable) |
| 7 | **strand** | `+` (forward), `-` (reverse), or `.` (unstranded) |
| 8 | **phase** | For CDS features: `0`, `1`, `2` (codon reading frame) |
| 9 | **attributes** | Semicolon-separated tag-value pairs (e.g., `ID=gene1;Name=ABC1`) |

</div>

<div class="text-sm mt-4 opacity-75">
Common attributes: ID, Name, Parent, Alias, Note
</div>

---
layout: center
class: text-center
---

# Example Configuration

This configuration creates a JBrowse 2 instance with:

<div class="mt-8 text-left inline-block">

1. The **hg38 (GRCh38)** human reference genome
2. **NCBI RefSeq** gene annotations
3. **1000 Genomes** variant calls
4. **Text search** capability for gene names
5. A default view displaying **chromosome 1**

</div>

---
layout: section
---

# SPARQLAdapter

Accessing genomic data from RDF stores via SPARQL endpoints

---
layout: default
---

# SPARQLAdapter Overview

The SPARQLAdapter enables JBrowse to display genomic information from RDF data stores accessed via SPARQL endpoints.

## Key Features

- Query semantic web databases for genomic features
- Compatible with FeatureTrack and VariantTrack
- Supports dynamic queries with template placeholders
- Handles hierarchical subfeatures
- Works with standard FALDO ontology

<br>

<div class="text-sm opacity-75">
Source: <code>plugins/rdf/src/SPARQLAdapter/</code>
</div>

---
layout: default
---

# Compatible Track Types

SPARQLAdapter works with multiple track types depending on the data your query provides.

<div class="mt-8">

## Recommended Track Types

- **FeatureTrack** - Most common use case for genomic features
  - Genes, transcripts, regulatory elements
- **VariantTrack** - When query provides variant-specific fields
  - Requires: REF, ALT, QUAL, etc.
- **Other track types** - As long as query provides required fields

</div>

<div class="text-sm mt-4 opacity-75">
The track type determines what fields are displayed and how features are rendered
</div>

---
layout: two-cols
---

# Basic SPARQL Configuration

A minimal SPARQLAdapter configuration requires three main components.

## Required Components

1. **Track metadata** - Type, ID, name
2. **SPARQL endpoint** - URI location
3. **Query template** - SPARQL query with placeholders

::right::

```json
{
  "type": "FeatureTrack",
  "trackId": "my_sparql_track",
  "name": "SPARQL Features",
  "assemblyNames": ["hg38"],
  "adapter": {
    "type": "SPARQLAdapter",
    "endpoint": {
      "uri": "https://example.com/sparql",
      "locationType": "UriLocation"
    },
    "queryTemplate": "..."
  }
}
```

---
layout: default
---

# SPARQL Required Fields

## endpoint

<div class="mt-4">

**Type:** fileLocation object

**Description:** URL of the SPARQL endpoint

```json
"endpoint": {
  "uri": "https://www.ebi.ac.uk/rdf/services/sparql",
  "locationType": "UriLocation"
}
```

</div>

## queryTemplate

<div class="mt-4">

**Type:** string

**Description:** SPARQL query where `{start}`, `{end}`, and `{refName}` are replaced for each request

</div>

<div class="text-sm mt-4 opacity-75">
Source: plugins/rdf/src/SPARQLAdapter/configSchema.ts:3-40
</div>

---
layout: default
---

# SPARQL Optional Fields (1/2)

## refNamesQueryTemplate

<div class="mt-4">

**Type:** string (default: empty)

**Description:** SPARQL query that returns possible refNames in a `?refName` column

```sparql
SELECT DISTINCT ?refName WHERE {
  ?s faldo:reference ?refName
}
```

</div>

## refNames

<div class="mt-4">

**Type:** string array (default: `[]`)

**Description:** Possible refNames (ignored if refNamesQueryTemplate is provided)

```json
"refNames": ["chr1", "chr2", "chr3", "chrX", "chrY"]
```

</div>

---
layout: default
---

# SPARQL Optional Fields (2/2)

## additionalQueryParams

<div class="mt-4">

**Type:** string array (default: `[]`)

**Description:** Additional parameters to add to the query URL

**Use case:** Specify response format or other endpoint-specific parameters

```json
"additionalQueryParams": ["format=json"]
```

</div>

<div class="mt-8 text-sm opacity-75">

The final request URL is constructed as:

`{endpoint}?query={encodedQueryTemplate}{additionalQueryParams}`

</div>

---
layout: default
---

# Query Template Requirements

Your SPARQL query **must** return these three variables:

<div class="mt-8">

## Required Variables

| Variable | Description |
|----------|-------------|
| **?start** | Start position of the feature (integer) |
| **?end** | End position of the feature (integer) |
| **?uniqueId** | Unique identifier for the feature (string) |

</div>

<div class="mt-8">

## Optional Variables

Any additional variables will be added to the feature data:
- `?name` - Feature name
- `?note` - Description/notes
- `?strand` - Strand information (1, -1, or 0)
- `?type` - Feature type
- Custom properties...

</div>

<div class="text-sm mt-4 opacity-75">
Source: plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts:136-142
</div>

---
layout: default
---

# Template Placeholders

The query template supports dynamic placeholders replaced at query time:

<div class="mt-8">

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| **{refName}** | Reference sequence name | `"chr1"`, `"chrX"` |
| **{start}** | Query start position | `1000000` |
| **{end}** | Query end position | `2000000` |

</div>

<div class="mt-8">

## Usage Example

```sparql
?location faldo:reference
  <http://example.org/genome/{refName}> .

FILTER ( (?start >= {start}) && (?end <= {end}) )
```

</div>

<div class="text-sm mt-4 opacity-75">
These placeholders are replaced with actual values when querying the endpoint
</div>

---
layout: default
---

# Example Query Template (1/2)

```sparql {1-4|6|8-14|15-20|21-23}
PREFIX  rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX  rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX  faldo: <http://biohackathon.org/resource/faldo#>
PREFIX  dc:   <http://purl.org/dc/elements/1.1/>

SELECT DISTINCT ?gene (?id AS ?uniqueId) (?label AS ?name) (?desc AS ?note) ?strand ?start ?end

WHERE {
  VALUES ?location_type {
    faldo:ForwardStrandPosition
    faldo:ReverseStrandPosition
    faldo:BothStrandsPosition
  }

  ?location faldo:begin _:b0 .
  _:b0 rdf:type ?location_type ;
       faldo:position ?faldo_begin .
  ?location faldo:end _:b1 .
  _:b1 rdf:type ?location_type ;
       faldo:position ?faldo_end .

  ?location faldo:reference
    <http://rdf.ebi.ac.uk/resource/ensembl/97/homo_sapiens/GRCh38/{refName}> .
```

---
layout: default
---

# Example Query Template (2/2)

```sparql {1-5|7-9|11-12|14}
  ?gene rdf:type ?type ;
        rdfs:label ?label ;
        dc:description ?desc ;
        dc:identifier ?id ;
        faldo:location ?location

  BIND(if((?location_type = faldo:ForwardStrandPosition), 1,
          if((?location_type = faldo:ReverseStrandPosition), -1, 0))
       AS ?strand)

  BIND(if((?strand = -1), ?faldo_end, ?faldo_begin) AS ?start)
  BIND(if((?strand = -1), ?faldo_begin, ?faldo_end) AS ?end)

  FILTER ( (?start >= {start}) && (?end <= {end}) )
}
```

<div class="text-sm mt-4 opacity-75">
This query retrieves genes with proper strand handling from an Ensembl RDF endpoint
</div>

---
layout: default
---

# Subfeatures - Method 1

## Parent-Child Relationship via ?parentUniqueId

Include a `?parentUniqueId` variable to create parent-child relationships.

<div class="mt-4">

**How it works:**
- Feature with `?parentUniqueId` becomes a subfeature
- Parent is the feature with matching `?uniqueId`

**Example:**

| uniqueId | start | end | parentUniqueId | type |
|----------|-------|-----|----------------|------|
| gene001 | 1000 | 5000 | - | gene |
| tx001 | 1100 | 4900 | gene001 | transcript |
| exon001 | 1100 | 1500 | tx001 | exon |

Result: gene → transcript → exon hierarchy

</div>

<div class="text-sm mt-4 opacity-75">
Source: plugins/rdf/src/SPARQLAdapter/SPARQLAdapter.ts:180-223
</div>

---
layout: default
---

# Subfeatures - Method 2

## Nested Features via Prefixes

Prefix variables with `sub_` for subfeatures:

<div class="mt-4">

**Prefix levels:**
- First level: `sub_uniqueId`, `sub_start`, `sub_end`, `sub_type`
- Second level: `sub_sub_uniqueId`, `sub_sub_start`, `sub_sub_end`
- And so on...

</div>

<div class="mt-4 text-xs">

| uniqueId | type | start | end | sub_uniqueId | sub_type | sub_start | sub_end | sub_sub_uniqueId | sub_sub_type | sub_sub_start | sub_sub_end |
|----------|------|-------|-----|--------------|----------|-----------|---------|------------------|--------------|---------------|-------------|
| gene0001 | gene | 10430102 | 10452003 | tx0001 | transcript | 10430518 | 10442405 | exon0001 | exon | 10430518 | 10430568 |
| gene0001 | gene | 10430102 | 10452003 | tx0001 | transcript | 10430518 | 10442405 | exon0002 | exon | 10432568 | 10433965 |

</div>

<div class="mt-4 text-sm opacity-75">
Result: One gene feature with one transcript subfeature containing two exon subfeatures
</div>

---
layout: default
---

# Complete SPARQL Configuration

```json {all|2-5|7-10|11|12-15}
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
    "queryTemplate": "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ...",
    "refNamesQueryTemplate": "SELECT DISTINCT ?refName WHERE { ?location faldo:reference ?refName }",
    "additionalQueryParams": ["format=json"]
  }
}
```

<div class="text-sm mt-4 opacity-75">
This configuration creates a track that queries Ensembl's RDF endpoint for gene features
</div>
