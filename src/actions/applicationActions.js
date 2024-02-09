// actions/applicationActions.js
export const setSearchResults = (results) => ({
  type: 'SET_SEARCH_RESULTS',
  payload: results,
});

export const setFilterValues = (filterValues) => ({
  type: 'SET_FILTER_VALUES',
  payload: filterValues,
});
