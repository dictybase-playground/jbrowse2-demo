# JBrowse2 Demo - Project Setup

This document explains how the JBrowse2 demo project is configured and set up.

## Overview

This project is a React application that integrates [JBrowse 2](https://jbrowse.org/jb2/) for genome visualization. It uses Vite as the build tool and TypeScript for type safety.

## Application Architecture

### Main Application (`src/App.tsx`)

The application follows this pattern:
1. Import `createViewState` and `JBrowseApp` from `@jbrowse/react-app2`
2. Create view state using the configuration in `useEffect`
3. Render the `JBrowseApp` component with the view state

```typescript
const state = createViewState({ config })
setViewState(state)
// ...
return <JBrowseApp viewState={viewState} />
```

## Development Workflow

### Install Dependencies
```bash
bun install
```

### Development Server
```bash
bun dev
```
Starts Vite dev server with HMR (Hot Module Replacement)

## Data Requirements

The application expects genome data to be served from `http://localhost:8080`:

- `hg38.prefix.fa.gz` - Compressed FASTA sequence
- `hg38.prefix.fa.gz.fai` - FASTA index
- `hg38.prefix.fa.gz.gzi` - Gzip index
- `GCA_000001405.15_GRCh38_full_analysis_set.refseq_annotation.sorted.gff.gz` - Gene annotations

You'll need to set up a local file server on port 8080 to serve these files from the `public/` directory.

### JBrowse Configuration (`src/config.ts`)

The JBrowse configuration defines:

**Assemblies**:
- `hg38` (GRCh38) human genome reference
- Uses BgzipFastaAdapter for FASTA sequence data
- Data served from `http://localhost:8080`
- Reference name aliases from jbrowse.org

**Tracks**:
- NCBI RefSeq Genes (GFF3 format)
- Uses Gff3TabixAdapter for indexed GFF data

**Default Session**:
- Linear Genome View configured for chromosome 1
- Hierarchical track selector enabled
- Reference sequence track and gene annotation track visible

