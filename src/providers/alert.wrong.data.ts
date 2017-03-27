import { AlertController } from 'ionic-angular';

import { Injectable } from '@angular/core';


@Injectable()
export class WrongDataService {


    constructor(private alertCtrl: AlertController) {

    }

    showAlertError() {
        let alert = this.alertCtrl.create({
            title: "It's impossible!",
            subTitle: 'The amount  exceeds the current balance. Please double-check the entered data!',
            buttons: ['OK']
        });
        alert.present();
    }

    validateTotalSum(obj){
        for( let key in obj ){
            if (obj[key] < 0) return false;
        }
        return true;
    }

}