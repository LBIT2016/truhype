import React, { Component } from 'react';
import { Table, Button, Form } from "semantic-ui-react";
import { connect } from "react-redux";

import AdMainPage from "./AdMainPage";

import { fetchCategories, addCategory, updateCategory, deleteCategory } from "../../../actions/others";
import { allCategoriesSelector } from "../../../reducers/others";

class AdCategoryPage extends Component {
	state = {
		isAddCategory: false,
		category: "",
		origCategory: false,
		isEditCategory: false
	}

	componentWillMount = () => {
		this.props.fetchCategories();
	}

	// Adding category
	handleIsAddCategory = () => {
		this.setState({ isAddCategory: !this.state.isAddCategory });
	}

	onAddCategoryChange = (e, { value }) => {
		this.setState({ category: value });
	}

	addCategory = () => {
		this.props.addCategory(this.state.category)
			.then(() => {
				this.setState({ category: "" });
			})
	}

	// Editing category
	handleIsEditCategory = e => {
		window.scrollTo(0,0);
		const value = e.target.value;
		this.setState({ isEditCategory: !this.state.isEditCategory, category: value, origCategory: value });
	}

	onEditCategoryChange = (e, { value }) => {
		this.setState({ category: value });
	}

	editCategory = () => {
		const { origCategory, category } = this.state;
		console.log(origCategory, category);
		this.props.updateCategory(origCategory, category)
			.then(() => {
				this.setState({ category: "", isEditCategory: false });
			});
	}

	// Delete category
	onDeleteCategory = e => {
		e.preventDefault();
		const id = e.target.value;
		this.props.deleteCategory(id)
			.then(() => {
				alert(`Post successfully deleted!`);
			}).catch(err => {
				alert(`Something went wrong. Post not deleted! with error: `, err);
			});
	}

	render() {
		const { categoryOptions } = this.props;
		const { isAddCategory, category, isEditCategory } = this.state;

		return (
			<AdMainPage>
				<Table celled striped>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell colSpan='3'>Categories</Table.HeaderCell>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{ isEditCategory && (
							<Table.Row>
								<Table.Cell>
									<div style={{ marginTop: 10 }}>
						        		<Form>
						        			<Form.Input 
						        				placeholder="Enter new" 
						        				value={category} 
						        				onChange={this.onEditCategoryChange}
						        				action={{ icon: "pencil", content: "update", onClick: this.editCategory }}
						        			/>
						        		</Form>
						        	</div>
					        	</Table.Cell>
							</Table.Row>
						)}
						<Table.Row>
							<Table.Cell>
								<Button
					        		content="Add new category" 
					        		icon="plus" 
					        		color="teal"
					        		onClick={this.handleIsAddCategory} 
					        	/>
					        	<div style={{ marginTop: 10 }}>
						        	{ isAddCategory && (
						        		<Form>
						        			<Form.Input 
						        				placeholder="Enter new" 
						        				value={category} 
						        				onChange={this.onAddCategoryChange}
						        				action={{ icon: "plus", content: "add", onClick: this.addCategory }}
						        			/>
						        		</Form>
						        	)}
					        	</div>
					        </Table.Cell>
						</Table.Row>
						{ categoryOptions.map((c, i) => (
							<Table.Row key={i} textAlign="center">
								<Table.Cell collapsing> {c.value} </Table.Cell>
								<Table.Cell>
									<Button 
						        		value={c.value}
						        		content="Edit" 
						        		icon="pencil" 
						        		color="grey"
						        		onClick={this.handleIsEditCategory} 
						        	/>
								</Table.Cell>
								<Table.Cell>
									<Button 
						        		value={c.value}
						        		content="Delete" 
						        		icon="trash" 
						        		negative 
						        		onClick={this.onDeleteCategory} 
						        	/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</AdMainPage>
		);
	}
}

function mapStateToProps(state) {
	return {
		categoryOptions: allCategoriesSelector(state)
	}
}

export default connect(
	mapStateToProps, 
	{ 
		fetchCategories, 
		addCategory,
		updateCategory,
		deleteCategory
	}
)(AdCategoryPage);