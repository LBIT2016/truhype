import { PATH_ADDED } from "../types";

export default function(state="", action={}) {
	switch(action.type) {
		case PATH_ADDED:
			return action.path;
		default:
			return state;
	}
}	