import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import PostFull from "./PostFull";
import DesktopPostFull from "./DesktopPostFull";

class EntrancePostFull extends Component {
	state = {};

	render() {
		const id = this.props.match.params.id;

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<PostFull 
						id={id} 
						history={this.props.history}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopPostFull 
						id={id} 
						history={this.props.history}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntrancePostFull;
