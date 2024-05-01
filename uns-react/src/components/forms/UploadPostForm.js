import React, { Component } from 'react';
import { 
	Form,
	Grid,
	Container,
	Checkbox,
	Button,
	Icon,
	TextArea
} from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CirclePicker } from "react-color";

import Post from "../elements/Post";
import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../actions/locations";
import { fetchCategories } from "../../actions/others";
import { 
	allCountriesSelector, 
	allStatesSelector, 
	allCitiesSelector
} from "../../reducers/locations";
import { allCategoriesSelector } from "../../reducers/others";

class UploadPostForm extends Component {
	state = {
		preview: false,
		data: {
			country: "",
			state: "",
			city: "",
			// hashtags: [],
			// hashtagValue: ""
		},
		/* colorOptions: [
			"#f44336", "#e91e63", "#9c27b0", 
			"#673ab7", "#3f51b5", "#2196f3", "#03a9f4", 
			"#00bcd4", "#009688", "#4caf50", "#8bc34a", 
			"#cddc39", "#ffeb3b", "#ffc107", "#ff9800", 
						"#ff5722", "#795548", "#607d8b"] */
		colorOptions: [
			"#999999",
			"#25D55F",
			"#595959",
			"#FFCF00",
			"#FFA500",
			"#FF7D00",
			"#F22B0C",
			"#EA1889",
			"#B651E1",
			"#8C20BA",
			"#00AFD1",
			"#3A58DB",
			"#A229D6",
			"#1FA2F3",
			"#FF8370",
			"#F977BC",
			"#262626",
			"#000000",
			"#FDCE01",
			"#2B6A76",
			"#314083"
		]
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
			this.props.fetchCities(this.state.data.country, this.state.data.state);
			this.props.getLocation(
				this.state.data.city,
				this.state.data.state,
				this.state.data.country,
			);
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

	handlePreview = () =>
		this.setState({ preview: !this.state.preview })

	/* addHashtag = (e, { searchQuery }) => {
		console.log(searchQuery);
		let newOption = { key: searchQuery, value: searchQuery, text: searchQuery };
		this.setState({ 
			data: { ...this.state.data, hashtags: [ ...this.state.data.hashtags, newOption ]}
		});
		// if(searchQuery[0] !== '#') searchQuery = '#'+searchQuery; 
		// this.props.addHashtag(value);
	} */

	unique = a => {
		    // var a = this.concat();
		    for(var i=0; i<a.length; ++i) {
		        for(var j=i+1; j<a.length; ++j) {
		            if(a[i] === a[j])
		                a.splice(j--, 1);
		        }
		    }

		    return a;
		};

	render() {
		const { 
			category, 
			title, 
			text, 
			hashtags, 
			cardColor, 
			isCardStyle, 
			location_city,
			location_state,
			location_country 
		} = this.props.data;
		const { categoryOptions } = this.props;
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
									placeholder="Writeup"
									autoHeight
									onChange={this.props.handleDataChange} 
									name="text"
									value={text}
									required
								/>
							</Form.Field>
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

UploadPostForm.propTypes = {
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
	getLocation : PropTypes.func.isRequired,
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
)(UploadPostForm);