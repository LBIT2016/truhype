import React from "react";
import PropTypes from "prop-types";
// import { Segment/*, Message*/ } from "semantic-ui-react";

/*const InlineError = ({ text }) => (
	<Segment>
		<p style={{ color: "#ae5856"}}> { text } </p>
		<Message>
			<Message.Header>Didn't get what happend?</Message.Header>
			<p>
				Try as suggested above/below or browser refresh (f5).
				If not fix, Sorry for that. 
				Please inform it to our development team.
			</p>
		</Message>
	</Segment>
);*/

const InlineError = ({ text }) => (
	<p style={{ color: "#ae5856"}}> { text } </p>
);

InlineError.propTypes = {
	text: PropTypes.string.isRequired
}

export default InlineError;