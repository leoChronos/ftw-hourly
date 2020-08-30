import { updatedEntities, denormalisedEntities } from '../../util/data';
import { storableError } from '../../util/errors';

// ================ Action types ================ //

export const FETCH_LISTINGS_REQUEST = 'app/ManageYourSpotsPage/FETCH_LISTINGS_REQUEST';
export const FETCH_LISTINGS_SUCCESS = 'app/ManageYourSpotsPage/FETCH_LISTINGS_SUCCESS';
export const FETCH_LISTINGS_ERROR = 'app/ManageYourSpotsPage/FETCH_LISTINGS_ERROR';

// ================ Reducer ================ //

const initialState = {
    pagination: null,
    queryParams: null,
    queryInProgress: false,
    queryListingsError: null,
    listings: [],
  };


const ManageYourSpotsPageReducer = (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case FETCH_LISTINGS_REQUEST:
        return {
          ...state,
          queryParams: payload.queryParams,
          queryInProgress: true,
          queryListingsError: null,
          listings: [],
        };
      case FETCH_LISTINGS_SUCCESS:
        return {
          ...state,
          listings: payload.data.data,
          pagination: payload.data.meta,
          queryInProgress: false,
        };
      case FETCH_LISTINGS_ERROR:
        // eslint-disable-next-line no-console
        console.error(payload);
        return { ...state, queryInProgress: false, queryListingsError: payload };
  
      default:
        return state;
    }
  };
  
  export default ManageYourSpotsPageReducer;


// ================ Action creators ================ //

export const queryListingsRequest = queryParams => ({
  type: FETCH_LISTINGS_REQUEST,
  payload: { queryParams },
});

export const queryListingsSuccess = response => ({
  type: FETCH_LISTINGS_SUCCESS,
  payload: { data: response.data },
});

export const queryListingsError = e => ({
  type: FETCH_LISTINGS_ERROR,
  error: true,
  payload: e,
});

  // Throwing error for new (loadData may need that info)
export const queryOwnListings = queryParams => (dispatch, getState, sdk) => {
    dispatch(queryListingsRequest(queryParams));
  
    const { perPage, ...rest } = queryParams;
    const params = { ...rest, per_page: perPage };
  
    return sdk.ownListings
      .query(params)
      .then(response => {
        dispatch(queryListingsSuccess(response));
        return response;
      })
      .catch(e => {
        dispatch(queryListingsError(storableError(e)));
        throw e;
      });
  };