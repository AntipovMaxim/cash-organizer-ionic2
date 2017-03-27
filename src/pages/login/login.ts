import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Store } from '@ngrx/store'
import { authState, CHECK_AUTH, LOGOUT, LOGIN, CREATE_USER } from '../../reducers/auth.reducer';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  auth$;
  submitted = false;
  credentials: { email?: string, password?: string } = {};

  constructor(
      public navCtrl: NavController,
      private store: Store<authState>
  ) {
    this.auth$ = this.store.select('auth');
    this.auth$.subscribe(v => console.log(v))
    // use the object in the template since it is an observable
    // this.storeInfo = this.store.select('mainAppStoreReducer');


    // here we are monitoring the authstate to do initial load of data
    // this.storeInfo.subscribe((currentState: State) => {
    //
    //   if (currentState.currentUser !== null && !currentState.dataArray && currentState.loading === false) {
    //     this.doQuery()
    //   }
    //
    // });
  }


  // ngOnInit() {
  //   this.store.dispatch({ type: CHECK_AUTH });
  //
  // }



  // ionViewWillUnload() {
  //   this.storeInfo.complete();
  // }


  // doLogout() {
  //   this.store.dispatch({ type: LOGOUT });
  // }

  doLogin(_credentials) {
    this.submitted = true;
    this.store.dispatch({ type: LOGIN, payload: _credentials.value });

  }


  doCreateUser(_credentials) {
    this.submitted = true;

    console.log(_credentials.value);


    this.store.dispatch({ type: CREATE_USER, payload: _credentials.value });

  }

  // doQuery() {
  //   this.store.dispatch({ type: GET_FIREBASE_ARRAY, payload: { path: 'songs' } });
  // }

  // doItemQuery
  // doItemQuery(_item) {
  //   this.navCtrl.push(StuffDetailPage, { itemId: _item.$key })
  // }


}
