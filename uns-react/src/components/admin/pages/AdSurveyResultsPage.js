import React, { Component } from 'react';
import { Table, Segment, Header, Button } from "semantic-ui-react";

import AdMainPage from "./AdMainPage";

import api from "../../../api";

class AdSurveyResultsPage extends Component {
	_isMounted = false;
	state = {
		per: 8,
		page: 1,
		totalPages: null,
		scrolling: false,
		surveys: [],
		yes: 0,
		no: 0,
		l30: 0,
		eq30: 0,
		m30: 0,
		totalResponses: 0
	}

	componentWillMount = () => {
		this.loadDocs();
		api.others.getAns1().then(ans => {
			this.setState({ yes: ans.yes, no: ans.no, totalResponses: ans.totalrs });
		});

		api.others.getAns2().then(ans => {
			this.setState({ l30: ans.l30, eq30: ans.eq30, m30: ans.m30, totalResponses: ans.totalrs });
		});
	}

	componentDidMount = () => {
		this._isMounted = true;
	}

	componentWillUnmount = () => {
		this._isMounted = false;
	}

	loadMore = () => {
		 this._isMounted && this.setState(prevState => ({
			page: prevState.page+1,
			scrolling: true
		}), this.loadDocs);
	}

	loadDocs = (number) => {
		const { per } = this.state;

		let { page } = this.state;
		if(number) {
			page = number;
			this.setState({ page: number });
		}
		/*this.props
			.fetchReportedPosts(per, page)
			.then(totalPages => {
				this._isMounted && this.setState({
					totalPages
				});
			});	*/
		api.others.getsurveys(per, page)
			.then(surveys => {
				this._isMounted && this.setState({  
					totalPages: surveys.totalPages,
					surveys: [...this.state.surveys, ...surveys.docs]
				});
			})
	}

	getAns1 = () => {
		api.others.getAns1().then(ans => {
			this._isMounted && this.setState({ yes: ans.yes, no: ans.no, totalResponses: ans.totalrs });
		});
	}

	getAns2 = () => {
		api.others.getAns2().then(ans => {
			this._isMounted && this.setState({ l30: ans.l30, eq30: ans.eq30, m30: ans.m30, totalResponses: ans.totalrs });
		});
	}

	render() {
		const { surveys, page, totalPages } = this.state;

		return (
			<AdMainPage>
				<h1>Survey Results</h1>
				<Segment>
					<p>Total number of survey responses: {this.state.totalResponses}</p>
				</Segment>
				<Segment>
					<Header as="h4">Should we add more emotions like funny, sad, wow with existing emotions love and hate?</Header>
					<p>Yes: {this.state.yes} %</p>
					<p>No: {this.state.no} %</p>
					<br />
					<Button content="update" onClick={this.getAns1} color="grey" /> 
				</Segment>
				<Segment>
					<Header as="h4">Every post should be active for?</Header>
					<p>Less than 30 days: {this.state.l30} %</p>
					<p>30 days only: {this.state.eq30} %</p>
					<p>More than 30 days: {this.state.m30} %</p>
					<br />
					<Button content="update" onClick={this.getAns2} color="grey" /> 
				</Segment>
				<Table celled striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell colSpan='3'>Any changes you wish to make on this platform?</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{ surveys.map((s, i) => (
							<Table.Row key={i}>
								<Table.Cell> {JSON.stringify(s['ans3'])} </Table.Cell>
							</Table.Row>
						))}
						{  page < totalPages && (
							<Table.Row>
								<Table.Cell onClick={this.loadMore}>Load More</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
			</AdMainPage>
		);
	}
}

export default AdSurveyResultsPage;
