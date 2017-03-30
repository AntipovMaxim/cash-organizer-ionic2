import { ActionReducer, Action } from "@ngrx/store";

export const GET_DEVICE_TOKENS: string = 'GET_DEVICE_TOKENS';
export const GET_DEVICE_TOKENS_SUCCESS: string = 'GET_DEVICE_TOKENS_SUCCESS';
export const GET_DEVICE_TOKENS_FAILED: string = 'GET_DEVICE_TOKENS_FAILED';



export const intitialState = {
    loading: false,
    tokens: [],

};

export interface tokensState {
    loading: boolean,
    tokens: Array<string>,
};


export const tokensReducer: ActionReducer<tokensState> =
    (state = intitialState, action: Action) => {


        switch (action.type) {

            case GET_DEVICE_TOKENS: {
                return Object.assign({}, state, { loading: true })
            }

            case GET_DEVICE_TOKENS_SUCCESS: {
                return Object.assign({},
                    state,
                    { tokens: [...action.payload],
                         error: null, loading: false })
            }

            case GET_DEVICE_TOKENS_FAILED: {
                return Object.assign({}, state, { tokens: state.tokens, error: action.payload, loading: false })
            }

            default: {
                return state;
            }
        }
    };