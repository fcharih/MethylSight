import React from "react"
import { withRouter, Redirect } from "react-router-dom"
import styled from "styled-components"
import { Message, Tab, Input, Button, Divider } from "semantic-ui-react"
import FileSelector from "../components/FileSelector.js"

import TwoColumnsLayout from "../components/TwoColumnsLayout.js"

class LookupForm extends React.Component {
  state = {
    uniprotId: "",
    lookupFile: null,
    loading: false,
    lookupFailedMessage: null,
    uploadFailedMessage: null,
  }

	async submitUniprotId() {
	  console.log(process.env)
    this.setState({ loading: true })
    const resp = await fetch(
			`${process.env.REACT_APP_API}/protein/${this.state.uniprotId}`
    )

    if (resp.status != 200) {
      const data = await resp.json()
      return this.setState({
        lookupFailedMessage: data.message,
        loading: false,
      })
    }

    const { requestId, payload, status } = await resp.json()

    return this.props.router.push({
			pathname: `/predictor/results/${requestId}`,
			state: { entries: payload, status, requestId }
    })
  }

  async uploadLookupFile() {
    this.setState({ loading: true })
    const formData = new FormData()
    formData.append("file", this.state.lookupFile, this.state.lookupFile.name)

		const resp = await fetch(`${process.env.REACT_APP_API}/proteins`, {
      method: "post",
      body: formData,
    })

    if (resp.status != 200) {
      const data = await resp.json()
      return this.setState({
        uploadFailedMessage: data.message,
        loading: false,
      })
    }

    const { requestId, payload, status } = await resp.json()

    return this.props.router.push({
			pathname: `/predictor/results/${requestId}`,
			state: { entries: payload, status, requestId }
    })
  }

  render() {
    return (
      <Tab.Pane>
        <Subtitle>Single protein</Subtitle>
        <Paragraph>
          Our database holds MethylSight's predictions for all lysines in the
          human proteome. Feel free to refer to one of these example
          proteins:&nbsp;
          <Anchor
            onClick={() =>
              this.setState({ lookupFailedMessage: null, uniprotId: "P68431" })
            }
          >
            Histone H3.1
          </Anchor>
          ,&nbsp;
          <Anchor
            onClick={() =>
              this.setState({ lookupFailedMessage: null, uniprotId: "Q05639" })
            }
          >
            EF1-alpha 2
          </Anchor>
          , or&nbsp;
          <Anchor
            onClick={() =>
              this.setState({ lookupFailedMessage: null, uniprotId: "Q9Y2U5" })
            }
          >
            MAP3K2
          </Anchor>
          .
        </Paragraph>
        {this.state.lookupFailedMessage && (
          <Message negative>
            <Message.Header>Sorry</Message.Header>
            <p>{this.state.lookupFailedMessage}</p>
          </Message>
        )}
        <Center>
          <Input
            icon="search"
            label="Uniprot ID"
            value={this.state.uniprotId}
            onChange={(e, text) =>
              this.setState({
                uniprotId: text.value,
                lookupFailedMessage: null,
              })
            }
            error={this.state.lookupFailedMessage}
          />
        </Center>

        <Center>
          <Button
            disabled={!this.state.uniprotId}
            loading={this.state.loading}
            onClick={this.submitUniprotId.bind(this)}
          >
            Submit
          </Button>
        </Center>
        <Divider horizontal>Or</Divider>
        <Subtitle>Multiple proteins</Subtitle>
        <Paragraph>
          Upload a file to retrieve the predictions for a batch of proteins. The
          file must list one Uniprot ID per line.
        </Paragraph>
        {this.state.uploadFailedMessage && (
          <Message negative>
            <Message.Header>Sorry</Message.Header>
            <p>{this.state.uploadFailedMessage}</p>
          </Message>
        )}
        <Center>
          <FileSelector
            selectedFile={this.state.lookupFile}
            onFileSelected={files =>
              this.setState({ uploadFailedMessage: null, lookupFile: files[0] })
            }
          />
        </Center>
        <Center>
          <Button
            disabled={!this.state.lookupFile}
            loading={this.state.loading}
            onClick={this.uploadLookupFile.bind(this)}
          >
            Upload
          </Button>
        </Center>
      </Tab.Pane>
    )
  }
}

