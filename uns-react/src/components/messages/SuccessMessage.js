import React from "react";
import { Message } from "semantic-ui-react";

const SuccessMessage = ({ text }) => (
	<Message positive>
		<Message.Header>{text}</Message.Header>
	</Message>
);

export default SuccessMessage;
