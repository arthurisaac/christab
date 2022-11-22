import {Component, OnInit} from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    NavController,
    Platform,
    ToastController
} from '@ionic/angular';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import {Storage} from '@ionic/storage';
import {UtilisateurDto} from './utilisateur.model';
import {UtilisateurService} from './utilisateur.service';
import {TypeFonction} from '../type-fonction/type-fonction.model';
import {TypeFonctionService} from '../type-fonction/type-fonction.service';
import {Engin} from '../engin/engin.model';
import {EnginService} from '../engin/engin.service';
import {LoginService} from "../login/login.service";
import {Admin} from "../admin/admin.model";
import {AuthenticationService} from "../authentication.service";
import {AdminService} from "../admin/admin.service";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {EventManagerService} from "../event-manager.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Paiement} from "../paiement/paiement.model";
import {COMMAND, CommandDto, PaiementService, TouchCustomDto} from "../paiement/paiement.service";
import {DatePipe} from "@angular/common";


@Component({
    selector: 'app-admin',
    templateUrl: './utilisateur.page.html',
    styleUrls: ['./utilisateur.page.scss'],
})
export class UtilisateurPage implements OnInit {


    users: Admin; //ici l'utilisateur pour la partie securité
    user: Admin = new Admin();
    roles: Array<string>;
    permitted: boolean;
    utilisateursF: UtilisateurDto;
    utilisateursLocal: Array<UtilisateurDto> = [];
    utilisateurs: UtilisateurDto;
    typeFonctions: TypeFonction; //  Array<TypeFonction> = [];
    utilisateur: UtilisateurDto = new UtilisateurDto();
    u: UtilisateurDto;
    engins: Engin; // Array<Engin> = [];
    enginsLocal: Array<Engin> = [];
    paiementsLocal: Array<Paiement> = [];
    engin: Engin = new Engin();
    paiement: Paiement = new Paiement();
    paiements: Paiement;
    typeFonct: number = 0;

    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    errorPassword: string;
    errorPasswordOld: string
    errorCnibPhoto: string;
    errorCnibNb: string;
    errorTypeDoc: string;
    errorDate: string;
    showButton: boolean = false;
    showButtonPhoto: boolean = false;
    showButtonCG: boolean = false;
    showButtonPC: boolean = false;
    showButtonAssu: boolean = false;
    errorEmail: string;
    errorPwdConf: string;
    errorTelSos: string;
    show: boolean;
    showP: boolean = false;
    showEngin: boolean;
    pwdConfirm: string;
    im: string;
    header: string;
    mode: number;
    image: any;
    photo: any;
    photoDefault = 'assets/nouvellesIcones/user.png';
    cnibR: any;
    cnibV: any;
    cnibT: any;
    cnibDefault = 'assets/nouvellesIcones/rectangleIdentite.svg';
    photoEF: any;
    photoEP: any;
    photoEA: any;
    photoEDefault = 'assets/nouvellesIcones/rectangleIdentite.svg';
    photoCGR: any;
    photoCGV: any;
    photoCGDefault = 'assets/nouvellesIcones/rectangleIdentite.svg';
    photoPCR: any;
    photoPCV: any;
    photoPCDefault = 'assets/nouvellesIcones/rectangleIdentite.svg';
    photoAssuR: any;
    photoAssuV: any;
    photoAssuDefault = 'assets/nouvellesIcones/rectangleIdentite.svg';

    emailOld: string;
    id: number = 0;
    idTF: number = 0;
    mixte: string = "Conducteur et passager";
    typeEngins: Array<any> = [{id: 1, val: "Auto"}, {id: 2, val: "Moto"}];
    typeDocument: Array<any> = [{id: 1, val: "CNIB"}, {id: 2, val: "PASSEPORT"}];
    PlaceA: Array<any> = [{val: 1}, {val: 2}, {val: 3}, {val: 4}];
    PlaceM: Array<any> = [{val: 1}, {val: 2}];
    place: number;
    showDeleteCNR: boolean;
    showDeleteCNV: boolean;
    showDeleteCNT: boolean;
    showDeletePEF: boolean;
    showDeletePEP: boolean;
    showDeletePEA: boolean;
    showDeleteCGR: boolean;
    showDeleteCGV: boolean;
    showDeletePCR: boolean;
    showDeletePCV: boolean;
    showDeleteAssuR: boolean;
    showDeleteAssuV: boolean;
    errorEnginPhoto: string;
    errorCarteGPhoto: string;
    errorPermisPhoto: string;
    errorAssurPhoto: string;
    emptyFields: string;
    errorTypeEngin: string;

    /******** Pour gérer le bouton save des informations de l'utilisateur **********/
    showBtnSave: boolean = false;
    showBtnSaveU1: boolean = false;
    showBtnSaveU2: boolean = false;
    showBtnSaveU3: boolean = false;
    showBtnSaveE1: boolean = false;
    showBtnSaveE2: boolean = false;

    dataUpdatedEvent: Subscription;

    //pour gérer l'affichage de l'utilisateur depuis l'accueil
    val: string = null;
    choixHome: string = 'H';
    choixRenouv: string = 'R';
    showRenouveler: boolean = false;

    /* Création des types de fonction si la table est vide */
    typeFonction: TypeFonction = new TypeFonction();

    /******** Paiement ***********/
    customer: CommandDto = new CommandDto();
    customMoov: TouchCustomDto = new TouchCustomDto();
    showBtn: boolean = false;
    errorCustomer: string;
    errorOtp: string;
    /******* Pour le choix du paiement ********/
    checkO: boolean = false;
    checkM: boolean = false;
    checkedO: boolean = false;
    checkedM: boolean = false;
    typeEnginCheck = null;
    modePaiement: number = 0; //choix de l'opérateur
    modePaie: number = 0; //pour l'affichage des interfaces paiement réussi ou échoué

    /********* Pour gérer les préférences *********/
    prefTel: boolean = false;
    prefEmail: boolean = false;
    prefEval: boolean = false;
    prefPromo: boolean = false;

    /******** Pour les frais de transport et réservation *******/
    showPrix: number = 0;
    prixReserv: number = 0;
    prixDu: number = 0;

    resultUtil: any;
    resultUser: any;
    days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sept', 'Oct', 'Nov', 'Dec'];
    hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    doneBtn = 'Ok';
    backBtn = 'Retour';


    constructor(
        private navCtrl: NavController,
        private  alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private typeFonctionService: TypeFonctionService,
        private enginService: EnginService,
        private loginService: LoginService,
        private utilisateurService: UtilisateurService,
        private userService: AdminService,
        private paiementService: PaiementService,
        private authService: AuthenticationService,
        private loadingController: LoadingController,
        private camera: Camera,
        private router: Router,
        private route: ActivatedRoute,
        private eventManager: EventManagerService,
        private platform: Platform,
        private sanitizer: DomSanitizer,
        private localStorage: Storage,
        private datePipe: DatePipe,
        private actionsheetCtrl: ActionSheetController
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.isAuthenticated();
        this.val = this.route.snapshot.paramMap.get('id'); //ici c'est le paramètre ajouté dans app.router.module
        this.initializePhotoVars();
        this.checkLocalStorageUserData();
        this.checkLocalStorageEnginData();
        this.checkAuthentif();
    }

    checkLocalStorageUserData() {
        this.localStorage.get('utilisateur').then(data => {
            if (data != null) {
                // console.log('********* Utilisateur ********');
                for (let d of data) {
                    this.utilisateur = d != null ? d : null;
                    // console.log(d);
                    if (d.hasOwnProperty('photo'))
                        this.photo = d.photo;
                    else
                        this.photo = this.photoDefault;
                    if (d.hasOwnProperty('cnibR'))
                        this.cnibR = d.cnibR;
                    else
                        this.cnibR = this.cnibDefault;
                    this.user.password = d.password;
                    this.user.passwordConfirmed = d.pwdConfirmed;
                    // console.log(this.utilisateur);
                }
            } else {
                this.utilisateur = new UtilisateurDto();
            }
        });
    }

