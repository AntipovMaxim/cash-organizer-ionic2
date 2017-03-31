import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Store} from '@ngrx/store'
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {DatePicker} from 'ionic-native';
import * as moment from "moment";


import {GET_LATEST_COSTS, LOAD_MORE_COSTS} from '../../reducers/expenses.reducer';

@Component({
    selector: 'page-report',
    templateUrl: 'report.html'
})
export class ReportPage {
    lastExpenses;
    expensesData = [];


    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private store: Store<any>,
                private af: AngularFire) {

        this.lastExpenses = this.store.select('expenses');
        this.lastExpenses.subscribe(v => {
            this.expensesData = v.expenses
            // this.optionsData = this.finalData(this.transformDataToObject(v.expenses))
            //
            // this.options = this.getOptions();
        });

    }

    ionViewDidLoad() {
        console.log('this.expensesData', this.expensesData);
        if (!this.expensesData.length) {
            this.store.dispatch({type: GET_LATEST_COSTS})
        }

    }

    loadMore() {
        this.store.dispatch({type: LOAD_MORE_COSTS})
    }

}
