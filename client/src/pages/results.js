import React from "react"
import { withRouter, Link } from "react-router-dom"
import styled from "styled-components"
import { Progress, Button, Icon, Dropdown, Segment } from "semantic-ui-react"

import SingleColumnLayout from "../components/SingleColumnLayout.js"
import Plot from "../components/Plot.js"
import PerformancePlot from "../components/PerformancePlot.js"
import PredictionsTable from "../components/PredictionsTable.js"
import KmeHelp from "../components/KmeHelp.js"
import MagnifyingGlass from "../static/loading_mg.gif";
import Slider from "rc-slider"
import 'rc-slider/assets/index.css'

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
	display: flex;
	flex-diretion: row;
  justify-content: space-around;
`

const Paragraph = styled.p``

const SettingsBar = styled(Segment)`
  padding: 10px;
  width: 400px;
  margin: 50px;
`

class Results extends React.Component {
	state = {
	  requestId: this.props.location.state.requestId,
		status: 'in progress',
		progress: 0,
    threshold: 0.5,
	}

	refresh = async () => {
		const resp = await fetch(`${process.env.REACT_APP_API}/job/${this.state.requestId}`);
		const responseObj = await resp.json();
		console.log(responseObj)
		if(responseObj.status === 'successful') {
			const { payload } = responseObj;
			const selectedProtein = Object.keys(payload)[0];
			this.setState({ entries: payload, status: 'successful', selectedProtein });
			clearInterval(this.refreshing);
		} else {
		  const { progress } = responseObj;
			this.setState({ progress });
		}
	}

	componentWillMount = () => {
	  const { status } = this.props.location.state;
		if(status === 'successful') {
			const selectedProtein = Object.keys(this.props.location.state.entries)[0];
			const { entries, requestId } = this.props.location.state;
			return this.setState({ selectedProtein, entries, requestId, status });
		} 
		this.refreshing = setInterval(this.refresh, 2000);
	}

  async downloadTable() {
		this.props.history.push(
			`/api/job/${this.state.requestId}/download`
    )
  }

	render() {
	if (this.state.status === 'in progress') {
		return (
			<SingleColumnLayout>
				<Container>
					<div style={{ textAlign: "center" }}>
						<div style={{ flex: 1 }}>
							Your job ({this.state.requestId}) is currently{" "}
							<b>{!this.state.progress ? "in queue" : "being processed"}</b>.
							<br />
							Bookmark and check the page periodically. <br />
							<div style={{ margin: 20 }}>
								<img src={MagnifyingGlass} />
							</div>
							<br />
							<div style={{ width: 400, margin: "0 auto" }}>
								<Progress percent={this.state.progress} indicating />
							</div>
							<div style={{ fontWeight: "bold", fontSize: "1.5em" }}>
								Your job is {this.state.progress.toFixed(1)}% complete.
							</div>
						</div>
					</div>
        </Container>
			</SingleColumnLayout>
			)
	} else {
    return (
			<SingleColumnLayout>
        <Container>
          <SettingsBar color="blue">
            <Title>Settings</Title>
            <Subtitle>Prediction threshold</Subtitle>
            <Paragraph>
              Set a prediction threshold, and see how this affects the
              anticipated quality of the results.
            </Paragraph>
            <PerformancePlot
              threshold={this.state.threshold}
              onThresholdChange={val => this.setState({ threshold: val })}
            />
            <Container>
              <Button
                size="small"
                onClick={() => this.setState({ threshold: 0.5 })}
              >
                Permissive
              </Button>
              <Button
                size="small"
                onClick={() => this.setState({ threshold: 0.7 })}
              >
                Conservative
              </Button>
            </Container>
            <Subtitle>FAQ</Subtitle>
            <Paragraph>
              Here are some commonly asked questions on how to interpret your
              results.
            </Paragraph>
            <KmeHelp />
          </SettingsBar>
          <div>
            <Segment color="blue">
              <Title>MethylSight's Predictions</Title>
              <Container>
                <Dropdown
                  selection
                  value={this.state.selectedProtein}
                  onChange={(e, data) =>
                    this.setState({ selectedProtein: data.value })
                  }
                  options={Object.values(this.state.entries).map(pred => ({
                    key: pred.accessionId,
                    text: pred.accessionId
                      ? `${pred.name} (${pred.accessionId})`
                      : pred.name,
                    value: pred.accessionId || pred.name,
                  }))}
                />
              </Container>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                  <Plot
                    threshold={this.state.threshold}
                    protein={this.state.entries[this.state.selectedProtein]}
                  />
                </div>
              </div>
            </Segment>
            <Segment color="blue">
              <Title>Predictions table</Title>
              <PredictionsTable
                protein={this.state.entries[this.state.selectedProtein]}
                threshold={this.state.threshold}
              />
							<Container>
								<a
									download
									href={`${process.env.REACT_APP_API}/job/${this.state.requestId}/download`}
									target="_self"
								>
                <Button
                  icon
                  labelPosition="right"
                >
                  Download
                  <Icon name="download" />
								</Button>
							</a>
              </Container>
            </Segment>
          </div>
        </Container>
			</SingleColumnLayout>
		)
	}
  }
}

export default withRouter(Results)
