import { createSelector } from "reselect";
import {
	TOTAL_ACCOUNTS_FETCHED,
	NO_ACCOUNTS_FETCHED,
	COUNTRY_STATS_FETCHED,
	STATS_BY_COUNTRY_CLEARED,
	STATE_STATS_FETCHED,
	STATS_BY_STATE_CLEARED
} from "../types";

const defaultState = {
	total_acc: 0,
	accounts: 0,
	countryStats: [],
	stateStats: []
};

export default function(state=defaultState, action={}) {
	switch(action.type) {
		case TOTAL_ACCOUNTS_FETCHED:
			return { ...state, total_acc: action.total_acc };
		case NO_ACCOUNTS_FETCHED:
			return { ...state, accounts: action.accounts };
		case COUNTRY_STATS_FETCHED:
			return { ...state, countryStats: action.countryStats };
		case STATS_BY_COUNTRY_CLEARED:
			return { ...state, countryStats: [] };
		case STATE_STATS_FETCHED:
			return { ...state, stateStats: action.stateStats };
		case STATS_BY_STATE_CLEARED:
			return { ...state, stateStats: [] };
		default:
			return state;
	}
} 

// SELECTORS

export const countryStatsSelector = state => state.adStatistics.countryStats;
export const stateStatsSelector = state => state.adStatistics.stateStats;

export const allCountryStats = createSelector(countryStatsSelector, countryStats =>
	countryStats
);

export const allStateStats = createSelector(stateStatsSelector, stateStats =>
	stateStats
);