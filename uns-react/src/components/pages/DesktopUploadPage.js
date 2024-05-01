import React, { Component } from 'react';
import { Grid } from "semantic-ui-react";

import UploadPage from "./UploadPage";
import DesktopMenuPage from "./DesktopMenuPage";
import DesktopProfilePage from "./DesktopProfilePage";

class DesktopUploadPage extends Component {
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
						<UploadPage
							history={this.props.history} 
							pathname={this.props.pathname}
						/>
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

export default DesktopUploadPage;