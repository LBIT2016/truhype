import React from "react";
import MainPage from "./MainPage";
import SearchForm from "../forms/SearchForm";

class SearchPage extends React.Component {
	state = { 
		filter: "Latest",
		varColor: "purple" 
	}

	componentDidUpdate = (prevProps, prevState) => {
		if(prevState.filter !== this.state.filter) {
			if(this.state.filter === "Loved") {
				this.setState({ varColor: "red" });
			} else if (this.state.filter === "Latest") {
				this.setState({ varColor: "purple" });
			} else if(this.state.filter === "Hated") {
				this.setState({ varColor: "grey" });
			}
		}	
	}

	handleFilter = e => {
		this.setState({ filter: e.target.value });
	}

	render() {
		const { filter, varColor } = this.state;

		return (
			<MainPage 
				pathname={this.props.pathname}
				filter={filter} 
				handleFilter={this.handleFilter} 
				showTopBar={true}
				showBottomBar={true}
				showTopIcons={true}
			>
				<SearchForm
					filter={filter} 
					varColor={varColor}
				/>
			</MainPage>
		);
	}
};

export default SearchPage;
