import React from "react"
import styled from "styled-components"
import { Form, Button, Icon, Dropdown, Segment, Checkbox } from "semantic-ui-react"

import SingleColumnLayout from "../components/SingleColumnLayout.js"
import Plot from "../components/Plot.js"
import PerformancePlot from "../components/PerformancePlot.js"
import PredictionsTable from "../components/PredictionsTable.js"
import KmeHelp from "../components/KmeHelp.js"
import NGLScene from "../components/NGLScene.js"
import Slider from "rc-slider"

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
  justify-content: space-around;
`

const Center = styled.div`
	text-align: center;
`;

const DescriptionBox = styled.div`
	max-height: 300px;
	overflow-y: scroll;
`;

const Paragraph = styled.p``

const SettingsBar = styled(Segment)`
  width: ${props => props.width}px;
  padding: 10px;
  margin: 50px;
`
const methylases = [
    { name: 'MLL1', id: '2w5z', uniprotId: 'Q03164' },
    { name: 'MLL3', id: '5f59', uniprotId: 'Q8NEZ4' },
    { name: 'MLL4', id: '4z4p', uniprotId: 'O14686' },
    { name: 'MLL5', id: '5ht6', uniprotId: 'Q8IZD2' },
    { name: 'SMYD1', id: '3n71', uniprotId: 'Q8NB12' },
    { name: 'SMYD2', id: '5wcg', uniprotId: 'Q9NRG4' },
    { name: 'SMYD3', id: '3qwp', uniprotId: 'Q9H7B4' },
    { name: 'G9a', id: '5tuy', uniprotId: 'Q96KQ7' },
    { name: 'GLP', id: '3swc', uniprotId: 'O88508' },
    { name: 'EZH2', id: '4mi5', uniprotId: 'Q15910' },
    { name: 'PRDM2', id: '2jv0', uniprotId: 'Q13029' },
    { name: 'PRDM9', id: '4c1q', uniprotId: 'P68431' },
    { name: 'ASH1L', id: '4ynm', uniprotId: 'Q9NR48' },
    { name: 'SETD2', id: '5v21', uniprotId: 'Q9BYW2' },
    { name: 'SETD7', id: '3m53', uniprotId: 'Q8WTS6' },
    { name: 'SETD8', id: '1zkk', uniprotId: 'P62805' },
    { name: 'SUV420H1', id: '3s8P', uniprotId: 'Q4FZB7' },
    { name: 'SUV420H2', id: '4au7', uniprotId: 'Q86Y97' },
    { name: 'NSD1', id: '3ooi', uniprotId: 'Q96L73' },
	];

const representations = [
	{ text: 'Cartoon', value: 'cartoon' },
	{ text: 'Cartoon (with sidechains)', value: 'dual' },
	{ text: 'Licorice', value: 'licorice' },
	{ text: 'Surface', value: 'surface' },
	{ text: 'Space fill', value: 'spacefill' }
]

const Info = ({tag, value}) => (
  <div>
		<Center><b>{tag}</b></Center>
		<Center>{value}</Center>
	</div>
)

const Description = ({ description }) => (
  <div>
		<Center><b>Description</b></Center>
		<DescriptionBox>{description}</DescriptionBox>
	</div>
)

class Structure extends React.Component {
	state = {
		structure: methylases[0],
		entry: {},
		representation: "cartoon",
		ligandRepresentation: "licorice",
		backgroundColor: "white",
		ligandMode: false,
		showContacts: false,
		reducedProteinOpacity: true,

		selection: {
			regionIndex: null,
			start: '',
			end: '',
		}
	}

	componentWillMount = () => {
	  this.changeMethylase(methylases[0].id)
	}

	changeMethylase = async id => {
		const structure = methylases.filter(x => x.id == id)[0]
		const response = await fetch(`${process.env.REACT_APP_API}/protein/${structure.uniprotId}`)
		const entries = (await response.json()).payload
		this.setState({ structure, entry: Object.values(entries)[0] })
	}

	render() {
    return (
      <SingleColumnLayout>
        <Container>

				<SettingsBar width={400} color="blue">
              <Title>Lysine methyltransferase</Title>
							<Paragraph>
							Please select the lysine methyltransferase of interest.
						</Paragraph>
						<Container>
							<Dropdown
                  selection
                  value={this.state.structure.id}
									onChange={(e, data) =>
										this.changeMethylase(data.value)
                  }
                  options={methylases.map(kmt => ({
                    key: kmt.id,
                    text: kmt.id
                      ? `${kmt.name} (${kmt.uniprotId})`
                      : kmt.name,
                    value: kmt.id,
                  }))}
                />
							</Container>
							<Info tag="Name" value={this.state.entry.name} />
							<Info tag="Length" value={this.state.entry.sequence ? `${this.state.entry.sequence.length} residues` : null} />
						<Description description={this.state.entry.description} />
					</SettingsBar>
          
            <SettingsBar color="blue">
              <Title>Structure visualization</Title>
							<NGLScene 
								height={500}
								width={600}
								pdbId={this.state.structure.id}
								representation={this.state.representation}
								ligandRepresentation={this.state.ligandRepresentation}
								backgroundColor={this.state.backgroundColor}
								showContacts={this.state.showContacts}
								selection={this.state.selection}
								ligandPocketOnly={this.state.ligandMode}
							/>
							<Container>
								<Button
									onClick={() => 
									window.open(`http://www.rcsb.org/structure/${this.state.structure.id}`, '_blank')}>
									<Icon name='external square alternate'/> View in RCSB
								</Button>
							</Container>
            </SettingsBar>

					<SettingsBar color="blue">
            <Title>Parameters</Title>
						<Form.Field>
						<label>
							KMT Representation
						</label><br />
							<Dropdown
                  selection
                  value={this.state.representation}
                  onChange={(e, data) =>
                    this.setState({ representation: data.value })
                  }
                  options={representations.map(rep => ({
                    key: rep.value,
                    text: rep.text,
                    value: rep.value
                  }))}
								/>
						</Form.Field>
							<Form.Field>
								<label>Ligand representation</label><br />
								<Dropdown
										selection
										value={this.state.ligandRepresentation}
										onChange={(e, data) =>
											this.setState({ ligandRepresentation: data.value })
										}
										options={representations.map(rep => ({
											key: rep.value,
											text: rep.text,
											value: rep.value
										}))}
									/>
							</Form.Field>
							<Form.Field>
								<Checkbox onChange={() => this.setState({ showContacts: !this.state.showContacts })} value={this.state.showContacts}/>{' '}
									Show protein-ligand contacts
							</Form.Field>
							<Form.Field>
								<Checkbox onChange={() => this.setState({ ligandMode: !this.state.ligandMode })} value={this.state.ligandMode}/>{' '}
									Show ligand pocket only
							</Form.Field>
          </SettingsBar>
        </Container>
      </SingleColumnLayout>
    )
  }
}

export default Structure
