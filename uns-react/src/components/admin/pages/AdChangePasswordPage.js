import React, { Component } from 'react';
import { Segment, Form, Message } from "semantic-ui-react";
import { connect } from "react-redux";

import AdMainPage from "./AdMainPage";
import InlineError from "../../messages/InlineError";
import { change_password } from "../../../actions/admins";

class AdChangePasswordPage extends Component {
	state = {
		data: {
			newPassword1: "",
			masterKey: "",
			newPassword2: ""
		},
		loading: false,
		errors: {}
	}

	onChange = (e, { name, value }) => {
		this.setState({
			data: { ...this.state.data, [name]: value }
		});
	}

	onSubmit = e => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({
			errors
		});
		if(Object.keys(errors).length === 0) {
			// alert(`New Password: ${this.state.data.newPassword1}, Masterkey: ${this.state.data.masterKey}`);
			this.setState({ loading: true });
			const data = { 
				password: this.state.data.newPassword1, 
				masterKey:  this.state.data.masterKey,
				token: this.props.token 
			};
			this.props
				.change_password(data)
				.then(() => {
					this.setState({ 
						data: {
							newPassword1: "",
							masterKey: "",
							newPassword2: ""
						},
						loading: false
					});
					alert("Password is changed successfully");
				})
				.catch(err => {
					console.log(err);
					this.setState({
						errors: err.response.data.errors,
						loading: false
					});
				});
		}
	}

	validate = data => {
		const errors = {};
		if(!data.newPassword1) errors.newPassword1 = "New Password needed!";
		if(!data.newPassword2) errors.newPassword2 = "Please re-type password!";
		if(data.newPassword1 !== data.newPassword2) errors.newPassword2 = "Passwords should match";
		if(!data.masterKey) errors.masterKey = "Master Key needed!";
		return errors;
	}

	render() {
		const { errors, loading } = this.state;
		const { newPassword1, newPassword2, masterKey } = this.state.data;

		return (
			<AdMainPage>
				<h1>Change Password</h1>
				<Segment>
					<Form 
						error={!!errors}
						loading={loading}
					>
						{errors.global && (
							<Message negative>
								<Message.Header>Something went wrong</Message.Header>
								<p>{errors.global}</p>
							</Message>
						)}
						<Form.Input 
							type="password" 
							placeholder="New Password"
							icon="key"
							iconPosition="left"
							value={newPassword1}
							error={!!errors.newPassword1}
							name="newPassword1"
							onChange={this.onChange}
						/>
						{errors.newPassword1 && (
							<InlineError text={errors.newPassword1} />
						)}
						<Form.Input 
							type="password" 
							placeholder="Re-type Password"
							icon="redo"
							iconPosition="left"
							value={newPassword2}
							error={!!errors.newPassword2}
							name="newPassword2"
							onChange={this.onChange}
						/>
						{errors.newPassword2 && (
							<InlineError text={errors.newPassword2} />
						)}
						<Form.Input 
							type="password" 
							placeholder="Master Key" 
							icon="user"
							iconPosition="left"
							error={!!errors.masterKey}
							name="masterKey"
							value={masterKey}
							onChange={this.onChange}
						/>
						{errors.masterKey && (
							<InlineError text={errors.masterKey} />
						)}
						<Form.Button 
							color="grey" 
							fluid 
							onClick={this.onSubmit}
							content="Submit" 
						/>
					</Form>
				</Segment>
			</AdMainPage>
		);
	}
}

function mapStateToProps(state) {
	return {
		token: state.admins.token
	}
}

export default connect(mapStateToProps, { change_password })(AdChangePasswordPage);