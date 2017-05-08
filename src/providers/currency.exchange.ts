
import {Injectable} from '@angular/core';
import { Http, Response }          from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CurrencyExchangeService {

  constructor(public http: Http) {

  }


  getCurrencyExchangeFromPrivatBank(){
    let url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
    return this.http.get(url)
      .toPromise()
      .then(r => r.json())
      .catch(e => console.log(e));
  }

}