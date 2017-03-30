import { combineReducers, ActionReducer, Action } from '@ngrx/store';

import { authReducer, authState } from './auth.reducer';
import { expensesReducer, expensesState } from './expenses.reducer';
import { balanceReducer, balanceState } from './balance.reducer';
import { tokensReducer, tokensState } from './notifications.reducer';


export interface AppState {
    auth: authState,
    expenses: expensesState,
    balance: balanceState,
    tokens: tokensState
}

const reducers = {
    auth: authReducer,
    expenses: expensesReducer,
    balance: balanceReducer,
    tokens: tokensReducer
};

const rootReducer: ActionReducer<AppState> = combineReducers(reducers);

export function root(state: any, action: Action) {
    return rootReducer(state, action);
}