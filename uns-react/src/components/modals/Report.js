import React, { Component } from 'react';
import { Modal, Button, Header, Icon, Responsive, Dropdown, Input, Form } from "semantic-ui-react";

import api from "../../api";
import SuccessMessage from "../messages/SuccessMessage";

class Report extends Component {
	state ={
		reportoption: "",
		Otherreason: "",
		postId: "",
		success: "",
		options: [
			{key: 1, text: "Cyber Bullying", value: "Cyber Bullying"},
			{key: 2, text: "Hate Speech", value: "Hate Speech"},
			{key: 3, text: "Racism", value: "Racism"},
			{key: 4, text: "Offensive words", value: "Offensive words"},
			{key: 5, text: "Spam", value: "Spam"},
			{key: 6, text: "Nudity / Pornography", value: "Nudity / Pornography"},
			{key: 7, text: "False Information", value: "False Information"},
			{key: 8, text: "Terrorism", value: "Terrorism"},
			{key: 9, text: "Other", value: "Other"}
		]
	}

	componentDidMount = () => {
		this._isMounted = true;	
		if(this.props._id) {
			this.setState({ postId: this.props._id });
		}
	}

	componentWillUnmount = () => {
		this._isMounted = false;	
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.reportoption !== this.state.reportoption) {
			if(this.state.reportoption !== "Other") {
				this.setState({ Otherreason: "" });
			}
		}	

		if(prevProps._id !== this.props._id) {
			this.setState({ postId: this.props._id });
		}
	}

	handleChange = (e, { name, value }) => {
		this.setState({ [name]: value });
	}

	handleSubmit = e => {
		e.preventDefault();


		const { Otherreason, reportoption, postId } = this.state;
		const { isAdpost } = this.props;
		
		if(!Otherreason) {
			if(!reportoption) {
				alert(`Reason needed!`);
				return;
			}
		}

		let reason = (Otherreason !== "") ? Otherreason : reportoption;

		if(isAdpost) {
			api.adposts.insertReport(postId, reason)
				.then(success => {
					if(success) {
						this._isMounted && this.setState({ success: true });
					}
				})
		} else {
			api.posts.insertReport(postId, reason)
				.then(success => {
					if(success) {
						this._isMounted && this.setState({ success: true });
					}
				})
		}
	}

	render() {
		const { reportoption, options, Otherreason } = this.state;

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
									<Icon name="flag" /> 
								</Button>
							</Responsive>
							<Responsive {...Responsive.onlyMobile}>
								<Button 
									icon="flag" 
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
					<Header icon='flag' content='Report' />
					<Modal.Content>
					{ !this.state.success ? (
						<div>
							<Dropdown 
								options={options}
								value={reportoption}
								selection
								fluid
								name="reportoption"
								placeholder="Select reason"
								scrolling
								onChange={this.handleChange}
							/>
							{ reportoption === "Other" && (
								<Form style={{ marginTop: 10 }}>
									<Input 
										name="Otherreason"
										value={Otherreason}
										fluid 
										onChange={this.handleChange} 
										placeholder="Please specify"
									/>
								</Form>
							)}
						</div>
					) : (
						<SuccessMessage text="Thanks for the feedback!" />
					)}
					</Modal.Content>
					{ !this.state.success ? (
						<Modal.Actions>
							<Button color='green' onClick={this.handleSubmit} >
								<Icon name='checkmark'/> Submit
							</Button>
						</Modal.Actions>
					) : (
						null
					)} 
				</Modal>
			</div>
		);
	}
}

export default Report;