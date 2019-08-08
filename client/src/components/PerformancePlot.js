import React, { Component } from "react"
import Performance from "../performance.js"
import Slider from "rc-slider"
import { scaleLinear } from "d3-scale"
import { line } from "d3-shape"

function XAxis({ x, y, width }) {
  const ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  return (
    <g transform={`translate(${x}, ${y})`}>
      <line x1={0} x2={width} y1={0} y2={0} stroke="black" strokeWidth={1} />
      {ticks.map(tick => (
        <g>
          <line
            x1={tick * width}
            x2={tick * width}
            y1={0}
            y2={5}
            stroke="black"
          />
          <text x={tick * width} y={15} fontSize={12} textAnchor="middle">
            {tick}
          </text>
        </g>
      ))}
      <text x={width / 2} y={30} fontSize={12} textAnchor="middle">
        Threshold
      </text>
    </g>
  )
}

function YAxis({ x, y, height }) {
  const ticks = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
  return (
    <g transform={`translate(${x}, ${y})rotate(-90)`}>
      <line x1={0} x2={height} y1={0} y2={0} stroke="black" strokeWidth={1} />
      {ticks.map(tick => (
        <g>
          <line
            x1={tick * height}
            x2={tick * height}
            y1={0}
            y2={-5}
            stroke="black"
          />
          <text
            transform={`rotate(90 ${tick * height} ${-15})`}
            x={tick * height}
            y={-10}
            fontSize={12}
            textAnchor="middle"
          >
            {tick}
          </text>
        </g>
      ))}
      <text x={height / 2} y={-30} fontSize={12} textAnchor="middle">
        Performance
      </text>
    </g>
  )
}

function Line({ x, y, xScale, yScale, data, color }) {
  const l = line()
    .x(function(d) {
      return xScale(parseFloat(d.threshold))
    })
    .y(function(d) {
      return yScale(d.value)
    })
  const path = l(data)

  return (
    <path
      transform={`translate(${x},${y})`}
      d={path}
      strokeWidth={2}
      stroke={color}
      fill="none"
    />
  )
}

export default class PerformancePlot extends Component {
  render() {
    const originX = 30
    const originY = 220
    const height = 200
    const width = 300
    const { threshold } = this.props
    const thresholdString = `${threshold.toFixed(3)}`

    const xScale = scaleLinear()
      .range([0, width])
      .domain([0, 1])
    const yScale = scaleLinear()
      .range([0, height])
      .domain([0, 1])

    const sensitivityCurve = Object.entries(Performance).map(point => {
      return { threshold: point[0], value: point[1].recall }
    })
    const precisionCurve = Object.entries(Performance).map(point => {
      return { threshold: point[0], value: point[1].precision }
    })
    const specificityCurve = Object.entries(Performance).map(point => {
      return { threshold: point[0], value: point[1].specificity }
    })

    const recall = Performance[thresholdString].recall
    const specificity = Performance[thresholdString].specificity
    const precision = Performance[thresholdString].precision

    return (
      <div>
        <div>
          <div style={{ fontWeight: "bold", textAlign: "center" }}>
            Anticipated performance
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <span>Sensitivity: {recall.toFixed(3)}</span>
            <span>Specificity: {specificity.toFixed(3)}</span>
            <span>Precision: {precision.toFixed(3)}</span>
          </div>
        </div>
        <svg height={height + 40} width={500}>
          <XAxis x={originX} y={originY} width={width} />
          <YAxis x={originX} y={originY} height={height} />
          <Line
            x={originX}
            y={originY - height}
            xScale={xScale}
            yScale={yScale}
            data={sensitivityCurve}
            color="red"
          />
          <Line
            x={originX}
            y={originY - height}
            xScale={xScale}
            yScale={yScale}
            data={precisionCurve}
            color="green"
          />
          <Line
            x={originX}
            y={originY - height}
            xScale={xScale}
            yScale={yScale}
            data={specificityCurve}
            color="blue"
          />
          <g transform={`translate(${originX},${originY - height})`}>
            <text
              dominantBaseline="middle"
              x={xScale(threshold) + 10}
              y={yScale(specificity)}
              fontSize={12}
            >
              Sensitivity
            </text>
            <circle
              r={4}
              cx={xScale(threshold)}
              cy={yScale(specificity)}
              fill="blue"
            />
            <text
              dominantBaseline="middle"
              x={xScale(threshold) + 10}
              y={yScale(precision)}
              fontSize={12}
            >
              Precision
            </text>
            <circle
              r={4}
              cx={xScale(threshold)}
              cy={yScale(precision)}
              fill="green"
            />
            <text
              dominantBaseline="middle"
              x={xScale(threshold) + 10}
              y={yScale(recall)}
              fontSize={12}
            >
              Specificity
            </text>
            <circle
              r={4}
              cx={xScale(threshold)}
              cy={yScale(recall)}
              fill="red"
            />
          </g>
        </svg>
        <div style={{ width, position: "relative", left: 30 }}>
          <Slider
            railStyle={{ backgroundColor: "green", height: 2 }}
            trackStyle={{ backgroundColor: "red", height: 2 }}
            handleStyle={{
              borderColor: "black",
              backgroundColor: "#0e6eb8",
            }}
            onChange={this.props.onThresholdChange}
            value={this.props.threshold}
            min={0}
            max={1}
            step={0.005}
          />
          <div style={{ textAlign: "center", color: "#0e6eb8" }}>
            Threshold: {this.props.threshold}
          </div>
        </div>
      </div>
    )
  }
}
