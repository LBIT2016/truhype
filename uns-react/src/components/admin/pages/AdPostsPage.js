import React, { Component } from 'react';
import { connect } from "react-redux";
import { Segment, Button, Container, Accordion, Table, Icon } from "semantic-ui-react";

import { fetchAdPostsForAdmin, clearAdPosts, deleteAdPost } from "../../../actions/adposts";
import { adpostsSelector } from "../../../reducers/adposts";

import Post from "../../elements/Post";
import PostImage from "../../elements/PostImage";
import PostVideo from "../../elements/PostVideo";
import AdMainPage from "./AdMainPage";

class AdPostsPage extends Component {
	state = {
		per: 8,
		page: 1,
		totalPages: null,
		scrolling: false,
		loading: false,
		activeIndex: -1
	}

	componentWillMount = () => {
		this.loadPosts();
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

		this.setState({ isFilterbar: false, isHashtagbar: false, loading: true });
		this.props.clearAdPosts();
		this.props
			.fetchAdPostsForAdmin(per, page)
			.then(totalPages => {
				this.setState({
					scrolling: false,
					totalPages,
					loading: false
				});
			});	
	}

	onDeletePost = e => {
		e.preventDefault();
		const id = e.target.value;
		this.props.deleteAdPost(id)
			.then(success => {
				if(success) alert(`Post successfully deleted!`);
				else alert(`Something went wrong. Post not deleted!`);
			}).catch(err => {
				alert(`Something went wrong. Post not deleted! with error: `, err);
			});
	}

	handleClick = (e, titleProps) => {
		const { index } = titleProps
		const { activeIndex } = this.state
		const newIndex = activeIndex === index ? -1 : index

		this.setState({ activeIndex: newIndex })
	}

	getBetterPost = post => {
		return Object.keys(post).map((s, i) => (
			<Table.Row key={i}>
				<Table.Cell collapsing> {s} </Table.Cell>
				<Table.Cell> {JSON.stringify(post[s])} </Table.Cell>
			</Table.Row>
		));
	}

	render() {
		const { posts } = this.props;
		const { activeIndex } = this.state;

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
									isAdpost={true}
									varColor={"teal"} 
									isForAdmin={true}
									post={post}
									showBottomBar={false}
								/>
								<Accordion styled style={{ marginBottom: 20 }}>
							        <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
								        <Icon name='dropdown' />
								        Reports: {post['reports_count']}
								    </Accordion.Title>
							        <Accordion.Content active={activeIndex === i}>
							        	<Button 
							        		value={post._id}
							        		content="Delete"
							        		fluid 
							        		icon="trash" 
							        		negative 
							        		onClick={this.onDeletePost} 
							        	/>
							        	<Table celled striped>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell colSpan='3'>Text Post</Table.HeaderCell>
												</Table.Row>
											</Table.Header>

											<Table.Body>
												{this.getBetterPost(post)}
											</Table.Body>
										</Table>
							        </Accordion.Content>
							    </Accordion>
							</div>
						)
					} else if(post.type === "image") {
						return (
							<div key={i}>
								<PostImage
									isAdpost={true} 
									varColor={"teal"} 
									isForAdmin={true}
									post={post}
									showBottomBar={false}
								/>
								<Accordion styled style={{ marginBottom: 20 }}>
							        <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
								        <Icon name='dropdown' />
								        Reports: {post['reports_count']}
								    </Accordion.Title>
							        <Accordion.Content active={activeIndex === i}>
							        	<Button 
							        		value={post._id}
							        		content="Delete"
							        		fluid 
							        		icon="trash" 
							        		negative 
							        		onClick={this.onDeletePost} 
							        	/>
							        	<Table celled striped>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell colSpan='3'>Image Post</Table.HeaderCell>
												</Table.Row>
											</Table.Header>

											<Table.Body>
												{this.getBetterPost(post)}
											</Table.Body>
										</Table>
							        </Accordion.Content>
							    </Accordion>
				        	</div>
						)
					} else if(post.type === "video") {
						return (
							<div key={i}>
								<PostVideo 
									isAdpost={true}
									isForAdmin={true}
									varColor={"teal"} 
									post={post}
									showBottomBar={false}
								/>
								<Accordion styled style={{ marginBottom: 20 }}>
							        <Accordion.Title active={activeIndex === i} index={i} onClick={this.handleClick}>
								        <Icon name='dropdown' />
								        Reports: {post['reports_count']}
								    </Accordion.Title>
							        <Accordion.Content active={activeIndex === i}>
							        	<Button 
							        		value={post._id}
							        		content="Delete"
							        		fluid 
							        		icon="trash" 
							        		negative 
							        		onClick={this.onDeletePost} 
							        	/>
							        	<Table celled striped>
											<Table.Header>
												<Table.Row>
													<Table.HeaderCell colSpan='3'>Video Post</Table.HeaderCell>
												</Table.Row>
											</Table.Header>

											<Table.Body>
												{this.getBetterPost(post)}
											</Table.Body>
										</Table>
							        </Accordion.Content>
							    </Accordion>
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
								<p>No Posts...</p>
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
			<AdMainPage>
				<h1>AdPostsPage</h1>
				{bodyContent}
			</AdMainPage>
		);
	}
}

function mapStateToProps(state) {
	return {
		posts: adpostsSelector(state)
	};
}

export default connect(mapStateToProps, { fetchAdPostsForAdmin, clearAdPosts, deleteAdPost })(AdPostsPage);