import api from "../api";
import { userLoggedIn } from "./auth";
import { postsFetched } from "./posts";
import { 
	USER_LOCATION_SET, 
	USER_USERNAME_SET,
	USER_KEY_FETCHED,
	USER_ACTIVITY_FETCHED,
	CLEAR_ACTIVITY,
	ANALYTICS_FETCHED
} from "../types";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const userLocationSet = user => ({
	type: USER_LOCATION_SET,
	user
});

export const userUsernameSet = username => ({
	type: USER_USERNAME_SET,
	username
});

export const userKeyFetched = key => ({
	type: USER_KEY_FETCHED,
	key
});

export const activityFetched = activity => ({
	type: USER_ACTIVITY_FETCHED,
	activity
});

export const activityCleared = () => ({
	type: CLEAR_ACTIVITY
});

export const analyticsFetched = analytics => ({
	type: ANALYTICS_FETCHED,
	analytics
});

/* export const detailsChecked = success => ({
	type: DETAILS_CHECKED,
	success
}); */

 // ===========================================================

export const signup = () => dispatch => 
	api.user.signup().then(user => {
		localStorage.TruhypeJWT = user.token;
		localStorage.sessionId = user.sessionId;
		setAuthorizationHeader(localStorage.TruhypeJWT);
		dispatch(userLoggedIn(user)); 
	});

/* export const gotDetails = () => dispatch => {
	if(localStorage.TruhypeJWT) {
		const { sessionId } = localStorage;
		api.user.gotDetails(sessionId)
		.then(success => {
			dispatch(detailsChecked(success));
		})
	}
} */


export const setUserData = data => dispatch =>
	api.user.setUserData(data).then(user => {
		dispatch(userLocationSet(user));
	});

export const getlocation = () => dispatch =>
	api.user.getlocation().then(user => {
		dispatch(userLocationSet(user));
	});

export const getUsername = () => dispatch =>
	api.user.getUsername().then(user => {
		dispatch(userUsernameSet(user));
	});

export const getKey = () => dispatch =>
	api.user.getKey().then(user => {
		dispatch(userKeyFetched(user));
	});

export const regenKey = () => dispatch =>
	api.user.regenKey().then(user => {
		dispatch(userKeyFetched(user));
	});

export const getPosts = (per, page) => dispatch =>
	api.user
		.getPosts(per, page)
		.then(postsResult => { 
			const posts = postsResult.docs;
			const totalPages = postsResult.totalPages;
			// dispatch(postsFetched(normalize(posts, [postSchema])));
			dispatch(postsFetched(posts));
			return totalPages;
		});

export const getActivity = (per, page) => dispatch =>
	api.user
		.getActivity(per, page)
		.then(activityResult => { 
			const activity = activityResult.docs;
			const totalPages = activityResult.totalPages;
			dispatch(activityFetched(activity));
			return totalPages;
		});

export const clearActivity = () => dispatch =>
	dispatch(activityCleared());

export const getAnalytics = analytics => dispatch =>
	api.user
		.getAnalytics()
		.then(analytics => dispatch(analyticsFetched(analytics)));

export const updatePostsSeen = postId => dispatch =>
	api.user
		.updatePostsSeen(postId)
		.then(analytics => {
			analytics && dispatch(analyticsFetched(analytics));
		});