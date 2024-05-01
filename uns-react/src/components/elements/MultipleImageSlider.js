import React, { Component } from 'react';
import { Image, Icon, Grid, Container } from "semantic-ui-react";
import Lightbox from "react-images";

import detectSwipe from "../../utils/detectSwipe.js";

const BackArrow = (props) => (
  <div onClick={props.previousImage} style={{ fontSize: '2em' }}>
    <Icon name="angle left" />
  </div>
);

const NextArrow = (props) => (
  <div onClick={props.nextImage} style={{ fontSize: '2em' }}>
    <Icon name="angle right" />
  </div>
);

class MultipleImageSlider extends Component {
	state = {
		photos: [],
		previewPhotos: [],
		slideCount: 0,
		isOpen: false
	}

	/* componentDidMount = () => {
		detectSwipe('imageid', this.myfunction);

		if(!!this.props.images && this.props.images.length > 0) {
			this.setState({ previewPhotos: [] });
			let imgs = this.props.images;
			for (var i = 0; i < imgs.length; i++) {
				loadImage(imgs[i], this.callBackFun, {orientation: true});						
			}
		}
	} */

	/* callBackFun = (canvas) => {
		let img = canvas.toDataURL();
		this.setState({ 
			previewPhotos: [ ...this.state.previewPhotos, { id: i, src: img, caption: "" } ]
		});
		i = i+1;
	} */

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.slideCount !== this.state.slideCount) {
			detectSwipe('imageid', this.myfunction);		
		}	

		if(prevProps.images !== this.props.images) {
			if(!!this.props.images && this.props.images.length > 0) {
				let i = 0;
				/* this.props.images.map(pic => {
					let newPic = { id: i, src: pic, caption: "" };
					this.setState({  
						photos: [...this.state.photos, newPic]
					});
					i=i+1;
					return null;
				})*/

				let arrObjs = this.props.images.map(function(img) {
					return { id: i, src: img, caption: ""}
				});
				this.setState({ photos: arrObjs });
			}
		}
	}

	nextImage = () => {
		let { slideCount } = this.state;
		if(slideCount !== this.state.photos.length - 1) {
			slideCount = slideCount + 1;
		}
		this.setState({ slideCount });
	}

	previousImage = () => {
		let { slideCount } = this.state;
		if(slideCount !== 0) {
			slideCount = slideCount - 1;
		}
		this.setState({ slideCount });
	}

	closeLightbox = () => {
		this.setState({ isOpen: false });
	}

	openLightbox = (e, obj) => {
		this.setState({ isOpen: true });
	}

	myfunction = (el,d) => {
	  if(d === "l") this.nextImage();
	  if(d === "r") this.previousImage();
	}

	render() {
		const { photos, slideCount, isOpen, previewPhotos } = this.state;
		// const { images } = this.props;
		// console.log(previewPhotos);

		const $photos = previewPhotos.length > 0 ? previewPhotos : photos; 
		// const $photos = images;

		return (
			<div>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			    {$photos.map((photo, key) => {
			       if ($photos.indexOf(photo) === slideCount) {
			         return (
			           <div id="imageid" key={key}/* style={{margin: '0 auto'}}*/>
							<Image crossOrigin="Anonymous" onClick={this.openLightbox} src={photo.src} alt=''/>
			            </div>
			         )
			        }
			        return ''
			    })}
			  	</div>
			  	{$photos.length > 0 && (
					<Grid centered style={{ marginTop: "0px" }}>
						<Grid.Row columns={3}>
						  <Grid.Column>
						    <Container align="left">
						      {slideCount !== 0 ? <BackArrow previousImage={this.previousImage}/> : ''}
						    </Container>
						  </Grid.Column>
						  <Grid.Column>
						    <Container align="middle" textAlign="center">
								{ $photos.length > 1 && (
									<div style={{zIndex: 2}}>
										{slideCount+1} of {$photos.length}
									</div>
								)}
						    </Container>
						  </Grid.Column>
						  <Grid.Column>
						    <Container align="right">
						      {slideCount !== ($photos.length - 1) ? <NextArrow nextImage={this.nextImage}/> : ''}
						    </Container>
						  </Grid.Column>
						</Grid.Row>
					</Grid>
			   )}
			   <Lightbox
					images={$photos}
					isOpen={isOpen}
					currentImage={slideCount}
					onClickPrev={this.previousImage}
					onClickNext={this.nextImage}
					onClose={this.closeLightbox}
				/>
			</div>
		);
	}
}

export default MultipleImageSlider;