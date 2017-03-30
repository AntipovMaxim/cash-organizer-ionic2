import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, MenuController  } from 'ionic-angular';
import { IncreaseBalanceFormPage } from '../increase-balance-form/increase-balance-form';
import { CurrencyExchangePage } from '../currency-exchange/currency-exchange';
import { Store } from '@ngrx/store'

import { GET_BALANCE, GET_BALANCE_REPORT } from '../../reducers/balance.reducer'

@Component({
  selector: 'page-balance',
  templateUrl: 'balance.html'
})
export class BalancePage {
  balance;
  balanceData;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public menuCtrl: MenuController,
  private store: Store<any>) {
    this.store.dispatch({type: GET_BALANCE_REPORT});
    this.balance = this.store.select('balance');
    this.balance.subscribe(v => {
      this.balanceData = v;
      console.log("DDDDDD",v)
    })

  }
  toggle(){
  this.menuCtrl.open();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad BalancePage');
    // this.store.select('balance').subscribe(v =>{
    //   console.log(v)
    // })


  }

  increaseBalance(balanceData){
    let modal = this.modalCtrl.create(IncreaseBalanceFormPage, {balanceData: this.balanceData.balance, operation: 'plus'});
    modal.present();
  }

  decreaseBalance(balanceData){
    let modal = this.modalCtrl.create(IncreaseBalanceFormPage, {balanceData: this.balanceData.balance, operation: 'minus'});
    modal.present();
  }



}
