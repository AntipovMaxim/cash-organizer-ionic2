import {ActionReducer, Action} from "@ngrx/store";

export const GET_BALANCE: string = 'GET_BALANCE';
export const GET_BALANCE_SUCCESS: string = 'GET_BALANCE_SUCCESS';
export const GET_BALANCE_FAILED: string = 'GET_BALANCE_FAILED';
export const UPDATE_BALANCE: string = 'UPDATE_BALANCE';
export const UPDATE_BALANCE_SUCCESS: string = 'UPDATE_BALANCE_SUCCESS';
export const UPDATE_BALANCE_FAILED: string = 'UPDATE_BALANCE_FAILED';
export const ADD_TO_BALANCE_REPORT: string = 'ADD_TO_BALANCE_REPORT';
export const ADD_TO_BALANCE_REPORT_SUCCESS: string = 'ADD_TO_BALANCE_REPORT_SUCCESS';
export const ADD_TO_BALANCE_REPORT_FAILED: string = 'ADD_TO_BALANCE_REPORT_FAILED';
export const GET_BALANCE_REPORT: string = 'GET_BALANCE_REPORT';
export const GET_BALANCE_REPORT_SUCCESS: string = 'GET_BALANCE_REPORT_SUCCESS';
export const GET_BALANCE_REPORT_FAILED: string = 'GET_BALANCE_REPORT_FAILED';


export const intitialState = {
  loading: false,
  balance: {
    UAH: 0,
    USD: 0,
    EUR: 0
  },
  balanceReport: [],
  currentCreds: null
};

export interface balanceState {
  loading: boolean,
  balance: {
    UAH: number,
    USD: number,
    EUR: number
  },
  currentCreds: any,
  balanceReport: Array<any>,
}
;


export const balanceReducer: ActionReducer<balanceState> =
  (state = intitialState, action: Action) => {


    switch (action.type) {

      case GET_BALANCE_REPORT: {
        return Object.assign({}, state, {loading: true})
      }

      case GET_BALANCE_REPORT_SUCCESS: {
        return Object.assign({},
          state,
          {
            balanceReport: [...action.payload],
            currentCreds: null, error: null, loading: false
          })
      }

      case GET_BALANCE_REPORT_FAILED: {
        return Object.assign({}, state, {balanceReport: state.balanceReport, error: action.payload, loading: false})
      }

      case ADD_TO_BALANCE_REPORT: {
        return Object.assign({}, state, {
          balanceReport: [...state.balanceReport],
          currentCreds: action.payload,
          loading: true
        })
      }

      case ADD_TO_BALANCE_REPORT_SUCCESS: {
        return Object.assign({},
          state,
          {
            balanceReport: [...state.balanceReport],
            currentCreds: null, error: null, loading: false
          })
      }

      case ADD_TO_BALANCE_REPORT_FAILED: {
        return Object.assign({}, state, {balanceReport: null, error: action.payload, loading: false})
      }

      case GET_BALANCE: {
        return Object.assign({}, state, {loading: true})
      }

      case GET_BALANCE_SUCCESS: {
        return Object.assign({},
          state,
          {
            balance: action.payload,
            error: null, loading: false
          })
      }

      case GET_BALANCE_FAILED: {
        return Object.assign({}, state, {balance: null, error: action.payload, loading: true})
      }

      case UPDATE_BALANCE: {
        return Object.assign({}, state, {currentCreds: action.payload, loading: true})
      }

      case UPDATE_BALANCE_SUCCESS: {
        return Object.assign({},
          state,
          {
            balance: Object.assign({}, state.balance, action.payload),
            currentCreds: null, error: null, loading: false
          })
      }

      case UPDATE_BALANCE_FAILED: {
        return Object.assign({}, state, {balance: null, error: action.payload, loading: false})
      }

      default: {
        return state;
      }
    }
  };