    1. seqid - name of the chromosome or scaffold; chromosome names can be given with or without the 'chr' prefix. Important note: the seq ID must be one used within Ensembl, i.e. a standard chromosome name or an Ensembl identifier such as a scaffold ID, without any additional content such as species or assembly. See the example GFF output below.

    2. source - name of the program that generated this feature, or the data source (database or project name)

    3. type - type of feature. Must be a term or accession from the SOFA sequence ontology

    4. start - Start position of the feature, with sequence numbering starting at 1.

    5. end - End position of the feature, with sequence numbering starting at 1.

    6. score - A floating point value.

    7. strand - defined as + (forward) or - (reverse).

    8. phase - One of '0', '1' or '2'. '0' indicates that the first base of the feature is the first base of a codon, '1' that the second base is the first base of a codon, and so on..

    9. attributes - A semicolon-separated list of tag-value pairs, providing additional information about each feature. Some of these tags are predefined, e.g. ID, Name, Alias, Parent - see the GFF documentation for more details.

