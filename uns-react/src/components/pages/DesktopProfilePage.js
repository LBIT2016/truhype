import React, { Component } from 'react';
import PropTypes from "prop-types";
import { 
	Grid,
	Image,
	Segment,
	Button,
	Advertisement,
	Icon,
	List,
	Statistic,
	Confirm
} from "semantic-ui-react";
import {Link} from "react-router-dom";
import { connect } from "react-redux";

import ShowKey from "../modals/ShowKey";
import { getUsername, getAnalytics } from "../../actions/users";
import { clearPosts } from "../../actions/posts";
import { clearAdPosts } from "../../actions/adposts";
import { logout } from "../../actions/auth";
import userimage_ from "../../media/user pic.png";

class DesktopProfilePage extends Component {
	state = {open: false, result: "", fireComponent: false}

	componentDidMount = () => {
		this.props.getUsername();
		this.props.getAnalytics();
	}

	handleDialogConfirm = () => {
		this.props.clearPosts();
		this.props.clearAdPosts();
		this.setState({ result: 'confirmed', open: false });
		this.props.logout();
	}

	handleDialogCancel = () => {
		this.setState({ result: 'cancelled', open: false });
	}

	handleLogout = () => {
		this.setState({ fireComponent: true, open: true });
	}

	onClickAnalyticsBtn = () => {
		this.props.getAnalytics();
	}

	render() {
		const { username, analytics } = this.props;
		const { fireComponent } = this.state;

		return (
			<div>
				{ fireComponent && (
					<Confirm
						open={this.state.open}
						content="Please note down the key to login to this session later. Otherwise, you can't access this session again!"
						onCancel={this.handleDialogCancel}
						onConfirm={this.handleDialogConfirm}
					/>
				)} 
				<div style={{ marginTop: "8px", marginLeft: "1.8rem" }}>
					<Grid centered>
						<Grid.Row>
							<Segment
								raised
								style={{
									backgroundColor: "#E0E1E2",
									minWidth: 315,
									maxWidth: 320
								}}
							>
								<Image size="tiny" centered circular src={userimage_} bordered/>
								<h1>{ username }</h1>
								Username
							</Segment>
						</Grid.Row>
					</Grid>
					<Grid centered>
						<Button  
							icon="newspaper" 
							labelPosition="left" 
							content="Posts" 
							color="grey" 
							as={Link}
							to="/posts"
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Button  
							icon="sign out" 
							labelPosition="right" 
							content="Opt Out" 
							color="grey" 
							onClick={this.handleLogout}
						/>
					</Grid>
					<Grid centered>
						<div style={{ marginTop: 5 }}>
							<ShowKey />
						</div>
					</Grid>
					<Grid>
						<Grid.Row>
							<Segment align="center" style={{ padding: 10, width: 315 }}>
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
						</Grid.Row>
					</Grid>
					<Grid>
						<Advertisement unit="medium rectangle" test="Sample Ad" />
					</Grid>
				</div>
			</div>
		);
	}
}

DesktopProfilePage.propTypes = {
	username : PropTypes.string
}

function mapStateToProps(state) {
	return {
		username: state.user.username,
		analytics: state.user.analytics
	}
}

export default connect(mapStateToProps, 
	{ 
		logout, 
		getUsername, 
		getAnalytics,
		clearAdPosts,
		clearPosts 
	}
)(DesktopProfilePage);