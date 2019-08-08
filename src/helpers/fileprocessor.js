class FileProcessor {
  extractUniprotIds(fileContent) {
    const regExp = /^[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}$/
    const lines = fileContent.trimRight("\n").split("\n") // non-empty lines
    const invalidLines = []
    lines.forEach((line, i) => {
      if (!line.match(regExp)) {
        invalidLines.push(i + 1)
      }
    })

    if (invalidLines.length > 0) {
      throw new Error(
        `The file uploaded contains lines that are not valid Uniprot IDs: see line(s) ${invalidLines.join(
          ", "
        )}`
      )
    }
    return lines
  }

  extractProteins(fastaFile) {
    const entries = fastaFile.split(">").filter(entry => entry)
    const proteins = entries.map(entry => {
      const tag = entry.split("\n")[0]
      const sequence = entry
        .split("\n")
        .slice(1)
        .join("")

      return {
        tag,
        sequence,
      }
    })

    const proteinPattern = /^[ACDEFGHIKLMNPQRSTVWY]+$/
    const invalid = []
    proteins.forEach((protein, i) => {
      if (!protein.sequence.match(proteinPattern)) {
        invalid.push(i)
      }
    })

    if (invalid.length > 0) {
      throw new Error(
        `There are proteins with invalid characters: please see protein(s) ${invalid
          .map(i => i + 1)
          .join(", ")}.`
      )
    }
    return proteins
  }
}

function FileProcessorCreator() {
  return new FileProcessor()
}

module.exports = FileProcessorCreator
