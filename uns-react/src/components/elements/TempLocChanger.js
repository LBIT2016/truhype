import React, { Component } from 'react';
import { Accordion, Icon, Grid, Dropdown, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../actions/locations";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../reducers/locations";

class TempLocChanger extends Component {
	_isMounted = false;
	state = {
		data: {
			country: "",
			state: "",
			city: ""
		},
		activeIndex: -1
	}

	componentWillMount = () => {
		this.props.fetchCountries();	
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	componentWillUnmount = () => {
		this._isMounted = false;	
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.data.country !== this.state.data.country) {
			this.props.fetchStates(this.state.data.country);
			this.props.clearCities();
		}

		if(prevState.data.state !== this.state.data.state) {
			this.props.fetchCities(this.state.data.country, this.state.data.state);
		}
	}

	handleAccClick = (e, titleProps) => {
		const { index } = titleProps
		const { activeIndex } = this.state
		const newIndex = activeIndex === index ? -1 : index

		this.setState({ activeIndex: newIndex })
	}

	handleChange = (e, { name, value }) => 
		this._isMounted && 
			this.setState({
				data: { ...this.state.data, [name]: value }
			})

	handleSubmit = e => {
		e.preventDefault();
		// alert(`Country: ${this.state.data.country}, State: ${this.state.data.state}, City: ${this.state.data.city}`);
		const loc = {
			location_city: this.state.data.city,
			location_state: this.state.data.state,
			location_country: this.state.data.country
		}
		this.setState({ activeIndex: -1 });
		this.props.clearPosts();
		this.props.loadPosts(1, loc);
	}

	render() {
		const { activeIndex, country, state, city } = this.state;
		const { CountryOptions, StateOptions, CityOptions } = this.props;

		return (
			<Accordion styled fluid style={{ marginTop: 5 }}>
				<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccClick}>
					Wanna change location of feed temporarily?
					&nbsp;&nbsp;
					<span style={{ float: "right" }}>
						<Icon 
							name="close" 
							onClick={this.props.handleIsAcc} 
						/>
					</span>
				</Accordion.Title>
				<Accordion.Content active={activeIndex === 0}>
					<Grid>
						<Grid.Row>
							<Grid.Column>
								<Dropdown 
									placeholder="Country" 
									fluid
									search
									selection 
									value={country}
									onChange={this.handleChange}
									name="country"
									options={CountryOptions}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Dropdown 
									placeholder="State" 
									fluid 
									search
									onChange={this.handleChange}
									value={state}
									name="state"
									selection 
									options={StateOptions}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Dropdown 
									placeholder="Location" 
									fluid
									search 
									onChange={this.handleChange}
									value={city}
									name="city"
									selection 
									options={CityOptions}
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button 
									content="Change" 
									onClick={this.handleSubmit} 
								/>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Accordion.Content>
			</Accordion>
		);
	}
}

function mapStateToProps(state) {
	return {
		CountryOptions: allCountriesSelector(state),
		StateOptions: allStatesSelector(state),
		CityOptions: allCitiesSelector(state)
	};
}

export default connect(mapStateToProps, 
	{ fetchCountries, fetchStates, fetchCities, clearCities }
)(TempLocChanger);
