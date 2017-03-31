import {Component} from '@angular/core';
import {Store} from '@ngrx/store'
import {GET_LATEST_COSTS, LOAD_MORE_COSTS} from '../../reducers/expenses.reducer';

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {
  lastExpenses;
  expensesData = [];


  constructor(private store: Store<any>,) {
    this.lastExpenses = this.store.select('expenses');
    this.lastExpenses.subscribe(v => {
      this.expensesData = v.expenses
    });

  }

  ionViewDidLoad() {
    if (!this.expensesData.length) {
      this.store.dispatch({type: GET_LATEST_COSTS})
    }

  }

  loadMore() {
    this.store.dispatch({type: LOAD_MORE_COSTS})
  }

}
