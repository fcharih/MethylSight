import React, { Component } from "react"

const mods = {
  methylation: {
    color: "blue",
    offset: 5,
  },
  ubiquitination: {
    color: "red",
    offset: 15,
  },
  acetylation: {
    color: "purple",
    offset: 25,
  },
  phosphorylation: {
    color: "green",
    offset: 35,
  },
  other: {
    color: "black",
    offset: 45,
  },
}

function Axis({ x, y, height }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text fontSize={12} x={-80} y={-100} textAnchor="right">
        Validated PTMs
      </text>
      <text transform="rotate(-90)" x={height / 2} y={-30} textAnchor="middle">
        Score
      </text>
      <text
        y={0}
        x={-20}
        dominantBaseline="middle"
        textAnchor="right"
        fontSize={10}
      >
        0.0
      </text>
      <text
        y={-height / 2}
        x={-20}
        dominantBaseline="middle"
        textAnchor="right"
        fontSize={10}
      >
        0.5
      </text>
      <text
        y={-height}
        x={-20}
        dominantBaseline="middle"
        textAnchor="right"
        fontSize={10}
      >
        1.0
      </text>
      <line y1={0} y2={-height} stroke="black" />
      <line x1={-5} x2={0} y1={0} y2={0} stroke="black" />
      <line x1={-5} x2={0} y1={-height / 2} y2={-height / 2} stroke="black" />
      <line x1={-5} x2={0} y1={-height} y2={-height} stroke="black" />
    </g>
  )
}

function Methyl({
  x,
  y,
  xPos,
  yPos,
  position,
  score,
  prediction,
  maxHeight,
  selected,
  onHover,
  onMouseOut,
}) {
  const height = score * maxHeight
  return (
    <g transform={`translate(0, 150)`}>
      <line x1={x} x2={x} y1={0} y2={-height} stroke="black" />
      <circle
        r={selected ? 10 : 5}
        cx={x}
        cy={-height}
        fill={prediction ? "green" : "red"}
        stroke="black"
        strokeWidth={2}
        onMouseOver={onHover}
        onMouseOut={onMouseOut}
      />
    </g>
  )
}

function Sequence({ sequence, spacing, x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {sequence.split("").map((residue, i) => (
        <g>
          <text
            x={i * spacing}
            fill="black"
            dominantBaseline="hanging"
            textAnchor="middle"
            style={{ fontFamily: "courier" }}
          >
            {residue}
          </text>
          <text
            x={i * spacing}
            y={15}
            dominantBaseline="hanging"
            fill="black"
            textAnchor="left"
            style={{ fontFamily: "courier" }}
          >
            {i % 10 == 0 && i + 1}
          </text>
        </g>
      ))}
    </g>
  )
}

