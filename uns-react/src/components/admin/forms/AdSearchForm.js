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
	Button,
	Confirm
} from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchCountries, fetchStates, fetchCities, clearCities } from "../../../actions/locations";
import { fetchCategories, fetchTopHashtags } from "../../../actions/others";
import { fetchPostsBySearchFilter, clearPosts, deletePost } from "../../../actions/posts"; 
import { allCountriesSelector, allStatesSelector, allCitiesSelector } from "../../../reducers/locations";
import { allCategoriesSelector, allTopHashtagsSelector } from "../../../reducers/others";
import { allPostsSelector } from "../../../reducers/posts";

import Post from "../../elements/Post";
import PostVideo from "../../elements/PostVideo";
import PostImage from "../../elements/PostImage";

class AdSearchForm extends Component {
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
		loading: false,
		fireComponent: false,
		open: false,
		tempvalue: "" 			// to delete
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

		this.setState({ isFilterbar: false, isHashtagbar: false, loading: true });
		this.props.clearPosts();
		this.props
			.fetchPostsBySearchFilter("Loved", per, page, country, state, city, hashtag, category, textquery)
			.then(totalPages => {
				this.setState({
					scrolling: false,
					totalPages,
					loading: false,
					data: { ...this.state.data, hashtag: "" }
				});
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

	onDeletePost = e => {
		e.preventDefault();
		const id = e.target.value;
		this.setState({ tempvalue: id, fireComponent: true, open: true });
	}

	handleDialogConfirm = () => {
		this.setState({ result: 'confirmed', open: false });
		const id = this.state.tempvalue;
		this.props.deletePost(id)
			.then(success => {
				if(success) alert(`Post successfully deleted!`);
				else alert(`Something went wrong. Post not deleted!`);
			}).catch(err => {
				alert(`Something went wrong. Post not deleted! with error: `, err);
			});
	}

	handleDialogCancel = () => {
		this.setState({ result: 'cancelled', open: false });
	}


	render() {
		// const { activeIndex } = this.state;
		const { CountryOptions, StateOptions, CityOptions, CategoryOptions, hashtags } = this.props;
		const { country, state, city, category, textquery } = this.state.data;
		const { isFilterbar, isHashtagbar, fireComponent } = this.state;

		const { posts } = this.props;

		const body = 
			posts.length > 0 ? 
				posts.map((post, i) => {
					!post.hashtags && (post.hashtags = []);
					!post.comments && (post.comments = []);
					!post.comments_count && (post.comments_count = 0);
					if(post.type === "text") {
						return (
							<div key={i}>
								<Post
									isAdpost={false}
									varColor="teal" 
									isForAdmin={true}
									post={post}
									showBottomBar={false}
									getCategoryForFilter={() => {}}
								/>
								<Button 
									style={{ marginBottom: 20 }}
					        		value={post._id}
					        		content="Delete"
					        		fluid 
					        		icon="trash" 
					        		negative 
					        		onClick={this.onDeletePost} 
					        	/>
							</div>
						)
					} else if(post.type === "image") {
						return (
							<div key={i}>
								<PostImage
									isAdpost={false} 
									varColor="teal"
									isForAdmin={true} 
									post={post}
									showBottomBar={false}
									getCategoryForFilter={() => {}}
								/>
								<Button 
									style={{ marginBottom: 20 }}
					        		value={post._id}
					        		content="Delete"
					        		fluid 
					        		icon="trash" 
					        		negative 
					        		onClick={this.onDeletePost} 
					        	/>
				        	</div>
						)
					} else if(post.type === "video") {
						return (
							<div key={i}>
								<PostVideo 
									isAdpost={false}
									isForAdmin={true}
									varColor="teal" 
									post={post}
									showBottomBar={false}
									getCategoryForFilter={() => {}}
								/>
								<Button 
									style={{ marginBottom: 20 }}
					        		value={post._id}
					        		content="Delete"
					        		fluid 
					        		icon="trash" 
					        		negative 
					        		onClick={this.onDeletePost} 
					        	/>
				        	</div>
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
			<div id="ResultBlock" style={{ marginTop: 25 }}>
				{body}
			</div>
		);

		return (
			<div>
				{ fireComponent && (
					<Confirm
						open={this.state.open}
						content="Are you sure to delete this post?"
						onCancel={this.handleDialogCancel}
						onConfirm={this.handleDialogConfirm}
					/>
				)}
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

					
				{/* <Accordion 
					exclusive={false} 
					as={Menu} 
					vertical 
					fluid
				>
					<Menu.Item>
						<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccClick}>
							<Icon name='dropdown' />
							Filters
				        </Accordion.Title>
				        <Accordion.Content active={activeIndex === 0}> */}
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
							{/*	<Grid.Row>
									<Grid.Column>
										{/*<Tab panes={TrendHashtagsTab} />}

									</Grid.Column>
								</Grid.Row> */}
							</Grid>
						</Segment>
						)}
				        {/* </Accordion.Content>
			        </Menu.Item> */}

			        {/* <Menu.Item>
				        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccClick}>
							<Icon name='dropdown' />
							Popular Hashtags
				        </Accordion.Title>
				        <Accordion.Content active={activeIndex === 1}> */}
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
				       {/*} </Accordion.Content>
			        </Menu.Item>
			    </Accordion> */}

			    <div>
			    	{ bodyContent }
			    </div>
			</div>
		);
	}
}

AdSearchForm.propTypes = {
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
		posts: allPostsSelector(state)
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
		deletePost
	}
)(AdSearchForm);