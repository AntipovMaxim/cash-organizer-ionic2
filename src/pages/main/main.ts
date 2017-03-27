import { Component } from '@angular/core';
import { NavController,  ModalController } from 'ionic-angular';
import { Store } from '@ngrx/store'

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { authState, LOGOUT } from '../../reducers/auth.reducer';
import { GET_BALANCE } from '../../reducers/balance.reducer';
import { categories } from '../../mock/categories';
import { CostFormPage } from '../cost-form/cost-form'

@Component({
  selector: 'main',
  templateUrl: 'main.html'
})
export class MainPage {

  items: FirebaseListObservable<any[]>;
  categories: Array<Object>;
  lastExpenses;


  constructor(public navCtrl: NavController,
              af: AngularFire, private store: Store<authState>,
              public modalCtrl: ModalController) {
        this.categories = categories;
        this.lastExpenses = this.store.select('expenses');

  }

  doLogout() {
    this.store.dispatch({ type: LOGOUT });
  }

  addCost(category){
    let modal = this.modalCtrl.create(CostFormPage, {title: category});
     modal.present();
  }



  ionViewDidLoad() {
    this.store.dispatch({type: GET_BALANCE});
  }




}