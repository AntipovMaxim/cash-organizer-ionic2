import {
    CHECK_AUTH, CHECK_AUTH_SUCCESS, CHECK_AUTH_FAILED,
    CHECK_AUTH_NO_USER, LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAILED,
    LOGIN, LOGIN_SUCCESS, LOGIN_FAILED, CREATE_USER, CREATE_USER_SUCCESS,
    CREATE_USER_FAILED
} from '../reducers/auth.reducer';

import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Device} from '@ionic-native/device';

import {AuthProviders, AuthMethods, AngularFireAuth, AngularFire} from 'angularfire2';
import {Push, PushToken} from '@ionic/cloud-angular';
import {PushNotificationService} from '../providers/push.notifications';

@Injectable()
export class authEffects {
    uid_: string;
    constructor(private action$: Actions, public auth$: AngularFireAuth,
                public af: AngularFire,
                public device: Device,
                public push: Push,
                public pushService: PushNotificationService) {
        console.log(this.auth$.getAuth())
    }

    @Effect() checkAuth$ = this.action$
        .ofType(CHECK_AUTH)
        .switchMap(() => this.af.auth)
        .take(1)
        .map((_result) => {
            //this.af.auth.unsubscribe()
            if (_result) {
                console.log("in auth subscribe", _result)
                return {type: CHECK_AUTH_SUCCESS, payload: _result}
            } else {
                return {type: CHECK_AUTH_NO_USER, payload: null}
            }


        }).catch((res: any) => Observable.of({type: CHECK_AUTH_FAILED, payload: res}));

    @Effect() logout$ = this.action$
    // Listen for the 'LOGOUT' action
        .ofType(LOGOUT)
        .switchMap(() => {
        console.log("LOGOUT", this.uid_, this.device.uuid);
            this.pushService.deleteToken(this.uid_, this.device.uuid);
            return this.auth$.logout();
        })
        // If successful, dispatch success action with result
        .map((res: any) => {

            return ({type: LOGOUT_SUCCESS, payload: null})
        })
        // If request fails, dispatch failed action
        .catch((res: any) => Observable.of({type: LOGOUT_FAILED, payload: res}))


    @Effect() login$ = this.action$
    // Listen for the 'LOGOUT' action
        .ofType(LOGIN)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in login$", payload);
            return this.doAuth(payload)
        });


    @Effect() createUser$ = this.action$
    // Listen for the 'LOGOUT' action
        .ofType(CREATE_USER)
        .map(toPayload)
        .switchMap(payload => {
            console.log("in createUser$", payload)
            return this.doCreateUser(payload)
        })


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doAuth(_creds) {
        return Observable.create((observer) => {
            this.auth$.login(_creds, {
                provider: AuthProviders.Password,
                method: AuthMethods.Password
            }).then((_result) => {
                console.log("_result", _result)
                let uid = _result.uid;
                this.uid_ = _result.uid;
                let devToken$: any = this.af.database.object(`/${uid}/deviceTokens`);

                this.push.register()
                    .then((t) => {
                        return this.push.saveToken(t);
                    }).then((t: PushToken) => {
                    console.log('Token saved:', t.token);
                    console.log('Token:', t);
                    devToken$.update({[this.device.uuid]: t.token})
                });
                return observer.next({type: LOGIN_SUCCESS, payload: _result})
            }, (error) => {
                console.log("error", error)
                return observer.next({type: LOGIN_FAILED, payload: {message: "User not found. Check your input data"}})
            })
        })
    }

    doCreateUser(_creds) {
        return Observable.create((observer) => {
            this.auth$.createUser(_creds).then((_result) => {
                console.log("CREATE USER", _result.uid)
                let uid = _result.uid;
                let balance$: any = this.af.database.object(`/${uid}/totalBalance`);
                let devToken$: any = this.af.database.object(`/${uid}/deviceTokens`);
                balance$.set({UAH: 0, USD: 0, EUR: 0});
                this.push.register()
                    .then((t) => {
                        return this.push.saveToken(t);
                    }).then((t: PushToken) => {
                    console.log('Token saved:', t.token);
                    console.log('Token:', t);
                    devToken$.set({[this.device.uuid]: t.token})
                });

                return observer.next({type: CREATE_USER_SUCCESS, payload: _result})
            }, (error) => {
                console.log("error", error)
                return observer.next({
                    type: CREATE_USER_FAILED, payload: {
                        message: "User with such data is already" +
                        " exists"
                    }
                })
            })
        })
    }
}