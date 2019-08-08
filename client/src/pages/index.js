import React from "react"
import styled from "styled-components"

import TwoColumnsLayout from "../components/TwoColumnsLayout.js"

const HomeContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  color: blue;
`

const Title = styled.h1`
  text-align: center;
  font-size: 1.4em;
`

const Paragraph = styled.p`
  width: 80%;
  margin: 0 auto;
  margin-top: 1em;
  margin-bottom: 1em;
`

const NewsParagraph = styled.p`
  width: 80%;
  margin: 0 auto;
  margin-top: 0em;
  margin-bottom: 0em;
`

const News = ({ date, children }) => {
  return (
    <NewsParagraph>
      <b>{date}:</b> {children}
    </NewsParagraph>
  )
}

function Home() {
  return (
    <TwoColumnsLayout>
      <Title>Welcome to MethylSight</Title>
      <Paragraph>
        The methylation of lysine residues is known to mediate or regulate a
        variety of cellular processes (i.e. tumor suppression, cell signalling
        and DNA damage response). The methyllysine proteome remains elusive as
        current approaches to uncover it are both expensive and labour
        intensive.
      </Paragraph>
      <Paragraph>
        The MethylSight web server helps with the discovery of novel methylation
        sites by providing access to a database of prediction for all human
        lysines, as well as to the lysine methylation predictor itself. This
        tool can be utilized to validate experiments or to identify potential
        pathways of lysine methylation.
      </Paragraph>
      <Title>Services</Title>
      <Paragraph>
        <b>Lysine Methylation Predictor:</b> Get predictions for a protein via
        Uniprot ID or protein sequence.
        <br />
        <b>Structure Visualization:</b> Have a look at the structure of known
        methylase.
        <br />
        <br />
        We are actively working on the development of multiple methylation
        predictors and plan to add more services. Be sure to check back soon!
      </Paragraph>
      <Title>News</Title>
      <News date="March 2nd, 2018">
        The pre-print of the first paper using MethylSight is available on{" "}
        <a
          href="https://www.biorxiv.org/content/10.1101/274688v1"
          target="_blank"
        >
          bioRxiv
        </a>
        .
      </News>
      <News date="Nov. 27th, 2017">
        Launch of structure visualization tool (beta)
      </News>
      <News date="Oct. 23rd, 2017">Launch of MethylSight</News>
    </TwoColumnsLayout>
  )
}

export default Home
