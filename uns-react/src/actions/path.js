import { PATH_ADDED } from "../types";

export const pathAdded = path => ({
	type: PATH_ADDED,
	path
});

export const AddPath = path => dispatch =>
	dispatch(pathAdded(path));