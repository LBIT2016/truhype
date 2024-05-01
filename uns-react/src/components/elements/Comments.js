import React, { Component } from 'react';
import { 
	Segment, 
	Form,
	Comment,
	TextArea,
	Button,
	Container,
	// Icon
} from "semantic-ui-react";

import DefinedComment from "./DefinedComment";
import api from "../../api";

class Comments extends Component {
	_isMounted = false;
	state = {
		postId: "",
		comment: "",
		comments: [],
		per: 10,
		page: 1,
		totalPages: null,
		// scrolling: false,
		loading: false
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevProps.postId !== this.props.postId) {
			if(this.props.postId) {
				this._isMounted && this.setState({ postId: this.props.postId });
				this.loadComments();
			}
		}
	}

	onChange = (e, { value }) => {
		this.setState({ comment: value });
	}

	onCommentSubmit = () => {
		const { postId, comment } = this.state;
		const { isAdpost } = this.props;

		if(isAdpost) {
			api.adposts.insertComment(postId, comment)
				.then(comment => {
					if(comment) {
						/*this._isMounted && 
						this.setState({ 
							comment: "",
							comments: [comment, ...this.state.comments] 
						});*/
						this.loadComments(1);
					}
				}).catch(err => {
					alert(err);
				});

			api.adposts.getCommentsCount(postId)
				.then(data => {
					this.props.getCommCount(data.comments_count);
				});
		} else {
			api.posts.insertComment(postId, comment)
				.then(comment => {
					if(comment) {
						this._isMounted && 
						this.setState({ 
							comment: "",
							comments: [...this.state.comments, comment] 
						});
					}
				}).catch(err => {
					alert(err);
				});

			api.posts.getCommentsCount(postId)
				.then(data => {
					this.props.getCommCount(data.comments_count);
				});
		}
	}

	getBetterDate = dateString => {
		let d = new Date(dateString);
		let datenow = new Date();

		let diffTime = Math.abs(datenow.getTime() - d.getTime());
		let diffDays = Math.round(diffTime / (1000 * 3600 * 24));
		
		if(diffDays >= 1) {
			if(diffDays > 1)
				return (diffDays + " days ago");
			else
				return (diffDays + " day ago");
		} else {
			let diffSec = Math.round(diffTime / 1000);
			let diffMin = Math.round(diffSec / 60);
			let diffHour = Math.round(diffMin / 60);

			if(diffHour > 1) {
				return (diffHour + " hours ago"); 
			} else if(diffHour === 1) {
				return (diffHour + " hour ago");
			} else if(diffMin > 1) {
				return (diffMin + " minutes ago");
			} else if(diffMin === 1) {
				return (diffMin + " minute ago");
			} else if(diffSec > 1) {
				return (diffSec + " seconds ago");
			} else if(diffSec > 0) {
				return (diffSec + " second ago");
			} else {
				return "";
			}
		}
	}

	loadMore = () => {
		this._isMounted && this.setState(prevState => ({
			page: prevState.page+1,
		}), this.loadComments);
	}

	loadComments = number => {
		const { per } = this.state;
		let { page } = this.state;
		const { postId } = this.props;

		if(number) {
			page = number;
			this.setState({ page: number });
		}

		api.posts.getAllComments(postId, per, page)
			.then(comments => {
				let cdocs = comments;
				let totalPages = cdocs.totalPages;

				this._isMounted && 
				this.setState({ 
					comments: [ ...this.state.comments, ...comments.docs],
					totalPages 
				});
			}).catch(err => {
				alert(err);
			});
	}

	handleLoadMoreButton = e => {
		e.preventDefault();
		const { totalPages, page } = this.state;
		if(totalPages <= page) return;
		this.loadMore();
	}

	render() {
		const { varColor, collapsed } = this.props;
		const { comments, comment, totalPages, page } = this.state;

		// console.log(comments);

		return (
			<div>
				<Comment.Group collapsed={collapsed} style={{ marginTop: "0px" }}>
					<Segment inverted color="brown">
						<Form>
							<TextArea 
								placeholder="Comment here..." 
								style={{ minHeight: 50 }} 
								value={comment}
								onChange={this.onChange}
							/>
							<Button 
								size="tiny" 
								color={varColor} 
								style={{ marginTop: "3px" }}
								content="Add"
								onClick={this.onCommentSubmit}
							/>
						</Form>
						<Container style={{ marginTop: 8 }}>
							{comments.length > 0 && comments.map((comment, index) => (
								<div key={index} style={{ marginTop: 10 }}>
									<DefinedComment
										index={index}
										comment={comment}
										varColor={varColor}
										getBetterDate={this.getBetterDate}
									/>
				                </div>
				            ))} 
			            </Container>  
		                <div style={{ marginTop: "5px" }}>
			                <center>
			                	{ comments.length === 0 ? (
			                		<p style={{ color: "black" }}>No Comments yet</p>
			                	) : (
			                		totalPages === page ? (
				                		<div>
				                			<p>Comments reached to end</p>
				                			<hr />
				                		</div>
				                	) : (
				                		<p style={{ color: `${varColor}` }} onClick={this.handleLoadMoreButton}>
					                		Load More Comments
					                	</p>
				                	)
			                	)}
			                </center>
		                </div>
	                </Segment>
				</Comment.Group>
			</div>
		);
	}
}

export default Comments;