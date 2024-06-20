import React, { Component } from 'react';
import { 
	Form,
	Grid,
	Container,
	Button,
	Icon 
} from "semantic-ui-react";
import { connect } from "react-redux";

import PostImage from "../elements/PostImage";
import ImageUploader from "../elements/ImageUploader";

import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../actions/locations";
import { fetchCategories } from "../../actions/others";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../reducers/locations";
import { allCategoriesSelector } from "../../reducers/others";

class UploadPostImageForm extends Component {
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
			this.props.getLocation(
				this.state.data.city,
				this.state.data.state,
				this.state.data.country,
			);
			this.props.fetchStates(this.state.data.country);
			this.props.clearCities();
		}

		if(prevState.data.state !== this.state.data.state) {
			this.props.getLocation(
				this.state.data.city,
				this.state.data.state,
				this.state.data.country,
			);
			this.props.fetchCities(this.state.data.country, this.state.data.state);
		}

		if(prevState.data.city !== this.state.data.city) {
			this.props.getLocation(
				this.state.data.city,
				this.state.data.state,
				this.state.data.country,
			);
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

	handleShowNext = () => {
		this.setState({ showNext: true });
	}	

	render() {
		const { 
			category, 
			title, 
			images, 
			hashtags, 
			location_city,
			location_state,
			location_country 
		} = this.props.data;
		const { categoryOptions } = this.props;
		const { CountryOptions, StateOptions, CityOptions, hashtagOptions, ServerHashtagOptions } = this.props;
		const { country, state, city } = this.state.data;
		const { whichPage, showNext } = this.state;

		const post = {
			title: title,
			images: images,
			category: category,
			hashtags: hashtags,
			location_city: location_city,
			location_state: location_state,
			location_country: location_country,
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
							<Form.Dropdown
								fluid
								required
								scrolling
								search
								selection
								value={category}
								name="category"
								onChange={this.props.handleDataChange}
								placeholder="Category" 
								options={categoryOptions}
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
							<label>Location</label>
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
)(UploadPostImageForm);