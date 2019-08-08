import React, { Component } from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"

const Colors = {
  blue: "#0E6EB8",
}

const SVGContainer = styled.svg`
  &:hover {
    stroke: ${Colors.blue};
    fill: ${Colors.blue};
  }
`

const IconWrapper = styled.div`
  outline: 0;
  margin-left: 30px;
  margin-right: 30px;
  text-align: center;
  color: ${Colors.blue};
  &:hover {
    stroke: ${Colors.blue};
    fill: ${Colors.blue};
  }
  &:hover path {
    fill: ${Colors.blue};
  }
`

class NavIcon extends Component {
  constructor(props) {
    super(props)
    this.state = { hovered: false }
  }
  render() {
    const icon = require(`./icons/${this.props.icon}.js`)
    return (
      <Link to={this.props.route || "/"}>
        <IconWrapper
          onMouseOver={() => this.setState({ ...this.state, hovered: true })}
          onMouseOut={() => this.setState({ ...this.state, hovered: false })}
        >
          <div>
            {icon.default({
              width: this.props.width,
              height: this.props.height,
            })}
          </div>
          <div
            style={{
              visibility: `${this.state.hovered ? "visible" : "hidden"}`,
            }}
          >
            {this.props.label}
          </div>
        </IconWrapper>
      </Link>
    )
  }
}

export default NavIcon
