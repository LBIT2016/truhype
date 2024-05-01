import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import { AddPath } from "../actions/path";
// import { gotDetails } from "../actions/users";

/* const UserRoute = ({ isAuthenticated, component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			isAuthenticated ? <Component {...props} /> : <Redirect to="/welcome" />
		}
	/>
); */

class UserRoute extends React.Component {
	state = {}

	/*componentDidMount = () => {
		this.props.gotDetails();
	}*/

	componentDidMount = () => {
		const { pathname } = this.props.location;
		pathname !== "/welcome2" && this.props.AddPath(pathname);
	}

	render() {
		const { isAuthenticated, component: Component, ...rest } = this.props;
		// const { gotDetails } = this.props;

		return (
			<Route
				{...rest}
				render={props =>
					isAuthenticated ? (
						// gotDetails ? (
							<Component {...props} />
						/* ) : (
							<Redirect to="/welcome2" />
						) */
					) : ( 
						<Redirect to="/welcome" />
					)
				}
			/>
		);
	}
}

UserRoute.propTypes = {
	component: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
	return {
		isAuthenticated: !!state.user.token,
		// gotDetails: !!state.user.gotDetails
	};
}

export default connect(mapStateToProps, { AddPath/*, gotDetails*/ })(UserRoute);
