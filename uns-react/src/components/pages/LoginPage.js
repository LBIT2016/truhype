import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { login } from "../../actions/auth";
import LoginForm from "../forms/LoginForm";

class LoginPage extends React.Component {
	state = {
		sucess: false
	}

	submit = data => 
		this.props
			.login(data)
			.then(() => {
				if(this.props.redirectTo) {
					this.props.history.push(this.props.redirectTo);
				} else {
					this.props.history.push("/");
				}
			});

	render() {
		return (
			<div>
				<LoginForm 
					submit={this.submit} 
					history={this.props.history}
				/> 
			</div>
		);
	}
}

LoginPage.propTypes = {
	login : PropTypes.func.isRequired,
	history : PropTypes.shape({
	  push : PropTypes.func.isRequired
	}).isRequired
}

function mapStateToProps(state) {
	return {
		redirectTo: state.path
	}
}

export default withRouter(connect(mapStateToProps, { login })(LoginPage));
// export default LoginPage;
