import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { login } from "../../../actions/admins";
import AdLoginForm from "../forms/AdLoginForm";

class AdLoginPage extends React.Component {
	submit = data => 
		this.props
			.login(data)
			.then(() => this.props.history.push("/admin_dashboard"));

	render() {
		return (
			<div>
				<AdLoginForm 
					submit={this.submit} 
					history={this.props.history}
				/> 
			</div>
		);
	}
}

AdLoginPage.propTypes = {
	login : PropTypes.func.isRequired,
	history : PropTypes.shape({
	  push : PropTypes.func.isRequired
	}).isRequired
}

export default withRouter(connect(null, { login })(AdLoginPage));
// export default AdLoginPage;
