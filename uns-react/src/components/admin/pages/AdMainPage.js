import React from 'react';
import {
  Container,
  // Divider,
  Dropdown,
  // Grid,
  // Header,
  Image,
  List,
  Menu,
  Segment,
  Responsive
} from 'semantic-ui-react';
import { Button } from "semantic-ui-react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { logout } from "../../../actions/admins";

import logoImage from "../../../media/logowithoutname.png";

class AdMainPage extends React.Component {
  
  onlogout = () => {
  	this.props.logout();
  }

  render() {
  	return (
  		<div>
	    <Menu fixed='top' inverted>
	      <Container>
	        <Menu.Item as={Link} to="/admin_dashboard" header>
	          <Image size='mini' src={logoImage} style={{ marginRight: '1.5em' }} />
	          Truhype
	        </Menu.Item>
	        <Dropdown item simple text='Menu'>
	          <Dropdown.Menu>
	            <Dropdown.Item as={Link} to="/admin_upload_page">Upload</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_adposts_page">Admin Posts</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_reported_posts_page">Reported posts</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_search_page">Search posts</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_category_page">Category</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_survey_results">Survey Results</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_feedbacks">Feedbacks</Dropdown.Item>
	            <Dropdown.Item as={Link} to="/admin_change_password">Change Password</Dropdown.Item>
	            {/*<Dropdown.Divider />
	            <Dropdown.Header>Header Item</Dropdown.Header>
	            <Dropdown.Item>
	              <i className='dropdown icon' />
	              <span className='text'>Submenu</span>
	              <Dropdown.Menu>
	                <Dropdown.Item>List Item</Dropdown.Item>
	                <Dropdown.Item>List Item</Dropdown.Item>
	              </Dropdown.Menu>
	            </Dropdown.Item>
	            <Dropdown.Item>List Item</Dropdown.Item>*/}
	          </Dropdown.Menu>
	        </Dropdown>
	        <Menu.Item as={Button} onClick={this.onlogout}>Logout</Menu.Item>
	      </Container>
	    </Menu>

	    <Responsive minWidth={Responsive.onlyTablet.minWidth}>
		    <Container text style={{ marginTop: '7em', minHeight: 320 }}>
		    	{this.props.children}  	
		    </Container>
	    </Responsive>

	    <Responsive {...Responsive.onlyMobile}>
		    <Container style={{ marginTop: '7em', minHeight: 330 }}>
		    	{this.props.children}
		    </Container>
	    </Responsive>

	    <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
	      <Container textAlign='center'>
	        {/*<Grid divided inverted stackable>
	          <Grid.Column width={3}>
	            <Header inverted as='h4' content='Group 1' />
	            <List link inverted>
	              <List.Item as='a'>Link One</List.Item>
	              <List.Item as='a'>Link Two</List.Item>
	              <List.Item as='a'>Link Three</List.Item>
	              <List.Item as='a'>Link Four</List.Item>
	            </List>
	          </Grid.Column>
	          <Grid.Column width={3}>
	            <Header inverted as='h4' content='Group 2' />
	            <List link inverted>
	              <List.Item as='a'>Link One</List.Item>
	              <List.Item as='a'>Link Two</List.Item>
	              <List.Item as='a'>Link Three</List.Item>
	              <List.Item as='a'>Link Four</List.Item>
	            </List>
	          </Grid.Column>
	          <Grid.Column width={3}>
	            <Header inverted as='h4' content='Group 3' />
	            <List link inverted>
	              <List.Item as='a'>Link One</List.Item>
	              <List.Item as='a'>Link Two</List.Item>
	              <List.Item as='a'>Link Three</List.Item>
	              <List.Item as='a'>Link Four</List.Item>
	            </List>
	          </Grid.Column>
	          <Grid.Column width={7}>
	            <Header inverted as='h4' content='Footer Header' />
	            <p>
	              Extra space for a call to action inside the footer that could help re-engage users.
	            </p>
	          </Grid.Column>
	        </Grid>*/}

	        {/*<Divider inverted section />*/}
	        <Image centered size='mini' src={logoImage} />
	        <List horizontal inverted divided link size='small'>
	          <List.Item as='a' href='#'>
	            Site Map
	          </List.Item>
	          <List.Item as='a' href='#'>
	            Contact Us
	          </List.Item>
	          <List.Item as='a' href='#'>
	            Terms and Conditions
	          </List.Item>
	          <List.Item as='a' href='#'>
	            Privacy Policy
	          </List.Item>
	        </List>
	      </Container>
	    </Segment>
	  </div>
  	);
  }
  
}

export default connect(null, { logout })(AdMainPage);