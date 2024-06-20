import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom"; 

// import { gotDetails } from "../actions/users";

class GuestRoute extends React.Component {
	state= {}

	/*componentDidMount = () => {
		this.props.gotDetails();
	}*/

	render() {
		const { isAuthenticated, component: Component, ...rest } = this.props;
		// const { gotDetails } = this.props;

		return (
			<Route
				{...rest}
				render={props =>
					!isAuthenticated ? (
						<Component {...props} />
					) : (
						// gotDetails ? (
							<Redirect to="/" />
						/* ) : (
							<Redirect to ="/welcome2" />
						) */
					)
				}
			/>
		);
	}	
}

GuestRoute.propTypes = {
	component: PropTypes.func.isRequired,
	isAuthenticated : PropTypes.bool.isRequired
}

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.token,
		// gotDetails: !!state.user.gotDetails
	}
}

export default connect(mapStateToProps/*, { gotDetails }*/)(GuestRoute);