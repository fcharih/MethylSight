import React from "react";
import styled from "styled-components";

import Histones from "../static/Histones.png"
import NavigationBar from "./NavigationBar.js";


const Half = styled.div`
  width: 50%;
`;


const SplitDiv = styled.div`
	display: flex;
`;

const Center = styled.div`
  text-align: center;
`;


export default function TwoColumnsLayout(props) {
	return (
		<div>
			<NavigationBar />
			<SplitDiv>
				<Half>
					{props.children}
				</Half>
				<Half>
					<Center>
						<img src={Histones} width="50%" />
					</Center>
				</Half>
			</SplitDiv>
		</div>
	);
}
