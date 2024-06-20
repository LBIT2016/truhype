import React, { Component } from 'react';
import { Comment, Icon } from "semantic-ui-react";

import axios from "axios";

class DefinedComment extends Component {
	_isMounted = false;
	state = {
		comment: {
			_id: "",
			upvotes_count: "",
			downvotes_count: "",
			text: "",
			postId: "",
			posted: ""
		},
		upvotes_count: 0,
		downvotes_count: 0,
		hasupvoted: false,
		hasdownvoted: false
	} 

	componentDidMount = () => {
		this._isMounted = true;	

		if(this.props.comment) {
			const { _id } = this.props.comment;
			this._isMounted && this.setState({ 
				comment: this.props.comment
			});

			axios.post("/api/comments/hasupvoted", {	// Checking whether user hasupvoted
				commId: _id
			}).then(res => {
				if(res.data.upvoted) {
					this._isMounted && this.setState({ hasupvoted: true });
				}
			});

			axios.post("/api/comments/hasdownvoted", {	// Checking whether user hasdownvoted
				commId: _id
			}).then(res => {
				if(res.data.downvoted) {
					this._isMounted && this.setState({ hasdownvoted: true });
				}
			});
		}
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevProps.comment !== this.props.comment) {
			this._isMounted && this.setState({
				comment: this.props.comment
			});	

			const { _id } = this.props.comment;
			axios.post("/api/comments/hasupvoted", {	// Checking whether user hasupvoted
				commId: _id
			}).then(res => {
				if(res.data.upvoted) {
					this._isMounted && this.setState({ hasupvoted: true });
				}
			});

			axios.post("/api/comments/hasdownvoted", {	// Checking whether user hasdownvoted
				commId: _id
			}).then(res => {
				if(res.data.downvoted) {
					this._isMounted && this.setState({ hasdownvoted: true });
				}
			});
		}
	}

	getVotesfun = () => {
		const { _id } = this.state.comment;

		axios.post("/api/comments/getCommentVotes", { commId: _id })	
			.then(res => {
				if(res.data.success) {
					this._isMounted && 
					this.setState({
						comment: { 
							...this.state.comment, 
							upvotes_count: res.data.upvotes_count, 
							downvotes_count: res.data.downvotes_count
						}
					});
				}
			});
	}

	handleUpvote = e => {
		/* this._isMounted && this.setState({
			hasupvoted: !this.state.hasupvoted
		}); */
		e.preventDefault();

		const { hasupvoted, hasdownvoted } = this.state;
		const { _id } = this.state.comment;

		if(!hasupvoted) {
			axios.post("/api/comments/upvote", {
				commId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasupvoted: true });
					this.getVotesfun();
				}
			});

			if(hasdownvoted) {
				axios.post("/api/comments/removedownvote", {	// remove downvote
					commId: _id
				}).then(res => {
					if(res.data.success) {
						this._isMounted && this.setState({ hasdownvoted: false });
						this.getVotesfun();
					}
				});
			}
		} else {
			axios.post("/api/comments/removeupvote", {
				commId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasupvoted: false });
					this.getVotesfun();
				}
			});
		}
	}

	handleDownvote = e => {
		/* this._isMounted && this.setState({
			hasdownvoted: !this.state.hasdownvoted
		}); */

		e.preventDefault();
		const { hasdownvoted, hasupvoted } = this.state;
		const { _id } = this.state.comment;

		if(!hasdownvoted) {
			axios.post("/api/comments/downvote", {
				commId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasdownvoted: true });
					this.getVotesfun();
				}
			});

			if(hasupvoted) {
				axios.post("/api/comments/removeupvote", {		// remove upvote
					commId: _id
				}).then(res => {
					if(res.data.success) {
						this._isMounted && this.setState({ hasupvoted: false });
						this.getVotesfun();
					}
				});
			}
		} else {
			axios.post("/api/comments/removedownvote", {
				commId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasdownvoted: false });
					this.getVotesfun();
				}
			});
		}
	}

	render() {
		const { varColor, index } = this.props;
		const { hasupvoted, hasdownvoted, comment } = this.state;

		return (
			<div>
				<Comment>
	                <Comment.Content>
	                    <Comment.Author style={{ color: varColor}} as='a'> TruView{(index)+1} </Comment.Author>
	                    <Comment.Metadata>
	                    	<span> {this.props.getBetterDate(comment.posted)}{/* 02-04-2019*/}</span>
	                    </Comment.Metadata>
	                    <Comment.Text> {comment.text}{/*"Some Random content"*/}</Comment.Text>
	                    <Comment.Actions style={{ color: "black" }}>
	                  		{ hasupvoted ? (
	                  			<span>
		                  			<Icon
		                  				color="red"
			                  			size="large"
			                  			onClick={this.handleUpvote} 
			                  			name="arrow alternate circle up outline" 
			                  		/> {comment.upvotes_count}
		                  		</span>
	                  		) : (
	                  			<span>
		                  			<Icon
			                  			onClick={this.handleUpvote} 
			                  			name="arrow alternate circle up outline" 
			                  		/> {comment.upvotes_count}
	                  			</span>
	                  		)}
	                  		&nbsp;&nbsp;&nbsp;&nbsp;
	                  		{ hasdownvoted ? (
	                  			<span>
		                  			<Icon 
		                  				size="large"
		                  				color="grey"
			                  			onClick={this.handleDownvote}
			                  			name="arrow alternate circle down outline" 
			                  		/> {comment.downvotes_count}
	                  			</span>
	                  		) : (
	                  			<span>
		                  			<Icon 
			                  			onClick={this.handleDownvote}
			                  			name="arrow alternate circle down outline" 
			                  		/> {comment.downvotes_count}
	                  			</span>
	                  		)}
	                    </Comment.Actions>
	                </Comment.Content>
                </Comment>
			</div>
		);
	}
}

export default DefinedComment;