    checkLocalStorageEnginData() {
        this.localStorage.get('engin').then(data => {
            if (data != null) {
                for (let d of data) {
                    this.engin = d != null ? d : null;
                    if (d.hasOwnProperty('photoAssuranceR'))
                        this.photoAssuR = d.photoAssuranceR;
                    else
                        this.photoAssuR = this.photoAssuDefault;
                    if (d.hasOwnProperty('photoPCR'))
                        this.photoPCR = d.photoPCR;
                    else
                        this.photoPCR = this.photoPCR;
                    if (data.hasOwnProperty('photoEP'))
                        this.photoEP = d.photoEP;
                    else
                        this.photoEP = this.photoEDefault;
                }
                this.typeEnginCheck = this.engin.typeEngin !== null? this.engin.typeEngin:'';
                  console.log('********** LocalStorage checking: '+this.typeEnginCheck);
            } else {
                this.engin = new Engin();
            }
        });
    }

    initializePhotoVars() {
        this.photo = this.photoDefault;
        this.cnibR = this.cnibDefault;
        this.cnibV = this.cnibDefault;
        this.cnibT = this.cnibDefault;
        this.photoEF = this.photoEDefault;
        this.photoEP = this.photoEDefault;
        this.photoEA = this.photoEDefault;
        this.photoCGR = this.photoCGDefault;
        this.photoCGV = this.photoCGDefault;
        this.photoPCR = this.photoPCDefault;
        this.photoPCV = this.photoPCDefault;
        this.photoAssuR = this.photoAssuDefault;
        this.photoAssuV = this.photoAssuDefault;
    }

    checkAuthentif() {
        if (this.isAuthenticated() && this.val) {
            if (this.val === this.choixHome) {
                console.log('********* Interface gérer mon profil ***********');
                this.mode = 10;
                this.getAllByU();
            } else {
                if (this.val === this.choixRenouv) {
                    console.log('********* Interface gérer mon profil après renouvellement ***********');
                    this.mode = 10;
                    this.getAllByU();
                }
            }
        } else {
            console.log('********* Interface inscription ***********');
            this.getAll();
             if (Object.keys(this.utilisateur).length > 0) {
                if (this.utilisateur.photo !== null || this.utilisateur.typeDocument !== null) {
                    console.log('********* Ecran inscription 2 ********');
                    this.mode = 3;
                    this.showBtnSave = false;
                    return this.utilisateur;
                } else if (this.utilisateur.cnib !== null || this.utilisateur.cnibR !== null) {
                    console.log('********* Ecran inscription 3 ********');
                    this.mode = 4;
                    this.showBtnSave = false;
                    return this.utilisateur;
                } else {
                    if (this.utilisateur.idTypeFonction !== null) {
                        console.log('********* Ecran inscription 4 ********');
                        this.mode = 5;
                        this.showBtnSave = false;
                        return this.utilisateur;
                    }
                }
            } else if (Object.keys(this.utilisateur).length > 0 && Object.keys(this.engin).length > 0) {
                if (this.engin.photoEngin !== null || this.engin.photoEnginF !== null) {
                    console.log('********* Ecran engin 2 ********');
                    this.mode = 7;
                    this.showBtnSave = false;
                    return this.engin;
                } else {
                    if (this.utilisateur !== null && this.engin !== null) {
                        console.log('********* Ecran engin 1 ********');
                        this.mode = 6;
                        this.showBtnSave = false;
                        return this.engin;
                    }
                }
            } else {
                console.log('********* Affichage normal ********');
                this.mode = 2;
                this.pwdConfirm = null;
                this.utilisateur = new UtilisateurDto();
                this.engin = new Engin();
                this.user = new Admin();
                this.image = null;
                this.showButton = true;
                this.registerChangeInUtilisateurs();
                this.getAll();
            }
        }
    }

    registerChangeInUtilisateurs() {
        this.eventManager.subscribe('utilisateurList', (response) => this.getAll());
    }

    onSaveSuccess(result) {
        this.eventManager.broadcast({name: 'utilisateurList'});
        this.getAllByU();
    }

    onError(error) {
        error(error.message, null, null);
    }

    goHome() {
        this.router.navigate(['home']);
    }

    /****************************************** Contrôle des saisies *********************************/

    checkEmail(e: any) {
        if (e.target.value !== null && !(this.regexp.test(e.target.value))) {
            this.errorEmail = "L'email n'est pas valide";
            this.showButton = true;
        }
        else if (e.target.value !== null) {
            this.userService.checkEmail(e.target.value).subscribe(result => {
                // console.log(result.body);
                if (result.status == 200) {
                    this.utilisateurService.checkEmail(e.target.value).subscribe(res => {
                        // console.log(res.body);
                        if (result.body && res.body) {
                            this.errorEmail = "Cet email existe déjà";
                            this.showButton = true;
                        } else {
                            this.showButton = false;
                        }
                    });
                }

            });
        }
    }

    checkEmailP(e: any) {
        if (e.target.value != null && !(this.re.test(String(e.target.value).toLowerCase()))) {
            this.errorEmail = "L'email n'est pas valide";
            this.showButton = true;
        } else {
            this.userService.checkEmail(e.target.value).subscribe(result => {
                if (result.status == 200) {
                            if (e.target.value === this.utilisateur.email) {
                                this.showButton = false;
                            } else {
                                this.errorEmail = "Cet email existe déjà";
                                this.showButton = true;
                            }
                }

            });
        }
    }

