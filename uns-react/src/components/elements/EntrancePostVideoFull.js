import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import PostVideoFull from "./PostVideoFull";
import DesktopPostVideoFull from "./DesktopPostVideoFull";

class EntrancePostVideoFull extends Component {
	state = {};

	render() {
		const id = this.props.match.params.id;

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<PostVideoFull 
						id={id}
						history={this.props.history}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopPostVideoFull 
						id={id}
						history={this.props.history}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntrancePostVideoFull;
