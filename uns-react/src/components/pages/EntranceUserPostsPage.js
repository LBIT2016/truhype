import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import UserPostsPage from "./UserPostsPage";
import DesktopUserPostsPage from "./DesktopUserPostsPage";

class EntranceUserPostsPage extends Component {
	state = {};

	render() {

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<UserPostsPage />
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopUserPostsPage />
				</Responsive>
			</div>
		);
	}
}

export default EntranceUserPostsPage;
