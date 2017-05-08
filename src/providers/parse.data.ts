import {Injectable} from '@angular/core';


@Injectable()
export class ParseDataService {

  constructor() {
  }

  private parseBalanceDataToObj (array: Array<any>){

  return array.reduce((accum, cur) => {
    let dateP = new Date(cur.date).toDateString();
    let obj = {
      source: cur.source,
      money: cur.money,
      currency: cur.currency
    };
    return Object.assign(accum, {[dateP]:  Array.isArray(accum[dateP]) ? [...accum[dateP], ...[obj]] : [obj]});
  }, {})
};

  parseToFinalBalanceData (array: Array<any>){
  let obj =  this.parseBalanceDataToObj(array) ;
  let finalData = [];
  for (let key in obj){
    if ( obj.hasOwnProperty(key) ){
      finalData.push({
        date: key,
        sources: obj[key]
      })
    }
  }
  return finalData;
};

  private parseReportDataToObj (array: Array<any>){

    return array.reduce((accum, cur) => {
      //let dateP = new Date(cur.date).toDateString();
      let dateP = cur.day;
      let obj = {
        category: cur.category,
        currency: cur.currency,
        description: cur.description,
        money: cur.money
      };
      return Object.assign(accum, {[dateP]:  Array.isArray(accum[dateP]) ? [...accum[dateP], ...[obj]] : [obj]});
    }, {})
  };

  parseToFinalReportData (array: Array<any>){
    let obj =  this.parseReportDataToObj(array) ;
    let finalData = [];
    for (let key in obj){
      if ( obj.hasOwnProperty(key) ){
        finalData.push({
          date: key,
          sources: obj[key]
        })
      }
    }
    return finalData;
  };

}