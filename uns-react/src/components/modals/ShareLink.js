import React, { Component } from 'react';
import { Modal, Button, Header, Icon, Responsive, Label } from "semantic-ui-react";
import {CopyToClipboard} from "react-copy-to-clipboard";

class ShareLink extends Component {
	state = {
		value: "",
		copied: false
	} 

	componentDidMount = () => {
		if(this.props._id) {
			const { _id, type } = this.props;
			let link = "";	
			if(process.env.NODE_ENV === 'development') {
				if(type === "text") {
					link = `https://localhost:3000/textpost/${_id}`;
				} else if(type === "image") {
					link = `https://localhost:3000/imagepost/${_id}`;
				} else if(type === "video") {
					link = `https://localhost:3000/videopost/${_id}`;
				} else {
					link = `https://localhost:3000/`;
				}
			} else if(process.env.NODE_ENV === 'production') {
				if(type === "text") {
					link = `https://truhype.app/textpost/${_id}`;
				} else if(type === "image") {
					link = `https://truhype.app/imagepost/${_id}`;
				} else if(type === "video") {
					link = `https://truhype.app/videopost/${_id}`;
				} else {
					link = `https://truhype.app/`;
				}
			}

			this.setState({ value: link });
		}
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevProps._id !== this.props._id) {
			if(this.props._id) {
				const { _id, type } = this.props;
				let link = "";		
				if(process.env.NODE_ENV === 'development') {
					if(type === "text") {
						link = `https://localhost:3000/textpost/${_id}`;
					} else if(type === "image") {
						link = `https://localhost:3000/imagepost/${_id}`;
					} else if(type === "video") {
						link = `https://localhost:3000/videopost/${_id}`;
					} else {
						link = `https://localhost:3000/`;
					}
				} else if(process.env.NODE_ENV === 'production') {
					if(type === "text") {
						link = `https://truhype.app/textpost/${_id}`;
					} else if(type === "image") {
						link = `https://truhype.app/imagepost/${_id}`;
					} else if(type === "video") {
						link = `https://truhype.app/videopost/${_id}`;
					} else {
						link = `https://truhype.app/`;
					}
				}

				this.setState({ value: link });
			}
		}	
	}

	render() {
		const { value, copied } = this.state;

		return (
			<div>
				<Modal 
					trigger={
						<div>
							<Responsive minWidth={Responsive.onlyTablet.minWidth}>
								<Button
									style={{ 
			            				borderRadius: "0px", 
			            				width: "120px"
			            			}}
								> 
									<Icon name="share alternate" /> 
								</Button>
							</Responsive>
							<Responsive {...Responsive.onlyMobile}>
								<Button 
									icon="share alternate" 
									style={{
										borderRadius: 0,
										minWidth: "60px"
									}}
								/> 
							</Responsive>
						</div>
					} 
					closeIcon
				>
					<Header icon='share alternate' content='Click to copy this link' />
					<Modal.Content>
						<div>
							{ !copied ? (
								<div>
									<Responsive {...Responsive.onlyMobile}>
										<CopyToClipboard 
											text={this.state.value}
								        	onCopy={() => this.setState({copied: true})}
								        >
								        	<span> {value.slice(0,40) + "..."} </span>
								        </CopyToClipboard>
							        </Responsive>
							        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
							        	<CopyToClipboard 
											text={this.state.value}
								        	onCopy={() => this.setState({copied: true})}
								        >
								        	<span> {value} </span>
								        </CopyToClipboard>
							        </Responsive>
						        </div>
					        ) : (
					        	<div>
					        		<Responsive {...Responsive.onlyMobile}>
						        		<Button
						        			color="grey"
						        			size="tiny" 
						        			content="Reset" 
						        			onClick={() => this.setState({ copied: false }) } 
						        		/> 
						        		<br /><br />
						        		<Label>
						        			<Header as="h5"> 
						        				{value.slice(0,35) + "..."} 
						        			</Header> 
						        		</Label>
					        		</Responsive>
							        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
							        	<Button
						        			color="grey"
						        			size="tiny" 
						        			content="Reset" 
						        			onClick={() => this.setState({ copied: false }) } 
						        		/> 
						        		<br /><br />
						        		<Label>
						        			<Header as="h5"> 
						        				{value} 
						        			</Header> 
						        		</Label>
							        </Responsive>
					        	</div>
					        )}
					        <br />
					        {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
						</div>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

export default ShareLink;