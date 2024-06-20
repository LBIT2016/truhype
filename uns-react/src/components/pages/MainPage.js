import React, { Component } from 'react';
import { 
	Sidebar,
	Grid, 
	Container, 
	Icon, 
	Button, 
	Segment,
	Responsive,
	Image
} from "semantic-ui-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import NotificationDrawer from "../elements/NotificationDrawer";
import ProfileDrawerSidebar from "../elements/ProfileDrawerSidebar";

import logobrand from "../../media/logofavicon.ico";


class MainPage extends Component {
	state = { 
		visibleLeft: false,
		activeMenuItem: ""
	}

	handleLeftClick = () => this.setState({ visibleLeft: !this.state.visibleLeft })

	handleRef = node => this.setState({ node })

	render() {
		const { visibleLeft, node } = this.state;
		const { pathname, showTopBar, showBottomBar, showTopIcons } = this.props;

		let isIE = /*@cc_on!@*/false || !!document.documentMode;
		let isEdge = !isIE && !!window.StyleMedia;

		return (
			<div>
				{showBottomBar && (
					<div>
						<Responsive {...Responsive.onlyMobile}>
							<div className="ui bottom fixed menu">
								<Button.Group widths="5" color="grey" size="large">
									<Button 
										active={pathname === "/"} 
										as={Link} 
										to="/" 
										// onClick={() => this.props.handleRoute("local")}
									>
										<Icon name="location arrow"/>
									</Button>
									<Button 
										active={pathname === "/global"} 
										as={Link} 
										to="/global" 
										style={{ paddingLeft: "29px" }}
										// onClick={() => this.props.handleRoute("global")}
									> 
										<Icon name="world"/> 
									</Button>
									<Button active={pathname === "/upload"} as={Link} to="/upload" style={{ paddingLeft: "29px" }}> 
										<Icon name="plus circle"/>
									</Button>
									{/* <Button icon="bullhorn" /> */}
									<NotificationDrawer /> 
									<Button active={pathname === "/search"} as={Link} to="/search"> 
										<Icon name="search"/> 
									</Button>
								</Button.Group>
							</div>
						</Responsive>

						<Responsive minWidth={Responsive.onlyTablet.minWidth}>
							<div
								style={{
									position: "fixed",
									top: window.innerHeight - 40,
									bottom: 0,
									right: 350,
									left: 350,
									height: "40px",
									zIndex: 1
								}}
								ref={this.handleRef}
							>
								<Button.Group widths="5" color="grey" size="large">
									<Button 
										active={pathname === "/"} 
										as={Link} 
										to="/" 
										// onClick={() => this.props.handleRoute("local")}
									>
										<Icon name="location arrow"/>
									</Button>
									<Button 
										active={pathname === "/global"} 
										as={Link} 
										to="/global" 
										// onClick={() => this.props.handleRoute("global")}
									> 
										<Icon name="world"/> 
									</Button>
									<Button active={pathname === "/upload"} as={Link} to="/upload"> 
										<Icon name="plus circle"/>
									</Button>	
									{/* <Button icon="bullhorn" /> */}
									<NotificationDrawer node={node} />
									<Button active={pathname === "/search"} as={Link} to="/search"> 
										<Icon name="search"/> 
									</Button>
								</Button.Group>
							</div>
						</Responsive>
					</div>
				)}
				<Sidebar.Pushable as={Segment} attached="bottom">
					{/* Left Sidebar */}
					{ showTopIcons && (
						<ProfileDrawerSidebar 
							visibleLeft={visibleLeft} 
							handleLeftClick={this.handleLeftClick}
						/>
					)}

					<Sidebar.Pusher 
						dimmed={visibleLeft}
					>
						{/* Mobile View */}
						<Responsive {...Responsive.onlyMobile}>
							<Segment 
								style={{ 
									minHeight: window.innerHeight, 
									backgroundColor: "#f9f9f9", 
									padding: "5px", 
									paddingTop: "15px",
									paddingBottom: "42px"
								}} 
							>
								<Grid centered>
									{ showTopIcons && (
										<Grid.Row columns={3}>
											<Grid.Column>
												<Container align="left" onClick={this.handleLeftClick}>
													<Icon size="large" name="bars" />
												</Container>
											</Grid.Column>
											<Grid.Column>
												{ isEdge ? (
													<Container align="middle" textAlign="center">
														<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
															<Image size="mini" src={logobrand} />
														</a>
													</Container>
												) : (
													<Container align="middle">
														<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
															<Image size="mini" src={logobrand} />
														</a>
													</Container>
												)}
											</Grid.Column>
											<Grid.Column>
												<Container align="right" as={Link} to="/menu">
													<Icon size="large" color="black" name="ellipsis vertical" />
												</Container>
											</Grid.Column>
										</Grid.Row>
									)}

									{ showTopBar && (
										<Grid.Row style={{ marginTop: "-18px" }}>
											<Button.Group fluid size="medium">
												<Button color="red" value="Loved" onClick={this.props.handleFilter}>
													Loved
												</Button>
												<Button color="purple" value="Latest" onClick={this.props.handleFilter}>
													Latest
												</Button>
												<Button color="grey" value="Hated" onClick={this.props.handleFilter}>
													Hated
												</Button>
											</Button.Group>
										</Grid.Row>
									)}

								</Grid>
								{this.props.children}
				            </Segment>
				        </Responsive>

				    	{/* Desktop View */}
				        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
							<Segment style={{ 
								minHeight: window.innerHeight, 
								backgroundColor: "#f9f9f9", 
								padding: "20px", 
								paddingTop: "15px",
								paddingBottom: "35px"
							}} >
								<Grid centered>
									<Grid.Row columns={3}>
										<Grid.Column />
										<Grid.Column textAlign="center">
											{ isEdge ? (
												<Container align="middle" textAlign="center">
													<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
														<Image centered size="mini" src={logobrand} />
													</a>
												</Container>
											) : (
												<Container align="middle">
													<a href="https://about.truhype.app/home" rel="noopener noreferrer" target="_blank">
														<Image size="mini" src={logobrand} />
													</a>
												</Container>
											)}
										</Grid.Column>
										<Grid.Column />
									</Grid.Row>

									{ showTopBar && (
										<Grid.Row style={{ marginTop: "-18px" }}>
											<Button.Group fluid size="medium">
												<Button color="red" value="Loved" onClick={this.props.handleFilter}>
													Loved
												</Button>
												<Button color="purple" value="Latest" onClick={this.props.handleFilter}>
													Latest
												</Button>
												<Button color="grey" value="Hated" onClick={this.props.handleFilter}>
													Hated
												</Button>
											</Button.Group>
										</Grid.Row>
									)}
								</Grid>
								{this.props.children}
				            </Segment>
				        </Responsive>
					</Sidebar.Pusher>
				</Sidebar.Pushable>
			</div>
		);
	}
}

MainPage.propTypes = {
	pathname : PropTypes.string.isRequired,
	filter : PropTypes.string.isRequired,
	handleFilter : PropTypes.func.isRequired,
	showTopBar : PropTypes.bool.isRequired
}

export default MainPage;