function Legend({ protein, dictionary, offset, spacing }) {
  const counts = {}
  Object.keys(dictionary).forEach(key => {
    counts[key] = protein.ptms.filter(ptm => ptm.modification === key).length
  })

  return (
    <svg
      height={20}
      width={800}
      style={{ borderWidth: 1, borderStroke: "black", borderStyle: "solid" }}
    >
      <g transform="translate(150, 0)">
        {Object.entries(dictionary).map((entry, i) => (
          <g>
            <circle
              cx={i * spacing + offset}
              cy={10}
              r={5}
              fill={entry[1].color}
            />
            <text
              x={i * spacing + offset + 10}
              y={10}
              dominantBaseline="middle"
              fontSize={16}
            >
              {entry[0]} ({counts[entry[0]]})
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}

function Regions({ regions, spacing, x, y, parent }) {
  if (regions.length == 0) return null

  const sortedRegions = [...regions]
  sortedRegions.sort((a, b) => a.begin - b.begin)
  sortedRegions[0].indent = 0
  for (let i = 1; i < sortedRegions.length; i++) {
    if (sortedRegions[i].begin <= sortedRegions[i - 1].end) {
      // if there is an overlap, increase the indentation
      sortedRegions[i].indent = sortedRegions[i - 1].indent + 1
    } else {
      sortedRegions[i].indent = 0
    }
  }
  return (
    <g transform="translate(0,150)">
      {sortedRegions.map((region, i) => (
        <rect
          x={region.begin * spacing}
          y={40 + 20 * region.indent}
          height={10}
          width={region.end * spacing - region.begin * spacing}
          fill="red"
          onMouseOver={() => parent.setState({ selectedRegion: region })}
          onMouseOut={() => parent.setState({ selectedRegion: null })}
        />
      ))}
    </g>
  )
}

function extractWindow(sequence, position, padding, width) {
  const padded = padding.repeat(50) + sequence + padding.repeat(50)
  const leftBound = 50 + parseInt(position) - 1 - parseInt(width)
  const rightBound = 50 + parseInt(position) + parseInt(width)
  return (
    <span>
      <span>{padded.slice(leftBound, leftBound + width)}</span>
      <span>{sequence[position - 1].toLowerCase()}</span>
      <span>{padded.slice(rightBound - width, rightBound)}</span>
    </span>
  )
}

function MethylTooltip({ x, y, width, position, score, window }) {
  return (
    <g transform={`translate(${x},${y - 10})`}>
      <foreignObject
        x={-width / 2}
        y={20}
        height={50}
        width={width}
        style={{ overflow: "visible" }}
      >
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            padding: 5,
            width: `${width}`,
            fontSize: 10,
            textAlign: "left",
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: "bold", height: "1em" }}>
            K{position}
          </div>
          <div style={{ height: "1em" }}>Score: {score.toFixed(3)}</div>
        </div>
      </foreignObject>
    </g>
  )
}
function RegionTooltip({ x, y, width, region }) {
  return (
    <g transform={`translate(${x},${y - 10})`}>
      <foreignObject
        x={-width / 2}
        y={20}
        height={50}
        width={width}
        style={{ overflow: "visible" }}
      >
        <div
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            padding: 5,
            height: "fit-content",
            width: `${width}`,
            fontSize: 10,
            textAlign: "left",
            borderRadius: 8,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontsize: 12,
              fontWeight: "bold",
              height: "1em",
            }}
          >
            {region.description}
          </div>
          <div>
            Residues: {region.begin} - {region.end}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

export default class Plot extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedPosition: null,
      selectedLysine: null,
      selectedRegion: null,
    }
  }

  numIndents(regions) {
    if (regions.length === 0) return 0

    const sortedRegions = [...regions]
    sortedRegions.sort((a, b) => a.begin > b.begin)
    sortedRegions[0].indent = 0
    for (let i = 1; i < sortedRegions.length; i++) {
      if (sortedRegions[i].begin <= sortedRegions[i - 1].end) {
        // if there is an overlap, increase the indentation
        sortedRegions[i].indent = sortedRegions[i - 1].indent + 1
      } else {
        sortedRegions[i].indent = 0
      }
    }
    sortedRegions.sort((next, prev) => prev.indent > next.indent)
    return sortedRegions[0].indent + 1
  }

  render() {
    const { protein } = this.props
    const spacing = 15
    const yPosition = 150 //respective to SVG top
    const numIndents = this.numIndents(protein.regions)
    return (
      <div>
        <Legend
          protein={protein}
          dictionary={mods}
          offset={-130}
          spacing={170}
        />
        <div>
          <div style={{ float: "left" }}>
            <svg width={105} height={200}>
              <Axis x={100} y={yPosition} height={80} />
            </svg>
          </div>
          <div style={{ overflowX: "scroll", width: 600 }}>
            <svg
              height={200 + numIndents * 20}
              width={spacing * protein.sequence.length + 4 * spacing}
            >
              <line
                x1={0}
                x2={spacing * protein.sequence.length}
                y1={yPosition - 80}
                y2={yPosition - 80}
                stroke="black"
                strokeDasharray={8}
              />
              {protein.ptms.map(ptm => (
                <circle
                  cx={20 + 2 * ((ptm.position - 1) * (spacing / 2))}
                  cy={mods[ptm.modification].offset + 10}
                  r={5}
                  fill={mods[ptm.modification].color}
                  onMouseOver={() =>
                    this.setState({ selectedPosition: ptm.position })
                  }
                  onMouseOut={() => this.setState({ selectedPosition: null })}
                />
              ))}
              {this.state.selectedPosition && (
                <rect
                  x={10 + (this.state.selectedPosition - 1) * spacing}
                  y={yPosition}
                  height={20}
                  width={20}
                  fill="grey"
                />
              )}
              <Sequence
                x={20}
                y={yPosition}
                sequence={protein.sequence}
                spacing={spacing}
              />
              <Regions
                regions={protein.regions}
                spacing={spacing}
                x={30}
                y={40}
                parent={this}
              />
              {protein.methylsightScores
                .concat()
                .sort((a, b) => a.position - b.position)
                .map((ptm, i) => {
                  const xLoc = 5 + ptm.position * spacing
                  return (
                    <Methyl
                      key={`methyl-${i}`}
                      x={xLoc}
                      y={yPosition}
                      position={ptm.position}
                      score={ptm.score}
                      prediction={ptm.score >= this.props.threshold}
                      maxHeight={80}
                      selected={this.state.selectedLysine === ptm.position}
                      onHover={() => {
                        this.setState({
                          selectedLysine: ptm,
                        })
                      }}
                      onMouseOut={() => this.setState({ selectedLysine: null })}
                    />
                  )
                })}
              {this.state.selectedLysine && (
                <MethylTooltip
                  width={75}
                  position={this.state.selectedLysine.position}
                  x={
                    20 +
                    2 *
                      ((this.state.selectedLysine.position - 1) * (spacing / 2))
                  }
                  y={0}
                  score={this.state.selectedLysine.score}
                  window={extractWindow(
                    protein.sequence,
                    this.state.selectedLysine.position,
                    "-",
                    7
                  )}
                />
              )}
              {this.state.selectedRegion && (
                <RegionTooltip
                  region={this.state.selectedRegion}
                  width={100}
                  x={spacing * this.state.selectedRegion.begin}
                  y={30}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    )
  }
}
