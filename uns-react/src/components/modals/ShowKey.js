import React, { Component } from 'react';
import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
import { Modal, Button, Header, Icon, Responsive, Label } from "semantic-ui-react";
import {CopyToClipboard} from "react-copy-to-clipboard";
import { connect } from "react-redux";

import { getKey, regenKey } from "../../actions/users";

// dotenv.config();

class ShowKey extends Component {
	state = {
		copied: false,
		showkey: ""
	}

	componentDidMount = () => {
		this.props.getKey();
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevProps.showkey !== this.props.showkey) {
			this.convertKey(this.props.showkey);
		}	
	}

	convertKey = showkey => {
		showkey && 
		jwt.verify(showkey, process.env.REACT_APP_SECRET_KEY, (err, decoded) => {
			if(err) {
				alert(`something went wrong. Please try again later`);
			} else {
				this.setState({ showkey: decoded.key });
			}
		});
	}

	/*regenKey = e => {
		e.preventDefault();
		this.props.regenKey();
	}*/

	render() {
		const { copied, showkey } = this.state;

		return (
			<div>
				<Modal 
					trigger={
						<div>
							<Responsive minWidth={Responsive.onlyTablet.minWidth}>
								<Button color="grey"> 
									<Icon name="key" /> Show Key 
								</Button>
							</Responsive>
							<Responsive {...Responsive.onlyMobile}>
								<Icon size="large" name="key" />
								<p>Show key</p>
							</Responsive>
						</div>
					} 
					closeIcon
				>
					<Header 
						icon='key' 
						content='Use this key to login to this session on other browser/device. Click to copy.' 
					/>
					<Modal.Content>
						<div>
							{ !copied ? (
								<div>
						        	<CopyToClipboard 
										text={showkey}
							        	onCopy={() => this.setState({copied: true})}
							        >
							        	<span> {showkey} </span>
							        </CopyToClipboard>

							        {/*<div style={{ marginTop: 10 }}>
								        <Button onClick={this.regenKey}>
								        	<Icon.Group>
								        		<Icon name="key" />
								        		<Icon corner name="redo" />
								        	</Icon.Group>
								        	Regenerate Key
								        </Button>
							        </div>*/}
						        </div>
					        ) : (
					        	<div>
						        	<Button
					        			color="grey"
					        			size="tiny" 
					        			content="Reset" 
					        			onClick={() => this.setState({ copied: false }) } 
					        		/> 
					        		<br /><br />
					        		<Label>
					        			<Header as="h5"> 
					        				{showkey}
					        			</Header> 
					        		</Label>
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

function mapStateToProps(state) {
	return {
		showkey: state.user.key
	}
}

export default connect(mapStateToProps, { getKey, regenKey })(ShowKey);