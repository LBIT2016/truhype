import api from "../api";
import { 
	CATEGORY_OPTIONS_FETCHED,
	CATEGORY_ADDED,
	CATEGORY_UPDATED,
	CATEGORY_DELETED,
	TOP_EIGHT_HASHTAGS_FETCHED,
	HASHTAGS_FETCHED,
	HASHTAGS_CLEARED
} from "../types";

export const categoriesFetched = categories => ({
	type: CATEGORY_OPTIONS_FETCHED,
	categories
});

export const categoryAdded = category => ({
	type: CATEGORY_ADDED,
	category
});

export const categoryUpdated = (oldC, newC) => ({
	type: CATEGORY_UPDATED,
	oldC, newC
});

export const categoryDeleted = category => ({
	type: CATEGORY_DELETED,
	category
});

export const tophashtagsFetched = hashtags => ({
	type: TOP_EIGHT_HASHTAGS_FETCHED,
	hashtags
});

export const hashtagsFetched = hashtags => ({
	type: HASHTAGS_FETCHED,
	hashtags
});

export const hashtagsCleared = () => ({
	type: HASHTAGS_CLEARED
});



// ====================================================

export const fetchCategories = () => dispatch => {
	api.others
		.fetchCategories()
		.then(categories => dispatch(categoriesFetched(categories)));
}

export const addCategory = category => dispatch =>
	api.others
		.addCategory(category)
		.then(category => dispatch(categoryAdded(category)));

export const updateCategory = (oldC, newC) => dispatch =>
	api.others
		.updateCategory(oldC, newC)
		.then(sucess => 
			sucess && dispatch(categoryUpdated(oldC, newC))
		);

export const deleteCategory = category => dispatch =>
	api.others
		.deleteCategory(category)
		.then(sucess => 
			sucess && dispatch(categoryDeleted(category))
		);

export const fetchTopHashtags = () => dispatch => {
	api.others
		.fetchHashtags()
		.then(hashtags => dispatch(tophashtagsFetched(hashtags)));
}

export const fetchHashtagsByKeyword = keyword => dispatch => {
	api.others
		.fetchHashtagsByKeyword(keyword)
		.then(hashtags => {
			dispatch(hashtagsFetched(hashtags));
		});
}

export const addHashtag = hashtag => dispatch => {
	api.others.addHashtag(hashtag);
}

export const clearHashtags = () => dispatch => {
	dispatch(hashtagsCleared());
}
