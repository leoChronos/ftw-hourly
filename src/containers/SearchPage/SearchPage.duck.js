import unionWith from 'lodash/unionWith';
import { storableError } from '../../util/errors';
import { addMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { convertUnitToSubUnit, unitDivisor } from '../../util/currency';
import { formatDateStringToTz, getExclusiveEndDateWithTz } from '../../util/dates';
import { denormalisedResponseEntities } from '../../util/data';
import config from '../../config';

// ================ Action types ================ //

export const SEARCH_LISTINGS_REQUEST = 'app/SearchPage/SEARCH_LISTINGS_REQUEST';
export const SEARCH_LISTINGS_SUCCESS = 'app/SearchPage/SEARCH_LISTINGS_SUCCESS';
export const SEARCH_LISTINGS_ERROR = 'app/SearchPage/SEARCH_LISTINGS_ERROR';

export const SEARCH_MAP_LISTINGS_REQUEST = 'app/SearchPage/SEARCH_MAP_LISTINGS_REQUEST';
export const SEARCH_MAP_LISTINGS_SUCCESS = 'app/SearchPage/SEARCH_MAP_LISTINGS_SUCCESS';
export const SEARCH_MAP_LISTINGS_ERROR = 'app/SearchPage/SEARCH_MAP_LISTINGS_ERROR';

export const SEARCH_MAP_SET_ACTIVE_LISTING = 'app/SearchPage/SEARCH_MAP_SET_ACTIVE_LISTING';

export const FETCH_TIME_SLOTS_REQUEST = 'app/SearchPage/FETCH_TIME_SLOTS_REQUEST';
export const FETCH_TIME_SLOTS_SUCCESS = 'app/SearchPage/FETCH_TIME_SLOTS_SUCCESS';
export const FETCH_TIME_SLOTS_ERROR = 'app/SearchPage/FETCH_TIME_SLOTS_ERROR';

// ================ Reducer ================ //

const initialState = {
  pagination: null,
  searchParams: null,
  searchInProgress: false,
  searchListingsError: null,
  currentPageResultIds: [],
  searchMapListingIds: [],
  searchMapListingsError: null,
  currentPageListingsTimeSlots: {},  
};

const resultIds = data => data.data.map(l => l.id);

const listingPageReducer = (state = initialState, action = {}) => {
  const { type, payload } = action;  
  switch (type) {
    case SEARCH_LISTINGS_REQUEST:
      return {
        ...state,
        searchParams: payload.searchParams,
        searchInProgress: true,
        searchMapListingIds: [],
        searchListingsError: null,
        currentPageListingsTimeSlots: {},
      };
    case SEARCH_LISTINGS_SUCCESS:
      return {
        ...state,
        currentPageResultIds: resultIds(payload.data),
        pagination: payload.data.meta,
        searchInProgress: false,
      };
    case SEARCH_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchInProgress: false, searchListingsError: payload };

    case SEARCH_MAP_LISTINGS_REQUEST:
      return {
        ...state,
        searchMapListingsError: null,
      };
    case SEARCH_MAP_LISTINGS_SUCCESS: {
      const searchMapListingIds = unionWith(
        state.searchMapListingIds,
        resultIds(payload.data),
        (id1, id2) => id1.uuid === id2.uuid
      );
      return {
        ...state,
        searchMapListingIds,
      };
    }
    case SEARCH_MAP_LISTINGS_ERROR:
      // eslint-disable-next-line no-console
      console.error(payload);
      return { ...state, searchMapListingsError: payload };

    case SEARCH_MAP_SET_ACTIVE_LISTING:
      return {
        ...state,
        activeListingId: payload,
      };

    case FETCH_TIME_SLOTS_REQUEST: {
      const currentPageListingsTimeSlots = {
        ...state.currentPageListingsTimeSlots,
        [payload]: {
          ...state.currentPageListingsTimeSlots[payload],
          fetchTimeSlotsError: null,
          fetchTimeSlotsInProgress: true          
        },
      };

      return { ...state, currentPageListingsTimeSlots };
    }
    case FETCH_TIME_SLOTS_SUCCESS: {
      const listingId = payload.listingId;
      const currentPageListingsTimeSlots = {
        ...state.currentPageListingsTimeSlots,
        [listingId]: {
          ...state.currentPageListingsTimeSlots[listingId],
          fetchTimeSlotsInProgress: false,
          timeSlots: payload.timeSlots,
        },
      };
      return { ...state, currentPageListingsTimeSlots };
    }
    case FETCH_TIME_SLOTS_ERROR: {
      const listingId = payload.listingId;
      const currentPageListingsTimeSlots = {
        ...state.currentPageListingsTimeSlots,
        [listingId]: {
          ...state.currentPageListingsTimeSlots[listingId],
          fetchTimeSlotsInProgress: false,
          fetchTimeSlotsError: payload.error,
        },
      };
      return { ...state, currentPageListingsTimeSlots };
    }
      
    default:
      return state;
  }
};

export default listingPageReducer;

// ================ Action creators ================ //

export const searchListingsRequest = searchParams => ({
  type: SEARCH_LISTINGS_REQUEST,
  payload: { searchParams },
});

