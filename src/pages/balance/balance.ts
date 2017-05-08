import {Component} from '@angular/core';
import {ModalController} from 'ionic-angular';
import {IncreaseBalanceFormPage} from '../increase-balance-form/increase-balance-form';
import {Store} from '@ngrx/store';
import {ParseDataService} from '../../providers/parse.data';


import {GET_BALANCE_REPORT} from '../../reducers/balance.reducer'

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {
  balance;
  balanceData;
  balanceData_;

  constructor(public modalCtrl: ModalController,
              private store: Store<any>,
              public parseData: ParseDataService) {
    this.store.dispatch({type: GET_BALANCE_REPORT});
    this.balance = this.store.select('balance');
    this.balance.subscribe(v => {
      this.balanceData = v;
      this.balanceData_ = this.parseData.parseToFinalBalanceData(v.balanceReport);
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
