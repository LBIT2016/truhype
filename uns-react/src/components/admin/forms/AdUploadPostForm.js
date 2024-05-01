import React, { Component } from 'react';
import { 
	Form,
	Grid,
	Container,
	Checkbox,
	Button,
	Icon,
	TextArea,
	Divider,
	Segment,
	Label
} from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CirclePicker } from "react-color";

import Post from "../../elements/Post";
import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../../actions/locations";
import { fetchCategories } from "../../../actions/others";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../../reducers/locations";
import { allCategoriesSelector } from "../../../reducers/others";

class AdUploadPostForm extends Component {
	state = {
		preview: false,
		data: {
			country: "",
			state: "",
			city: "",
			// hashtags: [],
			// hashtagValue: ""
		},
		colorOptions: [
			"#f44336", "#e91e63", "#9c27b0", 
			"#673ab7", "#3f51b5", "#2196f3", "#03a9f4", 
			"#00bcd4", "#009688", "#4caf50", "#8bc34a", 
			"#cddc39", "#ffeb3b", "#ffc107", "#ff9800", 
						"#ff5722", "#795548", "#607d8b"]
	}

	componentWillMount = () => {
		this.props.fetchCountries();
		this.props.fetchCategories();
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

	handleLocationChange = (e, { name, value }) => 
		this.setState({
			data: { ...this.state.data, [name]: value }
		})

	handlePreview = () =>
		this.setState({ preview: !this.state.preview })

	unique = a => {
		    // var a = this.concat();
		    for(var i=0; i<a.length; ++i) {
		        for(var j=i+1; j<a.length; ++j) {
		            if(a[i] === a[j])
		                a.splice(j--, 1);
		        }
		    }

		    return a;
		}

	onClickAddLoc = () => {
		const { city, state, country } = this.state.data;
		const newloc = {
			location_country: country,
			location_state: state,
			location_city: city
		}
		this.props.pushLocation(newloc);
		this.setState({ data: { city: "", state: "", country: "" } });
	}

	render() {
		const { 
			category, 
			title, 
			text, 
			hashtags, 
			cardColor, 
			isCardStyle,
			isNotification,
			locationtype,
			locations
		} = this.props.data;
		// const { categoryOptions } = this.props;
		const { CountryOptions, StateOptions, CityOptions, hashtagOptions, ServerHashtagOptions } = this.props;
		const { country, state, city } = this.state.data;
		const { colorOptions, preview } = this.state;

		const post = {
			title: title,
			text: text,
			category: category,
			hashtags: hashtags,
			cardColor: cardColor,
			isCardStyle: isCardStyle,
			upvotes_count: 0,
			downvotes_count: 0,
			comments_count: 0,
			comments: []
		};

		let options = this.unique([...hashtagOptions, ...ServerHashtagOptions]);

		return (
			<div>
				{ !preview ? (
					<div>
						<Form>
							<Form.Input 
								placeholder="Title" 
								onChange={this.props.handleDataChange}
								name="title"
								value={title}
							/>
							<Form.Field>
								<TextArea 
									placeholder="writeup"
									autoHeight
									onChange={this.props.handleDataChange} 
									name="text"
									value={text}
									required
								/>
							</Form.Field>
							<Form.Input 
								placeholder="Company Name" 
								onChange={this.props.handleDataChange}
								name="category"
								value={category}
							/>
							<Form.Dropdown
								fluid
								search
								scrolling
								selection
								multiple
								allowAdditions
								onAddItem={this.props.addHashtag}
								onSearchChange={this.props.onHashtagSearch}
								closeOnChange
								value={hashtags}
								name="hashtags"
								onChange={this.props.handleHashtagChange}
								placeholder="Add Hashtags" 
								options={options}
							/>

							<Divider section />
							<Form.Group inline>
								<Form.Radio
						          label='All locations'
						          value='all'
						          checked={locationtype === 'all'}
						          onChange={this.props.handleLocationRadio}
						        />
						        <Form.Radio
						          label='Locations to show'
						          value='locationstoshow'
						          checked={locationtype === 'locationstoshow'}
						          onChange={this.props.handleLocationRadio}
						        />
						        <Form.Radio
						          label='Locations not to show'
						          value='locationsnottoshow'
						          checked={locationtype === 'locationsnottoshow'}
						          onChange={this.props.handleLocationRadio}
						        />
						       { locationtype !== "all" && (
							       	<Button 
							        	floated="right" 
							        	basic
							        	color="grey"
							        	circular
							        	content="Clear locations" 
							        	onClick={this.props.onClearLocs}
							        />
							    )}
					        </Form.Group>

							{ locationtype !== "all" && (
								<div>
									<Segment>
							        	{ locations && locations.map((loc, i) => (
							        		loc.location_city ?
							        			<Label key={i}>{loc.location_city}</Label>
							        		  : loc.location_state ?
							        		  	<Label key={i}>{loc.location_state}</Label>
							        		  : loc.location_country &&
							        		  	<Label key={i}>{loc.location_country}</Label>
							        	))}
							        </Segment>

									<label>Add Locations</label>
									<Form.Group>
										<Form.Dropdown 
											placeholder="Country" 
											width={5}
											search
											selection 
											value={country}
											onChange={this.handleLocationChange}
											name="country"
											options={CountryOptions}
										/>
										<Form.Dropdown 
											placeholder="State" 
											width={5} 
											search
											onChange={this.handleLocationChange}
											value={state}
											name="state"
											selection 
											options={StateOptions}
										/>
										<Form.Dropdown 
											placeholder="Location" 
											width={6}
											search 
											onChange={this.handleLocationChange}
											value={city}
											name="city"
											selection
											options={CityOptions}
										/>
									</Form.Group>
									<Button color="grey" fluid content="Add location" onClick={this.onClickAddLoc}/>
								</div>
							)}
							<Divider section />

							<Form.Group style={{ marginTop: 10 }}>
								<Form.Field
									control={Checkbox}
									slider
									checked={isNotification}
									onChange={this.props.handleNotifCheck}
									label=" Send Notification to user"
								/>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</Form.Group>
							<Form.Group style={{ marginTop: 10 }}>
								<Form.Field
									control={Checkbox}
									checked={isCardStyle}
									onChange={this.props.handleCheck}
									label=" Use Card Color"
								/>
								&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							</Form.Group>
							{ isCardStyle && (
								<div style={{ marginTop: 10, marginLeft: 20 }}>
									<Container>
										<CirclePicker 
											color={cardColor}
											colors={colorOptions}
											onChangeComplete={this.props.handleColorChange} 
										/>
									</Container>
								</div>
							)}
						</Form>
						<Grid centered style={{ marginTop: 5 }}>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Container fluid align="left" onClick={this.handleLeftClick}>
										<Button color="grey" content="Preview" onClick={this.handlePreview}/>
									</Container>
								</Grid.Column>
								<Grid.Column>
									<Container fluid align="right">
										<Button onClick={this.props.onTextPostSubmit} color="grey" content="Submit" />
									</Container>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				) : (
					<div>
						<Post
							post={post}
							isForAdmin={true}
							showBottomBar={false}
						/>
						<Button onClick={this.handlePreview} color="grey" style={{ marginTop: 10 }}>
							<Icon name="close" /> Close Preview
						</Button>
					</div>
				)}
				
			</div>
		);
	}
}

AdUploadPostForm.propTypes = {
	ServerHashtagOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
	hashtagOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
	fetchCountries : PropTypes.func.isRequired,
	fetchStates : PropTypes.func.isRequired,
	fetchCities : PropTypes.func.isRequired,
	fetchCategories : PropTypes.func.isRequired,
	pushLocation : PropTypes.func.isRequired,
	clearCities : PropTypes.func.isRequired,
	categoryOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired
}

function mapStateToProps(state) {
	return {
		CountryOptions: allCountriesSelector(state),
		StateOptions: allStatesSelector(state),
		CityOptions: allCitiesSelector(state),
		categoryOptions: allCategoriesSelector(state)
	}
}

export default connect(
	mapStateToProps, 
	{ 
		fetchCountries,
		fetchCategories,
		fetchStates,
		fetchCities,
		clearCities
	}
)(AdUploadPostForm);