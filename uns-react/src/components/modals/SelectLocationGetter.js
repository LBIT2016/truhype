import React from "react";
import PropTypes from "prop-types";
import { Modal, Button, Icon, Grid, Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";

import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../actions/locations";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../reducers/locations";

class SelectLocationGetter extends React.Component {
	_isMounted = false;
	state = {
		isInnerModal: false,
		data: {
			country: "",
			state: "",
			city: ""
		}
	}

	componentDidMount = () => {
		this._isMounted = true;
		this.onInit(this.props);
	}

	componentWillUnmount = () => {
		this._isMounted = false;	
	}

	onInit = props => {
		props.fetchCountries();
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

	handleOpen = () => this.setState({ isInnerModal: true })

	handleClose = () => this.setState({ isInnerModal: false })

	handleSubmit = () => {
		const { country, state, city } = this.state.data;
		this.props.getLocation(country, state, city);
		this.handleClose();
	}

	handleChange = (e, { name, value }) => 
		this._isMounted && 
			this.setState({
				data: { ...this.state.data, [name]: value }
			});

	render() {
		const { CountryOptions, StateOptions, CityOptions } = this.props;
		const { country, state, city } = this.state.data;

		return (
			<Modal 
				closeIcon
				trigger={
					<Button 
						color='green' 
						inverted 
						onClick={this.handleOpen}
					>
						<Icon name='mouse pointer' /> Select location
					</Button>
				}
				open={this.state.isInnerModal}
				onClose={this.handleClose}
				style={{ backgroundColor: "#f9f9f9" }}
			>
				<Modal.Content>
					<Modal.Description>
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
										content="Select" 
										onClick={this.handleSubmit} 
									/>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</Modal.Description>
				</Modal.Content>
			</Modal>
		);
	}
};

SelectLocationGetter.propTypes = {
	fetchCountries : PropTypes.func.isRequired,
	fetchStates : PropTypes.func.isRequired,
	fetchCities : PropTypes.func.isRequired,
	clearCities : PropTypes.func.isRequired,

	CountryOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
	StateOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
	CityOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
}

function mapStateToProps(state) {
	return {
		CountryOptions: allCountriesSelector(state),
		StateOptions: allStatesSelector(state),
		CityOptions: allCitiesSelector(state)
	};
}

export default connect(
	mapStateToProps, 
	{ fetchCountries, fetchStates, fetchCities, clearCities }
)(SelectLocationGetter);