import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Store} from '@ngrx/store'

import {UPDATE_BALANCE} from '../../reducers/balance.reducer';

import {WrongDataService} from '../../providers/alert.wrong.data';
import  {CurrencyExchangeService} from '../../providers/currency.exchange';
import {BalancePage} from '../balance/balance';

@Component({
  selector: 'page-currency-exchange',
  templateUrl: 'currency-exchange.html'
})
export class CurrencyExchangePage {
  currentBalance: any;
  currencyEx: Array<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private store: Store<any>,
              private wrongData: WrongDataService,
              public currencyExServ: CurrencyExchangeService) {

  }

  ionViewWillEnter() {
    this.currencyExServ.getCurrencyExchangeFromPrivatBank()
      .then(r => {
        this.currencyEx = r.slice(0, -1);
      })
  }

  ionViewDidLoad() {
    this.currentBalance = this.navParams.get('balanceData');
    let balance$ = this.store.select('balance');
    balance$.subscribe(v => this.currentBalance = v)
  }

  dismiss() {
    this.navCtrl.push(BalancePage);
  }


  doExchange(data) {
    let newBalance = this.culculateExchange(data.value, this.currentBalance.balance);
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
