import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, MenuController} from 'ionic-angular';
import {IncreaseBalanceFormPage} from '../increase-balance-form/increase-balance-form';
import {Store} from '@ngrx/store'

import {GET_BALANCE_REPORT} from '../../reducers/balance.reducer'

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {
  balance;
  balanceData;

  constructor(public modalCtrl: ModalController,
              public menuCtrl: MenuController,
              private store: Store<any>) {
    this.store.dispatch({type: GET_BALANCE_REPORT});
    this.balance = this.store.select('balance');
    this.balance.subscribe(v => {
      this.balanceData = v;
    })

  }


  increaseBalance() {
    let modal = this.modalCtrl.create(IncreaseBalanceFormPage, {
      balanceData: this.balanceData.balance,
      operation: 'plus'
    });
    modal.present();
  }

  decreaseBalance() {
    let modal = this.modalCtrl.create(IncreaseBalanceFormPage, {
      balanceData: this.balanceData.balance,
      operation: 'minus'
    });
    modal.present();
  }


}
