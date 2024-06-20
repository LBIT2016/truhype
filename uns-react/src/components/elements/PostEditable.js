import React from "react";
import { 
	Segment, 
	Grid, 
	Header,
	TextArea, 
	Card, 
	Icon,
	Form,
	Input,
	Dropdown,
	Button,
	Container
} from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { getlocation } from "../../actions/users"; 

import Hashtag from "../messages/Hashtag";

class PostEditable extends React.Component {
	state = {
		isHashtagClick: false,
		isTitleClick: false,
		isCategoryClick: false,
		isTextClick: false
	}

	handleClickableOpen = e => {
		let name = e.target.id;
		// console.log(e.target);
		this.setState({ ...this.state, [name]: true });
	}

	handleClickableClose = e => {
		let name = e.target.id;
		// console.log(e.target.id);
		this.setState({ ...this.state, [name]: false });
	}

	render() {
		const { category, title, text, hashtags } = this.props.data;
		const {	
			isTitleClick,
			isHashtagClick,
			isTextClick,
			isCategoryClick
		} = this.state;
		const { categoryOptions, hashtagOptions, location } = this.props;

		return (
			<div>
			  <Segment.Group raised style={{ margin: "15px", marginBottom: "10px" }}>
			  	<Segment inverted color="brown">
			  		<Grid centered textAlign="center">
			  			<Grid.Row columns={2}>
			  				<Grid.Column textAlign="left">
			  					{ !isCategoryClick ? 
			  						(
			  							<Header as="h5" id="isCategoryClick" onClick={this.handleClickableOpen}> 
			  								{ !!category ? category : "Edit Category"}
			  							</Header>
			  						) : (
			  							<Form>
											<Form.Field inline>
												<Dropdown
													scrolling
													search
													value={category}
													name="category"
													onChange={this.props.handleDataChange}
													placeholder="Category" 
													options={categoryOptions}
													inline
												/>
												<label>
													<Icon 
														name="close" 
														id="isCategoryClick" 
														circular
														onClick={this.handleClickableClose}
													/>
												</label>
											</Form.Field>
										</Form>
			  						)
			  					}
			  				</Grid.Column>
			  				<Grid.Column textAlign="right">
			  					<Header as="h5"> { location } </Header>
			  				</Grid.Column>
			  			</Grid.Row>
			  		</Grid>
			  	</Segment>
			  	<Segment textAlign="center">
			  		<Card.Description>
			  			{ !isTitleClick ? 
	  						(
	  							<h4 id="isTitleClick" onClick={this.handleClickableOpen}> 
	  								{ !!title ? title : "Edit Title"}
	  							</h4>
	  						) : (
	  							<Form>
									<Form.Field inline>
										<Input 
											placeholder="Title"
											name="title"
											value={title}
											onChange={this.props.handleDataChange}
										/>
										<label>
											<Icon 
												name="close" 
												id="isTitleClick" 
												circular
												onClick={this.handleClickableClose}
											/>
										</label>
									</Form.Field>
								</Form>
	  						)
	  					}
			  		</Card.Description>
			  		<Card.Description>
			  			{ !isTextClick ? 
	  						(
	  							<div id="isTextClick" onClick={this.handleClickableOpen}> 
	  								{ !!text ? 
	  									text.split('\n').map((item, i) => 
	  										<span 
	  											id="isTextClick" 
	  											onClick={this.handleClickableOpen} 
	  											key={i}
	  										>
	  											{item}<br />
	  										</span>
	  									) 
	  									: "Edit the body of the post here."}
	  							</div>
	  						) : (
	  							<Form>
									<Form.Field inline>
										<TextArea 
											rows={6}
											name="text"
											value={text}
											placeholder="Write body here..."
											onChange={this.props.handleDataChange}
										/>
										<label>
											<Icon 
												name="close" 
												id="isTextClick" 
												circular
												onClick={this.handleClickableClose}
											/>
										</label>
									</Form.Field>
								</Form>
	  						)
	  					}
			  		</Card.Description>
			  		<Card.Description>
			  			{ !isHashtagClick ? (
  								hashtags.length  > 0 ? (
  									<div>
										{hashtags.map(h => 
											<Hashtag key={h} id="isHashtagClick" handleClick={this.handleClickableOpen} text={ h }/>
										)}
									</div>
								) : (
									<Hashtag id="isHashtagClick" handleClick={this.handleClickableOpen} text="#Edit Hashtags" />
								)
  								
	  						) : (
	  							<Form>
									<Form.Field inline>
										<Dropdown
											inline
											search
											scrolling
											selection
											allowAdditions
											multiple
											onAddItem={this.props.addHashtag}
											value={hashtags}
											name="hashtags"
											onChange={this.props.handleDataChange}
											placeholder="Add or select Hashtags" 
											options={hashtagOptions}
											style={{ maxWidth: "150px" }}
										/>
										<label>
											<Icon 
												name="close" 
												id="isHashtagClick" 
												circular
												onClick={this.handleClickableClose}
											/>
										</label>
									</Form.Field>
								</Form>
	  						)
	  					}
			  		</Card.Description>
			  		<hr />
			  		<Card.Description>
		  				<Icon name="angle up" />0
			  			&nbsp;&nbsp;&nbsp;&nbsp;
			  			<Icon name="angle down" />0
			  			&nbsp;&nbsp;&nbsp;&nbsp;
			  			<Icon name="comment outline" />0
			  		</Card.Description>
			  	</Segment>
			  </Segment.Group>

			  <Container textAlign="right">
				  <Button 
				  	secondary 
				  	content="Publish" 
				  	onClick={this.props.onTextPostSubmit} 
				  />
			  </Container>
		  </div>
		);
	}
};

PostEditable.propTypes = {
	categoryOptions : PropTypes.arrayOf(
		PropTypes.shape({
			key : PropTypes.string.isRequired,
			value : PropTypes.string.isRequired,
			text : PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	hashtagOptions : PropTypes.arrayOf(
		PropTypes.shape({
			key : PropTypes.string.isRequired,
			value : PropTypes.string.isRequired,
			text : PropTypes.string.isRequired
		}).isRequired
	).isRequired,
	addHashtag : PropTypes.func.isRequired,
	handleDataChange : PropTypes.func.isRequired,
	data : PropTypes.shape({
		title : PropTypes.string.isRequired,
		hashtags : PropTypes.arrayOf(
			PropTypes.string.isRequired
		).isRequired,
		category : PropTypes.string.isRequired,
		text : PropTypes.string.isRequired
	}),
	onTextPostSubmit : PropTypes.func.isRequired,
	location : PropTypes.string,
	getlocation : PropTypes.func.isRequired
}

function mapStateToProps(state) {
	return {
		location: state.user.location
	}
}

export default connect(mapStateToProps, { getlocation })(PostEditable);