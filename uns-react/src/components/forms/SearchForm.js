import React, { Component } from 'react';
import { 
	Grid, 
	Dropdown, 
	List, 
	// Tab,
	// Accordion,
	// Menu,
	Icon,
	Form,
	Container,
	Segment,
	Input,
	Button
} from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../actions/locations";
import { fetchCategories, fetchTopHashtags } from "../../actions/others";
import { fetchPostsBySearchFilter, clearPosts } from "../../actions/posts"; 
import { allCountriesSelector, allStatesSelector, allCitiesSelector } from "../../reducers/locations";
import { allCategoriesSelector, allTopHashtagsSelector } from "../../reducers/others";
import { allPostsSelector } from "../../reducers/posts";

import { adpostsSelector } from "../../reducers/adposts";
import { fetchAdPosts } from "../../actions/adposts";
import { changePer, changePage, changeTotalPages } from "../../actions/adpostsother";

import Post from "../elements/Post";
import PostVideo from "../elements/PostVideo";
import PostImage from "../elements/PostImage";

class SearchForm extends Component {
	state = {
		activeIndex: 1,
		data: {
			country: "",
			state: "",
			city: "",
			category: "",
			hashtag: "",
			textquery: ""
		},
		isHashtagbar: true,
		isFilterbar: true,
		per: 8,
		page: 1,
		totalPages: null,
		scrolling: false,
		loading: false
	}

	componentWillMount = () => {
		this.props.clearPosts();
		this.props.fetchCountries();
		this.props.fetchCategories();
		this.props.fetchTopHashtags();
	}

	componentDidMount = e => {
		window.addEventListener('scroll', e => {
			this.handleScroll(e);
		})
	}

	componentWillUnmount = e => {
		window.removeEventListener('scroll', e => {
			this.handleScroll(e);
		})
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.data.country !== this.state.data.country) {
			this.props.fetchStates(this.state.data.country);
			this.props.clearCities();
		}

		if(prevState.data.state !== this.state.data.state) {
			this.props.fetchCities(this.state.data.country, this.state.data.state);
		}

