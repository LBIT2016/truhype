import React, { Component } from 'react';
import { 
	Grid, 
	Container, 
	Button, 
	Icon, 
	Accordion,
	Menu,
	Image,
	TextArea,
	Form,
	Dropdown,
	Header,
	List
} from "semantic-ui-react";
import { connect } from "react-redux";
// import {Link} from "react-router-dom";

import api from "../../api";
import logobrand from "../../media/logofavicon.ico";
import SuccessMessage from "../messages/SuccessMessage";

import { allActivitySelector } from "../../reducers/user";
import { getActivity, clearActivity } from "../../actions/users";

class MenuPage extends Component {
	state = {
		activeIndex: -1,
		feedback: {
			feedbacktype: "",
			text: ""
		},
		feedbacksuccess: false,
		survey: {
			ans1: "",
			ans2: "",
			ans3: ""
		},
		surveysuccess: false,
		per: 15,
		page: 1,
		totalPages: null,
		scrolling: false
	}

	componentWillMount = () => {
		this.loadActivity();
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	componentWillUnmount = () => {
		this._isMounted = false;
		this.props.clearActivity();
	}

	loadMore = () => {
		 this._isMounted && this.setState(prevState => ({
			page: prevState.page+1,
			scrolling: true
		}), this.loadActivity);
	}

	loadActivity = (number) => {
		const { per } = this.state;
		let { page } = this.state;
		if(number) {
			page = number;
			this.setState({ page: number });
		}
		this.props
			.getActivity(per, page)
			.then(totalPages => {
				this._isMounted && this.setState({
					scrolling: false,
					totalPages
				});
			});	
	}

	handleAccClick = (e, titleProps) => {
		const { index } = titleProps;
		const { activeIndex } = this.state;
		const newIndex = activeIndex === index ? -1 : index;

		this.setState({ activeIndex: newIndex });
	}

	handleFeedbackChange = (e, { name, value }) => {
		this.setState({
			feedback: { ...this.state.feedback, [name]: value }
		});
	}

	handleSurveyChange = (e, { name, value }) => {
		this.setState({
			survey: { ...this.state.survey, [name]: value }
		});
	}

	handleFeedbackSubmit = e => {
		e.preventDefault();
		const { feedbacktype, text } = this.state.feedback;

		// checking for the errors
		let errors = {};
		if(!feedbacktype) errors.feedbacktype = "Feedback Type needed!";
		if(!text) errors.text = "Feedback needed";

		if(Object.keys(errors).length === 0) {	// if there are no errors
			api.others
				.insertfeedback(this.state.feedback)
				.then(success => {
					if(!success) {
						alert(`Something went wrong. Please try again!`);
					} else {
						this.setState({ feedbacksuccess: true });
					}
				});
		} else {							// if there are errors, then display error message to user.
			let displayError = "";
			displayError += Object.values(errors);
			alert(displayError);
		}
	}

	handleSurveySubmit = e => {
		e.preventDefault();
		const { ans1, ans2, ans3 } = this.state.survey;

		let errors = {};
		if(!ans1) errors.ans1 = "Answer1 needed!";
		if(!ans2) errors.ans2 = "Answer2 needed!";
		if(!ans3) errors.ans3 = "Answer3 needed!";

		if(Object.keys(errors).length === 0) {	// if there are no errors
			api.others
				.insertsurvey(this.state.survey)
				.then(success => {
					if(!success) {
						alert(`Something went wrong. Please try again!`);
					} else {
						this.setState({ surveysuccess: true });
					}
				});
		} else {							// if there are errors, then display error message to user.
			let displayError = "";
			displayError += Object.values(errors);
			alert(displayError);
		}
	}

	onButtonClick = e => {
		e.preventDefault();
		this.props.clearActivity();
		this.loadActivity(1);
	}

	render() {
		const { activeIndex, feedbacksuccess, surveysuccess } = this.state;
		const { feedbacktype, text } = this.state.feedback;
		const { ans1, ans2, ans3 } = this.state.survey;
		const { activity } = this.props;
		const { page, totalPages } = this.state;

		const feedbackOptions = [
			{ id: 0, text: "Suggestion", value: "suggestion" },
			{ id: 1, text: "Problem", value: "problem" },
			{ id: 0, text: "Question", value: "question" },
			{ id: 0, text: "Opinion", value: "opinion" },
			{ id: 0, text: "Other", value: "other" }
		];

		const activitybody =
			activity && 
			activity.length > 0 &&
				activity.map((act, i) => {
					if(act.action === "upvote") {
						return (
							<List.Item key={i}>
								<List.Icon name='angle up' />
								<List.Content verticalAlign='middle'>You have upvoted post {act.postId}</List.Content>
							</List.Item>	
						)
					} else if(act.action === "downvote") {
						return (
							<List.Item key={i}>
								<List.Icon name='angle down' />
								<List.Content verticalAlign='middle'>You have downvoted post {act.postId}</List.Content>
							</List.Item>
						)
					} else if(act.action === "report") {
						return (
							<List.Item key={i}>
								<List.Icon name='flag' />
								<List.Content verticalAlign='middle'>You have reported post {act.postId}</List.Content>
							</List.Item>
						)
					} else if(act.action === "comment") {
						return (
							<List.Item key={i}>
								<List.Icon name='comment' />
								<List.Content verticalAlign='middle'>You have commented post {act.postId}</List.Content>
							</List.Item>
						)
					} else if(act.action === "delete") {
						return (
							<List.Item key={i}>
								<List.Icon name='trash alternate outline' />
								<List.Content verticalAlign='middle'>You have deleted posts</List.Content>
							</List.Item>
						)
					} else if(act.action === "create") {
						return (
							<List.Item key={i}>
								<List.Icon name='upload' />
								<List.Content verticalAlign='middle'>You have uploaded post {act.postId}</List.Content>
							</List.Item>
						)
					} 
					return null;
				});

		return (
			<div style={{ backgroundColor: "#f9f9f9", minHeight: window.innerHeight, padding: "15px" }}>
				<Grid centered>
					<Grid.Row columns={3} style={{ marginTop: "5px" }}>
						<Grid.Column>
							<Container align="left" onClick={() => this.props.history.goBack()}>
								<Button size="medium" icon="angle left" color="grey" />
							</Container>
						</Grid.Column>
						<Grid.Column>
							<Container align="middle" style={{ marginTop: "5px" }}>
								<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
									<Image size="mini" src={logobrand} />
								</a>
							</Container>
						</Grid.Column>
						<Grid.Column />
					</Grid.Row>

					<Grid.Row>
						<Accordion as={Menu} vertical fluid>
							<Menu.Item>
								<Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleAccClick}>
						          <Icon name='dropdown' />
						          Activity Log
						        </Accordion.Title>
						        <Accordion.Content active={activeIndex === 0}>
									<Button 
										style={{ marginTop: 10 }}
										size="small" 
										fluid 
										content="update log" 
										onClick={this.onButtonClick} 
									/>
									<hr />
									<div
										style={{ 
											height: 300, 
											overflowY: "scroll", 
											overflowX: "hidden" 
										}}
									>
										<List celled floated="left">
											{activitybody}
										</List>
										{ !!totalPages && page < totalPages ? (
											<Button 
												style={{ marginTop: 10 }}
												size="mini" 
												circular
												color="grey"
												icon="triangle down" 
												onClick={this.loadMore} 
											/>	
										) : (
											<Header as="h6">Activity reached to end</Header>
										)}
									</div>
						        </Accordion.Content>
					        </Menu.Item>

					        <Menu.Item>
						        <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleAccClick}>
						          <Icon name='dropdown' />
						          Feedback
						        </Accordion.Title>
						        <Accordion.Content active={activeIndex === 1}>
									{ !feedbacksuccess ? (
										<div>
											<Form>
												<Form.Field>
													<Dropdown
														selection
														placeholder="Select type"
														name="feedbacktype"
														value={feedbacktype}
														onChange={this.handleFeedbackChange}
														options={feedbackOptions}
													/>
												</Form.Field>
												<Form.Field>
													<TextArea
														rows={6}
														placeholder="Feedback here ..."
														style={{ minHeight: 30 }}
														name="text"
														value={text}
														onChange={this.handleFeedbackChange}
													/>
												</Form.Field>
											</Form>
											<br />
											<Button onClick={this.handleFeedbackSubmit} content="Submit" fluid />
										</div>
									) : (
										<SuccessMessage text="Thank you for your feedback!" />
									)}
						        </Accordion.Content>
					        </Menu.Item>

					        <Menu.Item>
						        <Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleAccClick}>
									<Icon name='dropdown' />
									Survey
						        </Accordion.Title>
						        <Accordion.Content active={activeIndex === 2}>
						         	{ !surveysuccess ? (
						         		<div>
							         		<p>Answer these question to make this platform a better place</p>
								         	<Form>
								         		<Header as="h4">Q1.&nbsp;Should we add more emotions like funny, sad, wow with existing emotions love and hate?</Header>
								         		<Form.Group inline>
								         			<Form.Radio 
								         				label="Yes"
								         				value="yes"
								         				name="ans1"
								         				checked={ans1 === "yes"}
								         				onChange={this.handleSurveyChange}
								         			/>
								         			<Form.Radio 
								         				label="No"
								         				value="no"
								         				name="ans1"
								         				checked={ans1 === "no"}
								         				onChange={this.handleSurveyChange}
								         			/>
								         		</Form.Group>

								         		<Header as="h4">Q2.&nbsp;Every post should be active for</Header>
								         		<Form.Group inline>
								         			<Form.Radio 
								         				label="Less than 30 Days"
								         				value="less than 30 days"
								         				name="ans2"
								         				checked={ans2 === "less than 30 days"}
								         				onChange={this.handleSurveyChange}
								         			/>
								         			<Form.Radio 
								         				label="30 Days only"
								         				value="30 days only"
								         				name="ans2"
								         				checked={ans2 === "30 days only"}
								         				onChange={this.handleSurveyChange}
								         			/>
								         			<Form.Radio 
								         				label="More than 30 Days"
								         				value="more than 30 days"
								         				name="ans2"
								         				checked={ans2 === "more than 30 days"}
								         				onChange={this.handleSurveyChange}
								         			/>
								         		</Form.Group>

								         		<Header as="h4">Q3.&nbsp;Any changes you wish to make on this platform?</Header>
								         		<Form.Field>
													<TextArea
														rows={6}
														placeholder="Answer here ..."
														style={{ minHeight: 30 }}
														name="ans3"
														value={ans3}
														onChange={this.handleSurveyChange}
													/>
												</Form.Field>
												<Form.Button onClick={this.handleSurveySubmit} content="Submit" fluid />
								         	</Form>
								         </div>
							        ) : (
							        	<SuccessMessage text="Thank you for your support" />
							        )}
						        </Accordion.Content>
					        </Menu.Item>

