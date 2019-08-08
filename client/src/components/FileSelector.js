import * as React from "react"
import { Component } from "react"
import { Button, ButtonProps, Label, Icon } from "semantic-ui-react"

export class FileButton extends Component {
  constructor(props) {
    super(props)

    this.id = "fsdfsdfsdfsfd"
    this.onChangeFile = this.onChangeFile.bind(this)
  }

  render() {
    return (
      <div>
        <Button {...this.props} as="label" htmlFor={this.id}>
          <Icon name="upload" />
          Select
        </Button>
        <input
          hidden
          id={this.id}
          multiple
          type="file"
          onChange={e => this.props.onFileSelected(e.target.files)}
        />
        {!this.props.selectedFile
          ? "No file selected"
          : this.props.selectedFile.name}
      </div>
    )
  }

  onChangeFile() {
    const fileButton = document.getElementById(this.id)
    const file = fileButton ? fileButton.files[0] : null
    if (this.props.onSelect) {
      this.props.onSelect(file)
    }
  }
}

export default FileButton
