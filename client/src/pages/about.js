import React from "react"
import styled from "styled-components"

import TwoColumnsLayout from "../components/TwoColumnsLayout.js"
import Collaborator from "../components/Collaborator.js"

const AboutUsContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  color: grey;
`

const Title = styled.h1`
  text-align: center;
  font-size: 1.4em;
`

const ScrollContainer = styled.div`
  height: 600px;
  overflow-x: hide;
  overflow-y: scroll;
`

function About() {
  return (
    <TwoColumnsLayout>
      <Title>The Team</Title>
      <ScrollContainer>
        <Collaborator
          image="charih"
          name="Francois Charih, M.A.Sc."
          email="francoischarih@sce.carleton.ca"
          scholar="https://scholar.google.ca/citations?user=6Ist2oUAAAAJ&hl=en"
          website="https://www.charih.ca"
          title="Ph.D. Student, Carleton University"
          description="François Charih is currently completing his doctoral degree in
						Electrical and Computer Engineering under the supervision of Profs. Green and Biggar. François'
						research interests lie mainly in the application of machine learning methods to
						the study of biological data and other life science/biomedical application. Before
						turning to computational approaches, François acquired hands-on experience in protein
						chemistry by studying the structure and function of iron-regulating transcription
						factors in bacterial species."
        />
        <Collaborator
          image="grigg"
          name="Nashira Grigg, B.Sc."
          title="Research Associate, Carleton University"
          email="gnashira@gmail.com"
          description="Nashira is an experienced Data Scientist with a demonstrated history of working in the public
						safety industry. Skilled in Bioinformatics, Biosafety, Statistical Data Analysis, Laboratory Methods,
						and Computer Science. Strong biotechnology and computation professional with a Bachelor's Degree
						with Honours focused in Computational Biochemistry from Carleton University."
        />
        <Collaborator
          image="ruiz-blanco"
          name="Yasser B. Ruiz-Blanco, Ph.D."
          title="Research Assistant, University of Duisburg-Essen"
          scholar="https://scholar.google.com/citations?user=CqjT4qwAAAAJ&hl=en"
          email="yasser.RuizBlanco@uni-due.de"
          description="Dr. Ruiz-Blanco is currently a post-doctoral fellow in the Faculty of Biology at the
						University of Duisburg-Essen in Germany. Dr. Ruiz-Blanco's research interests lie at the intersection
						of computational chemistry and bioinformatics. He detains significant expertise in applying machine
						learning and other computational approaches to perform molecular simulations, engineer numerical encodings
						for proteins (ProtDCal), study protein interactions/post-translational modifications, and design
						anti-bacterial peptides. Dr. Ruiz-Blanco's work aims to leverage the synergy between computational chemistry
						methods and computer sciences to facilitate the discovery biological evidence and develop rational
						computer-aided approaches for design applications."
        />
        <Collaborator
          image="li"
          name="Shawn S.C. Li, Ph.D."
          title="Professor, University of Western Ontario"
          website="https://www.schulich.uwo.ca/lilab/"
          scholar="https://scholar.google.ca/citations?user=Ua0m2wkAAAAJ&hl=en&oi=ao"
          email="sli@uwo.ca"
          description="The main focus of the Li lab is to elucidate the molecular and epigenetic basis of cancer with
						the ultimate goal of developing protein- and peptide-based diagnostic or therapeutic agents for cancer."
        />
        <Collaborator
          image="biggar"
          email="kyle_biggar@carleton.ca"
					website="http://www.biggarlab.ca"
          scholar="https://scholar.google.ca/citations?user=YA1XxCIAAAAJ&hl=en"
          name="Kyle K. Biggar, Ph.D."
          title="Assistant Professor, Carleton University"
          description="Prof. Biggar is an assistant professor in the Department of Biology at Carleton University.
						The Biggar lab is primarily focused on the discovery and characterization of proteins dynamically interact
						with each other, including how enzymes recognize substrate. Specifically, their research focuses on how reversible 
						post translational lysine methylation of histone and non-histone proteins regulates protein-protein interactions and function."
        />
        <Collaborator
          image="green"
          name="James R. Green, Ph.D."
          email="jrgreen@sce.carleton.ca"
          scholar="https://scholar.google.ca/citations?user=nmxbwm4AAAAJ&hl=en"
          orcid="https://orcid.org/0000-0002-6039-2355"
          website="http://www.sce.carleton.ca/faculty/green/green.php"
          title="Associate Professor, Carleton University"
          description="Prof. Green is an associate professor in the Department of Systems and Computer Engineering at
						Carleton University. Prof. Green heads the Carleton University Biomedical Informatics Collaboratory
						(CUBIC), a multidisciplinary lab that makes use of cutting-edge techniques including machine learning,
						deep learning, machine vision and signal processing to tackle challenging problems in biomedical
						engineering and bioinformatics. Prof. Green possesses significant experience in dealing with problems
						with a high class imbalance, as is seen in the study of protein-protein interactions or
						prediction of post-translational modifications."
        />
      </ScrollContainer>
    </TwoColumnsLayout>
  )
}

export default About
