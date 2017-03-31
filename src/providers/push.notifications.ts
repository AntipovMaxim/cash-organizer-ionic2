import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';

import {Injectable} from '@angular/core';
import {AngularFire} from 'angularfire2';
import {Device} from '@ionic-native/device';

@Injectable()
export class PushNotificationService {
  url: string = 'https://api.ionic.io/push/notifications';

  constructor(public http: Http, public af: AngularFire,
              public device: Device) {

  }

  sendNotification( category: string, money: string, currency:string, uid: string, tokens: string) {
    let data = {
      tokens: tokens,
      profile: "cash",
      notification: {

        message: "Hello World!",
        "ios": {
          message: "Hello iOS!"
        },
        android: {
          "message": `Spent ${money} ${currency}`,
          "title": `Added expenses in ${category} category`

        }
      }
    };
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZGY5YTUwZC0xOTU0LTQ2NDktOGI5Yi1hNjUzNzA5ZDFhZDAifQ.h_rtCRziwbgSWBe6gBvOkts-CZ7rlc82g-5OnXjESsQ'
    });

    let options = new RequestOptions({headers: headers});
    return this.http.post(this.url, data, options)
      .map(this.handleData)
      .catch(this.handleError);
  }

  private handleData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

  updateToken(uid, deviceID, token) {
    if (uid) {
      let devToken$: any = this.af.database.object(`/${uid}/deviceTokens`);
      devToken$.subscribe(v => {
        if (v.hasOwnProperty(deviceID)) {
          devToken$.update({[deviceID]: token})
        }
      })
    }

  }

  deleteToken(uid, deviceID) {
    let devToken$: any = this.af.database.object(`/${uid}/deviceTokens/${deviceID}`);
    devToken$.remove()
  }

}