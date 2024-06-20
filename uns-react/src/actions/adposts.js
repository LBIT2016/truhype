import api from "../api";
import { 
	ADPOST_UPLOADED, 
	ADPOSTS_FETCHED, 
	ADPOST_FETCHED, 
	ADPOSTS_CLEARED, 
	ADPOST_FETCHED_BY_ID,
	ADPOST_DELETED 
} from "../types";

export const adpostUploaded = adposts => ({
	type: ADPOST_UPLOADED,
	adposts
});

export const adpostsFetched = adposts => ({
	type: ADPOSTS_FETCHED,
	adposts
});

export const adpostFetched = adposts => ({
	type: ADPOST_FETCHED,
	adposts
});

export const adpostsCleared = () => ({
	type: ADPOSTS_CLEARED
});

export const adpostDeleted = id => ({
	type: ADPOST_DELETED,
	id
});

export const adpostsFetchedById = adposts => ({
	type: ADPOST_FETCHED_BY_ID,
	adposts
});

export const upload_adpost = adpost => dispatch =>
	api.adposts
		.upload_adpost(adpost)
		.then(adpost => {
			// dispatch(adpostUploaded(normalize(adpost, adpostSchema)));
			dispatch(adpostUploaded(adpost));
			return adpost._id;
		});

/*export const fetch_adposts = () => dispatch =>
	api.adposts
		.fetch_adposts()
		.then(adposts => 
			// dispatch(adpostsFetched(normalize(adposts, [adpostSchema])))
			dispatch(adpostsFetched(adposts))
		); */

export const fetchAdPostById = id => dispatch => 
	api.adposts
		.fetchAdPostById(id)
		.then(post => {
			// dispatch(postsFetchedById(normalize(post, postSchema)));
			dispatch(adpostsFetchedById(post));
			return true;
		}).catch(err => {
			return false;
		});

export const fetchAdPosts = (per, page) => dispatch =>
	api.adposts
		.fetchAdPosts(per, page)
		.then(adpostsResult => { 
			const adposts = adpostsResult.docs;
			const totalPages = adpostsResult.totalPages;
			dispatch(adpostsFetched(adposts));
			return totalPages;
		});

export const fetchAdPostsForAdmin = (per, page) => dispatch =>
	api.adposts
		.fetchAdPostsForAdmin(per, page)
		.then(adpostsResult => { 
			const adposts = adpostsResult.docs;
			const totalPages = adpostsResult.totalPages;
			dispatch(adpostsFetched(adposts));
			return totalPages;
		});

export const clearAdPosts = () => dispatch => {
	dispatch(adpostsCleared());
}

export const deleteAdPost = id => dispatch => 
	api.adposts.deleteAdPost(id)
		.then(success => {
			dispatch(adpostDeleted(id));
			return success;
		})

/*
export const fetchReportedPosts = (per, page) => dispatch =>
	api.adposts
		.fetchReportedPosts(per, page)
		.then(adpostsResult => { 
			const adposts = adpostsResult.docs;
			const totalPages = adpostsResult.totalPages;
			// dispatch(adpostsFetched(normalize(adposts, [adpostSchema])));
			dispatch(adpostsFetched(adposts));
			return totalPages;
		});

export const fetchPostsBySearchFilter = (filter, per, page, country, state, city, hashtag, category, textquery) => dispatch =>
	api.adposts
		.fetchPostsBySearchFilter(filter, per, page, country, state, city, hashtag, category, textquery)
		.then(adpostsResult => { 
			const adposts = adpostsResult.docs;
			const totalPages = adpostsResult.totalPages;
			// dispatch(adpostsFetched(normalize(adposts, [adpostSchema])));
			dispatch(adpostsFetched(adposts));
			return totalPages;
		}); */
