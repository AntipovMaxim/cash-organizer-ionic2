import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import {Device} from '@ionic-native/device';

@Injectable()
export class PushNotificationService {
    url: string = 'https://api.ionic.io/push/notifications';
    tokens_;
    constructor(public http: Http, public af: AngularFire,
                public device: Device) {

    }




    sendNotification(name: string, category: string, uid: string, tokens: string){

        // let devToken$: any = this.af.database.list(`/${uid}/deviceTokens`, { preserveSnapshot: true })
        //     .subscribe(v => {
        //         console.log(v)
        //        this.tokens_ = v.filter(v => v.key !== this.device.uuid)
        //            .map(k => k.val())
        //     })
        //console.log(this.tokens_)
        let data = {
            tokens: tokens,
            profile: "cash",
            notification: {

                message: "Hello World!",
                "ios": {
                    message: "Hello iOS!"
                },
                android: {
                    "message": category,
                    "title": name

                }
            }
        }
        let headers = new Headers({ 'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZGY5YTUwZC0xOTU0LTQ2NDktOGI5Yi1hNjUzNzA5ZDFhZDAifQ.h_rtCRziwbgSWBe6gBvOkts-CZ7rlc82g-5OnXjESsQ'
        });

        let options = new RequestOptions({ headers: headers });
       // let bodyString = JSON.stringify(data)
        return this.http.post(this.url,  data , options)
            .map(this.handleData)
            .catch(this.handleError);
    }

    private handleData(res: Response) {
        let body = res.json();
        console.log(body)
        return body.data || { };
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
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

    updateToken(uid, deviceID, token){
        console.log("UPDATE TOKEN")
        if (uid){
            let devToken$: any = this.af.database.object(`/${uid}/deviceTokens`);
            devToken$.subscribe(v => {
                if(v.hasOwnProperty(deviceID)){
                    devToken$.update({[deviceID]: token})
                }
            })
        }

    }

    deleteToken(uid, deviceID){

        let devToken$: any = this.af.database.object(`/${uid}/deviceTokens/${deviceID}`);

        devToken$.remove()
    }


}