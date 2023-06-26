import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';


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

        default:
            return state
    }
}

export default spotsReducer;
