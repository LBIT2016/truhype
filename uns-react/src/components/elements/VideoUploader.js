import React, { Component } from 'react';
import { 
	Button, 
	Input, 
	Dimmer, 
	Segment, 
	Icon, 
	Header,
	Message 
} from "semantic-ui-react";
import PropTypes from "prop-types";
import NProgress from 'nprogress';

// import Video from "./Video";

class VideoUploader extends Component {
	_isMounted = false;
	state = {
		// videos: [], 
		videoUrls: [],
		fielswanttoupload: 0,
		uploadedVideos: [],
		loading: false
	}

	componentDidMount = () => {
		this._isMounted = true;	
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.videoUrls !== this.state.videoUrls) {
			if(this.state.videoUrls.length === this.state.fielswanttoupload) {
				this.props.getVideosUrls(this.state.videoUrls);
			}
		}	

		if(prevState.uploadedVideos !== this.state.uploadedVideos) {
			if(this.state.uploadedVideos.length === this.state.fielswanttoupload) {
				this.props.handleShowNext();
			}
		}
	}

	handleClearVideos = () => {
		let videos = this.state.uploadedVideos;
		for (var i = videos.length - 1; i >= 0; i--) {
			fetch(`/api/videos/files/${videos[i].id}`, { method: 'DELETE' })
				.then(res => res.json())
				.then(data => {
					if(!data.success) {
						alert('Something went wrong. Please try again');
					}
				})
		}
		this.setState({
			// videos: [],
			videoUrls: [],
			uploadedVideos: [],
			fielswanttoupload: 0
		});
	}

	handleVideoChange = e => {
		e.preventDefault();

		if(e.target.files.length > 8) {
			alert(`Please select upto 8 videos only`);
			return null;
		}


		this.setState({ loading: true, fielswanttoupload: e.target.files.length });

		// Getting multiple videos from user's selection
		for (var i = 0; i < e.target.files.length; i++) {
			let file = e.target.files[i];
			// console.log(file);

			if(!file.type.includes('video')) {
				alert('Please choose video');
			}/* else if(file.size / (1024*1024) > 5) {
				alert('Please choose video of smaller size');
			} */ 
		}
		
		this.handleVideosUpload(e.target.files);
	}

	handleVideosUpload = (files) => {
		let data = new FormData();
		for (var i = files.length - 1; i >= 0; i--) {
			data.append('files', files[i]);
		}

		let url;

		NProgress.start();
		fetch('/api/videos/multifiles', {
	      method: 'POST',
	      body: data
	    })
	    .then(res => res.json())
	    .then(data => {
	        if (data.success) {
	        	if(this._isMounted) {
					this.setState({ uploadedVideos: data.files });
					for (var i = data.files.length - 1; i >= 0; i--) {
						NProgress.set((data.files.length / i)*100);
						if(process.env.NODE_ENV === 'development') {
							url = `http://localhost:3001/api/videos/files/${data.files[i].filename}`;
						} else if(process.env.NODE_ENV === 'production') {
							url = `https://truhype.app/api/videos/files/${data.files[i].filename}`;
						}

						// console.log(url);
						this.setState({ videoUrls: this.state.videoUrls.concat(url) });
					}
				}
	        } else {
	        	NProgress.done(true);
	        	alert('Upload failed');
	        }
	        this.setState({ loading: false });
	    }).catch(err => {
	    	console.log(err);
	    	NProgress.done(true);
	    	alert('Upload failed with error: '+err);
	    	this.setState({ loading: false });
	    });
	}

	render() {
		const { videoUrls, loading } = this.state;

		return (
			<div>
				<Dimmer active={loading}>
					<p>Uploading...</p>
				</Dimmer>
				{ videoUrls.length > 0 ? (
						<div>
							{/*<Video videos={videoUrls} />*/}
							<Message>
								<Message.Header>
									{videoUrls.length}
									{videoUrls.length === 1 ? " video selected" : " videos selected"}
								</Message.Header>
							</Message>
							<div style={{ padding: "5px" }}>
								<Button 
									color="grey" 
									icon="close" 
									circular 
									basic 
									content="clear videos" 
									onClick={this.handleClearVideos}
								/>
							</div>
						</div>
					) : ( 
							<div>
								<label htmlFor="upload-video">
									<Segment placeholder style={{ borderRadius: 0 }}>
										<Header icon>
											<Icon name="video" /> Upload Videos
										</Header>
									</Segment>
								</label>
								<Input 
									style={{ opacity: 0, zIndex: 1 }}
									id="upload-video"
									accept="video/*"
									type="file" 
									multiple={true} 
									onChange={this.handleVideoChange} 
								/>
							</div>
					)
				}
			</div>
		);
	}
}

VideoUploader.propTypes = {
	getVideosUrls : PropTypes.func.isRequired
}

export default VideoUploader;