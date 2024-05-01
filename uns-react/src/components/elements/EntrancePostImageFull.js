import React, { Component } from 'react';
import { Responsive } from "semantic-ui-react";

import PostImageFull from "./PostImageFull";
import DesktopPostImageFull from "./DesktopPostImageFull";

class EntrancePostImageFull extends Component {
	state = {};

	render() {
		const id = this.props.match.params.id;

		return (
			<div>
				<Responsive {...Responsive.onlyMobile}>
					<PostImageFull 
						id={id} 
						history={this.props.history}
					/>
				</Responsive>
				<Responsive minWidth={Responsive.onlyTablet.minWidth}>
					<DesktopPostImageFull 
						id={id} 
						history={this.props.history}
					/>
				</Responsive>
			</div>
		);
	}
}

export default EntrancePostImageFull;
