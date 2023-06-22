import { csrfFetch } from './csrf';

const LOG_IN = 'session/login';
const LOG_OUT = 'session/logout';

export function login(user) {
    return {
        type: LOG_IN,
        payload: user
    };
};

export function logout() {
    return {
        type: LOG_OUT
    }
};
//Thunk action creators
export const userLogin = (user) => async (dispatch) => {
    const response = await csrfFetch(`/api/session`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const data = await response.json();
    dispatch(login(data.user));
    return response;
};

//Reducer
const initialState = {user: null}

export default function sessionReducer(state = initialState, action) {
    let newState;
    switch(action.type) {
        case LOG_IN:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        default:
            return state
    }
}
