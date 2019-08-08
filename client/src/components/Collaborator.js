import React from "react"
import styled from "styled-components"

const CollaboratorContainer = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  margin-top: 1em;
  margin-bottom: 1em;
`

const DescriptionContainer = styled.div`
  margin-left: 10px;
`

const Description = styled.div`
  font-size: 0.8em;
`

function Collaborator({
  image,
  name,
  title,
  description,
  website,
  orcid,
  scholar,
  email,
}) {
  return (
    <CollaboratorContainer>
      <img src={require(`../static/${image}.png`)} height="150px" />
      <DescriptionContainer>
        {name}{' '}
        {website && (
          <span>
            <a href={website} target="_blank">
              <i class="fa fa-globe square fa" />
            </a>{" "}
          </span>
        )}
        {email && (
          <span>
            <a href={"mailto:" + email} target="_blank">
              <i class="fa fa-envelope square fa" />
            </a>{" "}
          </span>
        )}
        {orcid && (
          <span>
            <a href={orcid} target="_blank">
              <i class="ai ai-orcid-square ai" />
            </a>{" "}
          </span>
        )}
        {scholar && (
          <span>
            <a href={scholar} target="_blank">
              <i class="ai ai-google-scholar-square ai" />
            </a>{" "}
          </span>
        )}
        <br />
        {title}
        <Description>{description}</Description>
      </DescriptionContainer>
    </CollaboratorContainer>
  )
}

export default Collaborator
