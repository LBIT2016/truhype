import React from "react";
import {
	Grid,
	Header,
	Image,
	Form,
	Segment,
	Button,
	Message
} from "semantic-ui-react";

import PropTypes from "prop-types";
import logoImage from "../../../media/logowithname.png";
import InlineError from "../../messages/InlineError";

class AdLoginForm extends React.Component {
	state = {
		data: {
			username: "",
			password: ""
		},
		loading: false,
		errors: {}
	};

	onChange = e => {
		this.setState({
			data: { ...this.state.data, [e.target.name]: e.target.value }
		});
	};

	onSubmit = e => {
		e.preventDefault();
		const errors = this.validate(this.state.data);
		this.setState({
			errors
		});
		if(Object.keys(errors).length === 0) {
			// alert(`Username: ${this.state.data.username}, Password: ${this.state.data.password}`);
			this.setState({ loading: true });
			this.props
				.submit(this.state.data)
				.catch(err => {
					console.log(err);
					this.setState({
						errors: err.response.data.errors,
						loading: false
					});
				});
		}
	};

	validate = data => {
		const errors = {};
		if (!data.username) errors.username = "Username needed!";
		if (!data.password) errors.password = "Can't be blank!";
		return errors;
	};

	render() {
		const { data, errors, loading } = this.state;

		return (
			<div>
				<Grid
					textAlign="center"
					style={{ height: window.innerHeight, backgroundColor: "#f9f9f9" }}
					verticalAlign="middle"
					centered
				>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Image centered src={logoImage} /> 
						<Header as="h2" color="grey" textAlign="center">
							Admin Login
						</Header>
						<Form
							size="large"
							onSubmit={this.onSubmit}
							error={!!errors}
							loading={loading}
						>
							{errors.global && (
								<Message negative>
									<Message.Header>Something went wrong</Message.Header>
									<p>{errors.global}</p>
								</Message>
							)}
							<Segment stacked>
								<Form.Input
									fluid
									icon="user"
									iconPosition="left"
									id="username"
									placeholder="Username"
									name="username"
									onChange={this.onChange}
									value={data.username}
									error={!!errors.username}
								/>
								{errors.username && (
									<InlineError text={errors.username} />
								)}

								<Form.Input
									fluid
									icon="lock"
									iconPosition="left"
									name="password"
									id="password"
									placeholder="Password"
									type="password"
									onChange={this.onChange}
									value={data.password}
									error={!!errors.password}
								/>
								{errors.password && (
									<InlineError text={errors.password} />
								)}
								<Button color="grey" fluid size="large">
									Login
								</Button>
							</Segment>
						</Form>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

AdLoginForm.propTypes = {
	submit : PropTypes.func.isRequired
}
export default AdLoginForm;
