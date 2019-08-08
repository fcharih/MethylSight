function extractWindow({ sequence, position, padding, width }) {
  const padded = padding.repeat(50) + sequence + padding.repeat(50)
  const leftBound = 50 + parseInt(position) - 1 - parseInt(width)
  const rightBound = 50 + parseInt(position) + parseInt(width)
  return (
    padded.slice(leftBound, leftBound + width) +
    sequence[position - 1].toLowerCase() +
    padded.slice(rightBound - width, rightBound)
  )
}

module.exports = {
  extractWindow,
}
