import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import UploadPage from "./UploadPage";
import DesktopUploadPage from "./DesktopUploadPage";

class EntranceUploadPage extends Component {
	state = {};

	render() {

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<UploadPage
						history={this.props.history} 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopUploadPage
						history={this.props.history} 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntranceUploadPage;
