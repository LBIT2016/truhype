import React, { Component } from 'react';
import { 
	Grid, 
	Container, 
	Button, 
	Image,
	Segment
} from "semantic-ui-react";
// import {Link} from "react-router-dom";
import { connect } from "react-redux";

import PostImage from "./PostImage";
import logobrand from "../../media/logofavicon.ico";
import FailureMessage from "../messages/FailureMessage";

import { fetchPostById } from "../../actions/posts";
import { allPostsSelector } from "../../reducers/posts";
import { fetchAdPostById } from "../../actions/adposts";
import { adpostsSelector } from "../../reducers/adposts";

class PostImageFull extends Component { 
	state = {
		isPostFound: false,
		isAdpost: false,
		loading: true
	}

	componentDidMount = () => {
		this.setState({ loading: true });
		this.props
			.fetchPostById(this.props.id)
			.then(success => {
				if(!success) {
					this.props
						.fetchAdPostById(this.props.id)
						.then(success => {
							if(!success) {
								this.setState({ isPostFound: false, loading: false });
							} else {
								this.setState({ isPostFound: true, isAdpost: true, loading: false });
							}
						})
				} else {
					this.setState({ isPostFound: true, loading: false });
				}
			});
	}

	render() {
		const { isPostFound, isAdpost, loading } = this.state;
		let npost = this.props.posts[0];
		const adpost = this.props.adposts[0];
		let post;
		if(npost) {
			post = npost
		} else {
			post = adpost;
		}

		if(post === undefined) {
			post = {
				category: "", 
				location_city: "",
				location_state: "",
				location_country: "",
				title: "",
				images: [],
				hashtags: [],
				upvotes_count: 0, 
				downvotes_count: 0,
				comments_count: 0,
				comments: []
			};
		}

		return (
			<div style={{ backgroundColor: "#f9f9f9", minHeight: window.innerHeight, padding: "15px" }}>
				<Grid centered>
					<Grid.Row columns={3} style={{ marginTop: "5px" }}>
						<Grid.Column>
							<Container align="left" onClick={() => this.props.history.push("/")}>
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

					<Grid.Row>
						<Grid.Column style={{ paddingLeft: "0.2rem", paddingRight: "0.2rem" }}>
							{ loading ? (
								<Segment textAlign="center">
									<p>loading...</p>
								</Segment>
							) : (
								isPostFound ? (
									<PostImage
										isAdpost={isAdpost}
										post={post} 
										showBottomBar={true}
									/>
								) : (
									<FailureMessage text="Post not found / Post get expired" />
								)
							)}
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		posts: allPostsSelector(state),
		adposts: adpostsSelector(state)
	}
}

export default connect(mapStateToProps, { fetchPostById, fetchAdPostById })(PostImageFull);