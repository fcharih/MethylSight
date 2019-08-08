import React from "react";
import styled from "styled-components";

import NavigationBar from "./NavigationBar.js";

export default function SingleColumnLayout(props) {
	return (
		<div>
			<NavigationBar />
			{props.children}
		</div>
	);
}
