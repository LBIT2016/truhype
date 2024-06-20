// import { normalize } from "normalizr";

import api from "../api";
import { 
	POST_UPLOADED, 
	POSTS_FETCHED, 
	POST_FETCHED, 
	POSTS_CLEARED, 
	POST_FETCHED_BY_ID ,
	POST_DELETED
} from "../types";
// import { postSchema } from "../schemas";

export const postUploaded = posts => ({
	type: POST_UPLOADED,
	posts
});

export const postsFetched = posts => ({
	type: POSTS_FETCHED,
	posts
});

export const postFetched = posts => ({
	type: POST_FETCHED,
	posts
});

export const postsCleared = () => ({
	type: POSTS_CLEARED
});

export const postsFetchedById = posts => ({
	type: POST_FETCHED_BY_ID,
	posts
});

export const postDeleted = id => ({
	type: POST_DELETED,
	id
});

export const upload_post = post => dispatch =>
	api.posts
		.upload_post(post)
		.then(post => {
			// dispatch(postUploaded(normalize(post, postSchema)));
			dispatch(postUploaded(post));
			return post._id;
		});

export const fetch_posts = () => dispatch =>
	api.posts
		.fetch_posts()
		.then(posts => 
			// dispatch(postsFetched(normalize(posts, [postSchema])))
			dispatch(postsFetched(posts))
		);

export const fetchPostById = id => dispatch => 
	api.posts
		.fetchPostById(id)
		.then(post => {
			// dispatch(postsFetchedById(normalize(post, postSchema)));
			dispatch(postsFetchedById(post));
			return true;
		}).catch(err => {
			return false;
		});

/* export const fetchLocalPosts = () => dispatch =>
	api.posts
		.fetchLocalPosts()
		.then(posts => dispatch(postsFetched(normalize(posts, [postSchema])))); */

export const fetchLocalPostsByFilter = (filter, per, page, category, isAltLoc, loc) => dispatch =>
	api.posts
		.fetchLocalPostsByFilter(filter, per, page, category, isAltLoc, loc)
		.then(postsResult => { 
			const posts = postsResult.docs;
			const totalPages = postsResult.totalPages;
			// dispatch(postsFetched(normalize(posts, [postSchema])));
			dispatch(postsFetched(posts));
			return totalPages;
		});

export const fetchGlobalPostsByFilter = (filter, per, page, category) => dispatch =>
	api.posts
		.fetchGlobalPostsByFilter(filter, per, page, category)
		.then(postsResult => { 
			const posts = postsResult.docs;
			const totalPages = postsResult.totalPages;
			// dispatch(postsFetched(normalize(posts, [postSchema])));
			dispatch(postsFetched(posts));
			return totalPages;
		});

export const fetchPostsBySearchFilter = (filter, per, page, country, state, city, hashtag, category, textquery) => dispatch =>
	api.posts
		.fetchPostsBySearchFilter(filter, per, page, country, state, city, hashtag, category, textquery)
		.then(postsResult => { 
			const posts = postsResult.docs;
			const totalPages = postsResult.totalPages;
			// dispatch(postsFetched(normalize(posts, [postSchema])));
			dispatch(postsFetched(posts));
			return totalPages;
		});

export const fetchReportedPostsByFilter = (per, page, category) => dispatch =>
	api.posts
		.fetchReportedPostsByFilter(per, page, category)
		.then(postsResult => { 
			const adposts = postsResult.docs;
			const totalPages = postsResult.totalPages;
			// dispatch(adpostsFetched(normalize(adposts, [adpostSchema])));
			dispatch(postsFetched(adposts));
			return totalPages;
		});

export const clearPosts = () => dispatch => {
	dispatch(postsCleared());
}

export const deletePost = id => dispatch => 
	api.posts.deletePost(id)
		.then(success => {
			dispatch(postDeleted(id));
			return success;
		})

