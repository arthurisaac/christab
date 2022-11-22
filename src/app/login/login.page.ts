import {Component, OnInit} from '@angular/core';
import {LoadingController, NavController, Platform, ToastController} from '@ionic/angular';
import {LoginService} from './login.service';
import {Login} from './login.model';
import {UtilisateurDto} from '../utilisateur/utilisateur.model';
import {UtilisateurService} from '../utilisateur/utilisateur.service';
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";
import {Admin} from "../admin/admin.model";
import {AdminService} from "../admin/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import OneSignal from 'onesignal-cordova-plugin';
import {PaiementService} from "../paiement/paiement.service";
import {Paiement} from "../paiement/paiement.model";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    loginD: Login = new Login();
    utilisateurs: UtilisateurDto;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    user: Admin = new Admin();
    errorEmail: string;
    errorPwd: string;
    errorCode: string;
    errorMail: string;
    showE: boolean = false;
    showP: boolean = false;
    showC: boolean = false;
    showBtn: boolean = false;
    mode: number;
    loading: any;
    passConf: string;
    id: number = 0;
    idTF: number = 0;
    push: OneSignalPushNotification = new OneSignalPushNotification();


    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    recoverKey: boolean = false;
    keyStep: boolean = false;
    emailSent: boolean = false;
    emailValid: boolean = false;
    checkKeyStep: boolean = false;
    keyForm = new FormGroup({
        code: new FormControl('', [Validators.required, Validators.minLength(6)]),
        newpass: new FormControl('', [Validators.required, Validators.minLength(4)]),
        confpass: new FormControl('', [Validators.required, Validators.minLength(4)]),
        email: new FormControl('', [Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ), Validators.required])
    });
    paiement: Paiement = new Paiement();

    constructor(
        private loginService: LoginService,
        private toastCtrl: ToastController,
        private utilisateurService: UtilisateurService,
        private userService: AdminService,
        private paiementService: PaiementService,
        private navCtrl: NavController,
        private loadingController: LoadingController,
        private platform: Platform,
        private router: Router,
        private authService: AuthenticationService,
        private notifService: NotificationsService
    ) {
    }

    ngOnInit() {
        this.mode = 1;
        this.loginD = new Login();
        this.showE = false;
        this.showP = false;
        this.showBtn = true;
    }

    ionViewWillEnter() {
        this.loginD = new Login();
    }

    hideError(e) {
        if (e.returnValue) {
            this.showE = false;
            this.showP = false;
        }

    }

    goHome() {
        this.router.navigate(['home']);
    }

    isAuthorised(id: number) {
        this.paiementService.getAllByU(this.id).subscribe(data => {
            this.paiement = data;
        });
        if (id == 1) {
            if ((localStorage.getItem('Date') !== null) && this.utilisateurService.getMonthsBetwDates(new Date().getTime(), new Date(localStorage.getItem('Date')).getTime()) >= 3) {
                this.router.navigate(['renouvellement', 'I']);
            }
            else if(this.utilisateurService.getMonthsBetwDates(new Date().getTime(),new Date(this.paiement.datePaiement).getTime()) >= 12 && !(this.paiement.renouveler)){
                this.router.navigate(['renouvellement', 'R']);
            }
            else {
                this.navCtrl.navigateForward('/home-conducteur');
            }
        } else {
            this.navCtrl.navigateForward('/itineraire');
        }
    }

    checkEmail(e: any) {
        if (e.target.value != null && !(this.re.test(String(e.target.value).toLowerCase()))) {
            this.errorEmail = "L'email n'est pas valide";
            this.showE = true;
        } else {
            this.showE = false;
        }
    }

    checkPassword(e: any) {
        if (e.target.value != null && e.target.value.length < 6) {
            this.errorPwd = 'Le mot de passe doit contenir au mininmum 6 caractères';
            this.showP = true;
        } else {
            this.showP = false;
            this.showBtn = false;
        }
    }

    /* ===================== Connexion ======================= */
    async login(data) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Connexion...',
        });

        await loading.present();
        this.loginService.login(data).subscribe((res) => {
            let jwt = res.headers.get('Authorization');
            this.authService.saveToken(jwt);
            if (res.status == 200) {
                console.log(res.status);
                this.utilisateurService.getOneByEmail(this.loginD.email).subscribe(data => {
                    this.utilisateurs = data;
                    this.authService.saveRegisterDate(this.utilisateurs.dateInscription);
                    this.loginService.loadCurrentUserId(this.utilisateurs.idUtilisateur);
                    this.loginService.loadCurrentUserF(this.utilisateurs.idTypeFonction);
                    loading.dismiss();
                    this.isAuthorised(this.utilisateurs.idTypeFonction);
                    OneSignal.getDeviceState((identity) => {
                        console.log('Device id');
                        console.log(identity.userId);
                        this.push.idUtilisateur = this.utilisateurs.idUtilisateur;
                        this.push.userID = identity.userId;
                        this.notifService.saveUserId(this.push).subscribe(res => {
                            console.log(res);

                        });
                    });

                });
            }
        }, error => {
            loading.dismiss();
            if (error.status == 401)
                this.showP = true;
            this.errorPwd = 'Mot de passe ou email incorrecte, re-essayer ou cliquez sur Mot de passe oublié pour le ré-initialiser';
        });

    }


    /* =========================================== Ré-initialisation du mot de passe ===================================== */
    initPassword() {
        this.mode = 2;
        this.emailValid = true;
    }

    RecoverKey() {
        this.mode = 1;
    }

    CheckEmail() {
        if (this.user.email && this.re.test(this.user.email)) {
            this.emailValid = true;
            this.SendEmail();
        } else {
            this.emailValid = false;
            this.errorMail = 'Entrer une adresse mail valide';
        }
    }

    checkCode(e: any) {
        if (e.target.value.length != 6) {
            this.showC = true;
            this.errorCode = 'Longueur du code incorrecte';
        } else {
            this.showC = false;
            this.errorCode = '';
        }
    }

    KeyStep() {
        this.loginService.verifCode(this.user.email, this.user.code).subscribe(data => {
            if (data) {
                this.keyStep = this.keyForm.controls['code'].value === this.user.renewPasswordCode;
                this.emailSent = false;
                this.showC = false;
                this.mode = 4;
            } else {
                this.showC = true;
                this.errorCode = 'Code incorrecte';
            }
        });
    }

    async SendEmail() {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Patientez svp...',
        });
        await loading.present();
        this.loginService.recupPass(this.user.email).subscribe((res) => {
            console.log(res.status);
            if (res.status == 200) {
                loading.dismiss();
                this.checkKeyStep = true;
                this.mode = 3;
            } else {
                loading.dismiss();
                this.mode = 2;
                this.emailValid = false;
                this.errorMail = 'Email incorrecte ou inexistant sur le serveur';
            }
        }, (error) => {
            console.log(error);
            loading.dismiss();
            this.mode = 2;
            this.emailValid = false;
            this.errorMail = 'Email incorrecte ou inexistant sur le serveur';
        });
    }

    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Mot de passe réinitialisé avec succès',
            color: "success",
            duration: 2000
        });
        await toast.present();
    }

    async changePass(data) {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Patientez svp...',
        });
        await loading.present();

        if (this.keyForm.controls['newpass'].value != this.keyForm.controls['confpass'].value) {
            loading.dismiss();
            console.log('An error occured');
        } else {
            this.loginService.reInitPass(this.user).subscribe(res => {
                if (res.status == 200) {
                    loading.dismiss();
                    this.mode = 1;
                    this.showToast();
                }
            }, error => {
                loading.dismiss();
            });
        }
    }


}
