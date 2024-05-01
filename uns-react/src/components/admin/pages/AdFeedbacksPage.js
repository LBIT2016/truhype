import React, { Component } from 'react';
import { Table, Segment } from "semantic-ui-react";

import AdMainPage from "./AdMainPage";

import api from "../../../api";

class AdFeedbacksPage extends Component {
	_isMounted = false;
	state = {
		per: 8,
		page: 1,
		totalPages: null,
		scrolling: false,
		activeIndex: -1,
		feedbacks: [],
		totalFeedbacks: 0
	}

	componentWillMount = () => {
		this.loadDocs();
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
		api.others.getFeedbacks(per, page)
			.then(feedbacks => {
				this._isMounted && this.setState({ 
					totalPages: feedbacks.totalPages,
					totalFeedbacks: feedbacks.totalDocs,
					feedbacks: [...this.state.feedbacks, ...feedbacks.docs]
				});
			})
	}

	render() {
		const { feedbacks, page, totalPages } = this.state;

		return (
			<AdMainPage>
				<h1>Feedbacks</h1>
				<Segment>
					<p>Total number of feedbacks: {this.state.totalFeedbacks}</p>
				</Segment>
				<Table celled striped>
					<Table.Body>
						{ feedbacks.map((f, i) => (
							<Table.Row key={i}>
								<Table.Cell>{ f['feedbacktype'] }</Table.Cell>
								<Table.Cell> {JSON.stringify(f['text'])} </Table.Cell>
							</Table.Row>
						))}
						{  page < totalPages && (
							<Table.Row>
								<Table.Cell onClick={this.loadMore}>Load More</Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>
				{ feedbacks && feedbacks.length === 0 && (
					<span>No feedbacks yet!</span>
				)}
			</AdMainPage>
		);
	}
}

export default AdFeedbacksPage;
