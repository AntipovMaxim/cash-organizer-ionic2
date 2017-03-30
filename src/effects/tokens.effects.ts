import {
    GET_DEVICE_TOKENS,
    GET_DEVICE_TOKENS_SUCCESS,
    GET_DEVICE_TOKENS_FAILED
} from '../reducers/notifications.reducer';



import {Injectable} from "@angular/core";
import {Observable} from 'rxjs';
import {Effect, Actions, toPayload} from "@ngrx/effects";
import {Store} from '@ngrx/store'

import {AngularFire} from 'angularfire2';
import {Device} from '@ionic-native/device';

@Injectable()
export class tokensEffects {
     authInfo;
     uid;
    // balance$;
    constructor(private action$: Actions, public af: AngularFire, public store: Store<any>, public device: Device) {
        this.authInfo = this.store.select('auth');
        this.authInfo.subscribe(v => {
            if (v.currentUser) this.uid = v.currentUser.uid;
        });

        // this.balance$ = this.af.database.object(`/${this.uid}/totalBalance`);

    }

    @Effect() getTokens$ = this.action$
        .ofType(GET_DEVICE_TOKENS)
        .switchMap(payload => {
            return this.getTokens()
        });


    getTokens() {
        return Observable.create((observer) => {
            let devToken$: any = this.af.database.list(`/${this.uid}/deviceTokens`, { preserveSnapshot: true })
            devToken$
                .subscribe(data => {
                    console.log('TOKENS', data)
                    let tokens = data.filter(v => v.key !== this.device.uuid)
                        .map(k => k.val())
                    observer.next({ type: GET_DEVICE_TOKENS_SUCCESS, payload: tokens })
                }, (error) => {
                    console.log(' ERROR: ' + error);
                    observer.next({ type: GET_DEVICE_TOKENS_FAILED, payload: error })
                })
        })
    }


}