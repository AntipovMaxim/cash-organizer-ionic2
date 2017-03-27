import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Store} from '@ngrx/store'
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import {DatePicker} from 'ionic-native';
import * as moment from "moment";


import {GET_LATEST_COSTS, LOAD_MORE_COSTS, FILTER_COSTS} from '../../reducers/expenses.reducer';

@Component({
    selector: 'page-report',
    templateUrl: 'report.html'
})
export class ReportPage {
    lastExpenses;
    expensesData = [];
    dateFrom: string = '';
    dateTo: string = '';
    options;
    optionsData;

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
        this.lastExpenses.subscribe(v => {
            this.optionsData = this.finalData(this.transformDataToObject(v.expenses))

            this.options = this.getOptions();
        });
    }

    getOptions() {
        // this.new = (data.countNew/data.totalCount) * 100;
        // this.learned = 100 - this.new;
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
        let totalSum = 0;
        for (let key in o) {
            totalSum += o[key];
        }
        for (let key in o) {
            arr.push({name: key, y: Math.round((o[key] / totalSum) * 100)})
        }
        return arr;
    }


}