		if(prevProps.filter !== this.props.filter) {
			if(this.props.filter === "Loved") {
				// this.setState({ varColor: "red" });
				this.props.clearPosts();
				this.loadPosts();
			} else if (this.props.filter === "Latest") {
				// this.setState({ varColor: "purple" });
				this.props.clearPosts();
				this.loadPosts();
			} else if(this.props.filter === "Hated") {
				// this.setState({ varColor: "grey" });
				this.props.clearPosts();
				this.loadPosts();
			}
		}
	}

	handleScroll = () => {
		const { scrolling, totalPages, page } = this.state;
		if(scrolling) return;
		if(totalPages <= page) return;
		let wrappedElement = document.getElementById("ResultBlock");
		if(this.isBottom(wrappedElement)) {
			this.loadMore();
		}
	}

	isBottom = e => {
		return (e.getBoundingClientRect().bottom - 20) < (window.innerHeight + window.pageYOffset);
	}

	loadMore = () => {
		this.setState(prevState => ({
			page: prevState.page+1,
			scrolling: true
		}), this.loadPosts);
	}

	loadPosts = () => {
		const { per, page } = this.state;
		const { country, state, city, hashtag, category, textquery } = this.state.data;
		const { filter } = this.props;

		const { adper, adtotalpages } = this.props;
		let { adpage } = this.props;

		if(adpage > adtotalpages) {
			adpage = 1;
			this.props.changePage(1);
		} else {
			adpage += 1;
			this.props.changePage(adpage);
		}

		this.setState({ isFilterbar: false, isHashtagbar: false, loading: true });
		this.props.clearPosts();
		this.props
			.fetchPostsBySearchFilter(filter, per, page, country, state, city, hashtag, category, textquery)
			.then(totalPages => {
				this.setState({
					scrolling: false,
					totalPages,
					loading: false,
					data: { ...this.state.data, hashtag: "" }
				});
			});	
		this.props.fetchAdPosts(adper, adpage)
			.then(adtotalpages => {
				this._isMounted && this.setState({ scrolling: false });
				this.props.changeTotalPages(adtotalpages);
			});
	}

	handleChange = (e, { name, value }) => 
		this.setState({
			data: { ...this.state.data, [name]: value }
		})

	handleFilterBar = () => {
		this.setState({ 
			isFilterbar: !this.state.isFilterbar, 
			country: "",
			state: "",
			city: ""
		});
	}

	handleHashtagBar = () => {
		this.setState({ isHashtagbar: !this.state.isHashtagbar });
	}

	handleHashtagClick = e => {
		let x = e.currentTarget.textContent;
		x = x.split(" ")[0];
		if(x[0] !== '#') {
			x = '#' + x.substr(0, x.length-3);
		} else {
			x = x.substr(0, x.length-3);
		}
		this.setState(() => ({
			data: { ...this.state.data, hashtag: x }
		}), this.loadPosts);
	}

	onSearch = e => {
		clearTimeout(this.timer);
		this.props.clearPosts();
		this.setState({ 
			data: { ...this.state.data, textquery: e.target.value }
		});
		this.timer = setTimeout(this.loadPosts, 1000);
	}

	render() {
		// const { activeIndex } = this.state;
		const { CountryOptions, StateOptions, CityOptions, CategoryOptions, hashtags } = this.props;
		const { country, state, city, category, textquery } = this.state.data;
		const { isFilterbar, isHashtagbar } = this.state;

		const { posts, varColor, adposts, adpage } = this.props;

		const body = 
			posts.length > 0 ? 
				posts.map((post, i) => {
					!post.hashtags && (post.hashtags = []);
					!post.comments && (post.comments = []);
					!post.comments_count && (post.comments_count = 0);
					if(i%7 === 0 && i !== 0) {
						if(adposts[adpage-1] && adposts[adpage-1].type === "text") {
							return (
								<Post
									key={i} 
									isAdpost={true}
									varColor={varColor} 
									isForAdmin={false}
									getCategoryForFilter={this.getCategoryForFilter}
									post={post}
									showBottomBar={true}
								/>
							)
						} else if(adposts[adpage-1] && adposts[adpage-1].type === "image") {
							return (
								<PostImage
									key={i} 
									isAdpost={true}
									isForAdmin={false}
									varColor={varColor}
									getCategoryForFilter={this.getCategoryForFilter} 
									post={post}
									showBottomBar={true}
								/>)
						} else if(adposts[adpage-1] && adposts[adpage-1].type === "video") {
							return (
								<PostVideo 
									key={i}
									isAdpost={true}
									isForAdmin={false}
									varColor={varColor}
									getCategoryForFilter={this.getCategoryForFilter}
									post={post}
									showBottomBar={true}
								/>
							)
						}
					}
					else if(post.type === "text") {
						return (
							<Post
								key={i} 
								isAdpost={false}
								isForAdmin={false}
								varColor={varColor} 
								post={post}
								showBottomBar={true}
							/>
						)
					} else if(post.type === "image") {
						return (
							<PostImage
								key={i}
								isAdpost={false} 
								isForAdmin={false}
								varColor={varColor} 
								post={post}
								showBottomBar={true}
							/>)
					} else if(post.type === "video") {
						return (
							<PostVideo 
								key={i}
								isAdpost={false}
								isForAdmin={false}
								varColor={varColor} 
								post={post}
								showBottomBar={true}
							/>
						)
					}
					return null;
				}) : (
					<Container textAlign="center">
						<br />
						<Segment>
							{ this.state.loading ?
								<p>Loading...</p>
								:
								<p>No Posts Matched...</p>
							}
						</Segment>
					</Container>
				)

		const bodyContent = (
			<div id="ResultBlock">
				{body}
			</div>
		);

		return (
			<div>
				<br />
				<Container textAlign="center">
					<Grid centered>
						<Grid.Row>
							<Grid.Column textAlign="center" width="10">
								<Input 
									action
									fluid 
									value={textquery}
									placeholder="Search text" 
									onChange={this.onSearch}
								>
									<input />
									<Button 
										icon="search"
										color="brown"
										onClick={this.loadPosts}
									/>
								</Input>
							</Grid.Column>
							<Grid.Column>
									<Form style={{ marginTop: 4, position: "fixed", zIndex: 1 }}>
										<Form.Field inline>
											{ isFilterbar ? (
												<Icon 
													size="large" 
													name="filter"
													color={this.props.varColor} 
													onClick={this.handleFilterBar} 
												/>
											) : (
												<Icon  
													name="filter" 
													onClick={this.handleFilterBar} 
												/>
											)}
										</Form.Field>
									</Form>
							</Grid.Column>
							<Grid.Column>
									<Form style={{ marginTop: 4, position: "fixed", zIndex: 1 }}>
										<Form.Field inline>
											{ isHashtagbar ? (
												<Icon 
													size="large" 
													name="hashtag" 
													color={this.props.varColor}
													onClick={this.handleHashtagBar} 
												/>
											) : (
												<Icon  
													name="hashtag" 
													onClick={this.handleHashtagBar} 
												/>
											)}
										</Form.Field>
									</Form>
							</Grid.Column>
							
						</Grid.Row>
					</Grid>
				</Container>

					
				
		        { isFilterbar && (<Segment>
		         	<Grid>
		         		<Grid.Row columns={2}>
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
									clearable
								/>
							</Grid.Column>
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
									noResultsMessage='Choose country first'
									clearable
								/>
							</Grid.Column>
							<Grid.Column>
								<Dropdown 
									placeholder="City" 
									fluid
									search 
									onChange={this.handleChange}
									value={city}
									name="city"
									selection 
									options={CityOptions}
									noResultsMessage='Choose state first'
									clearable
								/>
							</Grid.Column>
							<Grid.Column>
								<Dropdown 
									placeholder="Category" 
									fluid 
									search
									selection
									onChange={this.handleChange}
									value={category}
									name="category" 
									options={CategoryOptions}
									clearable
								/>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Button fluid onClick={this.loadPosts}>
									<Icon name="search" />
									Search
								</Button>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Segment>
				)}
		        
				{ isHashtagbar && (<Segment>	
					<List>
						{ hashtags.map((h) => (
							<List.Item key={h._id}  as="a">
								<List.Content>
									<List.Header 
										value={h.hashtag} 
										onClick={this.handleHashtagClick}
										name="hashtag"
									>
										<Icon name="hashtag" /> 
										{ h.hashtag[0] !== '#' && h.hashtag } 
										{ h.hashtag[0] === '#' && h.hashtag.substr(1) }
										&nbsp;&nbsp;&nbsp;
										({h.count === 1 ? "Once" : h.count +"times"})
									</List.Header>
								</List.Content>
							</List.Item>	
						))}
					</List>
				</Segment> )}
				       

			    <div>
			    	{ bodyContent }
			    </div>
			</div>
		);
	}
}

