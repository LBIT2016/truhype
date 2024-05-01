import React from "react";
import { 
	Segment, 
	Grid, 
	Header, 
	Button, 
	Container, 
	Card, 
	Icon,
	Responsive,
	Visibility,
	Transition
} from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as loadImage from "blueimp-load-image";
import axios from "axios";

// import Fullscreen from "react-full-screen";
import Hashtag from "../messages/Hashtag";
import { updatePostsSeen } from "../../actions/users";

import MultipleImageSlider from "./MultipleImageSlider";
import Comments from "./Comments";	
import ShareLink from "../modals/ShareLink";
import Report from "../modals/Report";

class PostImage extends React.Component {
	_isMounted = false;
	state = {
		collapsed: true,
		isFull: false,
		tempimgs: [],
		post: {
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
		},
		hasupvoted: false,
		hasdownvoted: false
	}

	componentDidMount = () => {		// this works when postImage preview.
		this._isMounted = true;
		this.setState({ post: {} });
		if(this.props.post && this.props.post.images) {
			this.setState({ post: this.props.post });

			this.props.post.images.map(image => {
				loadImage(image, this.callbackFun, {orientation: true});
				return null;
			});

			const { _id } = this.props.post;
			const { isAdpost } = this.props;

			const apiHasUpvotedUrl = isAdpost ? "/api/adposts/hasupvoted" : "/api/posts/hasupvoted";
			const apiHasDownvotedUrl = isAdpost ? "/api/adposts/hasdownvoted" : "/api/posts/hasdownvoted";

			const { showBottomBar } = this.props;

			if(_id && _id !== "" && showBottomBar) {
				axios.post(apiHasUpvotedUrl, {	// Checking whether user hasupvoted
					postId: _id
				}).then(res => {
					if(res.data.upvoted) {
						this._isMounted && this.setState({ hasupvoted: true });
					}
				});

				axios.post(apiHasDownvotedUrl, {	// Checking whether user hasdownvoted
					postId: _id
				}).then(res => {
					if(res.data.downvoted) {
						this._isMounted && this.setState({ hasdownvoted: true });
					}
				});
			}
		}
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.tempimgs !== this.state.tempimgs) {
			this._isMounted && this.setState({
				post: { ...this.state.post, images: this.state.tempimgs }
			});
		}

