import React from "react";
import { Menu } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import MainPage from "./MainPage"; 
// import PostEditable from "../elements/PostEditable";
// import PostImageEditable from "../elements/PostImageEditable";
// import PostVideoEditable from "../elements/PostVideoEditable";

import UploadPostForm from "../forms/UploadPostForm";
import UploadPostImageForm from "../forms/UploadPostImageForm";
import UploadPostVideoForm from "../forms/UploadPostVideoForm";


// import { getlocation } from "../../actions/users";
import { upload_post } from "../../actions/posts";
// import { allPostsSelector } from "../../reducers/posts";
import { fetchHashtagsByKeyword, clearHashtags } from "../../actions/others";
import { allHashtagsSelector } from "../../reducers/others";

class UploadPage extends React.Component {
	state = { 
		filter: "Loved", 
		activeItem: "text",
		hashtagOptions: [],
		ServerHashtagOptions: [],
		data: {
			category: "",
			title: "",
			text: "",
			hashtags: [],
			hashtagValue: "",
			images: [],
			videos: [],
			location_city: "",
			location_state: "",
			location_country: "",
			isCardStyle: false,
			cardColor: ""
		}
	}

	// componentDidMount = () => this.props.getlocation()

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.filter !== this.state.filter) {
			if(this.state.filter === "Loved") {
				this.setState({ varColor: "red" });
			} else if (this.state.filter === "Latest") {
				this.setState({ varColor: "purple" });
			} else if(this.state.filter === "Hated") {
				this.setState({ varColor: "grey" });
			}
		}

		if(prevProps.ServerHashtagOptions !== this.props.ServerHashtagOptions) {
			this.setState({
				ServerHashtagOptions: this.props.ServerHashtagOptions
			});
		}	
	}

	getImagesUrls = urls => {
		// console.log("Done called");
		this.setState({ 
			data: { 
				...this.state.data,
				images: [ ...urls ] 
			} 
		});
	}

	getVideosUrls = urls => {
		// console.log("Done called");
		this.setState({ 
			data: { 
				...this.state.data,
				videos: [ ...urls ] 
			} 
		});
	}

	onTextPostSubmit = e => {
		// console.log("Cliked Text post.");
		e.preventDefault();

		const { category, title, text, hashtags, isCardStyle, cardColor } = this.state.data;
		const { location_city, location_state, location_country } = this.state.data;

		// console.log(posts);

		// checking errors
		const errors = {};
		if(!category) errors.category = "Category needed!";
		if(!text) errors.text = "Text needed!";

		// console.log(errors);

		if (Object.keys(errors).length > 0) {
			// If there are errors
			
			let displayError = "";
			displayError += Object.values(errors);
			alert(displayError);
		} else {
			// If there are no errors

			let post = {};
			post.type = "text";
			post.location_city = location_city;
			post.location_state = location_state;
			post.location_country = location_country;
			post.title = title;
			post.text = text;
			post.category = category;
			post.hashtags = hashtags;
			post.isCardStyle = isCardStyle;
			post.cardColor = cardColor;
			// console.log(post);
			this.props.upload_post(post).then(id => this.props.history.push(`/textpost/${id}`));
		}

	}

	onImagePostSubmit = e => {
		// console.log("Cliked image post.");

		e.preventDefault();
		
		const { category, title, images, hashtags } = this.state.data;
		const { location_city, location_state, location_country } = this.state.data;

		// checking errors
		const errors = {};
		if(!category) errors.category = "Category needed!";
		if(!images) errors.images = "Image needed!";
		// console.log(errors);

		if (Object.keys(errors).length > 0) {
			// If there are errors
			
			let displayError = "";
			displayError += Object.values(errors);
			alert(displayError);
		} else {
			// If there are no errors

			let post = {};
			post.type = "image";
			post.location_city = location_city;
			post.location_state = location_state;
			post.location_country = location_country;
			post.title = title;
			post.images = images;
			post.category = category;
			post.hashtags = hashtags;
			this.props.upload_post(post).then(id => this.props.history.push(`/imagepost/${id}`));
		}
	}

	onVideoPostSubmit = e => {
		// console.log("Cliked video post.");

		e.preventDefault();
		
		const { category, title, videos, hashtags } = this.state.data;
		const { location_city, location_state, location_country } = this.state.data;

		// checking errors
		const errors = {};
		if(!category) errors.category = "Category needed!";
		if(!videos) errors.videos = "Video needed!";
		// console.log(errors);

		if (Object.keys(errors).length > 0) {
			// If there are errors
			// console.log(Object.keys(errors));
			// console.log(Object.values(errors));
			
			let displayError = "";
			displayError += Object.values(errors);
			// console.log(displayError);
			alert(displayError);
		} else {
			// If there are no errors
			// console.log("Everything is perfect. Ready to submit");

			let post = {};
			post.type = "video";
			post.location_city = location_city;
			post.location_state = location_state;
			post.location_country = location_country;
			post.title = title;
			post.videos = videos;
			post.category = category;
			post.hashtags = hashtags;
			// console.log(post);
			this.props.upload_post(post).then(id => this.props.history.push(`/videopost/${id}`));
		}
	}

	handleFilter = e => {
		this.setState({ filter: e.target.value });
	}

	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	addHashtag = (e, { value }) => {
		let newOption = { key: value, value: value, text: value };
		this.setState({ 
			hashtagOptions: [ ...this.state.hashtagOptions, newOption ]
		});
	}

	handleHashtagChange = (e, { value }) => {
		let newOption = { key: value[0], value: value[0], text: value[0] };
		this.setState({ 
			hashtagOptions: [ ...this.state.hashtagOptions, newOption ],
			data: { ...this.state.data, hashtags: value }
		}); 
	} 

	onHashtagSearch = (e, { searchQuery }) => {
		clearTimeout(this.timer);
		this.props.clearHashtags();
		this.setState({ data: { ...this.state.data, hashtagValue: searchQuery} });
		this.timer = setTimeout(this.search, 1000);
	}

	search = () => {
		this.setState({ loading: true });
		this.props.fetchHashtagsByKeyword(this.state.data.hashtagValue);
	}

	handleDataChange = (e, { name, value }) => {
		this.setState({
			data: { ...this.state.data, [name]: value }
		});
	}

	getLocation = (location_city, location_state, location_country) => {
		this.setState({ 
			data: { ...this.state.data, location_city, location_state, location_country } 
		});
	}

	handleCheck = () =>
		this.setState({ 
			data: { ...this.state.data, isCardStyle: !this.state.data.isCardStyle }
		})

	handleColorChange = cardColor => 
		this.setState({
			data: { ...this.state.data, cardColor: cardColor.hex }
		});
	

	render() {
		const { filter, activeItem, hashtagOptions, ServerHashtagOptions } = this.state;

		return (
			<MainPage 
				pathname={this.props.pathname}
				filter={filter} 
				handleFilter={this.handleFilter} 
				showTopBar={false}
				showBottomBar={true}
				showTopIcons={true}
			>
				<div>
					<Menu pointing secondary widths={3} color="grey" style={{ marginTop: "18px" }}>
						<Menu.Item 
							name="text" 
							active={activeItem === "text"} 
							onClick={this.handleItemClick} 
						/>
						<Menu.Item 
							name="image" 
							active={activeItem === "image"} 
							onClick={this.handleItemClick} 
						/>
						<Menu.Item 
							name="video" 
							active={activeItem === "video"} 
							onClick={this.handleItemClick} 
						/>
					</Menu>
					{ activeItem === "text" && (
						/* <PostEditable
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							categoryOptions={categoryOptions}
							onTextPostSubmit={this.onTextPostSubmit}
						/> */
						<UploadPostForm 
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							onHashtagSearch={this.onHashtagSearch}
							ServerHashtagOptions={ServerHashtagOptions}
							handleHashtagChange={this.handleHashtagChange}
							onTextPostSubmit={this.onTextPostSubmit}
							getLocation={this.getLocation}
							handleCheck={this.handleCheck}
							handleColorChange={this.handleColorChange}
						/> 
					)}
					{ activeItem === "image" && (
						/* <PostImageEditable
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							categoryOptions={categoryOptions}
							onImagePostSubmit={this.onImagePostSubmit}
							getImagesUrls={this.getImagesUrls}
						/> */
						<UploadPostImageForm
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							onHashtagSearch={this.onHashtagSearch}
							ServerHashtagOptions={ServerHashtagOptions}
							handleHashtagChange={this.handleHashtagChange}
							onImagePostSubmit={this.onImagePostSubmit}
							getLocation={this.getLocation}
							getImagesUrls={this.getImagesUrls}
						/> 
					)}
					{ activeItem === "video" && (
						/* <PostVideoEditable
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							categoryOptions={categoryOptions}
							handleClearVideos={this.handleClearVideos}
							handleVideoChange={this.handleVideoChange}
							getVideosUrls={this.getVideosUrls}
							onVideoPostSubmit={this.onVideoPostSubmit}
						/> */
						<UploadPostVideoForm
							data={this.state.data}
							handleDataChange={this.handleDataChange}
							addHashtag={this.addHashtag}
							hashtagOptions={hashtagOptions}
							onHashtagSearch={this.onHashtagSearch}
							ServerHashtagOptions={ServerHashtagOptions}
							handleHashtagChange={this.handleHashtagChange}
							onVideoPostSubmit={this.onVideoPostSubmit}
							getLocation={this.getLocation}
							getVideosUrls={this.getVideosUrls}
						/>
					)}
				</div>
			</MainPage>
		);
	}
};

UploadPage.propTypes = {
	// getlocation : PropTypes.func.isRequired,
	location : PropTypes.string,
	pathname : PropTypes.string.isRequired,
	upload_post : PropTypes.func.isRequired,
	history : PropTypes.shape({
	  push : PropTypes.func.isRequired
	}).isRequired
}

function mapStateToProps(state) {
	return {
		// location_city: state.user.location_city,
		// location_state: state.user.location_state,
		// location_country: state.user.location_country
		// posts: allPostsSelector(state)
		ServerHashtagOptions: allHashtagsSelector(state)
	}
}

export default connect(
	mapStateToProps, 
	{ 
		// getlocation, 
		clearHashtags,
		fetchHashtagsByKeyword,
		upload_post 
	}
)(UploadPage);