					        <Menu.Item>
								<Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleAccClick}>
									<Icon name='dropdown' />
									Blog
						        </Accordion.Title>
							    <Accordion.Content active={activeIndex === 3}>
							        <p>“Words of one. Voice of others”</p>
							        <br />
							        <p>Missing the best content of the week visit our blog</p>
							        <a 
							        	href="https://blog.truhype.app"
							        	target="_blank"
							        	rel="noopener noreferrer"
							        	style={{
							        		display: "block",
							        		border: "1px solid grey",
							        		padding: 8,
							        		backgroundColor: "grey",
							        		color: "white",
							        		borderRadius: 3
							        	}}
							        >
							        	Visit Blog
							        </a>
						        </Accordion.Content>
					        </Menu.Item>

					        <Menu.Item>
								<Accordion.Title active={activeIndex === 4} index={4} onClick={this.handleAccClick}>
									<Icon name='dropdown' />
									Sponsor
						        </Accordion.Title>
							    <Accordion.Content active={activeIndex === 4}>
							        <p>“A good advertisement is one which sells the product without drawing attention to itself.”</p>
							        <br />
							        <p>Start promotion from your own city.</p>
							        <a 
							        	href="https://business.truhype.app"
							        	target="_blank"
							        	rel="noopener noreferrer"
							        	style={{
							        		display: "block",
							        		border: "1px solid grey",
							        		padding: 8,
							        		backgroundColor: "grey",
							        		color: "white",
							        		borderRadius: 3
							        	}}
							        >
							        	Start Advertising
							        </a>
						        </Accordion.Content>
					        </Menu.Item>

						</Accordion>
					</Grid.Row>

					<Grid.Row>
						<Container fluid>
							<a 
								rel="noopener noreferrer" 
								href="https://about.truhype.app/copyright"
								target="_blank"
							>
								&copy; 2019 Truhype 
							</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<a 
								rel="noopener noreferrer" 
								href="https://about.truhype.app/home"
								target="_blank"
							>
								About 
							</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<a 
								rel="noopener noreferrer" 
								href="https://business.truhype.app/pricing"
								target="_blank"
							>
								Ads Info 
							</a>&nbsp;&nbsp;&nbsp;&nbsp;
							<a 
								rel="noopener noreferrer" 
								href="https://about.truhype.app/privacy-policy"
								target="_blank"
							>
								Privacy policy
							</a> &nbsp;&nbsp;&nbsp;&nbsp;
							<a 
								rel="noopener noreferrer" 
								href="https://about.truhype.app/tc"
								target="_blank"
							>
								Terms and Conditions 
							</a>&nbsp;&nbsp;&nbsp;	
						</Container>
					</Grid.Row>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		activity: allActivitySelector(state)
	}
}

export default connect(mapStateToProps, { getActivity, clearActivity })(MenuPage);