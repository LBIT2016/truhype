import React from "react";
import MainPage from "../../pages/MainPage";
import AdMainPage from "./AdMainPage";
import AdSearchForm from "../forms/AdSearchForm";

class SearchPage extends React.Component {
	state = { 
		varColor: "red" 
	}

	render() {

		return (
			<AdMainPage>
				<MainPage 
					pathname={this.props.location.pathname}
					filter={"loved"} 
					handleFilter={() => {}} 
					showTopBar={false}
					showBottomBar={false}
					showTopIcons={false}
				>
					<AdSearchForm />
				</MainPage>
			</AdMainPage>
		);
	}
};

export default SearchPage;
