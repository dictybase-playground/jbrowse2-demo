# RDF and SPARQL Documentation

A comprehensive guide to understanding RDF (Resource Description Framework) and SPARQL for genomic data.

## Table of Contents

- [What is RDF?](#what-is-rdf)
- [What is SPARQL?](#what-is-sparql)
- [How They Work Together](#how-they-work-together)
- [RDF Serialization Formats](#rdf-serialization-formats)
- [Real-World Examples](#real-world-examples)

---

## What is RDF?

**RDF (Resource Description Framework) is a way to store data as simple statements about things.**

Think of it like a collection of sentences with three parts:
- **Subject** - What you're talking about
- **Predicate** - The relationship or property
- **Object** - The value or another thing

### Example in Plain English:
- "GENE1 **has-location** chromosome 1"
- "GENE1 **has-start-position** 10000"
- "GENE1 **has-name** DDX11L1"

### Why Use RDF?

1. **Linked Data** - Everything is connected by relationships
2. **Flexible** - Easy to add new properties without restructuring
3. **Semantic** - The meaning is built into the data structure
4. **Interoperable** - Different databases can share and understand each other's data

### RDF for Genomics

Instead of a table like this:
| Gene ID | Name | Chromosome | Start |
|---------|------|------------|-------|
| gene001 | DDX11L1 | chr1 | 10000 |

RDF stores it as connected statements:
```
gene001 → has-name → "DDX11L1"
gene001 → located-on → chr1
gene001 → starts-at → 10000
```

---

## What is SPARQL?

**SPARQL is the query language for RDF data** (like SQL is for relational databases).

It lets you:
- **Ask questions** about the connected data
- **Find patterns** across relationships
- **Filter** and retrieve specific information

### Simple Analogy

- **RDF** = Your data organized as a graph/network of connected facts
- **SPARQL** = The language you use to search through that network

### Example Query in Plain English:

*"Find me all genes on chromosome 1 between positions 10000 and 50000, and give me their names and types"*

### In SPARQL:
```sparql
SELECT ?name ?type
WHERE {
  ?gene located-on chr1 .
  ?gene has-name ?name .
  ?gene has-type ?type .
  ?gene starts-at ?start .
  FILTER (?start >= 10000 && ?start <= 50000)
}
```

---

## How They Work Together

### For JBrowse and Genomic Browsers

1. **Genomic databases** (like Ensembl, UniProt) store their data in RDF format
2. They provide **SPARQL endpoints** - web URLs where you can send queries
3. **JBrowse's SPARQLAdapter** sends SPARQL queries to these endpoints
4. The endpoint **returns matching features** in JSON format
5. JBrowse **displays** them as tracks on the genome browser

### The Power of This Approach

Instead of downloading entire databases, JBrowse can:
- Query multiple RDF databases on-demand
- Get only the data needed for the current view
- Combine data from different sources that speak the same "RDF language"

**Bottom line:** RDF is the data format (how it's stored), SPARQL is the query language (how you ask for it), and together they enable flexible, linked genomic data access across the web.

---

## RDF Serialization Formats

RDF can be written in several different formats. Here are the most common ones using genomic data:

### 1. Turtle (TTL) - Most Human-Readable

```turtle
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix faldo: <http://biohackathon.org/resource/faldo#> .
@prefix ex: <http://example.org/genes/> .

ex:gene001 rdf:type ex:Gene ;
           ex:name "DDX11L1" ;
           ex:description "DEAD/H-box helicase 11 like 1" ;
           ex:strand "+" ;
           faldo:location ex:location001 .

ex:location001 faldo:begin ex:position001 ;
               faldo:end ex:position002 ;
               faldo:reference ex:chr1 .

ex:position001 rdf:type faldo:ForwardStrandPosition ;
               faldo:position 11869 .

ex:position002 rdf:type faldo:ForwardStrandPosition ;
               faldo:position 14409 .

ex:chr1 ex:name "chromosome 1" .
```

**Breaking it down:**
- `@prefix` defines shortcuts for long URIs
- `;` continues properties for the same subject
- `.` ends a statement
- Each line is basically: `subject predicate object`

### 2. RDF/XML - XML Format

```xml
<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:faldo="http://biohackathon.org/resource/faldo#"
         xmlns:ex="http://example.org/genes/">

  <ex:Gene rdf:about="http://example.org/genes/gene001">
    <ex:name>DDX11L1</ex:name>
    <ex:description>DEAD/H-box helicase 11 like 1</ex:description>
    <ex:strand>+</ex:strand>
    <faldo:location rdf:resource="http://example.org/genes/location001"/>
  </ex:Gene>

  <faldo:Location rdf:about="http://example.org/genes/location001">
    <faldo:begin rdf:resource="http://example.org/genes/position001"/>
    <faldo:end rdf:resource="http://example.org/genes/position002"/>
    <faldo:reference rdf:resource="http://example.org/genes/chr1"/>
  </faldo:Location>

  <faldo:ForwardStrandPosition rdf:about="http://example.org/genes/position001">
    <faldo:position rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">11869</faldo:position>
  </faldo:ForwardStrandPosition>

  <faldo:ForwardStrandPosition rdf:about="http://example.org/genes/position002">
    <faldo:position rdf:datatype="http://www.w3.org/2001/XMLSchema#integer">14409</faldo:position>
  </faldo:ForwardStrandPosition>

</rdf:RDF>
```

### 3. N-Triples - Simplest (One Triple Per Line)

```ntriples
<http://example.org/genes/gene001> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.org/genes/Gene> .
<http://example.org/genes/gene001> <http://example.org/genes/name> "DDX11L1" .
<http://example.org/genes/gene001> <http://example.org/genes/description> "DEAD/H-box helicase 11 like 1" .
<http://example.org/genes/gene001> <http://example.org/genes/strand> "+" .
<http://example.org/genes/gene001> <http://biohackathon.org/resource/faldo#location> <http://example.org/genes/location001> .
<http://example.org/genes/location001> <http://biohackathon.org/resource/faldo#begin> <http://example.org/genes/position001> .
<http://example.org/genes/location001> <http://biohackathon.org/resource/faldo#end> <http://example.org/genes/position002> .
<http://example.org/genes/location001> <http://biohackathon.org/resource/faldo#reference> <http://example.org/genes/chr1> .
<http://example.org/genes/position001> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://biohackathon.org/resource/faldo#ForwardStrandPosition> .
<http://example.org/genes/position001> <http://biohackathon.org/resource/faldo#position> "11869"^^<http://www.w3.org/2001/XMLSchema#integer> .
<http://example.org/genes/position002> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://biohackathon.org/resource/faldo#ForwardStrandPosition> .
<http://example.org/genes/position002> <http://biohackathon.org/resource/faldo#position> "14409"^^<http://www.w3.org/2001/XMLSchema#integer> .
```

**Each line is:** `<subject> <predicate> <object> .`

### 4. JSON-LD - JSON Format for RDF

```json
{
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "faldo": "http://biohackathon.org/resource/faldo#",
    "ex": "http://example.org/genes/"
  },
  "@id": "ex:gene001",
  "@type": "ex:Gene",
  "ex:name": "DDX11L1",
  "ex:description": "DEAD/H-box helicase 11 like 1",
  "ex:strand": "+",
  "faldo:location": {
    "@id": "ex:location001",
    "faldo:begin": {
      "@id": "ex:position001",
      "@type": "faldo:ForwardStrandPosition",
      "faldo:position": {
        "@type": "http://www.w3.org/2001/XMLSchema#integer",
        "@value": 11869
      }
    },
    "faldo:end": {
      "@id": "ex:position002",
      "@type": "faldo:ForwardStrandPosition",
      "faldo:position": {
        "@type": "http://www.w3.org/2001/XMLSchema#integer",
        "@value": 14409
      }
    },
    "faldo:reference": {
      "@id": "ex:chr1"
    }
  }
}
```

### Visualizing the Data as a Graph

All these formats represent the same **graph structure**:

```
                   ┌─────────────┐
                   │   gene001   │
                   └──────┬──────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
      name: "DDX11L1"  strand: "+"   location001
                                           │
                            ┌──────────────┼──────────────┐
                            │              │              │
                        begin          end          reference
                            │              │              │
                       position001    position002       chr1
                          │              │
                    11869 (int)     14409 (int)
```

---

## Real-World Examples

### Ensembl RDF Data

Here's what **actual Ensembl data** looks like in Turtle format:

```turtle
<http://rdf.ebi.ac.uk/resource/ensembl/ENSG00000223972>
    a ensembl:Gene ;
    rdfs:label "DDX11L1" ;
    dc:identifier "ENSG00000223972" ;
    dc:description "DEAD/H-box helicase 11 like 1 [Source:HGNC Symbol;Acc:HGNC:37102]" ;
    faldo:location [
        faldo:begin [
            a faldo:ForwardStrandPosition ;
            faldo:position 11869 ;
            faldo:reference <http://rdf.ebi.ac.uk/resource/ensembl/homo_sapiens/GRCh38/1>
        ] ;
        faldo:end [
            a faldo:ForwardStrandPosition ;
            faldo:position 14409 ;
            faldo:reference <http://rdf.ebi.ac.uk/resource/ensembl/homo_sapiens/GRCh38/1>
        ]
    ] .
```

This is the actual structure that JBrowse's SPARQLAdapter queries!

### SPARQL Query for Ensembl

Here's a complete SPARQL query that retrieves genes from Ensembl's RDF endpoint:

```sparql
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX faldo: <http://biohackathon.org/resource/faldo#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>

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

**Query Breakdown:**

1. **PREFIX declarations** - Define namespaces for RDF vocabularies
2. **SELECT** - Choose which variables to return
3. **VALUES** - Define possible strand types
4. **Pattern matching** - Find genes with locations matching the criteria
5. **BIND** - Calculate derived values (strand numbers, corrected positions)
6. **FILTER** - Apply range constraints using placeholders

---

## FALDO Ontology

**FALDO (Feature Annotation Location Description Ontology)** is a standardized ontology for describing the locations of biological sequence features in RDF.

### Core Concepts

- **Positions** - Exact coordinates on a sequence
  - `faldo:position` - The numerical position value
  - `faldo:reference` - Which chromosome/sequence the position is on

- **Strand Information**
  - `faldo:ForwardStrandPosition` - Feature on forward/plus strand (+)
  - `faldo:ReverseStrandPosition` - Feature on reverse/minus strand (-)
  - `faldo:BothStrandsPosition` - Feature on both strands or strand-agnostic

- **Regions** - Defined by begin and end positions
  - `faldo:begin` - Start of the feature
  - `faldo:end` - End of the feature
  - `faldo:location` - Links a feature to its location

### Why FALDO Matters

FALDO enables interoperability between different biological databases by providing a standard vocabulary. This allows JBrowse's SPARQLAdapter to query any FALDO-compliant RDF endpoint (like Ensembl, UniProt, etc.) using the same ontology terms.

---

## Additional Resources

- [W3C RDF Primer](https://www.w3.org/TR/rdf11-primer/)
- [SPARQL 1.1 Query Language](https://www.w3.org/TR/sparql11-query/)
- [FALDO Specification](https://github.com/OBF/FALDO)
- [Ensembl RDF Documentation](https://www.ensembl.org/info/data/rdf/index.html)
- [JBrowse 2 SPARQLAdapter Documentation](./SPARQLAdapter-Configuration.md)
