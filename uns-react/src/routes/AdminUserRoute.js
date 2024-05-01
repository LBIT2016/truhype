import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import { AddPath } from "../actions/path";

const AdminUserRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated ? <Component {...props} /> : <Redirect to="/admin_login_page" />
		}
	/>
);

/* class AdminUserRoute extends React.Component {
	state = {}

	/*componentDidMount = () => {
		const { pathname } = this.props.location;
		pathname !== "/welcome2" && this.props.AddPath(pathname);
	}

	render() {
		const { isAuthenticated, component: Component, ...rest } = this.props;

		return (
			<Route
				{...rest}
				render={props =>
					isAuthenticated ? <Component {...props} /> : <Redirect to="/admin_login_page" />
				}
			/>
		);
	}
} */

AdminUserRoute.propTypes = {
	component: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.admins.token
	};
}

export default connect(mapStateToProps, { AddPath })(AdminUserRoute);
