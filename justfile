add-assembly-from-fasta input:
  samtools faidx {{input}} 
  npx @jbrowse/cli add-assembly {{input}} --load copy --out public

add-track-from-gff input:
  npx @jbrowse/cli remove-track {{input}}.gz --out public
  # sort gff file
  npx @jbrowse/cli sort-gff {{input}} | bgzip > {{input}}.gz
  tabix {{input}}.gz
  npx @jbrowse/cli add-track {{input}}.gz --load copy --out public
