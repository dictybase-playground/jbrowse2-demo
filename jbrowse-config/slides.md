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

**BedAdapter**
- `.bed` files
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
