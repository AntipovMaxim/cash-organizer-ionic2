import {ActionReducer, Action} from "@ngrx/store";

export const ADD_COST: string = 'ADD_COST';
export const ADD_COST_SUCCESS: string = 'ADD_COST_SUCCESS';
export const ADD_COST_FAILED: string = 'ADD_COST_FAILED';
export const GET_LATEST_COSTS: string = 'GET_LATEST_COSTS';
export const GET_LATEST_COSTS_SUCCESS: string = 'GET_LATEST_COSTS_SUCCESS';
export const GET_LATEST_COSTS_FAILED: string = 'GET_LATEST_COSTS_FAILED';
export const LOAD_MORE_COSTS: string = 'LOAD_MORE_COSTS';
export const LOAD_MORE_COSTS_SUCCESS: string = 'LOAD_MORE_COSTS_SUCCESS';
export const LOAD_MORE_COSTS_FAILED: string = 'LOAD_MORE_COSTS_FAILED';
export const LOAD_MORE_COSTS_SUCCESS_COMPLETE: string = 'LOAD_MORE_COSTS_SUCCESS_COMPLETE';
export const GET_LATEST_COSTS_SUCCESS_COMPLETE: string = 'GET_LATEST_COSTS_SUCCESS_COMPLETE';
export const FILTER_COSTS = 'FILTER_COSTS';
export const FILTER_COSTS_SUCCESS = 'FILTER_COSTS_SUCCESS';
export const FILTER_COSTS_FAILED = 'FILTER_COSTS_FAILED';

import * as moment from 'moment';

export const intitialState = {
  loading: false,
  expenses: [],
  currentCreds: null,
  loadMoreButton: false,
  expensesStatistics: [],
  from: moment().format('YYYY-MM-DD'),
  to: moment().format('YYYY-MM-DD')
};

export interface expensesState {
  loading: boolean,
  expenses: Array<any>,
  expensesStatistics: Array<any>,
  error?: any
  currentCreds: any,
  loadMoreButton: boolean,
  from: string,
  to: string
}
;


export const expensesReducer: ActionReducer<expensesState> =
  (state = intitialState, action: Action) => {


    switch (action.type) {

      case ADD_COST: {
        return Object.assign({}, state, {expenses: [...state.expenses], currentCreds: action.payload, loading: true})
      }

      case ADD_COST_SUCCESS: {
        return Object.assign({},
          state,
          {
            expenses: [...state.expenses],
            currentCreds: null, error: null, loading: false
          })
      }

      case ADD_COST_FAILED: {
        return Object.assign({}, state, {expenses: null, error: action.payload, loading: false, currentCreds: null})
      }

      case GET_LATEST_COSTS: {
        return Object.assign({}, state, {loading: true})
      }

      case GET_LATEST_COSTS_SUCCESS: {
        return Object.assign({},
          state,
          {
            expenses: [...action.payload],
            currentCreds: null, error: null, loading: false, loadMoreButton: true
          })
      }

      case GET_LATEST_COSTS_SUCCESS_COMPLETE: {
        return Object.assign({},
          state,
          {
            expenses: [...action.payload],
            currentCreds: null, error: null, loading: false, loadMoreButton: false
          })
      }


      case GET_LATEST_COSTS_FAILED: {
        return Object.assign({}, state, {
          expenses: state.expenses,
          error: action.payload,
          loading: false,
          currentCreds: null
        })
      }

      case FILTER_COSTS: {
        return Object.assign({}, state, {currentCreds: action.payload, loading: true})
      }


      case FILTER_COSTS_SUCCESS: {
        return Object.assign({},
          state,
          {
            expensesStatistics: [...action.payload.data],
            currentCreds: null, error: null, loading: false, from: action.payload.from,
            to: action.payload.to
          })
      }


      case FILTER_COSTS_FAILED: {
        return Object.assign({}, state, {
          expenses: state.expenses,
          error: action.payload,
          loading: false,
          currentCreds: null
        })
      }

      case LOAD_MORE_COSTS: {
        return Object.assign({}, state, {loading: true})
      }

      case LOAD_MORE_COSTS_SUCCESS: {
        return Object.assign({},
          state,
          {
            expenses: [...state.expenses, ...action.payload],
            currentCreds: null, error: null, loading: false, loadMoreButton: true
          })
      }
      case LOAD_MORE_COSTS_SUCCESS_COMPLETE: {
        return Object.assign({},
          state,
          {
            expenses: [...state.expenses, ...action.payload],
            currentCreds: null, error: null, loading: false, loadMoreButton: false
          })
      }

      case LOAD_MORE_COSTS_FAILED: {
        return Object.assign({}, state, {
          expenses: state.expenses,
          error: action.payload,
          loading: false,
          currentCreds: null
        })
      }

      default: {
        return state;
      }
    }
  };