    checkTel(e: any) {
        if (e.target.value != null && e.target.value.length < 8) {
            this.errorPassword = '';
            this.errorEmail = '';
            this.errorTelSos = 'Numéro incorrecte';
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }

    checkPassword(e: any) {
        if (e.target.value != null && e.target.value.length < 6) {
            this.errorPassword = 'Le mot de passe doit contenir au mininmum 6 caractères';
            this.errorEmail = '';
            this.errorTelSos = '';
            this.showButton = true;
        } else if (this.user.passwordConfirmed != null && (e.target.value !== this.user.passwordConfirmed)) {
            this.errorPwdConf = 'Les mots de passe ne correspondent pas';
            this.errorEmail = '';
            this.errorTelSos = '';
            this.errorPassword = '';
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }

    checkPasswordConfirmed(e: any) {
        if (e.target.value != null && !(e.target.value.match(this.user.password))) {
            this.errorPwdConf = 'Les mots de passe ne correspondent pas';
            this.errorEmail = '';
            this.errorTelSos = '';
            this.errorPassword = '';
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }


    checkCnibNb(e: any) {
        if (this.utilisateur.typeDocument === 'CNIB') {
            this.errorDate = '';
            if (e.target.value != null && !e.target.value.substr(0, 1).match('B')) {
                this.errorCnibNb = 'Le numéro doit commencer par B';
                this.showButton = true;
            } else if (!(/^\d+$/.test(e.target.value.substr(1)))) {
                this.errorCnibNb = 'Les caractères suivants doivent être des chiffres';
                this.showButton = true;
            } else if(e.target.value.substr(1).length < 7) {
                this.errorCnibNb = 'Le numéro doit contenir 7 chiffres au minimum';
                this.showButton = true;
            } else {
                this.showButton = false;
            }
        } else {
            this.errorDate = '';
            if (e.target.value != null && !e.target.value.match(/[^a-zA-Z0-9]/) && !(e.target.value.length >= 5)) {
                this.errorCnibNb = 'Le numéro doit comporter au moins une lettre et 4 chiffres';
                this.showButton = true;
            } else {
                this.showButton = false;
            }
        }

    }

    checkD(val1, val2) {
        if (val1 !== 0 && val2 !== NaN) {
            if (val1 >= val2) {
                this.errorDate = 'Ce champ ne doit pas rester vide';
                this.errorCnibNb = '';
                this.showButton = true;
            } else if (val2 <= val1) {
                this.errorDate = 'La date dexpiration ne peut être inférieure à la précédente';
                this.errorCnibNb = '';
                this.showButton = true;
            }
            else if (this.utilisateurService.getDaysBetwDates(val1, val2)!= 10) {
                this.errorDate = "La date d'expiration est incorrecte";
                this.errorCnibNb = '';
                this.showButton = true;
            } else {
                this.showButton = false;
                this.errorDate = '';
            }
        } else {
            this.showButton = false;
            this.errorDate = '';
        }
    }

    checkDates(val, e: any) {
        let dStart; let dEnd;
        switch (val) {
            case 'Expiration':
                dStart = new Date(this.utilisateur.dateDelivrance).getTime();
                dEnd = new Date(e.target.value).getTime();
                this.checkD(dStart, dEnd);
                this.utilisateur.dateExpiration = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
                break;
            case 'Delivrance':
                dStart = new Date(e.target.value).getTime();
                dEnd = new Date(this.utilisateur.dateExpiration).getTime();
                this.checkD(dStart, dEnd);
                this.utilisateur.dateDelivrance = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
                break;
            default:
                break;
        }

    }

    checkPhotoNotempty(e: any) {
        if (this.cnibR == null) {
            this.errorCnibPhoto = 'Ce champ est obligatoire';
            this.errorCnibNb = '';
            this.errorDate = '';
            this.showButton = true;
        } else {
            this.showButton = false;
        }
    }


    /*********************************** Pour garder en local les données saisies *****************************/
    retrievePageUser(u: UtilisateurDto) {
    // console.log('************************ Sauvegarde des données utilisateur ********');
        console.log(u);
        if (this.localStorage.length !== null) {
            this.localStorage.clear();
        }
        u.password = this.user.password;
        u.pwdConfirmed = this.user.passwordConfirmed;
        // console.log(u);
        this.utilisateursLocal.push(u);
        this.localStorage.set('utilisateur', this.utilisateursLocal);
        this.showBtnSave = true;
    }

    retrievePageEngin(e: Engin) {
        console.log(e);
        if (this.localStorage.length !== null) {
            this.localStorage.clear();
        }
        this.retrievePageUser(this.utilisateur);
        this.enginsLocal.push(e);
        this.localStorage.set('engin', this.enginsLocal);
        this.showBtnSave = true;
    }

    retrievePagePaiement(p: Paiement) {
        if (this.localStorage.length != null) {
            this.localStorage.clear();
        }
        this.retrievePageUser(this.utilisateur);
        this.retrievePageEngin(this.engin);
        this.paiementsLocal.push(p);
        this.localStorage.set('paiement', this.paiementsLocal);
    }

    /********************************************** Test des toasts ***********************************/
    successToast() {
        const myToast = this.toastCtrl.create({
            header: 'Succès!',
            message: 'Test du toast réussi',
            position: 'middle',
            color: 'success',
            cssClass: 'toast',
            translucent: true,
            animated: true,
            duration: 1000
        }).then((toastData) => {
            toastData.present();
        });
    }

    failToast() {
        const myToast = this.toastCtrl.create({
            header: 'Erreur!',
            message: 'Test du toast erreur',
            position: 'middle',
            color: 'danger',
            cssClass: 'toast',
            translucent: true,
            animated: true,
            duration: 1000
        }).then((toastData) => {
            toastData.present();
        });
    }

    getAll() {
        this.typeFonctionService.getAll().subscribe(data => {
            this.typeFonctions = data;
        });
    }

    getAllByU() {
        this.utilisateurService.getOne(this.id).subscribe(data => {
            this.utilisateur = data;
            let p = this.utilisateur.photo;
            if (p != null) {
                let sanitizedUrlP = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.photo = sanitizedUrlP;
            } else {
                this.photo = this.photoDefault;
            }
            let c = this.utilisateur.cnib;
            if (c != null) {
                let sanitizedUrlR = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + c);
                this.cnibR = sanitizedUrlR;
            } else {
                this.cnibR = this.cnibDefault;
            }
            if (this.utilisateur.afficherTel != null) {
                this.prefTel = false;
            } else {
                this.prefTel = true;
            }
            if (this.utilisateur.afficherEmail != null) {
                this.prefEmail = false;
            } else {
                this.prefEmail = true;
            }
            if (this.utilisateur.courrierEvaluation != null) {
                this.prefEval = false;
            } else {
                this.prefEval = true;
            }
            if (this.utilisateur.courrierPromotion != null) {
                this.prefPromo = false;
            } else {
                this.prefPromo = true;
            }
        });

        this.paiementService.getLastByU(this.id).subscribe(data => {
            this.paiements = data;
            if (this.utilisateurService.getDaysBetwDates(new Date(this.paiements.datePaiement).getTime(), new Date().getTime()) == 1) {
                this.showRenouveler = true;
            } else {
                this.showRenouveler = false;
            }
        });

        this.enginService.getAllByUser(this.id).subscribe(data => {
            this.engins = data;
        });
    }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    isC() {
        if (this.idTF && this.idTF == 1) {
            // console.log('************ Conducteur **************');
            return true;
        } else {
            return false;
        }
    }

    isP() {
        if (this.idTF && this.idTF == 2) {
            // console.log('************ Passager **************');
            return true;
        } else {
            return false;
        }
    }

    saveFonction() {
        this.typeFonctionService.create(this.typeFonction);
        this.mode = 1;
    }

    back() {
        if (this.authService.isAuthenticated()) {
            this.mode = 1;
            this.getAllByU();
        } else {
            this.router.navigateByUrl('/home');
        }
    }

    /* ========================== Pour récupérer la sélection du  type de fonction =========================== */
    selectFonction(e: any) {
        this.utilisateur.idTypeFonction = e.detail.value;
        if (e.detail.value != 1) {
            this.showEngin = false;
        } else {
            this.showEngin = true;
        }
    }

    /* ========================== Pour récupérer la sélection du  type de fonction =========================== */
    selectTypeDocument(e: any) {
        this.utilisateur.typeDocument = e.detail.value;
    }

    connexion() {
        this.navCtrl.navigateForward('/login');
    }

    /* ========================== Pour récupérer la sélection du  type d'engin =========================== */

    selectTypeEngin(e: any, v) {
        console.log(v.val);
        if (v.id === 1) {
            this.place = 1;
            this.showPrix = 1000;
        } else {
            this.place = 2;
            this.showPrix = 500;
        }
        this.engin.typeEngin = v.val;
    }


    /* ================================ Ajout de type de fonction ============================ */
    add() {
        // si l'utilisateur est passager et veux ajouter la foncton conducteur
        this.mode = 4;
        this.utilisateurService.getOne(this.id).subscribe(data => {
            this.utilisateur = data;
        });
    }

    /* ========================== Appel de la fonction pour enregistrer le type de fonction ========================= */

    nextPaiementFonction() {
        if (this.engin.photoEnginP == null) {
            this.errorEnginPhoto = 'ce champ est obligatoire';
            this.showButtonPhoto = true;
        } else if (this.engin.carteGriseR == null) {
            this.errorCarteGPhoto = 'ce champ est obligatoire';
            this.showButtonCG = true;
        } else {
            if (this.engin.typeEngin == 'Auto' && this.engin.photoPermisR == null) {
                this.errorPermisPhoto = 'ce champ est obligatoire';
                this.showButtonPC = true;
            } else if (this.engin.typeEngin == 'Auto' && this.engin.photoAssuranceR == null) {
                this.errorAssurPhoto = 'ce champ est obligatoire';
                this.showButtonAssu = true;
            } else {
                this.showButtonPhoto = false;
                this.showButtonPC = false;
                this.showButtonCG = false;
                this.showButtonAssu = false;
                this.mode = 24;
            }
        }
    }

    nextValidationPaiementFonction() {
        this.mode = 25;
    }

    loadDataOrange() {
        this.customer.customer_msisdn = this.paiement.numeroClient.toString();
        this.customer.amount = this.paiement.montantPaiement;
        this.customer.otp = this.paiement.codeOtp;
        this.customer.idUtilisateur = this.id;
        console.log(this.customer);
    }

    changeFonctionCheck() {
        if (this.engin.photoEnginP == null) {
            this.errorEnginPhoto = 'ce champ est obligatoire';
            this.showButtonPhoto = true;
        } else if (this.engin.carteGriseR == null) {
            this.errorCarteGPhoto = 'ce champ est obligatoire';
            this.showButtonCG = true;
        } else {
            if (this.engin.typeEngin == 'Auto' && this.engin.photoPermisR == null) {
                this.errorPermisPhoto = 'ce champ est obligatoire';
                this.showButtonPC = true;
            } else if (this.engin.typeEngin == 'Auto' && this.engin.photoAssuranceR == null) {
                this.errorAssurPhoto = 'ce champ est obligatoire';
                this.showButtonAssu = true;
            } else {
                this.showButtonPhoto = false;
                this.showButtonPC = false;
                this.showButtonCG = false;
                this.showButtonAssu = false;
                // this.mode = 25;
                this.utilisateurService.update(this.utilisateur).subscribe(res => {
                    if(res.status == 200) {
                        this.utilisateurService.getOneByEmail(this.utilisateur.email).subscribe(data=> {
                            this.engin.idUtilisateur = data.idUtilisateur;
                            this.enginService.create(this.engin).subscribe(result => {
                                if(result.status == 200) {
                                    this.alertProfilSuccess();
                                } else {
                                    this.echecAccountEditAlert();
                                }
                            });
                        });
                    }
                    else {
                        this.echecAccountEditAlert();
                    }
                }, error => {
                    console.log(error);
                    this.echecAccountEditAlert();
                });

            }

        }
    }

    async changeFonction() {
        // console.log('******** Changement de fonction **********');
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Changement de profil en cours...'
        });
        await loading.present();

        this.utilisateur.idTypeFonction = 1;
        this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
        this.paiement.idUtilisateur = this.id;
        this.paiement.adhesion = true;
        if (this.engin.typeEngin == 'Auto') {
            this.customer.amount = 1000;
            this.customMoov.amount = 1000;
        } else {
            this.customer.amount = 500;
            this.customMoov.amount = 500;
        }

        this.paiementService.createOrange(this.customer).subscribe(res => {
            console.log('*******=========== Réponse du serveur ===========********');
            console.log(res.body);
            console.log(typeof res.body);
            if (res.status == 200 && res.body == 200) {
                this.utilisateurService.update(this.utilisateur).subscribe(res => {
                    if(res.status == 200) {
                        this.utilisateurService.getOneByEmail(this.utilisateur.email).subscribe(data=> {
                            this.engin.idUtilisateur = data.idUtilisateur;
                            this.enginService.create(this.engin).subscribe(result => {
                                if(result.status == 200) {
                                    loading.dismiss();
                                    this.alertProfilSuccess();
                                } else {
                                    loading.dismiss();
                                    this.echecAccountEditAlert();
                                }
                            })
                        })
                    }
                    else {
                        loading.dismiss();
                        this.echecAccountEditAlert();
                    }
                }, error => {
                    loading.dismiss();
                    console.log(error);
                    this.echecAccountEditAlert();
                });
            } else {
                loading.dismiss();
                this.echecAccountEditAlert();
            }
        }, error => {
            loading.dismiss();
            console.log(error);
            this.echecAccountEditAlert();
        });
    }