SearchForm.propTypes = {
	fetchCountries : PropTypes.func.isRequired,
	fetchStates : PropTypes.func.isRequired,
	fetchCities : PropTypes.func.isRequired,
	clearCities : PropTypes.func.isRequired,
	fetchCategories : PropTypes.func.isRequired,
	fetchTopHashtags : PropTypes.func.isRequired,

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
	CategoryOptions : PropTypes.arrayOf(
	  PropTypes.shape({
	  	key : PropTypes.string.isRequired,
		value : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired  
	  })
	).isRequired,
	hashtags : PropTypes.arrayOf(
	  PropTypes.shape({
	  	hashtag : PropTypes.string.isRequired,
	  	count : PropTypes.number.isRequired
	  })
	).isRequired,
}

function mapStateToProps(state) {
	return {
		CountryOptions: allCountriesSelector(state),
		StateOptions: allStatesSelector(state),
		CityOptions: allCitiesSelector(state),
		CategoryOptions: allCategoriesSelector(state),
		hashtags: allTopHashtagsSelector(state),
		posts: allPostsSelector(state),
		adposts: adpostsSelector(state),
		adper: state.adpostsother.per,
		adpage: state.adpostsother.page,
		adtotalpages: state.adpostsother.totalPages
	};
}

export default connect(
	mapStateToProps, 
	{ 
		fetchCountries, 
		fetchStates, 
		fetchCities, 
		clearCities, 
		fetchCategories, 
		fetchTopHashtags,
		fetchPostsBySearchFilter, 
		clearPosts,
		fetchAdPosts,
		changePage,
		changePer,
		changeTotalPages
	}
)(SearchForm);