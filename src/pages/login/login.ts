import {Component} from '@angular/core';
import {Store} from '@ngrx/store'
import {authState, LOGIN, CREATE_USER} from '../../reducers/auth.reducer';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  auth$;
  submitted = false;
  credentials: { email?: string, password?: string } = {};

  constructor(private store: Store<authState>) {
    this.auth$ = this.store.select('auth');
    this.auth$.subscribe(v => console.log(v))
  }

  doLogin(_credentials) {
    this.submitted = true;
    this.store.dispatch({type: LOGIN, payload: _credentials.value});

  }

  doCreateUser(_credentials) {
    this.submitted = true;
    this.store.dispatch({type: CREATE_USER, payload: _credentials.value});
  }

}