export const searchListingsSuccess = response => ({
  type: SEARCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchListingsError = e => ({
  type: SEARCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const fetchTimeSlotsRequest = listingId => ({
  type: FETCH_TIME_SLOTS_REQUEST,
  payload: listingId,
});
export const fetchTimeSlotsSuccess = (listingId, timeSlots) => ({
  type: FETCH_TIME_SLOTS_SUCCESS,
  payload: { timeSlots, listingId },
});
export const fetchTimeSlotsError = (listingId, error) => ({
  type: FETCH_TIME_SLOTS_ERROR,
  error: true,
  payload: { listingId, error },
});

export const searchMapListingsRequest = () => ({ type: SEARCH_MAP_LISTINGS_REQUEST });

export const searchMapListingsSuccess = response => ({
  type: SEARCH_MAP_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const searchMapListingsError = e => ({
  type: SEARCH_MAP_LISTINGS_ERROR,
  error: true,
  payload: e,
});

export const searchListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchListingsRequest(searchParams));

  const priceSearchParams = priceParam => {
    const inSubunits = value =>
      convertUnitToSubUnit(value, unitDivisor(config.currencyConfig.currency));
    const values = priceParam ? priceParam.split(',') : [];
    return priceParam && values.length === 2
      ? {
          price: [inSubunits(values[0]), inSubunits(values[1]) + 1].join(','),
        }
      : {};
  };

  const availabilityParams = (datesParam, minDurationParam) => {
    const dateValues = datesParam ? datesParam.split(',') : [];
    const hasDateValues = datesParam && dateValues.length === 2;
    const startDate = hasDateValues ? dateValues[0] : null;
    const endDate = hasDateValues ? dateValues[1] : null;

    const minDurationMaybe =
      minDurationParam && Number.isInteger(minDurationParam) && hasDateValues
        ? { minDuration: minDurationParam }
        : {};

    const timeZone = config.custom.dateRangeLengthFilterConfig.searchTimeZone;

    return hasDateValues
      ? {
          start: formatDateStringToTz(startDate, timeZone),
          end: getExclusiveEndDateWithTz(endDate, timeZone),

          // When we have `time-partial` value in the availability, the
          // API returns listings that don't necessarily have the full
          // start->end range available, but enough that the minDuration
          // (in minutes) can be fulfilled.
          //
          // See: https://www.sharetribe.com/api-reference/marketplace.html#availability-filtering
          availability: 'time-partial',

          ...minDurationMaybe,
        }
      : {};
  };

  const { perPage, price, dates, minDuration, ...rest } = searchParams;
  const priceMaybe = priceSearchParams(price);
  const availabilityMaybe = availabilityParams(dates, minDuration);

  const params = {
    ...rest,
    ...priceMaybe,
    ...availabilityMaybe,
    per_page: perPage,
  };  
  
  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchListingsSuccess(response));
      dispatch(fetchListingTimeSlots(response.data, availabilityMaybe));
      return response;
    })
    .catch(e => {
      dispatch(searchListingsError(storableError(e)));
      throw e;
    });
};

export const setActiveListing = listingId => ({
  type: SEARCH_MAP_SET_ACTIVE_LISTING,
  payload: listingId,
});

export const searchMapListings = searchParams => (dispatch, getState, sdk) => {
  dispatch(searchMapListingsRequest(searchParams));

  const { perPage, ...rest } = searchParams;
  const params = {
    ...rest,
    per_page: perPage,
  };

  return sdk.listings
    .query(params)
    .then(response => {
      dispatch(addMarketplaceEntities(response));
      dispatch(searchMapListingsSuccess(response));
      return response;
    })
    .catch(e => {
      dispatch(searchMapListingsError(storableError(e)));
      throw e;
    });
};

const timeSlotsRequest = params => (dispatch, getState, sdk) => {
  return sdk.timeslots.query(params).then(response => {
    return denormalisedResponseEntities(response);
  });
};

const fetchListingTimeSlots = (listings, availabilityMaybe) => (dispatch, getState, sdk) => {  
  const today = new Date();
  
  const startDate = availabilityMaybe && availabilityMaybe.start ? availabilityMaybe.start : today;
  const endDate = availabilityMaybe && availabilityMaybe.end ? availabilityMaybe.end : new Date(today.getFullYear(), today.getMonth() + 1, 0);

  listings.data.forEach(listing => {
    dispatch(fetchTimeSlots(listing.id, startDate, endDate));
  }); 
};

const fetchTimeSlots = (listingId, start, end) => (dispatch, getState, sdk) => {
  dispatch(fetchTimeSlotsRequest(listingId.uuid));

  // The maximum pagination page size for timeSlots is 500
  const extraParams = {
    per_page: 500,
    page: 1,
  };

  return dispatch(timeSlotsRequest({ listingId, start, end, ...extraParams }))
    .then(timeSlots => {
      dispatch(fetchTimeSlotsSuccess(listingId.uuid, timeSlots));      
    })
    .catch(e => {
      dispatch(fetchTimeSlotsError(listingId.uuid, storableError(e)));      
    });
};