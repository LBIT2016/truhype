import { combineReducers } from "redux";

import user from "./reducers/user";
import locations from "./reducers/locations";
import posts from "./reducers/posts";
import others from "./reducers/others";
import path from "./reducers/path";
import admins from "./reducers/admins";
import adposts from "./reducers/adposts";
import adpostsother from "./reducers/adpostsother";
import adStatistics from "./reducers/adStatistics";

export default combineReducers({
	user,
	locations,
	posts,
	others,
	path,
	admins,
	adposts,
	adpostsother,
	adStatistics
});