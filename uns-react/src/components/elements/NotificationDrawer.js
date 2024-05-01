import React from 'react';
import { 
	Button, 
	Grid, 
	// Feed, 
	Popup,
	// Image,
	Header,
	Icon,
	Responsive
} from 'semantic-ui-react';

const style = {
	opacity: 0.9,
	padding: "5px",
	backgroundColor: "#f9f9f9",
	height: "450px",
	minWidth: "250px",
	overflowY: "scroll",
	position: "fixed",
	bottom: 40
};

class PopupExampleControlled extends React.Component {
  state = { isOpen: false };

  handleOpen = () => {
    this.setState({ isOpen: true })
  };

  handleClose = () => {
    this.setState({ isOpen: false });
  };

  render() {

  	const NotifContent = (
		<div>
			<Header as="h3">All Notifications</Header>
			<p>No notifications</p>
			{/*<Feed>
				<Feed.Event>
					<Feed.Label>
						<Image src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
					</Feed.Label>
					<Feed.Content>
						You added Elliot Fu to the group Coworkers
					</Feed.Content>
				</Feed.Event>

				<Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>

			    <Feed.Event>
			      <Feed.Label icon='pencil' />
			      <Feed.Content date='Today' summary="You posted on your friend Stevie Feliciano's wall." />
			    </Feed.Event>
			</Feed>*/}
		</div>
	);

    return (
      <Grid>
        <Grid.Column width={8}>
          <Popup
          	keepInViewPort
          	wide="very"
            trigger={
            	<div>
	            	<Responsive {...Responsive.onlyMobile}>
		            	<Button color="grey" style={{ borderRadius: "0px" }}>
		            		<Icon name="bullhorn" />
		            	</Button>
	            	</Responsive>
	            	<Responsive minWidth={Responsive.onlyTablet.minWidth}>
	            		<Button 
	            			className="overlayBtn"
	            			color="grey" 
	            			style={{ 
	            				borderRadius: "0px", 
	            				minWidth: "120px"
	            			}}
	            		>
		            		<Icon name="bullhorn" />
		            	</Button>
	            	</Responsive>
            	</div>
            }
            content={NotifContent}
            on='click'
            open={this.state.isOpen}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
            position='right center'
            size="large"
            style={style}
          />
        </Grid.Column>
      </Grid>
    )
  }
}

export default PopupExampleControlled;
