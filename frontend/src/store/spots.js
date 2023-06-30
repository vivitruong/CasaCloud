import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const FILTER_SPOTS = 'spots/loadFilterSpots';
const CREATE_SPOTS = 'spots/createSpots';
const DETAIL_SPOTS = 'spots/detailSpots';
const EDIT_SPOTS = 'spots/editSpots';
const HOST_SPOTS = 'spots/hostSpots';



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

export function displayDetailSpots(spot) {
    return {
        type: DETAIL_SPOTS,
        spot
    }
}

export function editSpot(spot) {
    return {
        type: EDIT_SPOTS,
        spot
    }
}

export function getHostSpot(spots) {
    return {
        type: HOST_SPOTS,
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
    const { address, city, state, country, lat, lng, name, description, price, url, preview } = spot;

    const response = await csrfFetch(`/api/spots`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, address, city, country, state, lat, lng, price })
    });
    if(response.ok) {
        const data = await response.json();
        const imgRes = await csrfFetch(`/api/spots/${data.id}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({url, preview})
        });
        if(imgRes.ok) {
            const imgData = await imgRes.json();
            const imgUrl = imgData.url;
            data.previewImage = imgUrl;
            dispatch(createSpots(data));
            return data
        }
    }
};

export const fetchDetailSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`)
    const data = await response.json();
    dispatch(displayDetailSpots(data))
};

export const getEditSpot = (spot) => async (dispatch) => {
    const { name, description, address, city, country, state, lat, lng, price } = spot;
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, address, city, country, state, lat, lng, price })
    })
    if (response.ok) {
        const data = await response.json();
        dispatch(editSpot(data))
        return data;
    }

};

export const getUserSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots/current`);
    const data = await response.json();
    dispatch(getHostSpot(data.Spots))
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

        case DETAIL_SPOTS:
            newState = { ...state};
            const spot = action.spot
            newState = spot;
            return newState;

        case EDIT_SPOTS:
            newState = { ...state };
            newState[action.spots.id] = action.spots;
            return newState;




        default:
            return state
    }

}

export default spotsReducer;
