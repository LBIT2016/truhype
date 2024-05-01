import React from "react";
import { Message } from "semantic-ui-react";

const FailureMessage = ({ text }) => (
	<Message negative>
		<Message.Header>{text}</Message.Header>
	</Message>
);

export default FailureMessage;
