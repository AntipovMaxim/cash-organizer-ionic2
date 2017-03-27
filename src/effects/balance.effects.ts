import {
    UPDATE_BALANCE,
    UPDATE_BALANCE_SUCCESS,
    UPDATE_BALANCE_FAILED,
    GET_BALANCE,
    GET_BALANCE_SUCCESS,
    GET_BALANCE_FAILED,
    ADD_TO_BALANCE_REPORT,
    ADD_TO_BALANCE_REPORT_SUCCESS,
    ADD_TO_BALANCE_REPORT_FAILED,
    GET_BALANCE_REPORT,
    GET_BALANCE_REPORT_SUCCESS,
    GET_BALANCE_REPORT_FAILED
} from '../reducers/balance.reducer';



import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Store} from '@ngrx/store'

import {AngularFire} from 'angularfire2';

@Injectable()
export class balanceEffects {
    authInfo;
    uid;
    balance$;
    constructor(private action$: Actions, public af: AngularFire, public store: Store<any>) {
        this.authInfo = this.store.select('auth');
        this.authInfo.subscribe(v => {
            if (v.currentUser) this.uid = v.currentUser.uid;
        });

        this.balance$ = this.af.database.object(`/${this.uid}/totalBalance`);

    }

    @Effect() getBalance$ = this.action$
        .ofType(GET_BALANCE)
        .switchMap(payload => {
            return this.getBalance()
        });


    @Effect() increaseBalance$ = this.action$
        .ofType(UPDATE_BALANCE)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in addCost$", payload);
            return this.increaseBalance(payload)
        });

    @Effect() addToBalanceReport$ = this.action$
        .ofType(ADD_TO_BALANCE_REPORT)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in addCost$", payload);
            return this.addToBalanceReport(payload)
        });

    @Effect() getBalanceReport$ = this.action$
        .ofType(GET_BALANCE_REPORT)
        .switchMap(payload => {
            return this.getBalanceReport()
        });

    getBalanceReport() {

        return Observable.create((observer) => {
            this.af.database.list(`/${this.uid}/balanceReport`)
                .map(v => v.reverse())
                .subscribe(items => {
                    console.log('REPORT',items)
                        observer.next({ type: GET_BALANCE_REPORT_SUCCESS, payload: items})
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_BALANCE_REPORT_FAILED, payload: error })
                })
        })
    }

//не правильно добавляет!!!!!!!!!!!!!!!!!!!!!!!!!!!
    addToBalanceReport(info) {

        let data = Object.assign(info, {date: Date.now()});
        return Observable.create((observer) => {
            var s: any = this.af.database.list(`/${this.uid}/balanceReport`);
            s.push(data)
                .then(items => {
                    console.log("Success", data)
                    observer.next({ type: ADD_TO_BALANCE_REPORT_SUCCESS, payload: data })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: ADD_TO_BALANCE_REPORT_FAILED, payload: error })
                })
        })
    }

    getBalance() {

        return Observable.create((observer) => {
            let balance$ = this.af.database.object(`/${this.uid}/totalBalance`)
             balance$
                .subscribe(data => {
                       console.log('GET BALANCE ', data)
                        observer.next({ type: GET_BALANCE_SUCCESS, payload: data })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_BALANCE_FAILED, payload: error })
                })
        })
    }

    increaseBalance(info) {
        console.log("UPDATE DATA",info)
        // const data = {
        //     [info.currency]: Number(info.money),
        //
        // };
        return Observable.create((observer) => {
            let balance$ = this.af.database.object(`/${this.uid}/totalBalance`)
            balance$.update(info)
                .then(items => {
                    console.log("Success", info)
                    observer.next({type: UPDATE_BALANCE_SUCCESS, payload: info})
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({type: UPDATE_BALANCE_FAILED, payload: error})
                })
        })
    }

}