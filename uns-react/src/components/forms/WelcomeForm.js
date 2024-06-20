import React, { Component } from 'react';
import { 
	Grid, 
	Container, 
	Responsive, 
	Image, 
	List, 
	Segment, 
	Card, 
	Button, 
	Icon 
} from "semantic-ui-react";

import logowithname from "../../media/logowithname.png";
import InlineError from "../messages/InlineError";
// import ReCAPTCHA from "../elements/ReCAPTCHA";

const card1 = (
	<div>
		<Image size="small" src={logowithname} />
		<Container style={{ padding: "10px", paddingTop: "40px" }}>
			{`"Silence is the most powerful scream"`}
		</Container>
	</div>
);

const card2 = (
	<div>
		<Image size="small" src={logowithname} />
		<Container style={{ padding: "10px", paddingTop: "25px"}}>
			{"Truhype is an online content sharing and interaction platform based on your opinions"}
		</Container>
	</div>
);

const card3 = (
	<div>
		<Image style={{ top: 0 }} size="small" src={logowithname} />
		<Container align="left" style={{ padding: "10px", fontSize: "15px", paddingTop: "20px" }} textAlign="justified">
			<List bulleted>
				<List.Item> {"Every post will be deleted after 30 days upload."} </List.Item>
				<List.Item> {"We respect your privacy that's why we don't take your email and personal detail."} </List.Item>
				<List.Item> {"Feel free to report any post that offends you."} </List.Item>
			</List>
		</Container>
	</div>
);

const card4 = (
	<div>
		<Image size="small" src={logowithname} />
		<Container style={{ padding: "10px", paddingTop: "40px" }}>
			{`Welcome to our small family`}
		</Container>
	</div>
);

class WelcomeForm extends Component {
	_isMounted = false;
	state = {
		cardno: 1,
		loading: false,
		errors: {}
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	 componentWillUnmount = () => {
	 	this._isMounted = false;
	 }

	handleCardNo = () => {
		let { cardno } = this.state;
		cardno++;
		this._isMounted && this.setState({ cardno });
	}

	onSignUp = e => {
		e.preventDefault();
		// this.setState({ loading: true });
		// this.props.submit().catch(err => {
			// this._isMounted &&
			// this.setState({ cardno: 0, loading: false, errors: err.response.data.errors });
		this.props.history.push("/welcome2");
		// });
	}

	onLogIn = e => {
		e.preventDefault();
		this.props.history.push("/login");
	}

	render() {
		const { cardno, loading, errors } = this.state;

		return (
			<div>
				<div>
					{ errors.global && (
						<InlineError text={errors.global} />
					)}
				</div>
				<div style={{ backgroundColor: "#f9f9f9" }}>
					<Responsive minWidth={Responsive.onlyTablet.minWidth}>
						{ Object.keys(errors).length === 0 &&
							(<Grid
								textAlign="center"
								style={{ height: window.innerHeight }}
								verticalAlign="middle"
							>
								<Grid.Column style={{ maxWidth: 800 }}>
									<Card.Group itemsPerRow={2}>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }} loading={loading}>
												{card1}
											</Segment>
										</Card>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }} loading={loading}>
												{card2}
											</Segment>
										</Card>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }} loading={loading}>
												{card3}
											</Segment>
										</Card>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }} loading={loading}>
												{card4}
											</Segment>
										</Card>
									</Card.Group>
									{/*<Container textAlign="center">
										<ReCAPTCHA />
									</Container>*/}
									<Container style={{ marginTop: "20px" }}>
										<Button.Group size="big">
											<Button color="grey" onClick={this.onSignUp}>
												Get new Session &nbsp; <Icon name="signup" />
											</Button>
											<Button.Or />
											<Button color="black" onClick={this.onLogIn}>
												Login to Session &nbsp; <Icon name="sign-in" />
											</Button>
										</Button.Group>
									</Container>
								</Grid.Column>
							</Grid>
						)}
					</Responsive>
					<Responsive {...Responsive.onlyMobile}>
						<Grid
							textAlign="center"
							style={{ height: window.innerHeight, backgroundColor: "#f9f9f9" }}
							verticalAlign="middle"
						>
							<Grid.Column style={{ maxWidth: window.innerWidth - 50 }}>
								{ cardno === 1 && (
									<div>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }}>
												{card1}
											</Segment>
										</Card>
										<Container style={{ marginTop: "20px" }}>
											<Button color="grey" onClick={this.handleCardNo}>
												Next <Icon name="angle right" />
											</Button>
										</Container>
									</div>
								)}
								{ cardno === 2 && (
									<div>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "250px" }}>
												{card2}
											</Segment>
										</Card>
										<Container style={{ marginTop: "20px" }}>
											<Button color="grey" onClick={this.handleCardNo}>
												Next <Icon name="angle right" />
											</Button>
										</Container>
									</div>
								)}
								{ cardno === 3 && (
									<div>
										<Card>
											<Segment align="middle" raised style={{ height: "280px" }}>
												{card3}
											</Segment>
										</Card>
										<Container style={{ marginTop: "20px" }}>
											<Button color="grey" onClick={this.handleCardNo}>
												Next <Icon name="angle right" />
											</Button>
										</Container>
									</div>
								)}
								{ cardno === 4 && (
									<div>
										<Card>
											<Segment size="big" align="middle" raised style={{ height: "200px" }} loading={loading}>
												{card4}
											</Segment>
										</Card>
										{/*<ReCAPTCHA />*/}
										<Container style={{ marginTop: "20px" }}>
											<Button.Group>
												<Button color="grey" onClick={this.onSignUp}>
													Get new &nbsp; <Icon name="signup" />
												</Button>
												<Button.Or />
												<Button color="black" onClick={this.onLogIn}>
													Login &nbsp; <Icon name="sign-in" />
												</Button>
											</Button.Group>
										</Container>
									</div>
								)}
							</Grid.Column>
						</Grid>
					</Responsive>
				</div>
			</div>
		);
	}
}

export default WelcomeForm;