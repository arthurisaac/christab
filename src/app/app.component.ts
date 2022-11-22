import {Component} from '@angular/core';

import {AlertController, NavController, Platform, ToastController} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LoginService} from './login/login.service';
import {AuthenticationService} from "./authentication.service";
import {Router} from "@angular/router";
import {UtilisateurDto} from "./utilisateur/utilisateur.model";
import {UtilisateurService} from "./utilisateur/utilisateur.service";
import {Storage} from "@ionic/storage";
import {NotificationsService, OneSignalPushNotification} from "./notifications.service";
import OneSignal from 'onesignal-cordova-plugin';
import {SMS} from "@ionic-native/sms/ngx";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {AndroidPermissions} from "@ionic-native/android-permissions/ngx";
import {PaiementService} from "./paiement/paiement.service";
import {Paiement} from "./paiement/paiement.model";
import {OpenedEvent} from "../../plugins/onesignal-cordova-plugin/types/Notification";


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {


    show: boolean;
    id: number = 0;
    idTF: number = 0;
    push: OneSignalPushNotification = new OneSignalPushNotification();
    utilisateur: UtilisateurDto = new UtilisateurDto();
    utilisateurT: UtilisateurDto = {
        'idUtilisateur': 2,
        'idTypeFonction': 2,
        'email': 'dorisflora6@gmail.com',
        'nom': 'SOUDRE',
        'prenom': 'Doris Flora',
        'tel': 76093421,
        'photo': '2020-08-28T17:13:55.349.jpeg',
        'cnib': null,
        'numeroCnib': null,
        'dateDelivrance': null,
        'dateExpiration': null,
        'dateInscription': null,
        'lieuDelivrance': null,
        'typeDocument': null,
        'afficherTel': null,
        'afficherEmail': null,
        'courrierEvaluation': null,
        'courrierPromotion': null,
        'telSos': null
    }
    mode: number;
    paiement: Paiement = new Paiement();
    pushData: any;


    /********* Pour la localisation ********/
    latitude: any;
    longitude: any;

    constructor(
        private loginService: LoginService,
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private toast: ToastController,
        private utilisateurService: UtilisateurService,
        private paiementService: PaiementService,
        private localStorage: Storage,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private router: Router,
        private authService: AuthenticationService,
        private notifService: NotificationsService,
        private geolocation: Geolocation,
        private sms: SMS,
        private androidPermissions: AndroidPermissions
    ) {
    }

    initializeApp() {
        this.ngOnInit();
    }


    ngOnInit() {
        this.authService.loadToken();
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.platform.ready().then((res) => {
            this.notify();
        });

        if (this.isAuthenticated() && !this.authService.checkedTokenExpiry()) {
            this.requestSMSPermission();
            console.log('********** Connecté *********');
            this.id = +localStorage.getItem('ID_User');
            this.paiementService.getAllByU(this.id).subscribe(data => {
                this.paiement = data;
            });
                console.log('Token toujours valide');
                if (this.isPassager() || (this.idTF != null && this.idTF == 2)) {
                    this.platform.ready().then((res) => {
                        this.navCtrl.navigateRoot('/itineraire');
                        if (res === 'cordova') {
                            this.notify();
                        }
                    });
                }
                else if (this.isConducteur() || (this.idTF != null && this.idTF == 1)) {
                        if ((localStorage.getItem('Date') !== null) && this.utilisateurService.getMonthsBetwDates(new Date().getTime(), new Date(localStorage.getItem('Date')).getTime()) >= 3) {
                            console.log('********** Frais dadhésion *********');
                            this.platform.ready().then((res) => {
                                this.router.navigate(['renouvellement', 'I']);
                                this.notify();
                            });
                        }
                        else if((localStorage.getItem('Date') !== null) && this.utilisateurService.getMonthsBetwDates(new Date().getTime(),new Date(this.paiement.datePaiement).getTime()) >= 12 && !(this.paiement.renouveler)){
                            console.log('********** Renouvellement frais dadhésion *********');
                            this.platform.ready().then((res) => {
                                this.router.navigate(['renouvellement', 'R']);
                                this.notify();
                            });
                        }
                        else {
                            console.log('********** Page daccueil conducteur *********');
                            this.platform.ready().then((res) => {
                                this.navCtrl.navigateForward('/home-conducteur');
                                this.notify();
                            });
                        }
                }
            // }

        } else if(this.authService.checkedTokenExpiry()) {
            this.localStorage.clear();
            console.log('Token expiré');
            this.router.navigateByUrl('/login').then((res) => {
            });
        }
        else {
            if (this.localStorage.get('utilisateur').then(data => {
                console.log('********** Inscription utilisateur *********');
                if (data != null) {
                    this.platform.ready().then(() => {
                        this.navCtrl.navigateRoot('/utilisateur');
                    });
                } else {
                    console.log('********** Première page par défaut *********');
                    this.platform.ready().then(() => {
                        this.statusBar.styleDefault();
                        this.splashScreen.hide();
                    });
                }
            })) {
            }
        }
    }


    requestSMSPermission() {
        this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.SEND_SMS, this.androidPermissions.PERMISSION.BROADCAST_SMS]);
    }

    async showSuccessToast() {
        const toast = await this.toast.create({
            message: 'SOS envoyé avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showSuccessMailToast() {
        const toast = await this.toast.create({
            message: 'Mail envoyé avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showFailToast() {
        const toast = await this.toast.create({
            message: 'Envoi de SOS échoué',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    sendAlertMail() {
        if (this.isAuthenticated()) {
            this.geolocation.getCurrentPosition().then((resp) => {
                this.latitude = resp.coords.latitude;
                this.longitude = resp.coords.longitude;

                /************ Envoi du mail sos ***********/
                let pos = this.latitude.toString() + ',' + this.longitude.toString();
                this.utilisateurService.sendSos(pos).subscribe(res => {
                    console.log('mail durgence envoyé');
                    this.showSuccessMailToast();
                });

            }).catch((error) => {
                console.log('Error getting location', error);
                alert("Pas d'accès internet");
            });
        }
    }


    sendAlert() {
        let numberOne: string = null;
        let message: string = null;
        const options = {
            replaceLineBreaks: false,
            android: {
                // intent: ''
                intent: 'INTENT'
            }
        };

        if (this.isAuthenticated()) {
            this.id = +localStorage.getItem('ID_User');
            this.utilisateurService.getOne(this.id).subscribe(data => {
                this.utilisateur = data;
                numberOne = this.utilisateur.telSos;
                this.geolocation.getCurrentPosition().then((resp) => {

                    if (resp !== null) {
                        this.latitude = resp.coords.latitude;
                        this.longitude = resp.coords.longitude;
                        let pos = this.latitude.toString() + ',' + this.longitude.toString();

                        /************ Envoi du sms sos  ***********/
                        message = 'SOS, ma localisation est: : https://maps.google.com/?q=' + pos; // this.latitude.toString() + ','+ this.longitude.toString();
                        console.log('number=' + numberOne + ', message= ' + message);
                        this.sms.send(numberOne, message, options).then((result) => {
                            console.log(result);
                            this.showSuccessToast();
                        }).catch(error => {
                            console.log(error);
                            console.error(error);
                            this.showFailToast();
                        });
                    }

                }).catch((error) => {
                    console.log('Error getting location', error);
                    alert("Pas d'accès internet");
                });
            });

        }
    }

    /************************************* Pour l'envoi du message ************************/
    checkSMSPermission() {
      this.sendAlertMail();
      this.sendAlert();
    }


    /************************************* Gestion des push notification *******************************/

    async showToast() {
        const toast = await this.toast.create({
            message: 'Acceptation de covoiturage envoyé avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastFailed () {
        const toast = await this.toast.create({
            message: 'Acceptation de covoiturage échouée',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showDialogBoxWB(title, msg, action: string, data: any) {
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: '',
            message: msg,
            buttons: [
                {
                    text: action,
                    handler: () => {
                        if (action && Object.keys(data).length) {
                            let a = data;
                            if (action === 'Le noter') {
                                this.router.navigate(['trajet-conducteur'], {state: {note: a}});
                            } else if (action === 'Voir') {
                                this.router.navigate(['trajet-conducteur'], {state: {detail: a}});
                            } else if (action === 'Confirmer?') {
                                this.router.navigate(['home-conducteur']);
                                let obj = a;
                                console.log(obj);
                                this.push.idU = obj[0];
                                this.push.message = 'Le conducteur a accepté';
                                this.push.action = 'Payer';
                                this.pushData = {0: this.id, 1: obj[1], 2: obj[2], 3: obj[3]};
                                this.push.data = JSON.stringify(this.pushData);
                                this.notifService.sendNotifToOne(this.push).subscribe(res => {
                                    if (res.status == 200) {
                                        this.showToast();
                                    } else {
                                        this.showToastFailed();
                                    }
                                });
                            }
                            else if (action === 'Payer') {
                                this.router.navigate(['demande'], {state: {detailT: a}});
                            }
                            else {
                                this.router.navigate(['reservation'], {state: {detailT: a}});
                            }
                        } else {

                        }


                    }
                }
            ]
        })
        await alert.present();
    }

    async showDialogBox(title, msg) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: msg,
            buttons: ['Ok']
        })
        await alert.present();
    }

    notify() {
        OneSignal.setAppId(this.authService.ONESIGNAL_APP_ID);
        OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
            notificationReceivedEvent.complete(notificationReceivedEvent.getNotification());
        });
        OneSignal.setNotificationOpenedHandler((jsonData: OpenedEvent) => {
            /*console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
            console.log(jsonData.notification);*/
            let msg = jsonData.notification.body;
            let title = jsonData.notification.title;
            let additionalData = jsonData.notification.additionalData;
            let button =  Object(jsonData.notification.actionButtons)[0].text;
            let v = Object(jsonData.notification.actionButtons)[0].text;
            /*console.log(v);*/
            if (button) {
                this.showDialogBoxWB(title, msg, button, additionalData).then(() => {
                });
            }

        });
        OneSignal.getDeviceState((identity) => {
            // console.log('OneSignal getDeviceState: ' + JSON.stringify(identity));
            this.push.idUtilisateur = this.id;
            this.push.userID = identity.userId;
                /*console.log('Contenu: ');
                console.log(identity);*/
                if(this.push.idUtilisateur != 0 && this.push.userID !== null) {
                    this.notifService.saveUserId(this.push).subscribe(res => {
                        console.log(res);
                    });
                } else {
                    console.log("***** Données nulles ****");
                    console.log(this.push);
                }

        });
    }


    getAll() {
        this.isAdmin();
        this.isUser();
        this.isConducteur();
        this.isPassager();
        this.isAuthenticated();
        this.authService.loadToken();
    }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    tokenIsExpired() {
        return this.authService.checkedTokenExpiry();
    }

    isAdmin() {
        return this.authService.isAdmin();
    }

    isUser() {
        return this.authService.isUser();
    }

    goGererMesTrajet() {
        if (this.isPassager() || (this.idTF != null && this.idTF == 2)) {
            this.router.navigate(['/trajet-passager']);
        } else {
            this.router.navigate(['/trajet']);
        }
    }


    isPassager() {
        return this.loginService.isPassager();
    }

    isConducteur() {
        return this.loginService.isConductor();
    }


    logOut() {
        this.loginService.logout();
        this.localStorage.clear();
        this.router.navigate(['home']).then((res) => {
            location.reload();
        });
    }

}
