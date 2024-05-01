import React, { Component } from 'react';
import PropTypes from "prop-types";

import PostEditable from "./PostEditable";

class UploadTextPanel extends Component {
	state = { isPreview: false }

	handlePreview = () => this.setState({ isPreview: !this.state.isPreview });

	render() {
		const { categoryOptions, hashtagOptions } = this.props;

		return (
			<div>
				<PostEditable 
					addHashtag={this.props.addHashtag}
					categoryOptions={categoryOptions}
					hashtagOptions={hashtagOptions}
				/>
			</div>
		);
	}
}

UploadTextPanel.propTypes = {
	categoryOptions : PropTypes.arrayOf(
		PropTypes.shape({
			key : PropTypes.string.isRequired,
			value : PropTypes.string.isRequired,
			text : PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	hashtagOptions : PropTypes.arrayOf(
		PropTypes.shape({
			key : PropTypes.string.isRequired,
			value : PropTypes.string.isRequired,
			text : PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	addHashtag : PropTypes.func.isRequired
}

export default UploadTextPanel;