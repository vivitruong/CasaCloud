import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const FILTER_SPOTS = 'spots/loadFilterSpots';


export const allSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

//Thunk action creator
export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch("/api/spots", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(allSpots(data.Spots));
      }
      return response;
};
export function displayFilterSpots(spots) {
    return {
        type: FILTER_SPOTS,
        spots
    }
};

export const filterSpots = (query) => async (dispatch) => {
    const { minPrice, maxPrice } = query;
    try {
        const response = await fetch(`/api/spots/?minPrice=${minPrice}&maxPrice=${maxPrice}`);
        const data = await response.json();
        dispatch(displayFilterSpots(data));
        return data;
    } catch (err) {
        throw err;
    }
}
let initializedState = {
    allSpots: {},
    singleSpot: {}
}


//Reducer
let initialState = {}

const spotsReducer = (state = initialState, action) => {
    let newState = {}
    switch (action.type) {
        case GET_SPOTS:
            action.spots.forEach((spot) => {
                newState[spot.id] = spot
              })
              return newState;

        case FILTER_SPOTS:
        const filterSpots = action.spots.Spots;
        for (let spot of filterSpots) {
            newState[spot.id] = spot
        }
        return newState;


        default:
            return state
    }

}

export default spotsReducer;
