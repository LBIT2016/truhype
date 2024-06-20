import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import MainPage from "../../pages/MainPage"; 
import AdMainPage from "./AdMainPage";

import AdUploadPostForm from "../forms/AdUploadPostForm";
import AdUploadPostImageForm from "../forms/AdUploadPostImageForm";
import AdUploadPostVideoForm from "../forms/AdUploadPostVideoForm";
import SuccessMessage from "../../messages/SuccessMessage";

import { upload_adpost } from "../../../actions/adposts";
import { fetchHashtagsByKeyword, clearHashtags } from "../../../actions/others";
import { allHashtagsSelector } from "../../../reducers/others";

class AdUploadPage extends React.Component {
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
			isCardStyle: false,
			cardColor: "",
			isNotification: false,
			locationtype: "all",
			locations: []
		},
		success: false,
		pathname: ""
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

		const { 
			category, 
			title, 
			text, 
			hashtags, 
			isCardStyle, 
			cardColor, 
			isNotification,
			locationtype,
			locations
		} = this.state.data;

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
			post.title = title;
			post.text = text;
			post.category = category;
			post.hashtags = hashtags;
			post.isCardStyle = isCardStyle;
			post.cardColor = cardColor;
			post.isNotification = isNotification;
			post.locationtype = locationtype;
			post.locations = locations;
			// this.props.upload_adpost(post).then(id => this.props.history.push(`/admin_textpost/${id}`));
			this.props
				.upload_adpost(post)
				.then(() => {
					this.setState({ success: true });
					window.scrollTo(0,0);
				});
		}

	}

	onImagePostSubmit = e => {
		// console.log("Cliked image post.");

		e.preventDefault();
		
		const { 
			category, 
			title, 
			images, 
			hashtags,
			isNotification,
			locationtype,
			locations 
		} = this.state.data;

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
			post.title = title;
			post.images = images;
			post.category = category;
			post.hashtags = hashtags;
			post.isNotification = isNotification;
			post.locationtype = locationtype;
			post.locations = locations;
			// this.props.upload_adpost(post).then(id => this.props.history.push(`/admin_imagepost/${id}`));
			this.props
				.upload_adpost(post)
				.then(() => {
					this.setState({ success: true });
					window.scrollTo(0,0);
				})
		}
	}

	onVideoPostSubmit = e => {
		// console.log("Cliked video post.");

		e.preventDefault();
		
		const { 
			category, 
			title, 
			videos, 
			hashtags,
			isNotification,
			locationtype,
			locations
		} = this.state.data;

		// checking errors
		const errors = {};
		if(!category) errors.category = "Category needed!";
		if(!videos) errors.videos = "Video needed!";
		// console.log(errors);

		if (Object.keys(errors).length > 0) {
			// If there are errors
			
			let displayError = "";
			displayError += Object.values(errors);
			alert(displayError);
		} else {
			// If there are no errors

			let post = {};
			post.type = "video";
			post.title = title;
			post.videos = videos;
			post.category = category;
			post.hashtags = hashtags;
			post.isNotification = isNotification;
			post.locationtype = locationtype;
			post.locations = locations;
			// this.props.upload_adpost(post).then(id => this.props.history.push(`/admin_videopost/${id}`));
			this.props
				.upload_adpost(post)
				.then(() => {
					this.setState({ success: true });
					window.scrollTo(0,0);
				})
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
		this.props.fetchHashtagsByKeyword(this.state.data.hashtagValue);
	}

	handleDataChange = (e, { name, value }) => {
		this.setState({
			data: { ...this.state.data, [name]: value }
		});
	}

	handleCheck = () =>
		this.setState({ 
			data: { ...this.state.data, isCardStyle: !this.state.data.isCardStyle }
		})

	handleColorChange = cardColor => 
		this.setState({
			data: { ...this.state.data, cardColor: cardColor.hex }
		})
	
	handleNotifCheck = () =>
		this.setState({ 
			data: { ...this.state.data, isNotification: !this.state.data.isNotification }
		})

	handleLocationRadio = (e, { value }) => 
		this.setState({ 
			data: { ...this.state.data, locationtype: value }
		})

	pushLocation = loc => {
		this.setState({ 
			data: { ...this.state.data, locations: [...this.state.data.locations, loc] } 
		});
	}

	onClearLocs = () => {
		this.setState({
			data: { ...this.state.data, locations: [] } 
		});
	}

	closeSuccessMessage = () => {
		this.setState({ 
			success: false,
			data: {
				category: "",
				title: "",
				text: "",
				hashtags: [],
				hashtagValue: "",
				images: [],
				videos: [],
				isCardStyle: false,
				cardColor: "",
				isNotification: false,
				locationtype: "all",
				locations: []
			}
		});
	}

	render() {
		const { filter, activeItem, hashtagOptions, ServerHashtagOptions, success } = this.state;

		return (
			<AdMainPage>
				<MainPage 
					pathname={this.props.location.pathname}
					filter={filter} 
					handleFilter={this.handleFilter} 
					showTopBar={false}
					showTopIcons={false}
					showBottomBar={false}
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
							<div>
								{success ? (
									<div>
										<SuccessMessage text="Post Successfully submitted!" />
										<Button icon="close" onClick={this.closeSuccessMessage} />
									</div>
								) : (
									<AdUploadPostForm 
										data={this.state.data}
										handleDataChange={this.handleDataChange}
										addHashtag={this.addHashtag}
										hashtagOptions={hashtagOptions}
										onHashtagSearch={this.onHashtagSearch}
										ServerHashtagOptions={ServerHashtagOptions}
										handleHashtagChange={this.handleHashtagChange}
										onTextPostSubmit={this.onTextPostSubmit}
										pushLocation={this.pushLocation}
										handleCheck={this.handleCheck}
										handleColorChange={this.handleColorChange}
										handleNotifCheck={this.handleNotifCheck}
										handleLocationRadio={this.handleLocationRadio}
										onClearLocs={this.onClearLocs}
									/> 
								)}
							</div>
						)}
						{ activeItem === "image" && (
							<div>
								{success ? (
									<div>
										<SuccessMessage text="Post Successfully submitted!" />
										<Button icon="close" onClick={this.closeSuccessMessage} />
									</div>
								) : (
									<AdUploadPostImageForm
										data={this.state.data}
										handleDataChange={this.handleDataChange}
										addHashtag={this.addHashtag}
										hashtagOptions={hashtagOptions}
										onHashtagSearch={this.onHashtagSearch}
										ServerHashtagOptions={ServerHashtagOptions}
										handleHashtagChange={this.handleHashtagChange}
										onImagePostSubmit={this.onImagePostSubmit}
										pushLocation={this.pushLocation}
										getImagesUrls={this.getImagesUrls}
										handleNotifCheck={this.handleNotifCheck}
										handleLocationRadio={this.handleLocationRadio}
										onClearLocs={this.onClearLocs}
									/> 
								)}
							</div>
						)}
						{ activeItem === "video" && (
							<div>
								{success ? (
									<div>
										<SuccessMessage text="Post Successfully submitted!" />
										<Button icon="close" onClick={this.closeSuccessMessage} />
									</div>
								) : (
									<AdUploadPostVideoForm
										data={this.state.data}
										handleDataChange={this.handleDataChange}
										addHashtag={this.addHashtag}
										hashtagOptions={hashtagOptions}
										onHashtagSearch={this.onHashtagSearch}
										ServerHashtagOptions={ServerHashtagOptions}
										handleHashtagChange={this.handleHashtagChange}
										onVideoPostSubmit={this.onVideoPostSubmit}
										pushLocation={this.pushLocation}
										getVideosUrls={this.getVideosUrls}
										handleNotifCheck={this.handleNotifCheck}
										handleLocationRadio={this.handleLocationRadio}
										onClearLocs={this.onClearLocs}
									/>
								)}
							</div>
						)}
					</div>
				</MainPage>
			</AdMainPage>
		);
	}
};

AdUploadPage.propTypes = {
	// getlocation : PropTypes.func.isRequired,
	location : PropTypes.shape({
	  pathname : PropTypes.string.isRequired
	}).isRequired,
	upload_adpost : PropTypes.func.isRequired,
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
		upload_adpost 
	}
)(AdUploadPage);
