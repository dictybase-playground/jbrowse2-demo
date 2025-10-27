package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
)

// SPARQLResponse represents the standard SPARQL JSON Results format
type SPARQLResponse struct {
	Head    Head    `json:"head"`
	Results Results `json:"results"`
}

type Head struct {
	Vars []string `json:"vars"`
}

type Results struct {
	Bindings []Binding `json:"bindings"`
}

type Binding map[string]Value

type Value struct {
	Type     string `json:"type"`
	Value    string `json:"value"`
	Datatype string `json:"datatype,omitempty"`
}

// Feature represents a genomic feature
type Feature struct {
	UniqueID string
	Start    int
	End      int
	Name     string
	Note     string
	Strand   int
	Type     string
}

// DummyDataGenerator generates dummy genomic features
func GenerateDummyFeatures(refName string, start, end int) []Feature {
	features := []Feature{
		{
			UniqueID: "gene001",
			Start:    10000,
			End:      20000,
			Name:     "GENE1",
			Note:     "Dummy gene 1 for testing",
			Strand:   1,
			Type:     "gene",
		},
		{
			UniqueID: "gene002",
			Start:    25000,
			End:      35000,
			Name:     "GENE2",
			Note:     "Dummy gene 2 for testing",
			Strand:   -1,
			Type:     "gene",
		},
		{
			UniqueID: "gene003",
			Start:    40000,
			End:      50000,
			Name:     "GENE3",
			Note:     "Dummy gene 3 for testing",
			Strand:   1,
			Type:     "gene",
		},
		{
			UniqueID: "gene004",
			Start:    55000,
			End:      65000,
			Name:     "GENE4",
			Note:     "Dummy gene 4 for testing",
			Strand:   -1,
			Type:     "gene",
		},
		{
			UniqueID: "gene005",
			Start:    70000,
			End:      80000,
			Name:     "GENE5",
			Note:     "Dummy gene 5 for testing",
			Strand:   1,
			Type:     "gene",
		},
	}

	// Filter features based on the requested range
	var filtered []Feature
	for _, f := range features {
		if f.Start >= start && f.End <= end {
			filtered = append(filtered, f)
		} else if f.Start < end && f.End > start {
			// Feature overlaps with the requested range
			filtered = append(filtered, f)
		}
	}

	return filtered
}

// ParseSPARQLQuery extracts refName, start, and end from the query
func ParseSPARQLQuery(query string) (refName string, start int, end int, err error) {
	// Extract refName from the query
	refNameRegex := regexp.MustCompile(`/([^/]+)>\s*\.?\s*(?:FILTER|BIND|$)`)
	matches := refNameRegex.FindStringSubmatch(query)
	if len(matches) > 1 {
		refName = matches[1]
	} else {
		refName = "chr1" // default
	}

	// Extract start value
	startRegex := regexp.MustCompile(`\?start\s*>=\s*(\d+)`)
	startMatches := startRegex.FindStringSubmatch(query)
	if len(startMatches) > 1 {
		start, err = strconv.Atoi(startMatches[1])
		if err != nil {
			return "", 0, 0, fmt.Errorf("invalid start value: %v", err)
		}
	} else {
		start = 0
	}

	// Extract end value
	endRegex := regexp.MustCompile(`\?end\s*<=\s*(\d+)`)
	endMatches := endRegex.FindStringSubmatch(query)
	if len(endMatches) > 1 {
		end, err = strconv.Atoi(endMatches[1])
		if err != nil {
			return "", 0, 0, fmt.Errorf("invalid end value: %v", err)
		}
	} else {
		end = 1000000 // large default
	}

	return refName, start, end, nil
}

