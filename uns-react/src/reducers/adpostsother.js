import {
	ADPOST_PER_CHANGED,
	ADPOST_PAGE_CHANGED,
	ADPOST_TOTALPAGES_CHANGED
} from "../types";

const defaultState = {
	per: 1,
	page: 0,
	totalpages: null
}

export default function(state=defaultState, action={}) {
	switch(action.type) {
		case ADPOST_PER_CHANGED:
			return { ...state, per: action.per };
		case ADPOST_PAGE_CHANGED:
			if(action.page > state.totalpages) {
				return { ...state, page: 1 };
			} else {
				return { ...state, page: action.page };
			}
		case ADPOST_TOTALPAGES_CHANGED:
			return { ...state, totalpages: action.totalpages };
		default:
			return state;
	}
}