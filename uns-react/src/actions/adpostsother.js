import {
	ADPOST_PER_CHANGED,
	ADPOST_PAGE_CHANGED,
	ADPOST_TOTALPAGES_CHANGED
} from "../types";

export const perChanged = per => ({
	type: ADPOST_PER_CHANGED,
	per
});

export const pageChanged = page => ({
	type: ADPOST_PAGE_CHANGED,
	page
});

export const totalpagesChanged = totalpages => ({
	type: ADPOST_TOTALPAGES_CHANGED,
	totalpages
});

// -----------------------------

export const changePer = per => dispatch =>
	dispatch(perChanged(per));

export const changePage = page => dispatch =>
	dispatch(pageChanged(page));

export const changeTotalPages = totalpages => dispatch =>
	dispatch(totalpagesChanged(totalpages));
	
