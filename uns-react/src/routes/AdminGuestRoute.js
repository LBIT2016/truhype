import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom"; 

const AdminGuestRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			!isAuthenticated ? (
				<Component {...props} />
			) : (
				<Redirect to="/admin_dashboard" />
			)
		}
	/>
);

AdminGuestRoute.propTypes = {
	component:  PropTypes.func.isRequired,
	isAuthenticated : PropTypes.bool.isRequired
}

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.admins.token
	}
}

export default connect(mapStateToProps)(AdminGuestRoute);