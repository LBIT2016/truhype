import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import LocalPage from "./LocalPage";
import DesktopLocalPage from "./DesktopLocalPage";

class EntranceLocalPage extends Component {
	state = {}

	render() {
		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<LocalPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopLocalPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntranceLocalPage;
