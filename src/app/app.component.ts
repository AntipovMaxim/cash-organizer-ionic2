import {Component, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store'
import {Platform, MenuController, Nav, App, AlertController} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {Device} from '@ionic-native/device';
import {MainPage} from '../pages/main/main';
import {LoginPage} from '../pages/login/login';
import {BalancePage} from '../pages/balance/balance';
import {ReportPage} from '../pages/report/report';
import {CurrencyExchangePage} from '../pages/currency-exchange/currency-exchange';
import {StatisticsPage} from '../pages/statistics/statistics';
import {
  Push,
  PushToken
} from '@ionic/cloud-angular';
import {PushNotificationService} from '../providers/push.notifications';
import {authState, CHECK_AUTH} from '../reducers/auth.reducer';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any}>;
  authInfo;
  uid: string;
  currentToken: string;

  constructor(public platform: Platform,
              public menu: MenuController,
              private store: Store<authState>,
              public push: Push,
              public pushService: PushNotificationService,
              public device: Device,
              public appCtrl: App,
              private alertCtrl: AlertController) {
    this.store.dispatch({type: CHECK_AUTH});
    this.initializeApp();
    this.authInfo = this.store.select('auth');


    // set our app's pages
    this.pages = [
      {title: 'Make Budget Expenses', component: MainPage},
      {title: 'Balance', component: BalancePage},
      {title: 'Expenses Report', component: ReportPage},
      {title: 'Currency Exchange', component: CurrencyExchangePage},
      {title: 'Statistics', component: StatisticsPage}

    ];

    this.push.register()
      .then((t) => {
        return this.push.saveToken(t);
      }).then((t: PushToken) => {
      this.currentToken = t.token;
    });


    this.push.rx.notification()
      .subscribe((msg) => {
          let alert = this.alertCtrl.create({
            title: msg.title,
            subTitle: msg.text,
            buttons: ['OK']
          });
          alert.present();

      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }


  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.appCtrl.getRootNav().push(page.component);
  }


  ngOnInit() {
    this.authInfo.subscribe(a => {

      if (a.authChecked) {
        this.uid = a.uid;
        if (a.currentUser) {
          this.push.register()
            .then((t) => {
              return this.push.saveToken(t);
            }).then((t: PushToken) => {
            this.pushService.updateToken(this.uid, this.device.uuid, t.token);
          });

          this.rootPage = MainPage
        } else {
          this.rootPage = LoginPage
        }
      }
    });
  }
}
