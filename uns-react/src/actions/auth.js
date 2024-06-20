import api from "../api";
import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../types";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const userLoggedIn = user => ({
	type: USER_LOGGED_IN,
	user
});

export const userLoggedOut = () => ({
	type: USER_LOGGED_OUT
});

export const login = credentials => dispatch => 
	api.user.login(credentials).then(user => {
		localStorage.TruhypeJWT = user.token;
		localStorage.sessionId = user.sessionId;
		setAuthorizationHeader(localStorage.TruhypeJWT);
		dispatch(userLoggedIn(user));
		return "something";
	});

export const logout = () => dispatch => {
	setAuthorizationHeader();
	dispatch(userLoggedOut());
	localStorage.removeItem("TruhypeJWT");
	localStorage.removeItem("sessionId");
}; 
