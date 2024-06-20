import { createSelector } from "reselect";
import { 
	CATEGORY_OPTIONS_FETCHED,
	CATEGORY_ADDED,
	CATEGORY_UPDATED,
	CATEGORY_DELETED,
	TOP_EIGHT_HASHTAGS_FETCHED,
	HASHTAGS_FETCHED,
	HASHTAGS_CLEARED
} from "../types";

const defaultStore = {
	categories: [],
	tophashtags: [],
	hashtags: []
};

export default function(state = defaultStore, action = {}) {
	switch(action.type) {
		case CATEGORY_OPTIONS_FETCHED:
			return { ...state,  categories: action.categories };
		case CATEGORY_ADDED:
			return { ...state, categories: [ action.category, ...state.categories ] };
		case CATEGORY_UPDATED:
			let list = state.categories;
			const index = list.findIndex(item => item === action.oldC);
			list[index] = action.newC;
			return { ...state, categories: [ ...list ] };
		case CATEGORY_DELETED:
			const l = state.categories;
			l.splice(l.findIndex(item => item === action.category), 1);
			return { ...state, categories: [ ...l ] };
		case HASHTAGS_FETCHED:
			return { ...state, hashtags: action.hashtags };
		case TOP_EIGHT_HASHTAGS_FETCHED:
			return { ...state, tophashtags: action.hashtags };
		case HASHTAGS_CLEARED:
			return { ...state, hashtags: [] };
		default:
			return state;
	}
}

// SELECTORS

export const categoriesSelector = state => state.others.categories;
export const hashtagsSelector = state => state.others.hashtags;
export const tophashtagsSelector = state => state.others.tophashtags;

function makeObject(acc, value, index) {
	acc.push({ key: value, value: value, text: value });
	return acc;
}

function makeHashtagObject(acc, value, index) {
	acc.push({ key: value._id, value: value.hashtag, text: value.hashtag });
	return acc;
}

export const allCategoriesSelector = createSelector(categoriesSelector, categories => 
	categories.reduce(makeObject, [])
);

export const allHashtagsSelector = createSelector(hashtagsSelector, hashtags => 
	hashtags.reduce(makeHashtagObject, [])
);

export const allTopHashtagsSelector = createSelector(tophashtagsSelector, hashtags => 
	hashtags
);