import React from "react";
import { connect } from "react-redux";
import { Table, Icon, Accordion, Button, Confirm, Container, Segment, Dropdown } from "semantic-ui-react";

import AdMainPage from "./AdMainPage";
import MainPage from "../../pages/MainPage";
import Post from "../../elements/Post";
import PostVideo from "../../elements/PostVideo";
import PostImage from "../../elements/PostImage";

import { fetchReportedPostsByFilter, clearPosts, deletePost } from "../../../actions/posts";
import { allPostsSelector } from "../../../reducers/posts";

class AdReportedPostsPage extends React.Component {
	 _isMounted = false;
	state = {  
		filter: "Loved", 
		varColor: "red",
		category: "all",
		per: 8,
		page: 1,
		totalPages: null,
		scrolling: false,
		activeIndex: -1,
		fireComponent: false,
		open: false,
		tempvalue: "", 			// to delete
		repcategory: "Cyber Bullying",
		options: [
			{key: 1, text: "Cyber Bullying", value: "Cyber Bullying"},
			{key: 2, text: "Hate Speech", value: "Hate Speech"},
			{key: 3, text: "Racism", value: "Racism"},
			{key: 4, text: "Offensive words", value: "Offensive words"},
			{key: 5, text: "Spam", value: "Spam"},
			{key: 6, text: "Nudity / Pornography", value: "Nudity / Pornography"},
			{key: 7, text: "False Information", value: "False Information"},
			{key: 8, text: "Terrorism", value: "Terrorism"}
		],
		loading: false
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

	componentDidUpdate = (prevProps, prevState) => {
		if(this.state.repcategory !== prevState.repcategory) {
			this.props.clearPosts();
			this.loadPosts(1);
		}	
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
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
		const { per, repcategory } = this.state;

		let { page } = this.state;
		if(number) {
			page = number;
			this.setState({ page: number });
		}

		this.setState({ loading: true });
		this.props.clearPosts();
		this.props
			.fetchReportedPostsByFilter(per, page, repcategory)
			.then(totalPages => {
				this._isMounted && this.setState({
					scrolling: false,
					totalPages,
					loading: false
				});
			});	
	}

	getBetterPost = post => {
		return Object.keys(post).map((s, i) => (
			<Table.Row key={i}>
				<Table.Cell collapsing> {s} </Table.Cell>
				<Table.Cell> {JSON.stringify(post[s])} </Table.Cell>
			</Table.Row>
		));
	}

	handleClick = (e, titleProps) => {
		const { index } = titleProps
		const { activeIndex } = this.state
		const newIndex = activeIndex === index ? -1 : index

		this.setState({ activeIndex: newIndex })
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

	detailsPost = (activeIndex, i, post) => (
		<Accordion styled>
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
							<Table.HeaderCell colSpan='3'>
								{post.type === "text" && ("Text Post")}
								{post.type === "image" && ("Image Post")}
								{post.type === "video" && ("Video Post")}
							</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{this.getBetterPost(post)}
					</Table.Body>
				</Table>
	        </Accordion.Content>
	    </Accordion>
	);

	render() {
		const { posts } = this.props;
		const { activeIndex, fireComponent, repcategory, options } = this.state;

		const body = 
			posts.length > 0 ?
				posts.map((post, i) => {
					!post.hashtags && (post.hashtags = [] );
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
								{this.detailsPost(activeIndex, i, post)}
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
								{this.detailsPost(activeIndex, i, post)}
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
								{this.detailsPost(activeIndex, i, post)}
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
								<p>No Posts</p>
							}
						</Segment>
					</Container>
				)
			
		// console.log(body);

		const bodyContent = (
			<div id="ResultBlock" style={{ marginTop: 15 }}>
				{body}
			</div>
		);

		return (
			<AdMainPage>
				{ fireComponent && (
					<Confirm
						open={this.state.open}
						content="Are you sure to delete this post?"
						onCancel={this.handleDialogCancel}
						onConfirm={this.handleDialogConfirm}
					/>
				)}
				<h2>Reported Posts</h2>
				<MainPage 
					pathname={this.props.location.pathname}
					handleFilter={() => {}}	// These are not required for this page but for Main Page
					filter={"love"}		// These are not required for this page but for Main Page
					showTopBar={false}
					showBottomBar={false}
					showTopIcons={false}
				>
					<br />
					<Dropdown 
						options={options}
						value={repcategory}
						selection
						fluid
						name="repcategory"
						placeholder="Select Category"
						scrolling
						onChange={this.handleChange}
					/>
					{bodyContent}
				</MainPage>
			</AdMainPage>
		);
	}
};

function mapStateToProps(state) {
	return {
		posts: allPostsSelector(state)
	}
}

export default connect( 
	mapStateToProps, 
	{
		fetchReportedPostsByFilter,
		deletePost,
		clearPosts
	}
)(AdReportedPostsPage);
