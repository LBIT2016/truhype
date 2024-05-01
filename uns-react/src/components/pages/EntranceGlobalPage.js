import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import GlobalPage from "./GlobalPage";
import DesktopGlobalPage from "./DesktopGlobalPage";

class EntranceGlobalPage extends Component {
	state = {};

	render() {

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<GlobalPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopGlobalPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntranceGlobalPage;
