import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AnnonceService} from "./annonce.service";
import {Annonce, AnnonceDto} from "./annonce.model";
import {AlertController, LoadingController, ToastController} from "@ionic/angular";
import {Itineraire} from "../itineraire/itineraire.model";
import {ItineraireService} from "../itineraire/itineraire.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {Subscription} from "rxjs";
import {LoginService} from "../login/login.service";
import {EventManagerService} from "../event-manager.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {AuthenticationService} from "../authentication.service";
import {Engin} from "../engin/engin.model";
import {EnginService} from "../engin/engin.service";
import {DatePipe} from "@angular/common";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";

@Component({
    selector: 'app-annonce',
    templateUrl: './annonce.page.html',
    styleUrls: ['./annonce.page.scss'],
})
export class AnnoncePage implements OnInit {

    annonces: Annonce;
    annonce: AnnonceDto = new AnnonceDto();
    utilisateurs: UtilisateurDto;
    itineraires: Itineraire;
    itineraire: Itineraire = new Itineraire();
    infoSupps: InformationsSupplementaires = new InformationsSupplementaires();
    infoSups: InformationsSupplementaires[] = [];
    infoSupp: InformationsSupplementaires = new InformationsSupplementaires();
    infoSup: number[] = new Array();
    engins: Engin;
    engin: Engin = new Engin();
    subscription: Subscription;
    codeBag: number;
    codeSpring: number;
    codeSmoke: number;
    codeAnimal: number;
    id: number = 0;
    idTF: number = 0;
    mode: number;
    dateD: string;
    dateAr: string;
    heureD: string;
    heureAr: string;
    dateDep: boolean = false;
    dateArr: boolean = false;
    PlaceA: Array<any> = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}, {val: 10}];
    PlaceM: Array<any> = [{val: 1}, {val: 2}];
    enableSmoke: boolean = false;
    enableNSmoke: boolean = false;
    enableSpring: boolean;
    enableNSpring: boolean = false;
    enableAnimal: boolean;
    enableNAnimal: boolean = false;
    showButton: boolean = false;
    errorFields: string = null;

    /********* Gestion des choix du trajet et de l'engin *********/
    choixA: string = 'A';
    showA: boolean = false;
    choixM: string = 'M';
    showM: boolean = false;
    choixU: string = 'U';
    showU: boolean = false;
    choixV: string = 'V';
    showV: boolean = false;
    eng: string;
    voyage: string;

    prixreserv: number;
    prixdu: number;
    defaultPers: number;
    defaultAuto: string;
    compareWith: any;
    buttonSaveClicked: boolean;

    days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sept', 'Oct', 'Nov', 'Dec'];
    hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    doneBtn = 'Ok';
    backBtn = 'Retour';
    val: string;
    errorDate: string
    valSearchUD: string = 'SUD';
    valSearchUA: string = 'SUA';
    valSearchVD: string = 'SVD';
    valSearchVA: string = 'SVA';
    position: any;


    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private itineraireService: ItineraireService,
        private annonceService: AnnonceService,
        private enginService: EnginService,
        private utilisateurService: UtilisateurService,
        private infoSuppService: InformationsSupplementairesService,
        private loginService: LoginService,
        private datePipe: DatePipe,
        private eventManager: EventManagerService,
        private authService: AuthenticationService,
        private geolocation: Geolocation,
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.clearLocalP();
        this.infoSups = this.infoSuppService.infoSupplementaires;
        this.getAll();
        this.defaultPers = 0;
        this.defaultAuto = null;
        this.compareWith = this.compareWithFn;

        this.val = this.route.snapshot.paramMap.get('id');
        this.subscription = this.route.params.subscribe((params) => {
            if (params['a'] != null && params['d'] != null) {
                this.eng = params['a'];
                this.voyage = params['d'];
            }
        });
        /*console.log(this.eng);
        console.log(this.voyage);*/
        if (this.router.getCurrentNavigation().extras.state) {
            this.position = this.router.getCurrentNavigation().extras.state.result;
            let pos = this.position.split('(', 2)[1];

            /************** Urbain Départ ***********/
            if (this.val === this.valSearchUD) {
                this.showU = true;
                this.itineraire.typeVoyage = 'urbain';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }

                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    console.log('****** Récupération du stockage local *******');
                    this.annonce.lieuDepart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else {
                    console.log('****** Récupération direct *******');
                    localStorage.removeItem('placeD');
                    localStorage.removeItem('positionD');
                    this.annonce.lieuDepart = this.position.split('(')[0];
                    this.itineraire.positionDepart = pos.split(')',)[0];
                }
                this.annonce.lieuArrivee = localStorage?.getItem('placeA');
                this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                console.log('LieuDépart: ' + this.annonce.lieuDepart);
                console.log('PositionDépart: ' + this.itineraire.positionDepart);
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
            }
            /************** Urbain Arrivée ***********/
            else if (this.val === this.valSearchUA) {
                this.showU = true;
                this.itineraire.typeVoyage = 'urbain';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }

                if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    console.log('****** Récupération du stockage local *******');
                    this.annonce.lieuArrivee = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                } else {
                    console.log('****** Récupération direct *******');
                    localStorage.removeItem('placeA');
                    localStorage.removeItem('positionA');
                    this.annonce.lieuArrivee = this.position.split('(')[0];
                    this.itineraire.positionArrivee = pos.split(')',)[0];
                }
                this.annonce.lieuDepart = localStorage?.getItem('placeD');
                this.itineraire.positionDepart = localStorage?.getItem('positionD');
                console.log('LieuArrivée: ' + this.annonce.lieuArrivee);
                console.log('PositionArrivée: ' + this.itineraire.positionArrivee);
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
            }
            /************** Voyage Départ ***********/
            else if (this.val === this.valSearchVD) {
                this.showV = true;
                this.itineraire.typeVoyage = 'voyage';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }

                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    console.log('****** Récupération du stockage local *******');
                    this.annonce.depart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else {
                    console.log('****** Récupération direct *******');
                    localStorage.removeItem('placeD');
                    localStorage.removeItem('positionD');
                    this.annonce.depart = this.position.split('(')[0];
                    this.itineraire.positionDepart = pos.split(')',)[0];
                }
                this.annonce.destination = localStorage?.getItem('placeA');
                this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                console.log('Départ: ' + this.annonce.depart);
                console.log('PositionDépart: ' + this.itineraire.positionDepart);
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
            }
            /************** Voyage Arrivée ***********/
            else if (this.router.getCurrentNavigation().extras.state && this.val === this.valSearchVA) {
                this.showV = true;
                this.itineraire.typeVoyage = 'voyage';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }

                if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    console.log('****** Récupération du stockage local *******');
                    this.annonce.destination = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                } else {
                    console.log('****** Récupération direct *******');
                    localStorage.removeItem('placeA');
                    localStorage.removeItem('positionA');
                    this.annonce.destination = this.position.split('(')[0];
                    this.itineraire.positionArrivee = pos.split(')',)[0];
                }
                this.annonce.depart = localStorage?.getItem('placeD');
                this.itineraire.positionDepart = localStorage?.getItem('positionD');
                console.log('Destination: ' + this.annonce.destination);
                console.log('PositionArrivée: ' + this.itineraire.positionArrivee);
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
            }

        } else {
            /*********************************** Retour de la recherche sur la carte sans sélection *************************/
            if (this.val === this.valSearchUD) {
                console.log('**************** Retour sans sélection de UD ******************');
                this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                this.annonce.lieuArrivee = localStorage?.getItem('placeA');
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
                this.showU = true;
                this.itineraire.typeVoyage = 'urbain';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }
                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    this.annonce.depart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    this.annonce.destination = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                }
            } else if (this.val === this.valSearchUA) {
                console.log('**************** Retour sans sélection de UA ******************');
                this.itineraire.positionDepart = localStorage?.getItem('positionD');
                this.annonce.lieuDepart = localStorage?.getItem('placeD');
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
                this.showU = true;
                this.itineraire.typeVoyage = 'urbain';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }
                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    this.annonce.depart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    this.annonce.destination = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                }
            } else if (this.val === this.valSearchVD) {
                console.log('**************** Retour sans sélection de VD ******************');
                this.annonce.destination = localStorage?.getItem('placeA');
                this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
                this.annonce.lieuDepart = localStorage?.getItem('placeD');
                this.annonce.lieuArrivee = localStorage?.getItem('placeA');
                this.showV = true;
                this.itineraire.typeVoyage = 'voyage';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }
                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    this.annonce.depart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    this.annonce.destination = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                }
            } else if (this.val === this.valSearchVA) {
                console.log('**************** Retour sans sélection de VA ******************');
                console.log('Départ: '+localStorage?.getItem('placeD'));
                this.annonce.depart = localStorage?.getItem('placeD');
                console.log(this.annonce.depart);
                this.itineraire.positionDepart = localStorage?.getItem('positionD');
                this.itineraire.dateDepart = localStorage?.getItem('dateD');
                this.itineraire.heureDepart = localStorage?.getItem('heureD');
                this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
                this.showV = true;
                this.itineraire.typeVoyage = 'voyage';
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    this.showM = true;
                    this.itineraire.typeLocalite = 'Moto';
                }
                if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                    this.annonce.depart = localStorage.getItem('placeD');
                    this.itineraire.positionDepart = localStorage.getItem('positionD');
                } else if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                    this.annonce.destination = localStorage.getItem('placeA');
                    this.itineraire.positionArrivee = localStorage.getItem('positionA');
                }
            }
            /*********************************** Ajout de trajet auto urbain ******************************************/
            else if (this.eng.match(this.choixA) && this.voyage.match(this.choixU)) {
                console.log('********** Urbain Auto **********');
                this.showA = true;
                localStorage.setItem('showA', 'true');
                this.showU = true;
                localStorage.setItem('showU', 'true');
                this.itineraire.typeVoyage = 'urbain';
                this.itineraire.typeLocalite = 'Auto';
            }
            /*********************************** Ajout de trajet auto voyage ******************************************/
            else {
                if (this.eng.match(this.choixA) && this.voyage.match(this.choixV)) {
                    console.log('********** Voyage Auto ************');
                    this.showA = true;
                    localStorage.setItem('showA', 'true');
                    this.showV = true;
                    localStorage.setItem('showU', 'false');
                    this.itineraire.typeVoyage = 'voyage';
                    this.itineraire.typeLocalite = 'Auto';
                } else {
                    /*********************************** Ajout de trajet moto urbain ******************************************/
                    if ((this.eng.match(this.choixM)) && (this.voyage.match(this.choixU))) {
                        console.log('********* Urbain Moto *********');
                        this.showU = true;
                        this.showM = true;
                        localStorage.setItem('showA', 'false');
                        localStorage.setItem('showU', 'true');
                        this.itineraire.typeVoyage = 'urbain';
                        this.itineraire.typeLocalite = 'Moto';
                    }
                    /*********************************** Ajout de trajet moto voyage ******************************************/
                    else {
                        console.log('********** Voyage Moto ***********');
                        this.showV = true;
                        this.showM = true;
                        localStorage.setItem('showA', 'false');
                        localStorage.setItem('showU', 'false');
                        this.itineraire.typeVoyage = 'voyage';
                        this.itineraire.typeLocalite = 'Moto';
                    }
                }
            }
        }

    }

    prec() {
        if ((this.eng?.match(this.choixA) && this.voyage?.match(this.choixU)) || (this.showA && this.showU)) {
            console.log('******* Retour Conducteur Auto Urbain (Ajout) ******');
            this.router.navigate(['engin', 'U', 'a']);
        } else if ((this.eng?.match(this.choixA) && this.voyage?.match(this.choixV)) || (this.showA && this.showV)) {
            console.log('******* Retour Conducteur Auto Voyage (Ajout) ******');
            this.router.navigate(['engin', 'V', 'a']);
        } else if ((this.eng?.match(this.choixM) && this.voyage?.match(this.choixU)) || (this.showM && this.showU)) {
            console.log('******* Retour Conducteur Moto Urbain (Ajout) ******');
            this.router.navigate(['engin', 'U', 'a']);
        } else if ((this.eng?.match(this.choixM) && this.voyage?.match(this.choixV)) || (this.showM && this.showV)) {
            console.log('******* Retour Conducteur Moto Voyage (Ajout) ******');
            this.router.navigate(['engin', 'V', 'a']);
        }

    }

    clearLocalP() {
        console.log('******** Vidange des données non définies ********');
        if (localStorage.getItem('placeD') !== null && localStorage?.getItem('placeD').indexOf(undefined) >= 0) {
            console.log('********* Suppression départ *********');
            localStorage.removeItem('placeD');
            localStorage.removeItem('positionD');
        } else if (localStorage.getItem('placeA') !== null && localStorage?.getItem('placeA').indexOf(undefined) >= 0) {
            console.log('********* Suppression arrivée *********');
            localStorage.removeItem('placeA');
            localStorage.removeItem('positionA');
        }
    }

    searchPlaceVD() {
        console.log('Destination: ' + this.annonce.destination);
        if (this.annonce.destination !== null) {
            localStorage.setItem('placeA', this.annonce.destination);
            localStorage.setItem('positionA', this.itineraire.positionArrivee);
        }
        this.router.navigate(['recherche-carte', 'VDAn']);
    }

    searchPlaceUD() {
        console.log('LieuArrivée: ' + this.annonce.lieuArrivee);
        if (this.annonce.lieuArrivee !== null) {
            localStorage.setItem('placeA', this.annonce.lieuArrivee);
            localStorage.setItem('positionA', this.itineraire.positionArrivee);
        }
        this.router.navigate(['recherche-carte', 'UDAn']);
    }

    searchPlaceVA() {
        console.log('Départ: ' + this.annonce.depart);
        if (this.annonce.depart !== null) {
            localStorage.setItem('placeD', this.annonce.depart);
            localStorage.setItem('positionD', this.itineraire.positionDepart);
        }
        this.router.navigate(['recherche-carte', 'VAAn']);
    }

    searchPlaceUA() {
        console.log('LieuDépart: ' + this.annonce.lieuDepart);
        if (this.annonce.lieuDepart !== null) {
            localStorage.setItem('placeD', this.annonce.lieuDepart);
            localStorage.setItem('positionD', this.itineraire.positionDepart);
        }
        this.router.navigate(['recherche-carte', 'UAAn']);
    }


    /***************** Pour ré-initialiser les champs ************/
    initialiseA() {
        localStorage.removeItem('placeD');
        localStorage.removeItem('positionD');
        localStorage.removeItem('placeA');
        localStorage.removeItem('positionA');
        this.annonce = new AnnonceDto();
        this.itineraire = new Itineraire();
        this.prixreserv = 0;
        this.prixdu = 0;
        this.enableSpring = false;
        this.enableNSpring = false;
        this.enableSmoke = false;
        this.enableNSmoke = false;
        this.enableAnimal = false;
        this.enableNAnimal = false;
        this.buttonSaveClicked = false;


    }


    compareWithFn(o1, o2) {
        return o1 === o2;
    };

    registerChangeInUtilisateurs() {
        this.eventManager.subscribe('annonceList', (response) => this.getAll());
    }

    onSaveSuccess(result) {
        this.eventManager.broadcast({name: 'annonceList'});
        this.getAll();
    }

    onError(error) {
        error(error.message, null, null);
    }

    getAll() {
        this.annonceService.getAll().subscribe(data => {
            this.annonces = data;
        });

        this.enginService.getAllByUser(this.id).subscribe(data => {
            this.engins = data;
        })

    }

    getAllBy(id: number) {
        this.annonceService.getAllBy(id).subscribe(data => {
            this.annonces = data;
        });
    }

    /***************** La récupération des données des sélections (date, heure, place) ******************/

    selectE(e: any) {
        console.log(e.target.value);
        if (e.target.value !== 0)
            this.annonce.idEngin = e.target.value;
        if (this.annonce.idEngin !== 0) {
            this.enginService.getOne(this.annonce.idEngin).subscribe(res => {
                if (res.typeEngin.indexOf('Auto') >= 0) {
                    this.itineraire.typeLocalite = 'Auto';
                    console.log(this.itineraire.typeLocalite);
                } else {
                    this.itineraire.typeLocalite = 'Moto';
                    console.log(this.itineraire.typeLocalite);
                }
            })
        }
    }

    selectRP(e: any) {
        console.log(e.detail.value);
        this.annonce.nbrePersonne = e.detail.value;
    }

    loadPrixReserv(e) {
        if (e.target.value != 0) {
            this.prixreserv = (e.target.value * 1) / 4;
            this.prixdu = (e.target.value * 3) / 4;
        }
        else {
            this.prixreserv = 0;
            this.prixdu = 0;
        }
    }

    getDateDep(e: any) {
        this.itineraire.dateDepart = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        console.log('********** Sauvegarde Date *************');
        localStorage.setItem('dateD', this.itineraire.dateDepart);
    }

    getDateAr(e: any) {
        if (e.target.value != null && e.target.value < this.itineraire.dateDepart) {
            this.errorDate = "La date d'arrivée est inférieure à celle de départ";
            this.showButton = true;
        } else {
            this.showButton = false;
            this.errorDate = "";
            this.itineraire.dateArrivee = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
            localStorage.setItem('dateAr', this.itineraire.dateArrivee);
        }
    }

    getHeureDep(e: any) {
        var d = e.target.value?.split('T')[1];
                                     let m = d.split(':')[0];
                                     let n = d.split(':')[1];
                                     var tm = m + ":" + n;
        console.log('****************** Sauvegarde Heure *****************');
        localStorage.setItem('heureD', tm);
        this.itineraire.heureDepart = tm;
        console.log(this.itineraire.heureDepart);
    }


    getHeureAr(e: any) {
        let h = this.datePipe.transform(e.target.value, 'HH:mm');
        let hD = this.itineraire.heureDepart;
        if (e.target.value != null) {
            if (this.itineraire.dateDepart === this.itineraire.dateArrivee && h === hD) {
                this.errorDate = "Veuillez vérifier les dates et heures saisies(elles sont égales)";
                this.showButton = true;
            } else if (this.itineraire.dateDepart === this.itineraire.dateArrivee && h <= hD) {
                this.errorDate = "L'heure d'arrivée est inférieure à celle de départ";
                this.showButton = true;
            } else {
                this.showButton = false;
                this.errorDate = '';
                var d = e.target.value?.split('T')[1];
                let m = d.split(':')[0];
                let n = d.split(':')[1];
                var tm = m + ":" + n;
                localStorage.setItem('heureAr', tm);
                this.itineraire.heureArrivee = tm;
                console.log(this.itineraire.heureArrivee);
            }
        }
    }

    getBag(e: any) {
        console.log(e.target.value);
        if (e.target.value === 1) {
            this.codeBag = 4;
        } else if (e.target.value === 2) {
            this.codeBag = 3;
        } else {
            this.codeBag = 0;
        }
        console.log(this.codeBag);
    }

    getSmoke(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('smoke')) {
            this.codeSmoke = 7;
            this.enableNSmoke = false;
            this.enableSmoke = true;
        } else {
            this.enableSmoke = false;
            this.enableNSmoke = true;
            this.codeSmoke = 8;
        }
        return this.infoSup.push(this.codeSmoke);
    }

    getSpring(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('spring')) {
            this.codeSpring = 15;
            this.enableNSpring = false;
            this.enableSpring = true;
        } else {
            this.enableSpring = false;
            this.enableNSpring = true;
            this.codeSpring = 16;
        }
        return this.infoSup.push(this.codeSpring);
    }

    getAnimal(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('animal')) {
            this.codeAnimal = 5;
            this.enableAnimal = true;
            this.enableNAnimal = false;
        } else {
            this.codeAnimal = 6;
            this.enableNAnimal = true;
            this.enableAnimal = false;
        }
        return this.infoSup.push(this.codeAnimal);
    }

    /****************************** ****************************/

    add() {
        this.mode = 2;
        this.annonce = new AnnonceDto();
        this.itineraire = new Itineraire();
    }

    back() {
        this.ngOnInit();
    }

    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Annonce publiée avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastFail() {
        const toast = await this.toastCtrl.create({
            message: 'Annonce non publiée, veuillez ré-essayer',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    initialise() {
        localStorage.removeItem('placeD');
        localStorage.removeItem('positionD');
        localStorage.removeItem('placeA');
        localStorage.removeItem('positionA');
        localStorage.removeItem('dateD');
        localStorage.removeItem('heureD');
        localStorage.removeItem('dateA');
        localStorage.removeItem('heureA');
        this.itineraire = new Itineraire();
        this.annonce = new AnnonceDto();
        this.codeBag = 0;
        this.codeSmoke = 0;
        this.codeSpring = 0;
        this.codeAnimal = 0;
        this.infoSup = [];
        this.enableAnimal = false;
        this.enableNAnimal = false;
        this.enableSpring = false;
        this.enableNSpring = false;
        this.enableSmoke = false;
        this.enableNSmoke = false;
        this.prixreserv = 0;
        this.prixdu = 0;
        this.dateD = null;
        this.dateAr = null;
        this.heureD = null;
        this.heureAr = null;
        this.engins = null;
        this.PlaceA = [];
        this.PlaceM = [];
        this.buttonSaveClicked = false;
    }

    async save() {
        this.itineraire.latitude = +localStorage.getItem('lat');
        this.itineraire.longitude = +localStorage.getItem('lng');
        this.infoSup.push(this.codeBag);
        console.log('Latitude: ' + this.itineraire.latitude);
        console.log('Longitude: ' + this.itineraire.longitude);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Enregistrement en cours...',
        });
        await loading.present();
        this.buttonSaveClicked = true;
        if (this.annonce.prix == 0 || this.itineraire.dateDepart == null || this.annonce.idEngin == 0) {
            loading.dismiss();
            this.showButton = true;
            this.errorFields = 'Ce champ est obligatoire';
        } else {
            this.showButton = false;
            this.itineraireService.create(this.itineraire).subscribe(res => {
                if (res.status == 200) {
                    console.log(res.body);
                    this.annonce.dateDepart = res.body.dateDepart;
                    this.annonce.idItineraire = res.body.idItineraire;
                    this.annonce.idUtilisateur = this.id;
                    console.log(this.annonce);
                    this.annonceService.create(this.annonce).subscribe((result) => {
                        if (result.status == 200) {
                            loading.dismiss();
                            this.router.navigate(['/home-conducteur']);
                            this.showToast();
                            /********** Enregistrement des infos supp *********/
                            for (let i of this.infoSup) {
                                console.log(i);
                                this.infoSupps = this.infoSups.find(x => x.idInformationsSupplementaires == i);
                                console.log(this.infoSupps);
                                this.infoSupp.libelleInformationsSupplementaires = this.infoSupps.libelleInformationsSupplementaires;
                                this.infoSupp.idAnnonce = result.body.idAnnonce;
                                this.infoSupp.idUtilisateur = result.body.idUtilisateur;
                                console.log(this.infoSupp.idAnnonce);
                                this.infoSuppService.create(this.infoSupp).subscribe(resp => {
                                    console.log(resp);
                                    this.initialise();
                                });
                            }
                        }

                    }, (error) => {
                        loading.dismiss();
                        this.showToastFail();
                    });
                }
            })
        }

    }


    edit(a: Annonce) {
        this.mode = 3;
        this.annonceService.getOne(a.idAnnonce).subscribe(data => {
            this.annonce = data;
            this.itineraireService.getOne(this.annonce.idItineraire).subscribe(result => {
                this.itineraire = result;
                this.ngOnInit();
            })
        })
    }

    update() {
        this.annonceService.update(this.annonce).subscribe(res => {
            this.itineraireService.update(this.itineraire).subscribe(result => {
                this.ngOnInit();
            })
        })
    }

    async delete(a: Annonce) {
        let alert = await this.alertCtrl.create({
            header: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer <strong>' + a.depart + '</strong>?',
            buttons: [
                {
                    text: 'Non',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel confirmed');
                    }
                },
                {
                    text: 'Oui',
                    handler: () => {
                        console.log('Oui');
                        this.annonceService.delete(a.idAnnonce).subscribe(res => {
                            this.itineraireService.getOne(a.idItineraire).subscribe(result => {
                                this.onSaveSuccess(result);
                            });
                        });
                    }
                }
            ]
        });
        await alert.present();
    }


}
