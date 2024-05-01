import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import dotenv from "dotenv";

import "./index.css";
import "../node_modules/video-react/dist/video-react.css";
import '../node_modules/nprogress/nprogress.css'

import App from './App';
import rootReducer from "./rootReducer";
import setAuthorizationHeader from "./utils/setAuthorizationHeader";
import * as serviceWorker from './serviceWorker';

import { userLoggedIn } from "./actions/auth";
import { adminLoggedIn } from "./actions/admins";

dotenv.config();

let store;

if(process.env.NODE_ENV === 'development') {
	store = createStore(
		rootReducer,
		composeWithDevTools(applyMiddleware(thunk))
	);
} else if(process.env.NODE_ENV === 'production') {
	store = createStore(
		rootReducer,
		applyMiddleware(thunk)
	);
}

if(localStorage.TruhypeJWT) {
	const user = { 
		token: localStorage.TruhypeJWT, 
		sessionId: localStorage.sessionId, 
		username: localStorage.username 
	};
	setAuthorizationHeader(localStorage.TruhypeJWT);
	store.dispatch(userLoggedIn(user));
}

if(localStorage.TruhypeJWTAdmin) {
	const admin = {
		token: localStorage.TruhypeJWTAdmin
	};
	setAuthorizationHeader(localStorage.TruhypeJWTAdmin);
	store.dispatch(adminLoggedIn(admin));
}

ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<Route component={App} />
		</Provider>
	</BrowserRouter>, 
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
