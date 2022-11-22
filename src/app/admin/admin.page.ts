import {Component, OnInit} from '@angular/core';
import {Admin} from "./admin.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {TypeFonction} from "../type-fonction/type-fonction.model";
import {Engin} from "../engin/engin.model";
import {AlertController} from "@ionic/angular";
import {TypeFonctionService} from "../type-fonction/type-fonction.service";
import {EnginService} from "../engin/engin.service";
import {LoginService} from "../login/login.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {AdminService} from "./admin.service";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

    users: Admin;
    user: Admin = new Admin();
    utilisateurs: Array<UtilisateurDto> = [];
    typeFonctions: TypeFonction;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    engins: Engin;
    engin: Engin = new Engin();
    showEngin: boolean;
    errorEmail: string;
    errorPwdConf: string;
    show: boolean;
    pwdConfirm: string;
    header: string;
    mode: number;
    image: any;
    emailOld: string;
    id: number = 0;
    idTF: number = 0;

    constructor(
        private  alertCtrl: AlertController,
        private typeFonctionService: TypeFonctionService,
        private enginService: EnginService,
        private loginService: LoginService,
        private utilisateurService: UtilisateurService,
        private userService: AdminService
    ) {
    }

    ngOnInit() {
        this.utilisateurService.getAll().subscribe(data => {
            this.utilisateurs.push(data);
            console.log(this.utilisateurs);
        });
        this.enginService.getAll().subscribe(data => {
            this.engins = data;
        });
        this.typeFonctionService.getAll().subscribe(data => {
            this.typeFonctions = data;
        });
    }

    selectFonction(e: any) {
        this.utilisateur.idTypeFonction = e.detail.value;
        if (e.detail.value != 1) {
            this.showEngin = false;
        } else {
            this.showEngin = true;
        }
    }

    selectR(e: any) {
        this.engin.typeEngin = e.target.value;
        console.log(this.engin.typeEngin);
    }

    add() {
        this.mode = 2;
        this.pwdConfirm = null;
        this.utilisateur = new UtilisateurDto();
        this.user = new Admin();
    }

    save() {
        if (this.utilisateurs) {
            for (let i = 0; i < this.utilisateurs.length; i++) {
                if ((this.utilisateurs[i].email) && this.utilisateurs[i].email.match(this.utilisateur.email)) {
                    this.errorEmail = 'Cet email existe déjà';
                    this.show = true;

                } else {
                    if (!this.user.password.match(this.pwdConfirm)) {
                        this.errorPwdConf = 'Les mots de passe ne correspondent pas';
                        this.show = true;

                    } else {
                        if (this.utilisateur.idTypeFonction != 1) {
                            this.utilisateurService.create(this.utilisateur).subscribe(res => {
                                if (res.status == 200) {
                                    this.user.email = res.body.email;
                                    this.user.passwordConfirmed = this.pwdConfirm;
                                    this.userService.create(this.user).subscribe(res => {
                                        this.ngOnInit();
                                    });
                                }
                            });
                        } else {
                            this.utilisateurService.create(this.utilisateur).subscribe(res => {
                                if (res.status == 200) {
                                    this.engin.idUtilisateur = res.body.idUtilisateur;
                                    this.enginService.create(this.engin).subscribe(res => {
                                        this.ngOnInit();
                                    });
                                }
                            });
                        }
                    }
                }
            }
        } else {
            if (this.user.password.match(this.pwdConfirm)) {
                if (this.utilisateur.idTypeFonction != 1) {
                    this.utilisateurService.create(this.utilisateur).subscribe(res => {
                        if (res.status == 200) {
                            this.user.email = res.body.email;
                            console.log('Mot de passe');
                            console.log(this.user.password);
                            this.user.passwordConfirmed = this.pwdConfirm;
                            this.userService.create(this.user).subscribe(res => {
                                console.log(res);
                                this.ngOnInit();
                            });
                        }
                    });
                } else {
                    this.utilisateurService.create(this.utilisateur).subscribe(res => {
                        if (res.status == 200) {
                            this.user.email = res.body.email;
                            this.user.passwordConfirmed = this.pwdConfirm;
                            this.userService.create(this.user).subscribe(res => {
                            });
                            this.engin.idUtilisateur = res.body.idUtilisateur;
                            this.enginService.create(this.engin).subscribe(res => {
                                this.ngOnInit();
                            });
                        }
                    });
                }
            } else {
                this.errorPwdConf = 'Les mots de passe ne correspondent pas';
                this.show = true;
            }
        }


    }

    edit(u: UtilisateurDto) {
        this.mode = 3;
        this.utilisateurService.getOne(u.idUtilisateur).subscribe(data => {
            this.utilisateur = data;
            this.emailOld = this.utilisateur.email;
            this.userService.getByEmail(this.utilisateur.email).subscribe(data => {
                this.user = data;
            });
        });
    }

    update() {

        this.utilisateurService.update(this.utilisateur).subscribe(res => {
            this.user.email = res.body.email;
            this.user.passwordConfirmed = this.pwdConfirm;
            this.user.emailOld = this.emailOld;
            this.userService.update(this.user).subscribe(result => {
                this.ngOnInit();
            });
        });
    }

    async disable(u: UtilisateurDto) {
        let alert = await this.alertCtrl.create({
            header: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer <strong>' + u.email + '</strong>?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        this.user.email = u.email;
                        this.userService.disable(this.user).subscribe(result => {
                            this.ngOnInit();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


    back() {
        this.ngOnInit();
    }


    /**************************** Pour charger la photo ************************/
    upload(event) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            return reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

}
