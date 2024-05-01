import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import WelcomeForm from "../forms/WelcomeForm";

class WelcomePage extends Component {

	render() {
		return (
			<div>
				<WelcomeForm 
					history={this.props.history}
				/>
			</div>
		);
	}
}

WelcomePage.propTypes = {
	history : PropTypes.shape({
	  	push : PropTypes.func.isRequired
	}).isRequired
}

export default connect(null)(WelcomePage);