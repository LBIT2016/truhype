import React, { Component } from 'react';
import { 
	Button, 
	Input,
	Loader,
	Dimmer,
	Segment,
	Icon,
	Header,
	Message
} from "semantic-ui-react";
import PropTypes from "prop-types";
import NProgress from 'nprogress';

class ImageUploader extends Component {
	_isMounted = false;
	state = {
		pictures: [],
		fielswanttoupload: 0, 
		urls: [],
		uploadedPics: [],
		loading: false
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.urls !== this.state.urls) {
			if(this.state.urls.length === this.state.fielswanttoupload) {
				this.props.getImagesUrls(this.state.urls);	
			}
		}	

		if(prevState.pictures !== this.state.pictures) {
			if(this.state.pictures.length === this.state.fielswanttoupload) {
				this.props.handleShowNext();
			}
		}
	}

	handleClearImages = () => {
		let pictures = this.state.uploadedPics;
		for (var i = pictures.length - 1; i >= 0; i--) {
			fetch(`/api/images/files/${pictures[i].id}`, { method: 'DELETE' })
				.then(res => res.json())
				.then(data => {
					if(!data.success) {
						alert('Something went wrong. Please try again');
					}
				})
		}
		if(this._isMounted) {
			this.setState({
				pictures: [],
				urls: [],
				uploadedPics: [],
				fielswanttoupload: 0
			});
		}
	}

	handleImageChange = e => {
		e.preventDefault();

		if(e.target.files.length > 8) {
			alert(`Please select upto 8 images only`);
			return null;
		}

		this.setState({ loading: true, fielswanttoupload: e.target.files.length });

		// Getting multiple images from user's selection
		for (var i = 0; i < e.target.files.length; i++) {
			let file = e.target.files[i];
			// console.log(file);

			if(!file.type.includes('image')) {
				alert('Please choose image');
			} else if(file.size / (1024*1024) > 5) {
				alert('Please choose image of smaller size');
			} 
		}
		
		this.handleImagesUpload(e.target.files);
	}

	handleImagesUpload = (files) => {
		let data = new FormData();
		for (var i = files.length - 1; i >= 0; i--) {
			data.append('files', files[i]);
		}

		let url;

		NProgress.start();
		fetch('/api/images/multifiles', {
	      method: 'POST',
	      body: data
	    })
	    .then(res => res.json())
		.then(data => {
			if (data.success) {
				if(this._isMounted) {
					this.setState({ uploadedPics: data.files });
					for (var i = data.files.length - 1; i >= 0; i--) {
						NProgress.set((data.files.length / i)*100);
						if(process.env.NODE_ENV === 'development') {
							url = `http://localhost:3001/api/images/files/${data.files[i].filename}`;
						} else if(process.env.NODE_ENV === 'production') {
							url = `https://truhype.app/api/images/files/${data.files[i].filename}`;
						}
						
						this.setState({
							pictures: this.state.pictures.concat(url)
						});
						this.setState({ urls: this.state.urls.concat(url) });
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

	componentWillUnmount = () => {
		this._isMounted = false;	
	}

	render() {
		const { pictures, loading } = this.state;

		return (
			<div>
				<Dimmer active={loading} style={{ padding: 0, margin: 0, lineHeight: 0 }}>
					<Loader />
				</Dimmer>
				{	pictures.length > 0 ? (
					<div>
						<Message>
							<Message.Header>
								{pictures.length}
								{pictures.length === 1 ? " image selected" : " images selected"}
							</Message.Header>
						</Message>
						<div style={{ padding: "5px" }}>
							<Button 
								color="grey" 
								icon="close" 
								circular 
								basic 
								content="clear images" 
								onClick={this.handleClearImages}
							/>
						</div>
					</div>
				) : ( 
						<div>
							<label htmlFor="upload-photo">
								<Segment placeholder style={{ borderRadius: 0 }}>
									<Header icon>
										<Icon name="images" /> Upload Images
									</Header>
								</Segment>
							</label>
							<Input 
								style={{ opacity: 0, zIndex: 1 }}
								id="upload-photo"
								type="file"
								accept="image/*" 
								multiple={true} 
								onChange={this.handleImageChange} 
							/>
						</div>
				)
			}
			</div>
		);
	}
}

ImageUploader.propTypes = {
	getImagesUrls : PropTypes.func.isRequired
}

export default ImageUploader;