    async alertProfilSuccess() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirmation!',
            message: '<strong>Vous serez redirigé vers la page de connexion pour mettre à jour votre nouveau profil</strong>!!',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.loginService.logout();
                        this.navCtrl.navigateForward('/login').then(() => {
                            location.reload();
                        });
                        this.utilisateur = new UtilisateurDto();
                        this.engin = new Engin();
                    }
                }
            ]
        });

        await alert.present();
    }

    /****************************************************** Enregistrement *******************************************/
    nextCnib() {
        this.showBtnSave = false;
        if (this.utilisateur.email == null) {
            this.showButton = true;
            this.errorEmail = 'Ce champ ne doit pas être nul';
            this.errorPassword = '';
            this.errorPwdConf = '';
            this.errorTelSos = '';
        } else if (this.utilisateur.telSos == null) {
            this.showButton = true;
            this.errorEmail = '';
            this.errorPassword = '';
            this.errorPwdConf = '';
            this.errorTelSos = 'Ce champ ne doit pas être nul';
        } else {
            if (this.user.password == null) {
                this.showButton = true;
                this.errorEmail = '';
                this.errorPassword = 'Ce champ ne doit pas être nul';
                this.errorPwdConf = '';
                this.errorTelSos = '';
            } else if (this.user.passwordConfirmed == null) {
                this.showButton = true;
                this.errorEmail = '';
                this.errorPassword = '';
                this.errorPwdConf = 'Ce champ ne doit pas être nul';
                this.errorTelSos = '';
            } else {
                if (this.user.password !== this.user.passwordConfirmed) {
                    this.errorPwdConf = 'Les mots de passe ne correspondent pas';
                    this.errorEmail = '';
                    this.errorTelSos = '';
                    this.errorPassword = '';
                    this.showButton = true;
                } else if(this.utilisateur.email) {
                    this.userService.checkEmail(this.utilisateur.email).subscribe(result => {
                        if (result.status === 200) {
                            this.utilisateurService.checkEmail(this.utilisateur.email).subscribe(res => {
                                if (res.status === 200) {
                                    if (result.body && res.body) {
                                        this.errorEmail = 'Cet email existe déjà';
                                        this.errorPassword = null;
                                        this.errorPwdConf = null;
                                        this.errorTelSos = null;
                                        this.showButton = true;
                                    } else {
                                        this.mode = 3;
                                        this.showButton = false;
                                        this.errorEmail = null;
                                        this.errorPassword = null;
                                        this.errorPwdConf = null;
                                        this.errorTelSos = null;
                                    }
                                }
                            });
                        }

                    });
                } else {
                    this.mode = 3;
                    this.showButton = false;
                    this.errorEmail = null;
                    this.errorPassword = null;
                    this.errorPwdConf = null;
                    this.errorTelSos = null;
                }
            }
        }

    }

    nextPhoto() {
        this.utilisateur.dateDelivrance = this.datePipe.transform(this.utilisateur.dateDelivrance, 'yyyy-MM-dd');
        this.utilisateur.dateExpiration = this.datePipe.transform(this.utilisateur.dateExpiration, 'yyyy-MM-dd');
        /*console.log(this.utilisateur.dateDelivrance);
        console.log(this.utilisateur.dateExpiration);*/
        this.showBtnSave = false;
        if (this.utilisateur.typeDocument == null) {
            this.showButton = true;
            this.errorCnibNb = '';
            this.errorTypeDoc = 'Ce champ est obligatoire';
        } else if (this.utilisateur.numeroCnib == null) {
            this.showButton = true;
            this.errorCnibNb = 'Ce champ est obligatoire';
            this.errorTypeDoc = '';
        } else if (this.utilisateur.typeDocument === 'CNIB' && !this.utilisateur.numeroCnib.substr(0, 1).match('B')) {
                this.errorCnibNb = 'Le numéro doit commencer par B';
                this.showButton = true;
        } else {
            this.mode = 4;
            this.showButton = false;
            this.errorCnibNb = null;
            this.errorTypeDoc = null;
            this.errorDate = null;
        }
    }

    nextTypeFonction() {
        if (this.utilisateur.cnibR == null) {
            this.errorCnibPhoto = 'ce champ est obligatoire';
            this.showButton = true;
        } else {
            this.mode = 5;
            this.showButton = false;
        }
    }

    nextVerifEngin() {
        this.mode = 6;
        this.typeFonct = 1;
        this.showBtnSave = false;
    }

    nextPhotoEngin() {
        if (this.engin.typeEngin == null) {
            this.errorTypeEngin = 'Ce champ est obligatoire';
            this.showButton = true;
        } else {
            this.mode = 7;
            this.showButton = true;
            this.errorTypeEngin = '';
        }
    }

    nextPaiement() {
        if (this.engin.photoEnginP == null) {
            this.errorEnginPhoto = 'ce champ est obligatoire';
            this.showButtonPhoto = true;
        } else if (this.engin.carteGriseR == null) {
            this.errorCarteGPhoto = 'ce champ est obligatoire';
            this.errorEnginPhoto = '';
            this.showButtonCG = true;
        } else {
            if (this.engin.typeEngin === 'Auto' && this.engin.photoPermisR == null) {
                this.errorPermisPhoto = 'ce champ est obligatoire';
                this.errorCarteGPhoto = '';
                this.errorEnginPhoto = '';
                this.showButtonPC = true;
            } else if (this.engin.typeEngin === 'Auto' && this.engin.photoAssuranceR == null) {
                this.errorAssurPhoto = 'ce champ est obligatoire';
                this.errorPermisPhoto = '';
                this.errorCarteGPhoto = '';
                this.errorEnginPhoto = '';
                this.showButtonAssu = true;
            } else {
                this.showButtonPhoto = false;
                this.showButtonPC = false;
                this.showButtonCG = false;
                this.showButtonAssu = false;
                this.showBtnSave = false;
                this.errorAssurPhoto = '';
                this.errorPermisPhoto = '';
                this.errorCarteGPhoto = '';
                this.errorEnginPhoto = '';
                this.mode = 8;
            }
        }
    }

    nextValidationPaiement() {
        if (this.paiement.numeroClient.toString() == '') {
            console.log('Taille incorrecte');
            this.showBtn = false;
            this.errorCustomer = 'ce champ ne doit pas être vide';
        } else if (this.paiement.numeroClient.toString().length != 8) {
            console.log('Taille incorrecte');
            this.showBtn = false;
            this.errorCustomer = 'Le numéro est incorrecte';
        } else {
            console.log('Champ non vide donc ok');
            this.errorCustomer = '';
            this.showBtn = true;
            this.mode = 9;
        }
    }

    newBack() {
        this.mode = 8;
    }

    backPaiement() {
        this.mode = 7;
        this.showBtn = true;
        if (this.engin.photoEnginP != null && this.engin.photoPermisR != null && this.engin.photoAssuranceR != null &&
            this.engin.carteGriseR != null) {
            this.showBtn = false;
        } else {
            this.showBtn = true;
            if (this.modePaiement == 1) {
                this.checkO = true;
                this.checkedM = true;
            } else {
                this.checkM = true;
                this.checkedO = true;
            }
        }

    }

    backPhotoEngin() {
        this.mode = 6;
        if (this.engin.typeEngin != null) {
            this.showBtn = false;
        }
    }

    backVerifEngin() {
        this.mode = 5;
        if (this.utilisateur.idTypeFonction != 0) {
            this.showBtn = false;
        }
    }

    backTypeFonction() {
        this.mode = 4;
        if (this.utilisateur.cnibR != null) {
            this.showBtn = false;
        }
    }

    backPhoto() {
        this.mode = 3;
        console.log('Retour');
        console.log('Date début: '+this.utilisateur.dateDelivrance);
         console.log('Date fin: '+this.utilisateur.dateExpiration);
         console.log('**************');
        if (this.utilisateur.numeroCnib != null) {
            this.showButton = false;
        } else if( (this.utilisateur.dateDelivrance == null && this.utilisateur.dateExpiration == null) ||
            (this.utilisateur.dateDelivrance != null && this.utilisateur.dateExpiration != null) ) {
            this.showButton = false;
        } else {
            this.checkD(this.utilisateur.dateDelivrance,  this.utilisateur.dateExpiration);
        }
    }

    backCnib() {
        this.mode = 2;
        if (this.utilisateur.email != null && this.user.password != null && this.user.passwordConfirmed != null) {
            this.showBtn = false;
        }
    }

    initialiseObject() {
        this.utilisateur = new UtilisateurDto();
        this.engin = new Engin();
        this.paiement = new Paiement();
        this.customer = new CommandDto();
        this.showPrix = 0;
        this.prixReserv = 0;
        this.prixDu = 0;
        this.ngOnInit();
    }

    /* ======================= Enregistrement avec effet chargement =================== */


    async save() {
        console.log('********* Mode création... *********');
        this.pwdConfirm = this.user.passwordConfirmed;
        this.userService.checkEmail(this.utilisateur.email).subscribe(result => {
            if (result.status == 200) {
                this.utilisateurService.checkEmail(this.utilisateur.email).subscribe(res => {
                    if(result.body && res.body)
                        this.resultUser = true;
                });
            }
        });
        this.user.email = this.utilisateur.email;

        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Patientez svp...'
        });
        await loading.present();
        this.localStorage.clear();

        if (this.resultUser) {
            loading.dismiss();
            this.mode = 2;
            this.errorEmail = 'Cet email existe déjà';
            this.errorEmail = null;
            this.errorPassword = null;
            this.errorPwdConf = null;
            this.errorTelSos = null;
            this.showButton = true;
        } else {
            if (this.user.password.match(this.user.passwordConfirmed)) {
                if (this.utilisateur.idTypeFonction != 1) {
                    console.log('********** Avec fonction passager **********');
                    this.userService.create(this.user).subscribe(res => {
                        if (res.status == 200) {
                            this.utilisateurService.create(this.utilisateur).subscribe(res => {
                                if(res.status == 200) {
                                  this.utilisateurService.sendNotif().subscribe(res=>{
                                    console.log(res);
                                  });
                                  loading.dismiss();
                                  this.confirmAccountAlert();
                                }
                            }, error => {
                                loading.dismiss();
                                this.echecAccountAlert();
                                this.router.navigateByUrl('/home');
                            });
                        } else {
                            loading.dismiss();
                            this.echecAccountAlert();
                            this.mode = 2;
                        }
                    }, error => {
                        loading.dismiss();
                        this.echecAccountAlert();
                        this.router.navigateByUrl('/home');
                        console.log(error);
                    });

                }
                else {
                    console.log('********** Avec fonction propriétaire **********');
                    // this.user.email = this.utilisateur.email;
                    this.userService.create(this.user).subscribe(res => {
                        if (res.status == 200) {
                            this.utilisateurService.create(this.utilisateur).subscribe(resp => {
                                console.log(this.engin);
                                if (resp.status == 200 && res.body !== null) {
                                    console.log(resp.status);
                                    console.log(res.body.idAppUser);
                                    // this.engin.idUtilisateur = resp.body.idUtilisateur;
                                    this.engin.idUtilisateur = res.body.idAppUser;
                                    console.log('******Enregistrement de lengin ******');
                                    this.enginService.create(this.engin).subscribe(resE => {
                                        // console.log(res);
                                        if(resE.status == 200) {
                                          this.utilisateurService.sendNotif().subscribe(res=>{
                                            console.log(res);
                                          });
                                            loading.dismiss();
                                          this.confirmAccountAlert();
                                        }
                                    }, error => {
                                        loading.dismiss();
                                        this.echecAccountAlert();
                                        this.router.navigateByUrl('/home');
                                        console.log(error);
                                    });
                                } else {
                                    loading.dismiss();
                                    console.log(res.status);
                                    console.log(res.body);
                                    this.echecEnginAlert();
                                    // this.mode = 2;
                                    this.router.navigateByUrl('/login');
                                    this.initialiseObject();

                                }
                            }, error => {
                                loading.dismiss();
                                this.echecAccountAlert();
                                this.router.navigateByUrl('/home');
                                console.log(error);
                            });
                        } else {
                            loading.dismiss();
                            this.echecAccountAlert();
                            this.mode = 2;
                        }
                    }, error => {
                        loading.dismiss();
                        this.echecAccountAlert();
                        this.router.navigateByUrl('/home');
                        console.log(error);
                    });
                }
            }
            else {
                console.log('************** Les mots de passe ne correspondent pas ************');
                loading.dismiss();
                this.errorPwdConf = 'Les mots de passe ne correspondent pas';
                this.show = true;
                this.echecAccountAlert();
                this.router.navigateByUrl('/utilisateur');
            }
        }

    }

    savePassager() {
        this.utilisateur.idTypeFonction = 2;
        this.save();
    }

     saveConducteur() {
        this.utilisateur.idTypeFonction = 1;
         /*this.userService.checkEmail(this.utilisateur.email).subscribe(result => {
             if (result.status == 200) {
                 this.utilisateurService.checkEmail(this.utilisateur.email).subscribe(res => {
                     if(result.body && res.body)
                         this.resultUser = true;
                 });
             }
         });*/
        this.save();
        // this.mode = 0;
    }

    async confirmAccountAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Succès',
            subHeader: "Inscription réussie",
            message: "Après vérification et validation de vos documents, <br> vous recevrez un email confirmant votre accès à l'application.",
            buttons: [
                {
                    text: '',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Confirm Cancel');
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        console.log('Confirm Ok');
                        this.router.navigateByUrl('/login');
                        this.initialiseObject();

                    }
                }
            ]
        });

        await alert.present();
    }

    async confirmPhotoEditAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-classS',
            header: 'Succès',
            subHeader: "Edition photo",
            message: "La photo a été modifiée",
            buttons: ['OK']
        });

        await alert.present();
    }

    async confirmAccountEditAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-classS',
            header: 'Succès',
            subHeader: "Edition réussie",
            message: "Le compte a été modifié",
            buttons: ['OK']
        });

        await alert.present();
    }

    async echecAccountAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-classF',
            header: 'Echec',
            subHeader: "Inscription échouée",
            message: "Le compte n'a pas pu être créé, veuillez re-essayer",
            buttons: ['OK']
        });

        await alert.present();
    }

    async echecEnginAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-classF',
            header: 'Echec',
            subHeader: "Informations Engin",
            message: "Les informations de l'engin n'ont pas pu être enregistrées, " +
                "vous pouvez les mettre à jour plutard",
            buttons: ['OK']
        });

        await alert.present();
    }

    async echecPaiemenAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-classF',
            header: 'Echec',
            subHeader: "Inscription échouée",
            message: "Le compte n'a pas pu être créé, veuillez re-essayer",
            buttons: ['OK']
        });

        await alert.present();
    }

    async echecAccountEditAlert() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Echec',
            subHeader: "Edition échouée",
            message: "Le compte n'a pas pu être modifié, veuillez re-essayer",
            buttons: ['OK']
        });

        await alert.present();
    }

    /* ============================= Edition =========================== */

    edit(u: UtilisateurDto) {
        this.mode = 11;
        this.utilisateurService.getOne(u.idUtilisateur).subscribe(data => {
            this.utilisateur = data;
            this.user.password = null;
            this.emailOld = this.utilisateur.email;
            let p = this.utilisateur.photo;
            if (p != null) {
                this.photo = p;
            } else {
                this.photo = this.photoDefault;
            }
            let c = this.utilisateur.cnib;
            if (c != null) {
                let sanitizedUrlR = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + c);
                this.cnibR = sanitizedUrlR;
            } else {
                this.cnibR = this.cnibDefault;
            }
            this.userService.getByEmail(this.utilisateur.email).subscribe(data => {
                this.user = data;
            });
        });
        /***************** Si c'est un conducteur, on affiche les informations de l'engin ************/
        if (u.idTypeFonction = 1) {
            this.enginService.getAllByUser(u.idUtilisateur).subscribe(data => {
                this.engins = data;
                for (let e of Array(this.engins)) {
                    /******************* Pour récupérer la photo de l'engin ****************/
                    let pe = e.photoEngin;
                    if (pe != null) {

                        let sanitizedUrlP = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + pe);
                        this.photoEP = sanitizedUrlP;
                    } else {
                        this.photoEP = this.photoEDefault;
                    }
                    /******************* Pour récupérer la photo de la carte grise ****************/
                    let cg = e.carteGrise;
                    if (cg != null) {
                        let sanitizedUrlR = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + cg);
                        this.photoCGR = sanitizedUrlR;

                    } else {
                        this.photoCGR = this.photoCGDefault;
                    }
                    /******************* Pour récupérer la photo du permis ****************/
                    let pc = e.photoPermis;
                    if (pc != null) {
                        let sanitizedUrlR = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + pc);
                        this.photoPCR = sanitizedUrlR;

                    } else {
                        this.photoPCR = this.photoPCDefault;
                    }
                    /******************* Pour récupérer la photo de l'assurance ****************/
                    let assur = e.photoAssurance;
                    if (assur != null) {
                        let sanitizedUrlR = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + assur);
                        this.photoAssuR = sanitizedUrlR;
                    } else {
                        this.photoAssuR = this.photoAssuDefault;
                    }
                }
            })
        }
    }

    /*********************************************** Edition  ************************************************/

    /**************************** Mise à jour de la photo **********************/
    async updatePhoto() {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            message: 'Modification en cours...'
        });
        await loading.present();

        console.log(this.utilisateur);
        this.utilisateurService.update(this.utilisateur).subscribe(res => {
            // console.log(res);
            loading.dismiss();
            this.confirmPhotoEditAlert();
            this.mode = 10;
            this.getAllByU();
        }, error => {
            loading.dismiss();
            // console.log(error);
            this.echecAccountEditAlert();
            this.mode = 10;
            this.getAllByU();
        });
    }


    /**************************** Mise à jour du compte(informations de base) **********************/
    async update() {
        if (this.utilisateur.cnibR === null) {
            this.errorCnibPhoto = 'ce champ est obligatoire';
            this.showButton = true;
        } else {
            this.showButton = false;
            const loading = await this.loadingController.create({
                cssClass: 'my-custom-class',
                message: 'Modification en cours...'
            });
            await loading.present();

            this.utilisateurService.update(this.utilisateur).subscribe(res => {
                this.user.email = res.body.email;
                console.log(this.user.email);
                this.user.emailOld = this.utilisateur.email;
                console.log(this.user.emailOld);
                if (this.user.emailOld !== this.user.email) {
                    console.log('***** Mise à jour du compte user à cause de lemail *******');
                    this.userService.update(this.user).subscribe(result => {
                        loading.dismiss();
                        this.confirmAccountEditAlert();
                        this.mode = 10;
                        this.getAllByU();
                    });
                } else {
                    console.log('***** Mise à jour du compte utilisateur seulement *******');
                    loading.dismiss();
                    this.confirmAccountEditAlert();
                    this.mode = 10;
                    this.getAllByU();
                }
            }, error => {
                loading.dismiss();
                this.echecAccountEditAlert();
                this.mode = 10;
                this.getAllByU();
            });
        }
    }

    /****************** Mise à jour du mot de passe ****************/
    async updatePwd() {
        this.showP = false;
        if (this.user.password != this.user.passwordConfirmed) {
            this.errorPassword = 'Les mots de passe ne correspondent pas';
            this.show = true;
        } else {
            this.show = false;
            const loading = await this.loadingController.create({
                cssClass: 'my-custom-class',
                message: 'Modification en cours...'
            });
            await loading.present();

            this.user.email = this.utilisateur.email;
            this.user.emailOld = this.utilisateur.email;
            this.userService.updatePassword(this.user).subscribe(result => {
                loading.dismiss();
                this.alertPwdSuccess();
            }, error => {
                loading.dismiss();
                this.errorPasswordOld = "L'ancien mot de passe est incorrecte";
                this.showP = true;
                this.echecAccountEditAlert();
            });
        }

    }

    async alertPwdSuccess() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Confirmation!',
            message: '<strong>Vous serez redirigé vers la page de connexion pour mettre à jour votre mot de passe</strong>!!',
            buttons: [
                {
                    text: 'Annuler',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                    }
                }, {
                    text: 'Ok',
                    handler: () => {
                        this.loginService.logout();
                        this.navCtrl.navigateForward('/login').then(() => {
                            location.reload();
                        });
                        this.utilisateur = new UtilisateurDto();
                        this.show = false;
                        this.showP = false;
                    }
                }
            ]
        });

        await alert.present();
    }

    /**************************** Pour charger la photo ************************/

    async openCam(val) {
        let actionSheet = await this.actionsheetCtrl.create({
            header: 'Option',
            cssClass: 'action-sheets-basic-page',
            buttons: [
                {
                    text: 'Caméra',
                    role: 'destructive',
                    handler: () => {
                        this.choicePhotoTypeT(val, this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Galerie',
                    handler: () => {
                        this.choicePhotoTypeT(val, this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
            ]
        });
        actionSheet.present();

    }

    choicePhotoTypeT(val, sourceType) {
            let p: string = val;
            const options: CameraOptions = {
                quality: 10,
                destinationType: this.camera.DestinationType.DATA_URL,
                encodingType: this.camera.EncodingType.JPEG,
                mediaType: this.camera.MediaType.PICTURE,
                sourceType: sourceType
            }
            this.camera.getPicture(options).then((imageData) => {
                let base64Image = 'data:image/jpeg;base64,' + imageData;
                switch (p) {
                    case 'photo':
                        this.photo = base64Image;
                        return this.utilisateur.photo = base64Image;
                        break;
                    case 'cnibR':
                        this.cnibR = base64Image;
                        return this.utilisateur.cnibR = base64Image;
                        this.showDeleteCNR = true;
                        break;
                    case 'photoEP':
                        this.photoEP = base64Image;
                        return this.engin.photoEnginP = base64Image;
                        this.showDeletePEP = true;
                        break;
                    case 'photoCGR':
                        this.photoCGR = base64Image;
                        return this.engin.carteGriseR = base64Image;
                        this.showDeleteCGR = true;
                        break;
                    case 'photoPCR':
                        this.photoPCR = base64Image;
                        return this.engin.photoPermisR = base64Image;
                        this.showDeletePCR = true;
                        break;
                    case 'photoAssuR':
                        this.photoAssuR = base64Image;
                        return this.engin.photoAssuranceR = base64Image;
                        this.showDeleteAssuR = true;
                        break;
                    default:
                        console.log("Aucune photo sélectionnée");
                        break;
                }
            }, (err) => {
                // Handle error
                alert("error " + JSON.stringify(err));
            });
        }

    choicePhotoType(m, val) {
        let p: string = val;
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: undefined
        }
        switch (m) {
            case 1:
                options.sourceType = this.camera.PictureSourceType.CAMERA;
                break;
            case 2:
                options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
                break;
            default:
                break;

        }
        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            switch (p) {
                case 'photo':
                    this.photo = base64Image;
                    return this.utilisateur.photo = base64Image;
                    break;
                case 'cnibR':
                    this.cnibR = base64Image;
                    return this.utilisateur.cnibR = base64Image;
                    this.showDeleteCNR = true;
                    break;
                case 'photoEP':
                    this.photoEP = base64Image;
                    return this.engin.photoEnginP = base64Image;
                    this.showDeletePEP = true;
                    break;
                case 'photoCGR':
                    this.photoCGR = base64Image;
                    return this.engin.carteGriseR = base64Image;
                    this.showDeleteCGR = true;
                    break;
                case 'photoPCR':
                    this.photoPCR = base64Image;
                    return this.engin.photoPermisR = base64Image;
                    this.showDeletePCR = true;
                    break;
                case 'photoAssuR':
                    this.photoAssuR = base64Image;
                    return this.engin.photoAssuranceR = base64Image;
                    this.showDeleteAssuR = true;
                    break;
                default:
                    console.log("Aucune photo sélectionnée");
                    break;
            }
        }, (err) => {
            // Handle error
            alert("error " + JSON.stringify(err));
        });
    }

    uploadCam(val) {
        let p: string = val;
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            switch (p) {
                case 'photo':
                    this.photo = base64Image;
                    return this.utilisateur.photo = base64Image;
                    break;
                case 'cnibR':
                    this.cnibR = base64Image;
                    return this.utilisateur.cnibR = base64Image;
                    this.showDeleteCNR = true;
                    break;
                case 'photoEP':
                    this.photoEP = base64Image;
                    return this.engin.photoEnginP = base64Image;
                    this.showDeletePEP = true;
                    break;
                case 'photoCGR':
                    this.photoCGR = base64Image;
                    return this.engin.carteGriseR = base64Image;
                    this.showDeleteCGR = true;
                    break;
                case 'photoPCR':
                    this.photoPCR = base64Image;
                    return this.engin.photoPermisR = base64Image;
                    this.showDeletePCR = true;
                    break;
                case 'photoAssuR':
                    this.photoAssuR = base64Image;
                    return this.engin.photoAssuranceR = base64Image;
                    this.showDeleteAssuR = true;
                    break;
                default:
                    console.log("Aucune photo sélectionnée");
                    break;
            }
        }, (err) => {
            // Handle error
            alert("error " + JSON.stringify(err));
        });
    }

    uploadGal(val) {
        let p: string = val;
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
        }

        this.camera.getPicture(options).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.photo = base64Image;
            return this.utilisateur.photo = base64Image;
        }, (err) => {
            // Handle error
            alert("error " + JSON.stringify(err))
        });
    }

    deleteUpCNRecto() {
        if (this.utilisateur.cnibR != null) {
            this.showDeleteCNR = false;
            return this.cnibR = this.cnibDefault;
        }
    }

    deleteUpPEP() {
        if (this.engin.photoEnginP != null) {
            this.showDeletePEP = false;
            return this.photoEP = this.photoEDefault;
        }
    }

    deleteUpCGR() {
        if (this.engin.carteGriseR != null) {
            this.showDeleteCGR = false;
            return this.photoCGR = this.photoCGDefault;
        }
    }

    deleteUpPCR() {
        if (this.engin.photoPermisR != null) {
            this.showDeletePCR = false;
            return this.photoPCR = this.photoPCDefault;
        }
    }

    deleteUpAssuR() {
        if (this.engin.photoAssuranceR != null) {
            this.showDeleteAssuR = false;
            return this.photoAssuR = this.photoAssuDefault;
        }
    }


    /******************************** Gestion du paiement ***********************************/

    checkNumber(e: any) {
        if (e.target.value.length != 8) {
            this.showBtn = false;
            this.errorCustomer = 'Le numéro est incorrecte';
        } else {
            this.errorCustomer = '';
            this.showBtn = true;
        }
    }

    getModePaiement(e: any) {
        console.log(e.detail.value);
        if (e.datail.checked) {
            return true;
        }
    }

    getOrange(e: any) {
        if (e.target.checked) {
            this.checkO = true;
            this.checkedM = true;
        } else {
            this.checkO = false;
            this.checkedM = false;
        }
        return this.modePaiement = e.target.value;
    }

    getMobicash(e: any) {
        if (e.target.checked) {
            this.checkM = true;
            this.checkedO = true;
        } else {
            this.checkM = false;
            this.checkedO = false;
        }
        return this.modePaiement = e.target.value;
    }

    getOtp(e: any) {
        if (e.target.value.length != 6) {
            this.showBtn = true;
            this.errorOtp = 'Le champ doit comporter 6 caractères';
        } else {
            this.errorOtp = '';
            this.showBtn = false;
        }
    }

    async savePaiement() {
        const loading = await this.loadingController.create({
            cssClass: 'my-custom-class',
            duration: 4000,
            message: 'Veuillez patienter svp'
        });
        await loading.present();
        this.save();
    }

    async successPaiement() {
        let toast = await this.toastCtrl.create({
            cssClass: 'my-custom-class',
            header: '<ion-header *ngIf="mode === 9" class="secondScreen">\n' +
                '\t<ion-toolbar class="secondScreen">\n' +
                '\t\t\t<img src="assets/icons/christab2_neutre.svg">\n' +
                '\t\t</div>\n' +
                '\t</ion-toolbar>\n' +
                '</ion-header>',
            message: '<img src=\"assets/nouvellesIcones/tick blue.png\" class=\"positionImage\">\n' +
                '\t<h3 class=\"h3\">Inscription en cours de <br> validation!</h3> <br>\n' +
                '\t<p class="p7">Nous avons bien reçu votre paiement!</p>\n' +
                '\t<p class="p7">Votre demande d\'inscription est prise en compte.</p>\n' +
                '\t<p class="p8">Après vérification et validation de vos documents, <br> vous recevrez un email confirmant votre accès à l\'application.</p>\n' +
                '\t<section class="validation">\n' +
                '\t\t<img src="assets/nouvellesIcones/a.png" (click)="paiementInscription()" class="refImageValidation">\n' +
                '\t</section>',
            buttons: [{
                text: 'Retour',
                handler: () => {
                    this.nextPaiement();
                }
            }]
        });
        await toast.present();
    }

    async failPaiement() {
        let toast = await this.toastCtrl.create({
            cssClass: 'my-custom-class',
            header: '<ion-header class="secondScreen">\n' +
                '\t<ion-toolbar class="secondScreen">\n' +
                '\t</ion-toolbar>\n' +
                '</ion-header>',
            message: '<img src=\"assets/nouvellesIcones/tick belue.png\" class=\"positionImage\">\n' +
                '\t<h3 class=\"h3\">Paiement échoué</h3> <br>\n' +
                '	<p class="p7">Il semble que nous avons rencontrer un problème à procéder à votre paiement</p>\n' +
                '\t<p class="p7"> <strong> Motif: Solde insuffisant </strong> </p>\n' +
                '\t<p class="p7">Veuillez vérifier que toutes les données sont correctes, puis reéssayez!</p>\n' +
                '\t<section style="text-align: center" class="validation"> ' +
                '\t<img src="assets/nouvellesIcones/Grouezp.png" (click)="paiementInscription()" class="refImageValidation"> ' +
                '\t</section>',
            buttons: [{
                text: 'Retour',
                handler: () => {
                    this.nextPaiement();
                }
            }]
        });
        await toast.present();
    }

    /***************************************** Gestion du profil ******************************************/
    gererProfil() {
        this.mode = 10;
        this.getAllByU();
    }

    isAuthorised() {
        if (this.idTF == 1) {
            this.navCtrl.navigateForward('/home-conducteur');
        } else {
            this.navCtrl.navigateForward('/itineraire');
        }
    }

    /********* Récupération des choix affichage du téléphone, email... **********/

    display(val, e: any) {
        switch (val) {
            case 'Eval':
                if (e.target.attributes.value.nodeValue === '1') {
                    this.utilisateur.courrierEvaluation = true;
                } else {
                    this.utilisateur.courrierEvaluation = false;
                }
                break;
            case 'Promo':
                if (e.target.attributes.value.nodeValue === '1') {
                    this.utilisateur.courrierPromotion = true;
                } else {
                    this.utilisateur.courrierPromotion = false;
                }

        }
        this.utilisateurService.update(this.utilisateur).subscribe(res => {
        })
    }

    changerPassword(u: UtilisateurDto) {
        this.mode = 12;
        this.userService.getByEmail(u.email).subscribe(data => {
            this.user = data;
            this.user.password = null;
        })
    }

    changerPhoto() {
        this.mode = 17;
        this.getAllByU();
    }

    changerProfil() {
        this.mode = 18;
        this.getAllByU();
    }

    nextAjoutPhotoEngin() {
        this.mode = 19;
    }

    nextCnibProfil() {
        this.mode = 15;

    }

    nextPhotoProfil() {
        this.utilisateur.dateDelivrance = this.datePipe.transform(this.utilisateur.dateDelivrance, 'yyyy-MM-dd');
        this.utilisateur.dateExpiration = this.datePipe.transform(this.utilisateur.dateExpiration, 'yyyy-MM-dd');
        /*console.log(this.utilisateur.dateDelivrance);
        console.log(this.utilisateur.dateExpiration);*/
        this.showBtnSave = false;
        if (this.utilisateur.typeDocument == null) {
            this.showButton = true;
            this.errorCnibNb = '';
            this.errorTypeDoc = 'Ce champ est obligatoire';
        } else if (this.utilisateur.numeroCnib == null) {
            this.showButton = true;
            this.errorCnibNb = 'Ce champ est obligatoire';
            this.errorTypeDoc = '';
        } else if (!this.utilisateur.numeroCnib.substr(0, 1).match('B')) {
                this.errorCnibNb = 'Le numéro doit commencer par B';
                this.showButton = true;
        } else {
            this.mode = 16;
            this.showButton = false;
            this.errorCnibNb = null;
            this.errorTypeDoc = null;
            this.errorDate = null;
        }
    }

    /***************************** Ajouter un engin ******************/

    ajoutEngin() {
        this.mode = 22;
    }

    ajoutENextPhoto() {
        if (this.engin.typeEngin == null) {
            this.showButton = true;
        } else {
            this.mode = 23;
            this.showButton = false;
            this.errorTypeEngin = '';
        }
    }

    ajouterEngin() {
        if (this.engin.photoEnginF == null || this.engin.photoEnginP == null || this.engin.photoEnginA == null) {
            this.errorEnginPhoto = 'Veuillez ajouter les photos';
            this.showButtonPhoto = true;
        } else if (this.engin.carteGriseR == null || this.engin.carteGriseV == null) {
            this.errorCarteGPhoto = 'Veuillez ajouter les photos';
            this.showButtonCG = true;
        } else {
            if (this.engin.typeEngin == 'Auto' && (this.engin.photoPermisR == null || this.engin.photoPermisV == null)) {
                this.errorPermisPhoto = 'Veuillez ajouter les photos';
                this.showButtonPC = true;
            } else if (this.engin.typeEngin == 'Auto' && (this.engin.photoAssuranceR == null || this.engin.photoAssuranceV == null)) {
                this.errorAssurPhoto = 'Veuillez ajouter les photos';
                this.showButtonAssu = true;
            } else {
                this.showButtonPhoto = false;
                this.showButtonPC = false;
                this.showButtonCG = false;
                this.showButtonAssu = false;

                this.engin.idUtilisateur = this.id;
                this.enginService.create(this.engin).subscribe(res => {
                    this.mode = 10;
                    this.getAllByU();
                    this.engin = new Engin();
                });
            }
        }
    }

    addEnginAuthorised() {
        // vérifier s'il a déjà effectué deux voyages au moins
    }


}
