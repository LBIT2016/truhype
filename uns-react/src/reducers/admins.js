import { 
	ADMIN_LOGGED_IN, 
	ADMIN_LOGGED_OUT,
	PASSWORD_CHANGED
} from "../types";
// import { createSelector } from "reselect";

export default function(state = {}, action = {}) {
	switch(action.type) {
		case ADMIN_LOGGED_IN:
			return action.admin;
		case ADMIN_LOGGED_OUT:
			return {};
		case PASSWORD_CHANGED:
			return action.admin;
		default:
			return state;
	}
}

// SELECTORS

/*export const activitySelector = state => state.user.activity;

export const allActivitySelector = createSelector(activitySelector, activity => 
	// Object.values(activity)
	activity
);*/