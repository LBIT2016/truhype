import {
	ADPOST_UPLOADED,
	ADPOSTS_FETCHED,
	ADPOST_FETCHED,
	ADPOSTS_CLEARED,
	ADPOST_FETCHED_BY_ID,
	ADPOST_DELETED
} from "../types";
import { createSelector } from "reselect";

export default function(state=[], action={}) {
	switch(action.type) {
		case ADPOST_UPLOADED:
			return [ ...state, action.adposts  ];
		case ADPOSTS_FETCHED:
		case ADPOST_FETCHED: {
			// return { ...state, ...action.data.entities.adposts };
			return [ ...state, ...action.adposts  ];
		}
		case ADPOST_FETCHED_BY_ID:
			// return { ...action.data.entities.adposts };
			return [ action.adposts ];
		case ADPOSTS_CLEARED:
			// return {}
			return [];
		case ADPOST_DELETED:
			const state_ = state;
			state_.splice(state_.findIndex(v => v._id === action.id), 1);
			return [ ...state_ ];
		default:
			return state;
	}
}

// SELECTORS

export const adpostsSelector = state => state.adposts;

export const allPostsSelector = createSelector(adpostsSelector, postHash => 
	// Object.values(postHash)
	postHash
);