// FeaturesToSPARQLResponse converts features to SPARQL JSON format
func FeaturesToSPARQLResponse(features []Feature) SPARQLResponse {
	vars := []string{"uniqueId", "start", "end", "name", "note", "strand", "type"}
	bindings := make([]Binding, 0, len(features))

	for _, f := range features {
		binding := Binding{
			"uniqueId": Value{
				Type:  "literal",
				Value: f.UniqueID,
			},
			"start": Value{
				Type:     "literal",
				Value:    strconv.Itoa(f.Start),
				Datatype: "http://www.w3.org/2001/XMLSchema#integer",
			},
			"end": Value{
				Type:     "literal",
				Value:    strconv.Itoa(f.End),
				Datatype: "http://www.w3.org/2001/XMLSchema#integer",
			},
			"name": Value{
				Type:  "literal",
				Value: f.Name,
			},
			"note": Value{
				Type:  "literal",
				Value: f.Note,
			},
			"strand": Value{
				Type:     "literal",
				Value:    strconv.Itoa(f.Strand),
				Datatype: "http://www.w3.org/2001/XMLSchema#integer",
			},
			"type": Value{
				Type:  "literal",
				Value: f.Type,
			},
		}
		bindings = append(bindings, binding)
	}

	return SPARQLResponse{
		Head: Head{
			Vars: vars,
		},
		Results: Results{
			Bindings: bindings,
		},
	}
}

// SPARQLHandler handles SPARQL endpoint requests
func SPARQLHandler(w http.ResponseWriter, r *http.Request) {
	// Enable CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Get the query parameter
	var query string
	if r.Method == "GET" {
		query = r.URL.Query().Get("query")
	} else if r.Method == "POST" {
		if err := r.ParseForm(); err != nil {
			http.Error(w, "Failed to parse form", http.StatusBadRequest)
			return
		}
		query = r.FormValue("query")
	}

	if query == "" {
		http.Error(w, "Missing query parameter", http.StatusBadRequest)
		return
	}

	// Decode URL-encoded query
	decodedQuery, err := url.QueryUnescape(query)
	if err != nil {
		decodedQuery = query
	}

	log.Printf("Received query: %s", decodedQuery)

	// Parse the query to extract parameters
	refName, start, end, err := ParseSPARQLQuery(decodedQuery)
	if err != nil {
		log.Printf("Error parsing query: %v", err)
		http.Error(w, fmt.Sprintf("Error parsing query: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("Parsed - refName: %s, start: %d, end: %d", refName, start, end)

	// Generate dummy features
	features := GenerateDummyFeatures(refName, start, end)

	// Convert to SPARQL response format
	response := FeaturesToSPARQLResponse(features)

	// Set response headers
	w.Header().Set("Content-Type", "application/sparql-results+json")

	// Encode and send response
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}

	log.Printf("Returned %d features", len(features))
}

// RootHandler handles the root endpoint
func RootHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	html := `
<!DOCTYPE html>
<html>
<head>
    <title>Dummy SPARQL Server</title>
</head>
<body>
    <h1>Dummy SPARQL Server for JBrowse 2</h1>
    <p>This is a test SPARQL endpoint that returns dummy genomic features.</p>

    <h2>Usage</h2>
    <p>Send SPARQL queries to <code>/sparql</code> endpoint.</p>

    <h3>Example Query</h3>
    <pre>
PREFIX faldo: &lt;http://biohackathon.org/resource/faldo#&gt;

SELECT ?uniqueId ?start ?end ?name ?note ?strand ?type
WHERE {
  ?location faldo:reference &lt;http://example.org/chr1&gt; .
  FILTER ( (?start >= 0) && (?end <= 100000) )
}
    </pre>

    <h3>Available Features</h3>
    <ul>
        <li>gene001: 10000-20000 (GENE1, strand +1)</li>
        <li>gene002: 25000-35000 (GENE2, strand -1)</li>
        <li>gene003: 40000-50000 (GENE3, strand +1)</li>
        <li>gene004: 55000-65000 (GENE4, strand -1)</li>
        <li>gene005: 70000-80000 (GENE5, strand +1)</li>
    </ul>

    <p><a href="/sparql?query=SELECT%20%3FuniqueId%20%3Fstart%20%3Fend%20%3Fname%20WHERE%20%7B%20FILTER%20(%20(%3Fstart%20%3E%3D%200)%20%26%26%20(%3Fend%20%3C%3D%20100000)%20)%20%7D">Test Query</a></p>
</body>
</html>
`
	fmt.Fprint(w, html)
}

func main() {
	port := "8090"

	http.HandleFunc("/", RootHandler)
	http.HandleFunc("/sparql", SPARQLHandler)

	log.Printf("Starting SPARQL server on http://localhost:%s", port)
	log.Printf("SPARQL endpoint: http://localhost:%s/sparql", port)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}
