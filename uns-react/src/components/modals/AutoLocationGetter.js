import React, { Component } from "react";
import { geolocated, geoPropTypes } from "react-geolocated";
import { Button, Modal, Icon, Segment } from "semantic-ui-react";

import InlineError from "../messages/InlineError";


class AutoLocationGetter extends Component {
	state = {
		isInnerModal: false,
		data: {
			country: "",
			state: "",
			city: ""
		},
		isLoaded: false,
		error: ""
	}


	componentDidUpdate = (prevProps, prevState) => {
		if(prevProps.coords !== this.props.coords) {
			// const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.props.coords.latitude},${this.props.coords.longitude}&key=${process.env.REACT_APP_GOOGLECODING_API_KEY}`;
			if(this.props.coords) {
				// console.log("It is working...");
				// console.log(this.props.coords.latitude);
				// console.log(this.props.coords.longitude);
				// console.log(url);

				// call getLocation function here to update country, state and city values in this.state
			}
		}
	}

	handleOpen = () => this.setState({ isInnerModal: true })

	handleClose = () => this.setState({ isInnerModal: false })

	handleSubmit = () => {
		const { country, state, city } = this.state.data;
		this.props.getLocation(country, state, city);
		this.handleClose();
	}

	getLocationGoogle = () => {		
		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.props.coords.latitude},${this.props.coords.longitude}&key=AIzaSyCoPu8xJRCrag5typC4VI9Ww9FHPgFJ_xQ`;
		fetch(url, {
			method: "GET"
		}).then(res => {
			if(res.ok) {
				return res.json();
			} else {
				this.setState({ error: res.statusText });
				throw Error(res.statusText);
			}
		}).then(json => {
			let results = json;
			console.log(results);
			if (results[0]) {
				let add= results[0].formatted_address ;
				let value=add.split(",");
				let count=value.length;
				const country=value[count-1];
				const state=value[count-2];
				const city=value[count-3];
				this.setState({ isLoaded: true, data: { country, state, city }});
				console.log(country, state, city);
			} else {
				this.setState({ error: "Problem in fetching location." });
			}
		})
	}

	render() {
		return (
			<div>
				<Modal 
					closeIcon
					trigger={
						<Button color='green' inverted onClick={this.handleOpen}>
							<Icon name='point' /> Get location
						</Button>
					}
					open={this.state.isInnerModal}
					onClose={this.handleClose}
					style={{ backgroundColor: "#f9f9f9" }}
				>
					<Modal.Content>
						<Modal.Description>
							{ this.state.error && (
								<div>
									<InlineError text={this.state.error} />
									<Segment>
						      			Please go back and Select the location manually
						      		</Segment>
					      		</div>
							)}
							{!this.props.isGeolocationAvailable
						      ? <div>
						      		<InlineError text="Your browser does not support Geolocation" />
						      		<Segment>
						      			Please go back and Select the location manually
						      		</Segment>
						      	</div>
						      : !this.props.isGeolocationEnabled
						        ? <div>
						        	<InlineError text="Geolocation is not enabled" />
						        	<Segment>
						      			Please allow the geolocation prompt in the browser.
						      		</Segment>
						          </div>
						        : this.props.coords
						          ? <div>
						          			Your Location is <br />
						          			Country: &nbsp;&nbsp; {this.state.data.country} <br />
						          			State: &nbsp;&nbsp; {this.state.data.state} <br />
						          			City: &nbsp;&nbsp; {this.state.data.city} <br /><br />

						          			Is this Location Ok? <br />
						          			If yes, We take this location for local feed. <br/>
						          			If no, Select it manually <br /> 
						          			<Button floated="right" secondary content="Yes" /> 
						          			<Button floated="right" primary content="No" />
						            </div>
						          : <div>Getting the location data&hellip; </div> 
							}
						</Modal.Description>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

AutoLocationGetter.propTypes = {...AutoLocationGetter.propTypes, ...geoPropTypes};

export default geolocated({
	positionOptions: {
		enableHighAccuracy: true,
	},
	userDecisionTimeout: 5000,
	watchPosition: false,
    suppressLocationOnMount: false
})(AutoLocationGetter);