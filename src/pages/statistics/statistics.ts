import {Component} from '@angular/core';
import {Store} from '@ngrx/store'
import {DatePicker} from 'ionic-native';

import {FILTER_COSTS} from '../../reducers/expenses.reducer';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})
export class StatisticsPage {

  statistics$;
  statisticsData = [];
  dateFrom: string = '';
  dateTo: string = '';
  options;
  optionsData;
  tableData;
  totalSum: number = 0;

  constructor(private store: Store<any>,) {

    this.statistics$ = this.store.select('expenses');
    this.statistics$.subscribe(v => {
      this.statisticsData = v.expensesStatistics
    });

  }


  getExpensesByDate() {
    this.store.dispatch({type: FILTER_COSTS, payload: {from: this.dateFrom, to: this.dateTo}})

  }

  fromDatePicker() {
    DatePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.dateFrom = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      err => console.log(err)
    );
  }

  toDatePicker() {
    DatePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: DatePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.dateTo = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
      err => console.log(err)
    );
  }

  ngAfterViewInit() {
    this.statistics$.subscribe(v => {
      this.optionsData = this.finalData(this.transformDataToObject(v.expensesStatistics))
      this.tableData = this.finalDataforTable(this.transformDataToObject(v.expensesStatistics))
      this.options = this.getOptions();
    });
  }

  getOptions() {
    console.log(this.optionsData)
    return {
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Statistics for the selected period'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        },
        series: {
          dataLabels: {
            enabled: true,
            //format: '{point.name}: {point.y:.1f}%',
            format: '{point.y}%'
          }
        }
      },
      series: [{
        name: 'Status',
        colorByPoint: true,
        data: this.optionsData
      }]
    }
  }

  transformDataToObject(arr) {
    return arr.reduce((accum, cur) => {
      accum[cur.category] = Number(cur.money) + (accum[cur.category] ? accum[cur.category] : 0);
      return accum
    }, {})
  }


  finalData(o) {
    let arr = [];
    for (let key in o) {
      this.totalSum += o[key];
    }
    for (let key in o) {
      arr.push({name: key, y: Math.round((o[key] / this.totalSum) * 100)})
    }
    return arr;
  }

  finalDataforTable(o) {
    console.log('O', o)
    let arr = [];
    let totalSum = 0;
    for (let key in o) {
      totalSum += o[key];
    }
    for (let key in o) {
      arr.push({category: key, money: o[key]})
    }
    return arr;
  }

}
