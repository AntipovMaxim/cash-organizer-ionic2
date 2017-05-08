// import {Component} from '@angular/core';
// import {Store} from '@ngrx/store'
// import {ParseDataService} from '../../providers/parse.data';
// import {GET_LATEST_COSTS, LOAD_MORE_COSTS} from '../../reducers/expenses.reducer';
//
// @Component({
//   selector: 'page-report',
//   templateUrl: 'report.html'
// })
// export class ReportPage {
//   lastExpenses;
//   expensesData;
//   expensesData_;
//
//
//   constructor(private store: Store<any>, public parseData: ParseDataService) {
//     this.lastExpenses = this.store.select('expenses');
//     this.lastExpenses.subscribe(v => {
//       this.expensesData = v.expenses
//       this.expensesData_ = this.parseData.parseToFinalReportData(this.expensesData);
//       console.log(this.expensesData)
//     });
//
//   }
//
//   ionViewDidLoad() {
//     if (!this.expensesData.length) {
//       this.store.dispatch({type: GET_LATEST_COSTS})
//     }
//
//
//   }
//
//   loadMore() {
//     this.store.dispatch({type: LOAD_MORE_COSTS})
//   }
//
// }
