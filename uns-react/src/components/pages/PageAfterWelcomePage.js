import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Button, Header, Modal, Input, Label } from "semantic-ui-react";
import { connect } from "react-redux";

import { signup, setUserData } from "../../actions/users";
import SelectLocationGetter from "../modals/SelectLocationGetter";
// import AutoLocationGetter from "../modals/AutoLocationGetter";

class PageAfterWelcomePage extends Component {
	state = {  
		isModalOpen: true,
		data: {
			country: "",
			state: "",
			city: "",
			username: ""
		},
		tempusername: ""
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.data.city !== this.state.data.city) {
			this.props.signup().then(() => {
				this.props
					.setUserData(this.state.data)
					.then(() => {
						if(this.props.redirectTo) {
							this.props.history.push(this.props.redirectTo);
						} else {
							this.props.history.push("/");
						}
					});
			});
		}	
	}

	getLocation = (country, state, city) => {
		this.setState({ ...state, data: { ...this.state.data, country, state, city }});
	}

	onInputChange = (e, { value }) => {
		this.setState({ tempusername: value });
	}

	setFinalUsername = () => {
		this.setState({ data: {...this.state.data, username: this.state.tempusername} });
	}

	render() {
		// const { sessionId } = this.props;
		const { username } = this.state.data;
		const { tempusername } = this.state;

		return (
			<div>
				<Modal
					defaultOpen={true}
					closeOnDimmerClick={false}
					closeOnDocumentClick={false}
					basic 
					size='small'
				>
					<Header icon='heart' content='Truhype welcomes you' />
					<Modal.Content>
						<p>
							Hi user, <br />
							Welcome to Truhype <br /><br />
							
							{/*You got Session Id: &nbsp;&nbsp;&nbsp; #{sessionId} <br /><br />*/}
						</p>

					{ !username ?	(
						<div>
							<p>
								Give yourself a username (It will visible to you only)
							</p>
							<Input 
								action={{ color: "teal", content: "save", onClick: this.setFinalUsername }}
								onChange={this.onInputChange} 
								value={tempusername} 
							/>
						</div>
					) : (
						<div>
							<p>Username: </p>
							<Label>{username}</Label>
						</div>
					)}
						
					{ username ? (	
						<p>
							<br /><br />
							We need your location for your local feed
						</p>
					) : ( null )}
					</Modal.Content>
					{ username ? (
						<Modal.Actions>
							<Button.Group>
								<SelectLocationGetter
									username={username} 
									getLocation={this.getLocation}
								/>
								{/*<Button.Or />
								<AutoLocationGetter
									getLocation={this.getLocation}
								/>*/}
							</Button.Group>
						</Modal.Actions> 
					) : ( null )}
				</Modal>
			</div>
		);
	}
}

PageAfterWelcomePage.propTypes = {
	history: PropTypes.shape({
	  push : PropTypes.func.isRequired
	}).isRequired,
	setUserData : PropTypes.func.isRequired,
	// sessionId : PropTypes.string.isRequired
}

function mapStateToProps(state) {
	return {
		// sessionId: state.user.sessionId,
		redirectTo: state.path
	}
}

export default connect(mapStateToProps, { signup, setUserData })(PageAfterWelcomePage);