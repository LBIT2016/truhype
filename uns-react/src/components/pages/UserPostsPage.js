import React, { Component } from 'react';
import PropTypes from "prop-types";
import { 
	Grid, 
	Container, 
	Button,
	Card,
	Image,
	Divider,
	Icon, 
	Header,
	Segment,
	Confirm
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { getPosts } from "../../actions/users";
import { clearPosts } from "../../actions/posts";
import { allPostsSelector } from "../../reducers/posts";

import api from "../../api";
import SuccessMessage from "../messages/SuccessMessage";
import logobrand from "../../media/logofavicon.ico";
// import image_ from "../../media/statue.jpg";
import videoplaceholder_ from "../../media/video-placeholder.png";

class UserPostsPage extends Component {
	_isMounted = false;
	state = {
		per: 9,
		page: 1,
		totalPages: null,
		scrolling: false,
		success: false,
		fireComponent: false,
		open: false
	}

	componentWillMount = () => {
		this.props.clearPosts();
		this.loadPosts();
	}

	componentDidMount = () => {
		this._isMounted = true;
		window.addEventListener('scroll', e => {
			this.handleScroll(e);
		})
	}

	componentWillUnmount = () => {
		this._isMounted = false;
		window.removeEventListener('scroll', e => {
			this.handleScroll(e);
		});	
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
		 this._isMounted && this.setState(prevState => ({
			page: prevState.page+1,
			scrolling: true
		}), this.loadPosts);
	}

	loadPosts = (number) => {
		const { per } = this.state;
		let { page } = this.state;
		if(number) page = number;
		this.props
			.getPosts(per, page)
			.then(totalPages => {
				this._isMounted && this.setState({
					scrolling: false,
					totalPages
				});
			});	
	}

	onDelete = e => {
		if(this.props.posts.length === 0) {
			alert(`There are no posts to delete.`);
			return;
		}

		e.preventDefault();
		this.setState({ fireComponent: true, open: true });
	}

	handleDialogConfirm = () => {
		this.setState({ result: 'confirmed', open: false });
		api.user.deletePosts()
			.then(success => {
				if(success) {
					this.props.clearPosts();
					this.loadPosts(1);
					this.setState({ success: true });
				} else  {
					alert(`something went wrong. Please try again after sometime.`);
				}
			})
	}

	handleDialogCancel = () => {
		this.setState({ result: 'cancelled', open: false });
	}

	render() {
		const { sessionId, posts } = this.props;
		const { success, fireComponent } = this.state;

		const body = 
			posts.length > 0 &&
				posts.map(post => {
					post.hashtags = [];
					if(post.type === "text") {
						const cardColor = post.cardColor;
						return (
							<Card
								key={post._id} 
								link 
								as={Link} 
								to={`/textpost/${post._id}`}
								color="black" 
								style={{ 
									height: "120px", 
									textAlign: "center",
									color: "black"
								}}
							>
								<div style={{
									position: "relative",
								    margin: "auto",
								    top: 0,
								    left: 0,
								    right: 0,
								    bottom: 0,
								    backgroundColor: `${cardColor}`
								}}>
									{post.text.slice(0, 75)}{post.text.length > 75 && "..."}
								</div>
								<Card.Description>
									<Header as="h6">{post.title.slice(0, 12)}{post.title.length > 12 && "..."}</Header>
								</Card.Description>
							</Card>
							
						)
					} else if(post.type === "image") {
						return (
							<Card 
								key={post._id}
								link
								as={Link}
								to={`/imagepost/${post._id}`}
								color="black"
								style={{ 
									/*height: "150px",*/
									paddinTop: "56.25%", 
									textAlign: "center",
									color: "black" 
								}}
							>
								<div 
									style={{
										position: "relative",
									    margin: "auto",
									    top: 0,
									    left: 0,
									    right: 0,
									    bottom: 0
									}}
								>
									<Image rounded size="small" src={post.images[0]} />
									<Card.Description>
										<p>{post.images.length} {post.images.length > 1 ? " images" : "image"}</p>
									</Card.Description>
									<Card.Description>
									<Header as="h6">{post.title.slice(0, 12)}{post.title.length > 12 && "..."}</Header>
								</Card.Description>
								</div>
							</Card>
						)
					} else if(post.type === "video") {
						return (
							<Card 
								key={post._id}
								link
								as={Link}
								to={`/videopost/${post._id}`}
								color="black"
								style={{ 
									/*height: "120px", */
									paddinTop: "56.25%",
									textAlign: "center",
									color: "black"
								}}
							>
								<div style={{
									position: "relative",
								    margin: "auto",
								    top: 0,
								    left: 0,
								    right: 0,
								    bottom: 0
								}}>
									<Image size="tiny" src={videoplaceholder_} />
									<Card.Description>
										<p>{post.videos.length} {post.videos.length > 1 ? " videos" : "video"}</p>
									</Card.Description>
									<Card.Description>
										<Header as="h6">{post.title.slice(0, 12)}{post.title.length > 12 && "..."}</Header>
									</Card.Description>
								</div>
							</Card>
						)
					}
					return null;
				})

		return (
			<div style={{ backgroundColor: "#f9f9f9", minHeight: window.innerHeight, padding: "15px" }}>
				{ fireComponent && (
					<Confirm
						open={this.state.open}
						content="Are you sure to delete these posts?"
						onCancel={this.handleDialogCancel}
						onConfirm={this.handleDialogConfirm}
					/>
				)}
				<Grid centered>
					<Grid.Row columns={3} style={{ marginTop: "5px" }}>
						<Grid.Column>
							<Container align="left" as={Link} to="/">
								<Button size="medium" icon="angle left" color="grey" />
							</Container>
						</Grid.Column>
						<Grid.Column>
							<Container align="middle" style={{ marginTop: "5px" }}>
								<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
									<Image size="mini" src={logobrand} />
								</a>
							</Container>
						</Grid.Column>
						<Grid.Column />
					</Grid.Row>

					<Grid.Row columns={2} style={{ marginTop: "15px" }}>
						<Grid.Column>
							<Container align="left">
								<h3>Session Id</h3>
								#{sessionId}
							</Container>
						</Grid.Column>
						<Grid.Column>
							<Container align="right">
								<Button color="grey" onClick={this.onDelete} content="Delete All" />
							</Container>
						</Grid.Column>
					</Grid.Row>

					<Divider horizontal>
						<Header as="h4">
							<Icon name="newspaper" /> Posts 
						</Header>
					</Divider>
				</Grid>

				{/* Posts as cards */}
				<Card.Group itemsPerRow={3}>
					{body}
				</Card.Group>
				{ success && (
					<Container textAlign="center"  style={{ marginTop: 50 }}>
						<SuccessMessage text="Posts successfully deleted !" />
					</Container>
				)}
				{ posts.length === 0 && (
					<Segment style={{ marginTop: 50 }}>
						<Container textAlign="center">
							<p>No posts.</p>
						</Container>
					</Segment>
				)}
			</div>
		);
	}
}

UserPostsPage.propTypes = {
	sessionId : PropTypes.string.isRequired
}

function mapStateToProps(state) {
	return {
		posts: allPostsSelector(state),
		sessionId: state.user.sessionId
	}
}

export default connect(mapStateToProps, { getPosts, clearPosts })(UserPostsPage);