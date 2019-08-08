const fs = require("fs")

class DatabaseClient {
  constructor({ path }) {
    this.path = path
  }

  getEntry(uniprotId) {
    try {
      const entry = JSON.parse(
        fs.readFileSync(`${this.path}/${uniprotId.toUpperCase()}.json`, "utf-8")
      )
      return {
        [uniprotId]: entry,
      }
    } catch (e) {
      throw new Error(
        `Protein "${uniprotId}" is not in the MethylSight database.`
      )
    }
  }

  getEntries(uniprotIds) {
    let entries = []
    const invalid = []
    uniprotIds.forEach(id => {
      try {
        entries.push(this.getEntry(id)[id])
      } catch (e) {
        invalid.push(`"${id}"`)
      }
    })

    if (invalid.length > 0) {
      throw new Error(
        `Proteins ${invalid.join(", ")} are not in the MethylSight database.`
      )
    }

    return entries
  }
}

function ClientCreator({ path }) {
  return new DatabaseClient({ path })
}

module.exports = ClientCreator
