import {
	TOTAL_ACCOUNTS_FETCHED,
	NO_ACCOUNTS_FETCHED,
	COUNTRY_STATS_FETCHED,
	STATS_BY_COUNTRY_CLEARED,
	STATE_STATS_FETCHED,
	STATS_BY_STATE_CLEARED
} from "../types";
import api from "../api";

export const totalAccountsFetched = total_acc => ({
	type: TOTAL_ACCOUNTS_FETCHED,
	total_acc
});

export const noAccountsFetched = accounts => ({
	type: NO_ACCOUNTS_FETCHED,
	accounts
});

export const countryStatsFetched = countryStats => ({
	type: COUNTRY_STATS_FETCHED,
	countryStats
});

export const stateStatsFetched = stateStats => ({
	type: STATE_STATS_FETCHED,
	stateStats
});

export const statsByCountryCleared = () => ({
	type: STATS_BY_COUNTRY_CLEARED
});

export const statsByStateCleared = () => ({
	type: STATS_BY_STATE_CLEARED
});

// -------------------

export const fetchTotalNoAccounts = () => dispatch => 
	api.adStatistics.fetchTotalNoAccounts()
		.then(total_acc => {
			dispatch(totalAccountsFetched(total_acc));
		});

export const fetchNoAccounts = (country, state, city) => dispatch => 
	api.adStatistics.fetchNoAccounts(country, state, city)
		.then(accounts => {
			dispatch(noAccountsFetched(accounts));
		});

export const fetchStatsByCountry = country => dispatch =>
	api.adStatistics.fetchStatsByCountry(country)
		.then(countryStats => {
			dispatch(countryStatsFetched(countryStats));
		});

export const fetchStatsByState = (country, state) => dispatch =>
	api.adStatistics.fetchStatsByState(country, state)
		.then(stateStats => {
			dispatch(stateStatsFetched(stateStats));
		});

export const clearStatsByCountry = () => dispatch =>
	dispatch(statsByCountryCleared());

export const clearStatsByState = () => dispatch =>
	dispatch(statsByStateCleared());