		if(prevProps.post !== this.props.post && this.props.post) {	// this works when it used in postfull with id from server
			// this.setState({ post: {} });
			if(this.props.post && this.props.post.images) {
				this._isMounted && this.setState({ post: this.props.post });

				this.props.post.images.map(image => {
					loadImage(image, this.callbackFun, {orientation: true});
					return null;
				});
			}
		}
	}

	onBottomVisible = () => {
		if(this.state.post._id !== "") {
			const { isForAdmin } = this.props;

			const postId = this.state.post._id;
			!isForAdmin && this.props.updatePostsSeen(postId);
		}
	}

	getVotesfun = () => {
		const { _id } = this.state.post;
		const { isAdpost } = this.props;

		const apigetVotesUrl = isAdpost ? "/api/adposts/getVotes" : "/api/posts/getVotes";

		axios.post(apigetVotesUrl, { postId: _id })	
			.then(res => {
				if(res.data.success) {
					this._isMounted && 
					this.setState({
						post: { 
							...this.state.post, 
							upvotes_count: res.data.upvotes_count, 
							downvotes_count: res.data.downvotes_count
						}
					});
				}
			})
	}

	handleUpvotePost = e => {
		e.preventDefault();
		const { hasupvoted, hasdownvoted } = this.state;
		const { _id } = this.state.post;
		const { isAdpost } = this.props;

		const apiUpvoteUrl = isAdpost ? "/api/adposts/upvote" : "/api/posts/upvote";
		const apiRemoveDownvoteUrl = isAdpost ? "/api/adposts/removedownvote" : "/api/posts/removedownvote";
		const apiRemoveUpvoteUrl = isAdpost ? "/api/adposts/removeupvote" : "/api/posts/removeupvote";

		if(!hasupvoted) {
			axios.post(apiUpvoteUrl, {
				postId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasupvoted: true });
					this.getVotesfun();
				}
			});

			if(hasdownvoted) {
				axios.post(apiRemoveDownvoteUrl, {	// remove downvote
					postId: _id
				}).then(res => {
					if(res.data.success) {
						this._isMounted && this.setState({ hasdownvoted: false });
						this.getVotesfun();
					}
				});
			}
		} else {
			axios.post(apiRemoveUpvoteUrl, {
				postId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasupvoted: false });
					this.getVotesfun();
				} 
			});
		}
	}

	handleDownvotePost = e => {
		e.preventDefault();
		const { hasdownvoted, hasupvoted } = this.state;
		const { _id } = this.state.post;
		const { isAdpost } = this.props;

		const apiDownvoteUrl = isAdpost ? "/api/adposts/downvote" : "/api/posts/downvote";
		const apiRemoveUpvoteUrl = isAdpost ? "/api/adposts/removeupvote" : "/api/posts/removeupvote";
		const apiRemoveDownvoteUrl = isAdpost ? "/api/adposts/removedownvote" : "/api/posts/removedownvote";

		if(!hasdownvoted) {
			axios.post(apiDownvoteUrl, {
				postId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasdownvoted: true });
					this.getVotesfun();
				}
			});

			if(hasupvoted) {
				axios.post(apiRemoveUpvoteUrl, {		// remove upvote
					postId: _id
				}).then(res => {
					if(res.data.success) {
						this._isMounted && this.setState({ hasupvoted: false });
						this.getVotesfun();
					}
				});
			}
		} else {
			axios.post(apiRemoveDownvoteUrl, {
				postId: _id
			}).then(res => {
				if(res.data.success) {
					this._isMounted && this.setState({ hasdownvoted: false });
					this.getVotesfun();
				}
			});
		}
	}

	callbackFun = canvas => {
		if(canvas && canvas.type !== "error") {

			let url = canvas.toDataURL();
			this._isMounted && this.setState({
				tempimgs: this.state.tempimgs.concat(url)
			});
		}
	}

	handleCommentAccClick = () => this.setState({ collapsed: !this.state.collapsed })

	// goFullScreen = () => this.setState({ isFull: true });
	getCommCount = count => {
		this._isMounted && 
		this.setState({
			post: { ...this.state.post, comments_count: count+1 }
		});
	}

	render() {
		const { collapsed, hasupvoted, hasdownvoted } = this.state;
		const { varColor, showBottomBar, isAdpost } = this.props;
		const { 
			_id,
			type,
			category, 
			location_city,
			location_state,
			location_country, 
			title, 
			images, 
			hashtags, 
			upvotes_count, 
			downvotes_count,
			comments_count
		} = this.state.post;

		return (
			<div>
			  <Segment.Group raised style={{ margin: "15px", marginBottom: "10px" }}>
			  	<Segment inverted color="brown">
			  		<Grid centered textAlign="center">
			  			<Grid.Row columns={2}>
			  				<Grid.Column textAlign="left">
			  					<Header 
			  						as="h5" 
			  						color={varColor}
			  						onClick={() => this.props.getCategoryForFilter(category)}
			  					> 
			  						{category} 
			  					</Header>
			  				</Grid.Column>
			  				<Grid.Column textAlign="right">
			  					<Header as="h5" color={varColor}>
			  						{location_city !== "" ? 
			  							location_city : 
			  							location_state !== "" ?
			  								location_state :
			  								location_country
			  						}
			  					</Header>
			  				</Grid.Column>
			  			</Grid.Row>
			  		</Grid>
			  	</Segment>
			  	<Segment textAlign="center" style={{ padding: "0px" }}>
			  		<Visibility updateOn='repaint' once onBottomVisible={this.onBottomVisible}>
						{ this.props.post && (this.state.tempimgs.length === this.props.post.images.length) ? (
							<MultipleImageSlider 
								images={images}
							/>
						) : (
							<Segment>
								{/*<Dimmer active style={{ padding: 0, margin: 0, lineHeight: 0 }}>
									<Loader />
								</Dimmer>*/}
								<Icon name="image" size="massive" />
							</Segment>
						)}
					</Visibility>
			  	</Segment>
			  	<Segment textAlign="center">
			  		<Card.Description><h4> {title} </h4></Card.Description>
			  		<Card.Description>
						<div>
							{hashtags.length > 0 && hashtags.map(h =>
								<Hashtag key={h} id="isHashtagClick" handleClick={() => {}} text={ h }/>
							)}
						</div>
			  		</Card.Description>
			  		<hr />
			  		<Card.Description>
		  				{/* <Icon name="angle up" color={varColor} />{upvotes.length}
			  			&nbsp;&nbsp;&nbsp;&nbsp;
			  			<Icon name="angle down" color={varColor} />{downvotes.length}
			  			&nbsp;&nbsp;&nbsp;&nbsp;
			  			<Icon name="comment outline" color={varColor} />{comments.length} */}
			  			<Grid centered>
							<Grid.Row columns={3}>
							  <Grid.Column>
							    <Container align="left">
							     	<Icon name="angle up" color={varColor} />{upvotes_count}
							    </Container>
							  </Grid.Column>
							  <Grid.Column>
							    <Container align="middle" textAlign="center">
									<Icon name="comment outline" color={varColor} />{comments_count}
							    </Container>
							  </Grid.Column>
							  <Grid.Column>
							    <Container align="right">
							      <Icon name="angle down" color={varColor} />{downvotes_count}
							    </Container>
							  </Grid.Column>
							</Grid.Row>
						</Grid>
			  		</Card.Description>
			  	</Segment>
			  </Segment.Group>
			  { showBottomBar && (
				<Container>
					<Responsive {...Responsive.onlyMobile}>
						<Button.Group widths="5" size="big" >
							{/*  hasupvoted ? ( */}
								<Transition visible={hasupvoted} animation="fly up" duration="900">
									<Button 
										onClick={this.handleUpvotePost}
									>
										<Icon color="red" name="arrow alternate circle up" />
									</Button>
								</Transition>
							{/* }) : ( */}
								<Transition visible={!hasupvoted} animation="fly up" duration="900">
									<Button 
										onClick={this.handleUpvotePost}
									>
										<Icon name="arrow alternate circle up outline" />
									</Button>
								</Transition>
							{/* })} */}
							{/* hasdownvoted ? ( */}
								<Transition visible={hasdownvoted} animation="fly up" duration="900">
									<Button onClick={this.handleDownvotePost}>
										<Icon color="grey" name="arrow alternate circle down" />
									</Button>
								</Transition>
							{/* }) : ( */}
								<Transition visible={!hasdownvoted} animation="fly up" duration="900">
									<Button 
										onClick={this.handleDownvotePost}
									>
										<Icon name="arrow alternate circle down outline" />
									</Button>
								</Transition>
							{/* })} */}
							<Button icon="chat" onClick={this.handleCommentAccClick} />
							{/*<Button icon="share alternate" />*/}
							<ShareLink 
								_id={_id}
								type={type}
							/>
							{/*<Button icon="flag" />*/}
							<Report 
								isAdpost={isAdpost}
								_id={_id}
							/>
						</Button.Group>
					</Responsive>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						<Button.Group widths="5" size="big" >
							{/*  hasupvoted ? ( */}
								<Transition visible={hasupvoted} animation="fly up" duration="900">
									<Button 
										onClick={this.handleUpvotePost}
									>
										<Icon color="red" name="arrow alternate circle up" />
									</Button>
								</Transition>
							{/* }) : ( */}
								<Transition visible={!hasupvoted} animation="fly up" duration="900">
									<Button 
										onClick={this.handleUpvotePost}
										icon="arrow alternate circle up outline" 
										style={{width: 120}}
									/>
								</Transition>
							{/* })} 
							{ hasdownvoted ? ( */}
								<Transition visible={hasdownvoted} animation="fly up" duration="900">
									<Button onClick={this.handleDownvotePost}>
										<Icon color="grey" name="arrow alternate circle down" />
									</Button>
								</Transition>
							{/* }) : ( */}
								<Transition visible={!hasdownvoted} animation="fly up" duration="900">
									<Button 
										style={{width: 120}}
										onClick={this.handleDownvotePost}
										icon="arrow alternate circle down outline" 
									/>
								</Transition>
							{/* })} */}
							<Button 
								icon="chat" 
								onClick={this.handleCommentAccClick} 
								style={{width: 120}}
							/>
							{/*<Button icon="share alternate" />*/}
							<ShareLink 
								_id={_id}
								type={type}
							/>
							{/*<Button icon="flag" />*/}
							<Report 
								_id={_id}
								isAdpost={isAdpost}
							/>
						</Button.Group>
					</Responsive>

					<Comments
						isAdpost={isAdpost}
						postId={_id} 
						varColor={varColor} 
						collapsed={collapsed}
						getCommCount={this.getCommCount} 
					/>
			  </Container>
			)}
		  </div>
		);
	}
};

PostImage.propTypes = {
	varColor : PropTypes.string,
	post : PropTypes.shape({
	  	category : PropTypes.string,
		location_city : PropTypes.string,
		location_state: PropTypes.string,
		location_country: PropTypes.string,
		title : PropTypes.string,
		images : PropTypes.arrayOf(PropTypes.string),
		hashtags : PropTypes.arrayOf(PropTypes.string),
		upvotes_count : PropTypes.number,
		downvotes_count : PropTypes.number,
		comments_count : PropTypes.number
	})
}

export default connect(null, { updatePostsSeen })(PostImage);