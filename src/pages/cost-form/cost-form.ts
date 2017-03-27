import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import { WrongDataService } from '../../providers/alert.wrong.data';
import {Store} from '@ngrx/store'

import {expensesState, ADD_COST} from '../../reducers/expenses.reducer';
import {UPDATE_BALANCE} from '../../reducers/balance.reducer';


@Component({
    selector: 'page-cost-form',
    templateUrl: 'cost-form.html'
})
export class CostFormPage {
    category;
    _currentBalance;
    currentBalance$;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public store: Store<expensesState>,
                public wrongData: WrongDataService) {
    }

    ionViewDidLoad() {
        this.category = this.navParams.get('title').toLowerCase();
        this.currentBalance$ = this.store.select('balance');
        this.currentBalance$.subscribe(v => {
            this._currentBalance = v.balance;
        })
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    makeExpenses(data) {
        console.log(data.value);
        let currentData = {
            currency: data.value.currency,
            money: data.value.money
        }
        let newData = this.updateMoney(currentData, this._currentBalance);
        console.log(this._currentBalance)
        console.log('newdata', newData)
        if (!this.wrongData.validateTotalSum(newData)) {
            this.wrongData.showAlertError();
        } else {
            this.store.dispatch({type: ADD_COST, payload: {data: data.value, category: this.category}});
            this.store.dispatch({type: UPDATE_BALANCE, payload: newData});
            this.dismiss();
        }


    }


    updateMoney(input, def) {
        let newTotalSum = {[input.currency]: def[input.currency] - Number(input.money)};
        console.log(newTotalSum)

        return Object.assign({}, def, newTotalSum)
    }



}
