import React from "react";
import { connect } from "react-redux";
import { Segment } from "semantic-ui-react";
 
import MainPage from "./MainPage";
import Post from "../elements/Post";
import PostVideo from "../elements/PostVideo";
import PostImage from "../elements/PostImage"; 

import { fetchGlobalPostsByFilter, clearPosts } from "../../actions/posts"; 
import { allPostsSelector } from "../../reducers/posts";
import { adpostsSelector } from "../../reducers/adposts";
import { fetchAdPosts } from "../../actions/adposts";
import { changePer, changePage, changeTotalPages } from "../../actions/adpostsother";

class GlobalPage extends React.Component {
	_isMounted = false;
	state = { 
		filter: "Latest", 
		varColor: "purple",
		category: "all",
		per: 5,
		page: 1,
		totalPages: null,
		scrolling: false,
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
		});
	}

	componentWillUnmount = () => {
		this._isMounted = false;
		window.addEventListener('scroll', e => {
			this.handleScroll(e);
		});
	}

	handleScroll = e => {
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
		this.setState({ loading: true });
		const { filter, per, category } = this.state;
		const { adper, adtotalpages } = this.props;
		let { adpage } = this.props;

		if(adpage > adtotalpages) {
			adpage = 1;
			this.props.changePage(1);
		} else {
			adpage += 1;
			this.props.changePage(adpage);
		}

		let { page } = this.state;
		if(number) page = number;
		this.props
			.fetchGlobalPostsByFilter(filter, per, page, category)
			.then(totalPages => {
				this._isMounted && this.setState({
					scrolling: false,
					totalPages,
					loading: false
				});
			});	

		this.props.fetchAdPosts(adper, adpage)
			.then(adtotalpages => {
				this._isMounted && this.setState({ scrolling: false });
				this.props.changeTotalPages(adtotalpages);
			});
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.filter !== this.state.filter) {
			window.scrollTo(0, 0);
			if(this.state.filter === "Loved") {
				this._isMounted && 
				this.setState({ varColor: "red", page: 1 });
				this.props.clearPosts();
				this.loadPosts(1);
			} else if (this.state.filter === "Latest") {
				this._isMounted && 
				this.setState({ varColor: "purple", page: 1 });
				this.props.clearPosts();
				this.loadPosts(1);
			} else if(this.state.filter === "Hated") {
				this._isMounted && 
				this.setState({ varColor: "grey", page: 1 });
				this.props.clearPosts();
				this.loadPosts(1);
			}
		}	

		if(prevState.category !== this.state.category) {
			window.scrollTo(0, 0);
			this.props.clearPosts();
			this.loadPosts();
		}
	}

	handleFilter = e => {
		this._isMounted && this.setState({ filter: e.target.value });
	}

	getCategoryForFilter = category =>
		this._isMounted && this.setState({ category, page: 1 })

	handleRoute = route => {
		this._isMounted && route === "global" && this.setState({ category: "all", page: 1 });
		window.scrollTo(0, 0);
	}

	showAdPostAt7 = (adposts, adpage, i, varColor) => {
		if(i%5 === 0 && i !== 0) {
			if(adposts[adpage-1] && adposts[adpage-1].type === "text") {
				return (
					<Post
						isAdpost={true}
						isForAdmin={false}
						varColor={varColor} 
						getCategoryForFilter={this.getCategoryForFilter}
						post={adposts[adpage-1]}
						showBottomBar={true}
					/>
				)
			} else if(adposts[adpage-1] && adposts[adpage-1].type === "image") {
				return (
					<PostImage
						isAdpost={true}
						isForAdmin={false}
						varColor={varColor}
						getCategoryForFilter={this.getCategoryForFilter} 
						post={adposts[adpage-1]}
						showBottomBar={true}
					/>)
			} else if(adposts[adpage-1] && adposts[adpage-1].type === "video") {
				return (
					<PostVideo 
						isAdpost={true}
						isForAdmin={false}
						varColor={varColor}
						getCategoryForFilter={this.getCategoryForFilter}
						post={adposts[adpage-1]}
						showBottomBar={true}
					/>
				)
			}
		}
	}

	render() {
		const { filter, varColor, loading } = this.state;
		let { posts, adposts, adpage } = this.props;

		const body = 
			posts.length > 0 &&
				posts.map((post, i) => {
					!post.hashtags && (post.hashtags = [] );
					if(post.type === "text") {
						return (
							<div key={i}>
								<Post									 
									isAdpost={false}
									isForAdmin={false}
									varColor={varColor} 
									getCategoryForFilter={this.getCategoryForFilter}
									post={post}
									showBottomBar={true}
								/>
								{this.showAdPostAt7(adposts, adpage, i, varColor)}
							</div>
						)
					} else if(post.type === "image") {
						return (
							<div key={i}>
								<PostImage									 
									isAdpost={false}
									isForAdmin={false}
									varColor={varColor}
									getCategoryForFilter={this.getCategoryForFilter} 
									post={post}
									showBottomBar={true}
								/>
								{this.showAdPostAt7(adposts, adpage, i, varColor)}
							</div>
						)
					} else if(post.type === "video") {
						return (
							<div key={i}>
								<PostVideo 									
									isAdpost={false}
									isForAdmin={false}
									varColor={varColor}
									getCategoryForFilter={this.getCategoryForFilter}
									post={post}
									showBottomBar={true}
								/>
								{this.showAdPostAt7(adposts, adpage, i, varColor)}
							</div>
						)
					}
					return null;
				})

		const bodyContent = (
			<div id="ResultBlock">
				{body}
			</div>
		);

		return (
			<MainPage 
				pathname={this.props.pathname}
				filter={filter} 
				handleFilter={this.handleFilter}
				handleRoute={this.handleRoute}  
				showTopBar={true}
				showBottomBar={true}
				showTopIcons={true}
			>
				{bodyContent}
				{ loading && (
					<div>
						<br />
						<Segment textAlign="center">
							<p>loading posts...</p>
						</Segment>
					</div>
				)}
			</MainPage>
		);
	}
};

function mapStateToProps(state) {
	return {
		posts: allPostsSelector(state),
		adposts: adpostsSelector(state),
		adper: state.adpostsother.per,
		adpage: state.adpostsother.page,
		adtotalpages: state.adpostsother.totalPages
	}
}

export default connect( 
	mapStateToProps, 
	{  
		fetchGlobalPostsByFilter, 
		clearPosts,
		fetchAdPosts,
		changePage,
		changePer,
		changeTotalPages
	}
)(GlobalPage);
