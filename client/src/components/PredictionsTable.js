import React from "react"
import styled from "styled-components"
import { Table } from "semantic-ui-react"

const Positive = styled.span`
  color: green;
`

const Negative = styled.span`
  color: red;
`

const Scrollable = styled.div`
  height: 300px;
  overflow-y: scroll;
`

function extractWindow(sequence, position, padding, width) {
  const padded = padding.repeat(50) + sequence + padding.repeat(50)
  const leftBound = 50 + parseInt(position) - 1 - parseInt(width)
  const rightBound = 50 + parseInt(position) + parseInt(width)
  return (
    <div>
      <span>{padded.slice(leftBound, leftBound + width)}</span>
      <span>{sequence[position - 1].toLowerCase()}</span>
      <span>{padded.slice(rightBound - width, rightBound)}</span>
    </div>
  )
}

function PredictionsTable({ threshold, protein }) {
  const predictions = protein.methylsightScores
  predictions.sort((a, b) => a.position - b.position)
  return (
    <div>
      <Scrollable>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Site</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
              <Table.HeaderCell>Prediction</Table.HeaderCell>
              <Table.HeaderCell>Window</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {predictions.map(pred => (
              <Table.Row>
                <Table.Cell>{pred.position}</Table.Cell>
                <Table.Cell>{pred.score.toFixed(3)}</Table.Cell>
                <Table.Cell>
                  {pred.score >= threshold ? (
                    <Positive>Methylated</Positive>
                  ) : (
                    <Negative>Not methylated</Negative>
                  )}
                </Table.Cell>
                <Table.Cell>
                  {extractWindow(protein.sequence, pred.position, "-", 5)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Scrollable>
    </div>
  )
}
export default PredictionsTable
