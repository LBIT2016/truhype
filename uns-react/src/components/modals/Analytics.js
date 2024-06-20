import React, { Component } from 'react';
import { Modal, Header, Icon, Segment, List, Statistic, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import { getAnalytics } from "../../actions/users";


class Analytics extends Component {
	state = {}

	componentDidMount = () => {
		this.props.getAnalytics();
	}

	onClickAnalyticsBtn = () => {
		this.props.getAnalytics();
	}

	render() {
		const { analytics } = this.props;

		return (
			<div>
				<Modal 
					trigger={
						<div>
							<Icon size="large" name="line graph" />
							<p>Analytics</p>
						</div>
					} 
					closeIcon
				>
					<Header 
						icon='line graph' 
						content='Statistics' 
					/>
					<Modal.Content>
						<Segment align="center" style={{ padding: 40, backgroundColor: "#E0E1E2" }}>
							<List horizontal relaxed>
								<List.Item>
									<Statistic size="tiny">
										<Statistic.Value><Icon name="angle up" /></Statistic.Value>
										<Statistic.Label>{analytics && analytics.upvotes_given}</Statistic.Label>
									</Statistic>
								</List.Item>
								<List.Item style={{ marginLeft: "3rem", marginRight: "3rem" }}>
									<Statistic size="tiny">
										<Statistic.Value><Icon name="eye" /></Statistic.Value>
										<Statistic.Label>{analytics && analytics.posts_seen}</Statistic.Label>
									</Statistic>
								</List.Item>
								<List.Item>
									<Statistic size="tiny">
										<Statistic.Value><Icon name="angle down" /></Statistic.Value>
										<Statistic.Label>{analytics && analytics.downvotes_given}</Statistic.Label>
									</Statistic>
								</List.Item>
							</List>
							<br /><br />
							<Button content="Update analytics" color="grey" onClick={this.onClickAnalyticsBtn}/>
						</Segment>
					</Modal.Content>
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		analytics: state.user.analytics
	}
}

export default connect(mapStateToProps, { getAnalytics })(Analytics);