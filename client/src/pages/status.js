import React from "react"
import Head from "next/head"
import Router from "next/router"
import styled from "styled-components"
import { Progress, Button, Icon, Dropdown, Segment } from "semantic-ui-react"

import SingleColumnLayout from "../components/SingleColumnLayout.js"

const Title = styled.h1`
  text-align: center;
  color: #0e6eb8;
`

const Subtitle = styled.h2`
  font-size: 1.2em;
  text-align: center;
`

const Container = styled.div`
  margin: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-around;
`

const Paragraph = styled.p``

const SettingsBar = styled(Segment)`
  padding: 10px;
  width: 400px;
  margin: 50px;
`

class Status extends React.Component {
  static async getInitialProps({ query }) {
    return { status: query.status, requestId: query.requestId }
  }

  state = { progress: 0 }

  componentDidMount() {
    setInterval(this.refresh.bind(this), 1000)
  }

  async refresh() {
    const resp = await fetch(
      `/predictor/status/${this.props.requestId}`
    )
    const { status, progress } = await resp.json()
    if (status === "successful") {
      Router.push(
        `/predictor/results/${this.props.requestId}`
      )
    } else if (status === "in progress") {
      this.setState({ progress })
    }
  }

  render() {
    return (
      <SingleColumnLayout>
        <Head>
          <title>Results</title>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <link href="/static/rc-slider.css" rel="stylesheet" />
        </Head>
        <Container>
          <div style={{ flex: 1 }}>
            Your job ({this.props.requestId}) is currently{" "}
            <b>{!this.state.progress ? "in queue" : "being processed"}</b>.
            <br />
            Bookmark and check the page periodically. <br />
            <div style={{ margin: 20 }}>
              <img src="/static/loading_mg.gif" />
            </div>
            <br />
            <div style={{ width: 400, margin: "0 auto" }}>
              <Progress percent={this.state.progress} indicating />
            </div>
            <div style={{ fontWeight: "bold", fontSize: "1.5em" }}>
              Your job is {this.state.progress.toFixed(1)}% complete.
            </div>
          </div>
        </Container>
      </SingleColumnLayout>
    )
  }
}

export default Status
