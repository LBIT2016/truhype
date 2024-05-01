import {
	POST_UPLOADED,
	POSTS_FETCHED,
	POST_FETCHED,
	POSTS_CLEARED,
	POST_FETCHED_BY_ID,
	POST_DELETED
} from "../types";
import { createSelector } from "reselect";

export default function(state=[], action={}) {
	switch(action.type) {
		case POST_UPLOADED:
			return [ ...state, action.posts  ];
		case POSTS_FETCHED:
		case POST_FETCHED: {
			// return { ...state, ...action.data.entities.posts };
			return [ ...state, ...action.posts  ];
		}
		case POST_FETCHED_BY_ID:
			// return { ...action.data.entities.posts };
			return [ action.posts ];
		case POSTS_CLEARED:
			// return {}
			return [];
		case POST_DELETED:
			const state_ = state;
			state_.splice(state_.findIndex(v => v._id === action.id), 1);
			return [ ...state_ ];
		default:
			return state;
	}
}

// SELECTORS

export const postsSelector = state => state.posts;

export const allPostsSelector = createSelector(postsSelector, postHash => 
	// Object.values(postHash)
	postHash
);