class SubmissionForm extends React.Component {
  state = {
    loading: false,
    file: null,
    errorMessage: null,
  }

  async uploadFile() {
    this.setState({ loading: true })
    const formData = new FormData()
    formData.append("file", this.state.file, this.state.file.name)

    const resp = await fetch(
			`${process.env.REACT_APP_API}/job/upload`,
      {
        method: "post",
        body: formData,
      }
    )

    if (resp.status != 200) {
      const data = await resp.json()
      return this.setState({
        errorMessage: data.message,
        loading: false,
      })
    }

    const { requestId } = await resp.json()

    return this.props.router.push({
			pathname: `/predictor/results/${requestId}`,
			state: { requestId, status: 'in progress' }
    })
  }

  render() {
    return (
      <Tab.Pane>
        <Subtitle>Submitting one or more custom sequence(s)</Subtitle>
        <Paragraph>
          You may submit one or more (up to 1000) custom amino acid sequences,
          provided that they contain only standard amino acids.
        </Paragraph>
        <Paragraph>
          Please upload a file containing the sequences in FASTA format.
        </Paragraph>
        {this.state.errorMessage && (
          <Message negative>
            <Message.Header>Sorry</Message.Header>
            <p>{this.state.errorMessage}</p>
          </Message>
        )}
        <Center>
          <FileSelector
            selectedFile={this.state.file}
            onFileSelected={files =>
              this.setState({ file: files[0], errorMessage: null })
            }
          />
        </Center>
        <Center>
          <Button
            disabled={!this.state.file}
            loading={this.state.loading}
            onClick={this.uploadFile.bind(this)}
          >
            Upload
          </Button>
        </Center>
      </Tab.Pane>
    )
  }
}

const panes = [
  { menuItem: "Lookup", render: LookupForm },
  {
    menuItem: "Custom sequence",
    render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
  },
]

const Center = styled.div`
  text-align: center;
  margin: 15px;
`

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
`

const Title = styled.h1`
  text-align: center;
  font-size: 1.4em;
`

const Subtitle = styled.h2`
  text-align: center;
  font-size: 1.2em;
`

const Paragraph = styled.p`
  width: 100%;
  margin: 0 auto;
  margin-top: 1em;
  margin-bottom: 1em;
`

const Anchor = styled.a`
  cursor: pointer;
`

function Predictor(props) {
  return (
    <TwoColumnsLayout>
      <Container>
        <Title>Lysine Methylation Predictor</Title>
        <Paragraph>
          As of now, you can interact with the MethylSight predictor in one of
          two ways.
        </Paragraph>
        <Paragraph>
          If your protein is an indexed human protein, the best way to obtain
          MethylSight's predictions is through an&nbsp;
          <i>ID-based</i> query wherein you provide the&nbsp;
          <a href="https://www.uniprot.org/" target="_blank">
            Uniprot ID
          </a>{" "}
          of the protein of interest.
        </Paragraph>
        <Paragraph>
          If you wish to obtain predictions for non-human proteins or for
          protein fragments, you may submit the sequence in the FASTA format.
          Note that the MethylSight predictor was trained on full human
          proteins, so your mileage may vary in these cases.
        </Paragraph>

        <Tab
          panes={[
            { menuItem: "Lookup", render: () => <LookupForm router={props.history}/> },
            {
              menuItem: "Custom sequence",
              render: () => <SubmissionForm router={props.history}/>,
            },
          ]}
        />
      </Container>
    </TwoColumnsLayout>
  )
}

export default withRouter(Predictor)
