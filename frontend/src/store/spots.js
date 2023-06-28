import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const FILTER_SPOTS = 'spots/loadFilterSpots';
const CREATE_SPOTS = 'spots/createSpots';



export const allSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
};

export const createSpots = (spots) => {
    return {
        type: CREATE_SPOTS,
        spots
    }
};

export function displayFilterSpots(spots) {
    return {
        type: FILTER_SPOTS,
        spots
    }
};

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

export const filterSpots = (query) => async (dispatch) => {
    const { minPrice, maxPrice } = query;
    try {
        const response = await csrfFetch(`/api/spots/?minPrice=${minPrice}&maxPrice=${maxPrice}`);
        const data = await response.json();
        dispatch(displayFilterSpots(data));
        return data;
    } catch (err) {
        throw err;
    }
};

export const createSpot = (spot) => async (dispatch) => {
    // const { address, city, state, country, lat, lng, name, description, price, url, preview } = spot;

    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(spot)
    });
    if(response.ok) {
        const data = await response.json();
        const imgRes = await csrfFetch(`/api/spots/${data.id}/images`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({url: spot.url, preview: spot.previewImage})
        });
        if(imgRes.ok) {
            const imgData = await imgRes.json();
            const imgUrl = imgData.url;
            data.previewImage = imgUrl;
            dispatch(createSpots(data));
            return data
        }
    }
}
// let initializedState = {
//     allSpots: {},
//     singleSpot: {}
// }


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

        case CREATE_SPOTS:
            newState = { ...state };
            newState[action.spots.id] = action.spots;
                return newState;



        default:
            return state
    }

}

export default spotsReducer;
