import {Component} from '@angular/core';
import {Store} from '@ngrx/store'
import {DatePicker} from 'ionic-native';
import {ParseDataService} from '../../providers/parse.data';
import {CurrencyExchangeService} from '../../providers/currency.exchange';


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

  myDateFrom: String;
  myDateTo: String;

  expensesData_;

  constructor(private store: Store<any>, public parseData: ParseDataService, public currencyServ: CurrencyExchangeService) {
    this.getCurrencyExData();
    this.statistics$ = this.store.select('expenses');
    this.statistics$.subscribe(v => {
      this.statisticsData = v.expensesStatistics;
      this.myDateFrom = v.from;
      this.myDateTo = v.to;
      this.expensesData_ = this.parseData.parseToFinalReportData(v.expensesStatistics);
    });
  }



  getExpensesByDate() {
    console.log(this.myDateFrom);
    console.log(this.myDateTo);
    this.store.dispatch({type: FILTER_COSTS, payload: {from: this.myDateFrom, to: this.myDateTo}})
  }


  ngAfterViewInit() {
    this.statistics$.subscribe(v => {
      this.optionsData = this.finalData(this.transformDataToObject(v.expensesStatistics));
      this.tableData = this.finalDataforTable(this.transformDataToObject(v.expensesStatistics));
      this.options = this.getOptions();
    });
  }

  getOptions() {
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
    let array = [...arr];
    return array.reduce((accum, cur) => {
      accum[cur.category] = Number(cur.money) + (accum[cur.category] ? accum[cur.category] : 0);
      return accum
    }, {})
  }


  finalData(o) {
    this.totalSum = 0;
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
    console.log('OBJ', o)
    for (let key in o) {
      totalSum += o[key];
    }
    for (let key in o) {
      arr.push({category: key, money: o[key]})
    }
    return arr;
  }

  getCurrencyExData(){
    this.currencyServ.getCurrencyExchangeFromPrivatBank();
  }

}
