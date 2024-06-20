import React, { Component } from 'react';
import { Grid, Segment } from "semantic-ui-react";

import PostVideoFull from "./PostVideoFull";
import DesktopMenuPage from "../pages/DesktopMenuPage";
import DesktopProfilePage from "../pages/DesktopProfilePage";

class DesktopPostVideoFull extends Component {
	state = {};

	render() {

		return (
			<div>
				<Grid centered>
					<Grid.Column width={4}>
						<div style={{ position: "fixed", minWidth: "310px" }}>
							<DesktopProfilePage />
						</div>
					</Grid.Column>
					<Grid.Column width={8}>
						<Segment
							style={{ 
								minHeight: window.innerHeight, 
								backgroundColor: "#f9f9f9", 
								padding: "5px", 
								paddingTop: "15px"
							}}
						>
							<PostVideoFull 
								id={this.props.id}
								history={this.props.history}
							/>
						</Segment>
					</Grid.Column>
					<Grid.Column 
						width={4}
						style={{ 
							height: "100%"
						}}
					>
						<div style={{ position: "fixed", minWidth: "310px" }}>
							<DesktopMenuPage />
						</div>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default DesktopPostVideoFull;