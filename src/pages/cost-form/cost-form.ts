import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {WrongDataService} from '../../providers/alert.wrong.data';
import {Store} from '@ngrx/store'

import {expensesState, ADD_COST} from '../../reducers/expenses.reducer';
import {UPDATE_BALANCE} from '../../reducers/balance.reducer';
import {GET_DEVICE_TOKENS} from '../../reducers/notifications.reducer';
import * as moment from 'moment';

@Component({
  selector: 'page-cost-form',
  templateUrl: 'cost-form.html'
})
export class CostFormPage {
  category;
  _currentBalance;
  currentBalance$;
  deviceTokens$;
  deviceTokens_;
  expensesDate: String = moment().format('YYYY-MM-DD');

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public store: Store<expensesState>,
              public wrongData: WrongDataService) {
    this.store.dispatch({type: GET_DEVICE_TOKENS});
  }

  ionViewDidLoad() {
    this.category = this.navParams.get('title').toLowerCase();
    this.currentBalance$ = this.store.select('balance');
    this.deviceTokens$ = this.store.select('tokens');
    this.currentBalance$.subscribe(v => {
      this._currentBalance = v.balance;
    })
    this.deviceTokens$.subscribe(v => {
      this.deviceTokens_ = v.tokens;
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  formatDate(date: String) {
    let defDate = date.split('-');
    return [defDate[2], defDate[1], defDate[0]].join('.')
  }

  makeExpenses(data) {
    console.log(this.expensesDate)
    let date = this.formatDate(this.expensesDate);
    let currentData = {
      currency: data.value.currency,
      money: data.value.money
    };
    let newData = this.updateMoney(currentData, this._currentBalance);
    if (!this.wrongData.validateTotalSum(newData)) {
      this.wrongData.showAlertError();
    } else {
      this.store.dispatch({
        type: ADD_COST,
        payload: {data: data.value, category: this.category, tokens: this.deviceTokens_, date}
      });
      this.store.dispatch({type: UPDATE_BALANCE, payload: newData});
      this.dismiss();
    }
  }


  updateMoney(input, def) {
    let newTotalSum = {[input.currency]: def[input.currency] - Number(input.money)};
    return Object.assign({}, def, newTotalSum)
  }

}
