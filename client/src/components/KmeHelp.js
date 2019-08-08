import React, { Component } from "react"
import { Accordion, Icon } from "semantic-ui-react"

export default class KmeHelp extends Component {
  state = { activeIndex: null }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
      <Accordion styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          What is the threshold?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <p>
            The threshold (or cut-off) is the minimum prediction score required
            for a site to be labeled as positive. In other words, predictions
            whose scores are above this threshold will be predicted to be
            positive, while those with a lower score are predicted to be
            negative.
          </p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          What threshold should I use?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
          <p>
            There is no one good answer to this. A higher threshold increases
            the precision, or the probability that a positive prediction is
            truly positive. On the other hand, setting a high threshold will
            result in fewer positive predictions and is likely to miss true
            positives. A lower threshold will do the opposite. In our
            publications, we use a threshold of 0.7 (conservative).
          </p>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 2}
          index={2}
          onClick={this.handleClick}
        >
          <Icon name="dropdown" />
          How does the predictor work?
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 2}>
          <p>
            MethylSight is a support vector machine-based model. It was trained
            on a large set of positive (validated) and negative (assumed) lysine
            methylation sites. A total of 28 carefully selected features are
            extracted from a 71 amino acid lysine-centered window with the{" "}
            <a target="_blank" href="https://protdcal.zmb.uni-due.de/">
              ProtDCal
            </a>{" "}
            feature extractor (Ruiz-Blanco <i>et al.</i>, 2015). The features,
            extracted for each sites, are then input to the SVM classifier which
            then outputs a prediction.
          </p>
          <p>
            We encourage people to read the{" "}
            <a
              target="_blank"
              href="https://www.biorxiv.org/content/10.1101/274688v1"
            >
              MethylSight paper pre-print
            </a>{" "}
            for additional details regarding how the MethylSight predictor works
            and how it was trained.
          </p>
        </Accordion.Content>
      </Accordion>
    )
  }
}
