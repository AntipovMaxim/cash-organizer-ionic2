

import {
    ADD_COST, ADD_COST_SUCCESS,
    ADD_COST_FAILED, GET_LATEST_COSTS,
    GET_LATEST_COSTS_SUCCESS,
    GET_LATEST_COSTS_FAILED,
    LOAD_MORE_COSTS,
    LOAD_MORE_COSTS_SUCCESS,
    LOAD_MORE_COSTS_FAILED,
    LOAD_MORE_COSTS_SUCCESS_COMPLETE,
    GET_LATEST_COSTS_SUCCESS_COMPLETE,
    FILTER_COSTS, FILTER_COSTS_SUCCESS,
    FILTER_COSTS_FAILED

} from '../reducers/expenses.reducer';
import firebase from "firebase";





import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { Effect, Actions, toPayload } from "@ngrx/effects";
import { Store } from '@ngrx/store'

import { AngularFire } from 'angularfire2';

@Injectable()
export class expensesEffects {
    authInfo;
    uid;
    lastValue;

    constructor(private action$: Actions, public af: AngularFire, public store: Store<any>) {
        this.authInfo = this.store.select('auth');
        this.authInfo.subscribe(v => {
            if(v.currentUser) this.uid = v.currentUser.uid;
        });

    }

    @Effect() addExpenses$ = this.action$
        .ofType(ADD_COST)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in addCost$", payload);
            return this.doAddExpenses(payload)
        });

    @Effect() getLatestExpenses$ = this.action$
        .ofType(GET_LATEST_COSTS)
        .switchMap(payload => {
            return this.dogetLatestExpenses()
        });
    

    @Effect() loadMoreExpenses$ = this.action$
        .ofType(LOAD_MORE_COSTS)
        .switchMap(payload => {
            return this.loadMoreExpenses()
        });

    @Effect() filterExpenses$ = this.action$
        .ofType(FILTER_COSTS)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in filterCost$", payload);
            return this.filterExpenses(payload)
        });

    filterExpenses(creds){
        return Observable.create((observer) => {
            this.af.database.list(`/${this.uid}/expenses`, { preserveSnapshot: false, query: {
                // limitToLast: 1,
                // orderByKey: true
                orderByChild: 'day',
                // orderByChild: 'category',
                // equalTo: 'products',
                //limitToLast: 4,
                //orderByChild: 'date',
                startAt: creds.from,
                endAt: creds.to
            } })
                .map(v => v.reverse())
                .subscribe(items => {
                    console.log(items)
                        observer.next({ type: FILTER_COSTS_SUCCESS, payload: items})
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: FILTER_COSTS_FAILED, payload: error })
                })
        })
    }


    loadMoreExpenses() {
        console.log('LAST VALUE OF DATE',this.lastValue)

        return Observable.create((observer) => {
            this.af.database.list(`/${this.uid}/expenses`, { preserveSnapshot: false, query: {
                // limitToLast: 1,
                // orderByKey: true
                // orderByChild: 'date'
                // orderByChild: 'category',
                // equalTo: 'products',
                orderByChild: 'date',
                //startAt: this.lastValue,
                endAt: this.lastValue,
                limitToLast: 4,
                //endAt: 100
            } })
                .map(v => v.reverse())
                .subscribe(items => {
                    console.log(items)
                    this.lastValue = items[items.length-1].date;
                    console.log(items.length)
                    if(items.length < 4) {
                        observer.next({ type: LOAD_MORE_COSTS_SUCCESS_COMPLETE, payload: items.slice(0, 3)})
                    } else{
                        observer.next({ type: LOAD_MORE_COSTS_SUCCESS, payload: items.slice(0, 3)})
                    }

                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: LOAD_MORE_COSTS_FAILED, payload: error })
                })
        })
    }

    dogetLatestExpenses() {

        return Observable.create((observer) => {
            this.af.database.list(`/${this.uid}/expenses`, { preserveSnapshot: false, query: {
                // limitToLast: 1,
                // orderByKey: true
                // orderByChild: 'date'
                // orderByChild: 'category',
                // equalTo: 'products',
                limitToLast: 4,
                //orderByChild: 'date',
                //startAt: 50,
                //endAt: 100
            } })
                .map(v => v.reverse())
                .subscribe(items => {
                    console.log('ITEMS',items.length)
                    if(items.length !== 0){
                        this.lastValue = items[items.length-1].date;
                        console.log(items[items.length-1])
                        }

                    if(items.length < 4) {
                        observer.next({ type: GET_LATEST_COSTS_SUCCESS_COMPLETE, payload: items.slice(0, 3)})
                    } else{
                        observer.next({ type: GET_LATEST_COSTS_SUCCESS, payload: items.slice(0, 3) })
                    }


                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_LATEST_COSTS_FAILED, payload: error })
                })
        })
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doAddExpenses(info) {
        let date = new Date();
        let counter = 24;
        const data = {
            category: info.category,
            money: info.data.money,
            description: info.data.description,
            //date: firebase.database.ServerValue.TIMESTAMP
            currency: info.data.currency,
            date: Date.now(),
            day: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
            //day: `25-3-2017`
        };
        return Observable.create((observer) => {
            var s: any = this.af.database.list(`/${this.uid}/expenses`);
            s.push(data)
                .then(items => {
                    console.log("Success", data)
                    observer.next({ type: ADD_COST_SUCCESS, payload: data })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: ADD_COST_FAILED, payload: error })
                })
        })
    }

}