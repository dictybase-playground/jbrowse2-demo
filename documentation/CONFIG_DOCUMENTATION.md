# JBrowse 2 Configuration Documentation

This document provides detailed documentation for the JBrowse 2 configuration file (`src/config.ts`).

## Overview

The configuration file defines the setup for a JBrowse 2 genome browser instance, including assemblies, tracks, search capabilities, and the default session state.

## Configuration Structure

### Assemblies

The `assemblies` array defines the reference genomes available in the browser.

#### Assembly Properties

- **name**: The primary identifier for the assembly (e.g., `"hg38"`)
- **aliases**: Alternate names for assemblies of the same genome. Can be used to associate a track from a different assembly to this one (e.g., `["GRCh38"]`)

#### Sequence Configuration

Each assembly includes a `sequence` object that defines the reference sequence track:

- **type**: `"ReferenceSequenceTrack"`
- **trackId**: Unique identifier for the track
- **adapter**: Defines how the sequence data is accessed

##### Supported Adapter Types

The reference sequence adapter can be one of the following types:
- **BgzipFastaAdapter**: For `.fa.gz` files (requires `.fa.gz.gzi` and `.fa.gz.fai` index files)
- **IndexedFastaAdapter**: For `.fa` files (requires `.fai` index)
- **UnindexedFastaAdapter**: For `.fa` files without indexing
- **ChromSizesAdapter**: For chromosome sizes files
- **TwoBitAdapter**: For `.2bit` format files

##### BgzipFastaAdapter Configuration

```typescript
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

#### Reference Name Aliases

The `refNameAliases` property helps resolve differently named assembly regions as the same entity.

- **Purpose**: Enables searching by alternative chromosome names (e.g., searching `"1"` as `"chr1"`)
- **Note**: Removing this property disables the ability to search by alternative names

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

### Tracks

The `tracks` array defines the genomic feature tracks available in the browser.

#### Feature Track Configuration

Feature tracks display genomic annotations such as genes, transcripts, and other features.

```typescript
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

##### Supported Feature Track Adapters

- **Gff3TabixAdapter**: For indexed GFF3 files (`.gff.gz` with `.gff.gz.tbi` index)
  - The `.gff.gz.tbi` file is assumed to be located at `{uri}.tbi`
- **Gff3Adapter**: For unindexed GFF3 files (`.gff.gz`)

#### Variant Track Configuration

Variant tracks display genetic variants such as SNPs and indels.

```typescript
{
  type: "VariantTrack",
  trackId: "variant_track_id",
  name: "1000 Genomes Variant Calls",
  assemblyNames: ["hg38"],
  category: ["1000 Genomes", "Variants"],
  adapter: {
    type: "VcfTabixAdapter",
    uri: "http://localhost:8080/variants.vcf.gz"
  }
}
```

- **category**: Optional array for organizing tracks hierarchically in the track selector

### Text Search

The `aggregateTextSearchAdapters` array enables text searching capabilities (e.g., searching by gene names).

#### TrixTextSearchAdapter Configuration

```typescript
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
  assemblyNames: ["hg38"]
}
```

### Default Session

The `defaultSession` object defines the initial state of the browser when loaded.

#### Session Properties

- **drawerPosition**: Position of the drawer panel (`"left"` or `"right"`)
- **drawerWidth**: Width of the drawer in pixels
- **widgets**: Configuration for available widgets (e.g., track selector, bookmarks)
- **activeWidgets**: Currently active/visible widgets
- **minimized**: Whether the session is minimized
- **views**: Array of view configurations (e.g., LinearGenomeView)

#### LinearGenomeView Configuration

The linear genome view displays tracks along a genomic coordinate system.

Key properties:
- **offsetPx**: Current scroll position in pixels
- **bpPerPx**: Base pairs per pixel (zoom level)
- **displayedRegions**: Array of genomic regions being displayed
- **tracks**: Array of track instances in the view
- **showCytobandsSetting**: Whether to display cytobands
- **showGridlines**: Whether to display gridlines
- **trackSelectorType**: Type of track selector to use (`"hierarchical"`)

## Example Usage

This configuration creates a JBrowse 2 instance with:
1. The hg38 (GRCh38) human reference genome
2. NCBI RefSeq gene annotations
3. 1000 Genomes variant calls
4. Text search capability for gene names
5. A default view displaying chromosome 1

## File Location References

- **Configuration file**: `src/config.ts`
- **Assembly sequence**: src/config.ts:8-27
- **Reference name aliases**: src/config.ts:31-39
- **Feature track adapter**: src/config.ts:48-53
- **Variant track adapter**: src/config.ts:62-65
- **Text search configuration**: src/config.ts:69-89
- **Default session**: src/config.ts:90-191
