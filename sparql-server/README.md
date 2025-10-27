# Dummy SPARQL Server for JBrowse 2

A lightweight SPARQL endpoint server written in Go that serves dummy genomic feature data compatible with JBrowse 2's SPARQLAdapter.

## Features

- Returns data in standard SPARQL JSON Results format
- Parses query templates with `{refName}`, `{start}`, and `{end}` placeholders
- Includes 5 dummy gene features for testing
- CORS-enabled for local development
- Simple HTTP server with no external dependencies

## Installation

### Prerequisites

- Go 1.21 or later

### Build

```bash
cd sparql-server
go build -o sparql-server
```

## Usage

### Start the Server

```bash
./sparql-server
```

The server will start on `http://localhost:8090`

### Endpoints

- **`GET /`** - Information page with usage instructions
- **`GET/POST /sparql`** - SPARQL endpoint

### Query Parameters

The `/sparql` endpoint accepts a `query` parameter containing the SPARQL query.

**Example:**

```bash
curl "http://localhost:8090/sparql?query=SELECT%20?uniqueId%20?start%20?end%20WHERE%20{%20FILTER%20((?start%20>=%200)%20&&%20(?end%20<=%20100000))%20}"
```

## Dummy Data

The server includes 5 pre-defined gene features:

| UniqueID | Start  | End    | Name  | Strand | Type |
|----------|--------|--------|-------|--------|------|
| gene001  | 10000  | 20000  | GENE1 | +1     | gene |
| gene002  | 25000  | 35000  | GENE2 | -1     | gene |
| gene003  | 40000  | 50000  | GENE3 | +1     | gene |
| gene004  | 55000  | 65000  | GENE4 | -1     | gene |
| gene005  | 70000  | 80000  | GENE5 | +1     | gene |

Features are filtered based on the `start` and `end` values extracted from the SPARQL query.

## Response Format

The server returns data in the standard SPARQL JSON Results format:

```json
{
  "head": {
    "vars": ["uniqueId", "start", "end", "name", "note", "strand", "type"]
  },
  "results": {
    "bindings": [
      {
        "uniqueId": {
          "type": "literal",
          "value": "gene001"
        },
        "start": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "10000"
        },
        "end": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "20000"
        },
        "name": {
          "type": "literal",
          "value": "GENE1"
        },
        "note": {
          "type": "literal",
          "value": "Dummy gene 1 for testing"
        },
        "strand": {
          "type": "literal",
          "datatype": "http://www.w3.org/2001/XMLSchema#integer",
          "value": "1"
        },
        "type": {
          "type": "literal",
          "value": "gene"
        }
      }
    ]
  }
}
```

## JBrowse 2 Configuration

To use this SPARQL server with JBrowse 2, add a track configuration like this:

```json
{
  "type": "FeatureTrack",
  "trackId": "sparql_test_track",
  "name": "SPARQL Test Features",
  "assemblyNames": ["hg38"],
  "adapter": {
    "type": "SPARQLAdapter",
    "endpoint": {
      "uri": "http://localhost:8090/sparql",
      "locationType": "UriLocation"
    },
    "queryTemplate": "SELECT ?uniqueId ?start ?end ?name ?note ?strand ?type WHERE { FILTER ( (?start >= {start}) && (?end <= {end}) ) }",
    "additionalQueryParams": []
  }
}
```

## Development

### Modifying Dummy Data

Edit the `GenerateDummyFeatures` function in `main.go` to add or modify features:

```go
features := []Feature{
    {
        UniqueID: "gene006",
        Start:    85000,
        End:      95000,
        Name:     "GENE6",
        Note:     "Custom gene for testing",
        Strand:   1,
        Type:     "gene",
    },
    // Add more features...
}
```

### Changing the Port

Modify the `port` variable in the `main` function:

```go
port := "8090"  // Change to your desired port
```

## CORS

The server includes CORS headers to allow cross-origin requests from JBrowse 2 running on different ports during development:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept
```

For production use, you should restrict the allowed origins.

## License

This is demo/testing code for JBrowse 2 development.
