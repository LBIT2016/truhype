import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import SearchPage from "./SearchPage";
import DesktopSearchPage from "./DesktopSearchPage";

class EntranceSearchPage extends Component {
	state = {};

	render() {

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<SearchPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopSearchPage 
						pathname={this.props.location.pathname}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntranceSearchPage;
