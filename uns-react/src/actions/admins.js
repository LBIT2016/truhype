import api from "../api";
import { ADMIN_LOGGED_IN, ADMIN_LOGGED_OUT, PASSWORD_CHANGED } from "../types";
import setAuthorizationHeader from "../utils/setAuthorizationHeader";

export const adminLoggedIn = admin => ({
	type: ADMIN_LOGGED_IN,
	admin
});

export const adminLoggedOut = () => ({
	type: ADMIN_LOGGED_OUT
});

export const adminPasswordChanged = admin => ({
	type: PASSWORD_CHANGED,
	admin
});

export const login = credentials => dispatch => 
	api.admins.login(credentials).then(admin => {
		localStorage.TruhypeJWTAdmin = admin.token;
		// localStorage.sessionId = admin.sessionId;
		setAuthorizationHeader(localStorage.TruhypeJWT);
		dispatch(adminLoggedIn(admin));
	});


export const logout = () => dispatch => {
	setAuthorizationHeader();
	dispatch(adminLoggedOut());
	localStorage.removeItem("TruhypeJWTAdmin");
	// localStorage.removeItem("sessionId");
};

export const change_password = data => dispatch => 
	api.admins.change_password(data)
		.then(admin => dispatch(adminPasswordChanged(admin)));

