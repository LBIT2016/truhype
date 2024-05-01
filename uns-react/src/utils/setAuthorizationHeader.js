import axios from "axios";

export default function(token = null) {
	if(token) {
		axios.defaults.headers.common.authorization = `S86dkf_ ${token}`;
	} else {
		delete axios.defaults.headers.common.authorization;
	}
}