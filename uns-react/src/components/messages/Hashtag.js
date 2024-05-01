import React from "react";
import PropTypes from "prop-types";

const Hashtag = (props) => (
	<span onClick={props.handleClick} id={props.id} style={{ color: "#b972c9" }}>
		{props.text}{" "}
	</span>
);

Hashtag.propTypes = {
	text: PropTypes.string.isRequired,
	handleClick : PropTypes.func.isRequired,
	id : PropTypes.string.isRequired
}

export default Hashtag;