import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {Store} from '@ngrx/store'

import { UPDATE_BALANCE } from '../../reducers/balance.reducer';

import { WrongDataService } from '../../providers/alert.wrong.data';


@Component({
  selector: 'page-currency-exchange',
  templateUrl: 'currency-exchange.html'
})
export class CurrencyExchangePage {
  currentBalance: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private store: Store<any>,
              private wrongData: WrongDataService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrencyExchangePage');
    this.currentBalance = this.navParams.get('balanceData');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  doExchange(data) {
    console.log(data.value);
    console.log(this.currentBalance);
    let newBalance = this.culculateExchange(data.value, this.currentBalance)
    if (!this.wrongData.validateTotalSum(newBalance)) {
      this.wrongData.showAlertError()
    } else {
      this.store.dispatch({type: UPDATE_BALANCE, payload: newBalance});
      this.dismiss();
    }
  }

  culculateExchange(input, def) {
    let o = {
      [input.currency_from]: def[input.currency_from] - Number(input.money_from),
      [input.currency_to]: def[input.currency_to] + Number(input.money_to),
    };
    return Object.assign({}, def, o)
  }

}
