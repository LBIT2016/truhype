import { 
	USER_LOGGED_IN, 
	USER_LOGGED_OUT, 
	USER_LOCATION_SET,
	USER_USERNAME_SET,
	USER_KEY_FETCHED,
	USER_ACTIVITY_FETCHED,
	CLEAR_ACTIVITY,
	ANALYTICS_FETCHED,
	DETAILS_CHECKED
} from "../types";
import { createSelector } from "reselect";

export default function(state = {}, action = {}) {
	switch(action.type) {
		case USER_LOGGED_IN:
		case USER_LOCATION_SET:
			return action.user;
		case USER_USERNAME_SET:
			return { ...state, username: action.username };
		case USER_KEY_FETCHED:
			return { ...state, key: action.key };
		case USER_ACTIVITY_FETCHED:
			return state.activity ? 
					{ ...state, activity: [...state.activity, ...action.activity] }
				:
					{ ...state, activity: [...action.activity] };
		case CLEAR_ACTIVITY:
			return { ...state, activity: [] };
		case ANALYTICS_FETCHED:
			return { ...state, analytics: action.analytics }
		case USER_LOGGED_OUT:
			return {};
		case DETAILS_CHECKED:
			return { ...state, gotDetails: action.success }
		default:
			return state;
	}
}

// SELECTORS

export const activitySelector = state => state.user.activity;

export const allActivitySelector = createSelector(activitySelector, activity => 
	// Object.values(activity)
	activity
);