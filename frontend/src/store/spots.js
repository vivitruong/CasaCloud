import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';


export const allSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}



export const landingPageSpots = () => async dispatch => {
    const response = await csrfFetch(`api/spots`);
    const spotsData = await response.json();
    dispatch(allSpots(spotsData.Spots));
    return response;
}


//Reducer

export default function spotsReducer(state = {}, action) {
    let newState;
    switch (action.type) {
        case GET_SPOTS:
            newState = {};
            for (let spot of action.spots) {
                newState.allSpots[spot.id] = spot
            }
            return newState;

        default:
        return state
    }
}
