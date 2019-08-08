import React, { Component } from "react"
import styled from "styled-components"

import NavigationIcon from "./NavigationIcon.js"
import MethylSightLogo from "../static/animated_logo.gif"

const HeaderContainer = styled.header`
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 50px;
  padding-right: 50px;
  justify-content: space-between;
  align-items: center;
`

const IconsContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Rule = styled.hr`
  width: 100%;
  height: 3px;
  border: 0;
  border-top: 10px solid #0e6eb8;
`

class NavigationBar extends Component {
  render() {
    return (
      <div>
				<HeaderContainer>
					<img src={MethylSightLogo} height="100px" />
          <IconsContainer>
            <NavigationIcon label="Home" width="50px" icon="HomeIcon" />
            <NavigationIcon
              label="Predictor"
              width="50px"
              icon="PredictorIcon"
              route="/predictor"
            />
						<NavigationIcon label="Structure" width="50px" icon="ProteinIcon" route="/structure"/>
						{/*<NavigationIcon label="Help" width="50px" icon="HelpIcon" />
						<NavigationIcon label="Readings" width="50px" icon="ReadingIcon" />*/}
            <NavigationIcon
              label="About us"
              width="50px"
              icon="AboutUs"
              route="/about"
            />
          </IconsContainer>
        </HeaderContainer>
        <Rule />
      </div>
    )
  }
}

export default NavigationBar
