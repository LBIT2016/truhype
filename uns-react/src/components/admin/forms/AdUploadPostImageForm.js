import React, { Component } from 'react';
import { 
	Form,
	Grid,
	Container,
	Button,
	Icon,
	Checkbox,
	Label,
	Segment,
	Divider
} from "semantic-ui-react";
import { connect } from "react-redux";

import PostImage from "../../elements/PostImage";
import ImageUploader from "../../elements/ImageUploader";

import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../../actions/locations";
import { fetchCategories } from "../../../actions/others";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../../reducers/locations";
import { allCategoriesSelector } from "../../../reducers/others";

class AdUploadPostImageForm extends Component {
	state = {
		whichPage: "ImageUploader",
		data: {
			country: "",
			state: "",
			city: ""
		},
		showNext: false
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

	handlePageChange = (e, { value }) => {
		e.preventDefault();
		this.setState({ whichPage: value });
	}

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

	handleShowNext = () => {
		this.setState({ showNext: true });
	}

	render() {
		const { 
			category, 
			title, 
			images, 
			hashtags,
			isNotification,
			locationtype,
			locations 
		} = this.props.data;
		// const { categoryOptions } = this.props;
		const { CountryOptions, StateOptions, CityOptions, hashtagOptions, ServerHashtagOptions } = this.props;
		const { country, state, city } = this.state.data;
		const { whichPage, showNext } = this.state;

		const post = {
			title: title,
			images: images,
			category: category,
			hashtags: hashtags,
			upvotes_count: 0,
			downvotes_count: 0,
			comments_count: 0,
			comments: []
		};

		let options = this.unique([...hashtagOptions, ...ServerHashtagOptions]);

		return (
			<div>
				{ whichPage === "ImageUploader" && (
					<div>
						<ImageUploader 
							getImagesUrls={this.props.getImagesUrls}
							handleShowNext={this.handleShowNext}
						/>
						{showNext && (
							<Button
								active={images.length > 0}
								onClick={this.handlePageChange} 
								value="EditForm"  
								floated="right"
								color="grey"
							>
								Next
								<Icon name="angle right" />
							</Button>
						)}
						<br />
					</div>
				)}
				{ whichPage === "EditForm" && (
					<div>
						{/*<Button size="small" color="grey" onClick={this.handlePageChange} value="ImageUploader">
							<Icon name="angle left" /> back
						</Button>*/}
						<Form style={{ marginTop: 10 }}>
							<Form.Input 
								placeholder="Title" 
								onChange={this.props.handleDataChange}
								name="title"
								value={title}
							/>
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
						</Form>
						<Grid centered style={{ marginTop: 5 }}>
							<Grid.Row columns={2}>
								<Grid.Column>
									<Container fluid align="left" onClick={this.handleLeftClick}>
										<Button color="grey" content="Preview" value="Preview" onClick={this.handlePageChange}/>
									</Container>
								</Grid.Column>
								<Grid.Column>
									<Container fluid align="right">
										<Button onClick={this.props.onImagePostSubmit} color="grey" content="Submit" />
									</Container>
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>
				)}
				{whichPage === "Preview" && (
					<div>
						<PostImage
							post={post}
							isForAdmin={true}
							showBottomBar={false}
						/>
						<Button onClick={this.handlePageChange} value="EditForm" color="grey" style={{ marginTop: 10 }}>
							<Icon name="close" /> Close Preview
						</Button>
					</div>
				)}
				
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		categoryOptions: allCategoriesSelector(state),
		CountryOptions: allCountriesSelector(state),
		StateOptions: allStatesSelector(state),
		CityOptions: allCitiesSelector(state)
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
)(AdUploadPostImageForm);