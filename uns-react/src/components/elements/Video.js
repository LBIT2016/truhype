import React from 'react';
import { 
  Player, 
  BigPlayButton, 
  ControlBar, 
  ForwardControl, 
  ReplayControl,
  LoadingSpinner
} from 'video-react';
import { Icon, Container, Grid, Responsive } from "semantic-ui-react";
import PropTypes from "prop-types";

import detectSwipe from "../../utils/detectSwipe.js";

const BackArrow = (props) => (
  <div onClick={props.previousVideo} style={{fontSize: '2em'}}>
    <Icon name="angle left" />
  </div>
);

const NextArrow = (props) => (
  <div onClick={props.nextVideo} style={{fontSize: '2em'}}>
    <Icon name="angle right" />
  </div>
);

class Video extends React.Component {
  state = {
    videos: [],
    slideCount: 0
  }

  componentDidMount = () => {
    detectSwipe('videoid', this.myfunction);

    if(this.props.videos) {
     this.setState({ videos: this.props.videos }); 
    } 
  }

  componentDidUpdate = (prevProps, prevState) => {
    if(prevState.slideCount !== this.state.slideCount) {
      detectSwipe('videoid', this.myfunction);    
    }

    if(prevProps.videos !== this.props.videos) {
      this.setState({ videos: this.props.videos });
    }
  }

  nextVideo = () => {
    let { slideCount } = this.state;
    if(slideCount !== this.state.videos.length - 1) {
      slideCount = slideCount + 1;
    }
    this.setState({ slideCount });
  }

  previousVideo = () => {
    let { slideCount } = this.state;
    if(slideCount !== 0) {
      slideCount = slideCount - 1;
    }
    this.setState({ slideCount });
  }

  myfunction = (el,d) => {
    if(d === "l") this.nextVideo();
    if(d === "r") this.previousVideo();
  }

  render() {
    const { videos, slideCount } = this.state;
    // console.log(videos);

    return (
      <div>
          { videos.map(video => {
            if (videos.indexOf(video) === slideCount) {
              return (
                <div id="videoid" key={video} style={{margin: '0 auto'}}>
                  
                  {/* Video Player */}
                  <Responsive {...Responsive.onlyMobile} >
                    <Player
                      preload="metadata"
                    >
                      <BigPlayButton position="center" />
                      <source src={video} />
                      <LoadingSpinner />
                      <ControlBar autoHide={false}>
                        <ReplayControl seconds={10} order={7.1} />
                        <ForwardControl seconds={10} order={7.2} />
                      </ControlBar>
                    </Player>
                  </Responsive>

                  <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                    <Player aspectRatio="16:9">
                      <BigPlayButton position="center" />
                      <source src={video} />
                      <LoadingSpinner />
                      <ControlBar autoHide={false}>
                        <ReplayControl seconds={10} order={7.1} />
                        <ForwardControl seconds={10} order={7.2} />
                      </ControlBar>
                    </Player>
                  </Responsive>
                  
                  <Grid centered style={{ marginTop: "0px" }}>
                    <Grid.Row columns={3}>
                      <Grid.Column>
                        <Container align="left">
                          { slideCount !== 0 ? <BackArrow previousVideo={this.previousVideo}/> : '' }
                        </Container>
                      </Grid.Column>
                      <Grid.Column>
                        <Container align="middle" textAlign="center">
                          { videos.length > 1 && (
                            <div>
                              {slideCount+1} of {videos.length}
                            </div>
                          )}
                        </Container>
                      </Grid.Column>
                      <Grid.Column>
                        <Container align="right">
                          { slideCount !== (videos.length - 1) ? <NextArrow nextVideo={this.nextVideo}/> : '' }
                        </Container>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              )
            }
            return ''
          })}
      </div>
    );
  }
};

BigPlayButton.propTypes = {
	position : PropTypes.string
}

ControlBar.propTypes = {
  autoHide: PropTypes.bool
}

export default Video;