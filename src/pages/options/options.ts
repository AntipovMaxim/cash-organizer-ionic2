import { Component } from '@angular/core';
import {Store} from '@ngrx/store'
import {LOGOUT} from '../../reducers/auth.reducer';

@Component({
  selector: 'page-options',
  templateUrl: 'options.html'
})
export class OptionsPage {

  constructor(public store: Store<any>) {}

  doLogout() {
    this.store.dispatch({type: LOGOUT});
  }
}
