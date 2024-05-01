import React from 'react';
import { Menu, Sidebar, Icon, Container, Image, Confirm } from "semantic-ui-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import ShowKey from "../modals/ShowKey";
import Analytics from "../modals/Analytics";

import { logout } from "../../actions/auth";
import { getUsername } from "../../actions/users";
import { clearPosts } from "../../actions/posts";
import { clearAdPosts } from "../../actions/adposts";
import userimage_ from "../../media/user pic.png";

class ProfileDrawerSidebar extends React.Component {
	state = { open: false, result: "", fireComponent: false }

	componentDidMount = () => {
		this.props.getUsername();	
	}

	handleDialogConfirm = () => { 
		this.props.clearPosts();
		this.props.clearAdPosts();
		this.setState({ result: 'confirmed', open: false })
		this.props.logout();
	}

	handleDialogCancel = () => {
		this.setState({ result: 'cancelled', open: false });
	}

	handleLogout = () => {
		this.setState({ fireComponent: true, open: true });
	}

	render() {
		const { username, visibleLeft, handleLeftClick } = this.props;
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
				<Sidebar
					as={Menu}
					animations="overlay"
					vertical
					direction="left"
					icon="labeled"
					onClick={handleLeftClick}
					visible={visibleLeft}
					width="thin"
					style={{ backgroundColor: "#f9f9f9" }}
				>
					<Container align="right">
						<Icon name="close" />
					</Container>
					<Menu.Item>
						<Image size="tiny" centered circular src={userimage_} bordered/>
						<h3>{username}</h3>
						Username
					</Menu.Item>
					<Menu.Item as={Link} to="/posts">
						<Icon name="newspaper outline" />
						Posts
					</Menu.Item>
					<Menu.Item as="a">
						<ShowKey />
					</Menu.Item>
					<Menu.Item as="a">
						{/*<Icon name="line graph" />
						Analytics*/}
						<Analytics />
					</Menu.Item>
					<Menu.Item as="a" onClick={this.handleLogout}>
						<Icon name="log out" />
						Opt Out
					</Menu.Item>
				</Sidebar>
			</div>
		);
	}
};

ProfileDrawerSidebar.propTypes = {
	username : PropTypes.string,
	visibleLeft : PropTypes.bool.isRequired,
	handleLeftClick : PropTypes.func.isRequired
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
		clearPosts,
		clearAdPosts
	}
)(ProfileDrawerSidebar);
