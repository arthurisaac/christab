import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Demande} from "./demande.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {
    AlertController,
    LoadingController,
    NavController,
    Platform,
    PopoverController,
    ToastController
} from "@ionic/angular";
import {ItineraireService} from "../itineraire/itineraire.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {ActivatedRoute, Router} from "@angular/router";
import {DemandeService} from "./demande.service";
import {AnnonceDto, UserAnnonce} from "../annonce/annonce.model";
import {Subscription} from "rxjs";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {AnnonceService} from "../annonce/annonce.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {AuthenticationService} from "../authentication.service";
import {LoginService} from "../login/login.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Recherche} from "../recherche/recherche.model";
import {RechercheService} from "../recherche/recherche.service";
import {Engin} from "../engin/engin.model";
import {AvisDto} from "../avis/avis.model";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {EnginService} from "../engin/engin.service";
import {AvisService} from "../avis/avis.service";
import {DatePipe} from "@angular/common";
import {Reservation, UserItin} from "../reservation/reservation.model";
import {ReservationService} from "../reservation/reservation.service";
import {
    AdditionnalInfos, CommandDto,
    PaiementService,
    TouchCustomDto,
    TouchMoovCallBackRequestDto
} from "../paiement/paiement.service";
import {Paiement} from "../paiement/paiement.model";
import {Decompte} from "../decompte/decompte.model";
import {DecompteService} from "../decompte/decompte.service";
import {TypeAvis} from "../type-avis/type-avis.model";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {AdminService} from "../admin/admin.service";
import {Admin} from "../admin/admin.model";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import {GoogleMap, GoogleMaps, GoogleMapsEvent, LatLng} from "@ionic-native/google-maps";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";

/******** Pour la carte ******/
declare const google;

@Component({
    selector: 'app-demande',
    templateUrl: './demande.page.html',
    styleUrls: ['./demande.page.scss'],
})
export class DemandePage implements OnInit, AfterViewInit {

    @ViewChild('mapD') mapElement: ElementRef;

    demandes: Demande;
    demande: Demande = new Demande();
    reservations: Reservation;
    reservation: Reservation = new Reservation();
    itineraires: Itineraire;
    itineraire: Itineraire = new Itineraire();
    subscription: Subscription;
    subscriptionR: Subscription;
    annonces: AnnonceDto;
    annonce: AnnonceDto = new AnnonceDto();
    avis: AvisDto;
    utilisateurs: UtilisateurDto;
    utilisateurRecipient: UtilisateurDto;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    paiement: Paiement = new Paiement();
    decompte: Decompte = new Decompte();
    customer: CommandDto = new CommandDto(); // COMMAND = new COMMAND();
    touchCustom: TouchCustomDto = new TouchCustomDto();
    customMoov: TouchMoovCallBackRequestDto = new TouchMoovCallBackRequestDto();
    infoConducteurs: UtilisateurDto;
    annoncesWUAIAv: Array<any> = [];
    annoncesWUAIAvObj: any;
    recherche: Recherche = new Recherche();
    id: number = 0;
    idTF: number = 0;
    choixA: string = 'A';
    showA: boolean = false;
    choixM: string = 'M';
    showM: boolean = false;
    choixU: string = 'U';
    showU: boolean = false;
    choixV: string = 'V';
    showV: boolean = false;
    mode: number;
    val: string;
    valTC: string = 'TC';
    valSearchUD: string = 'SUD';
    valSearchUA: string = 'SUA';
    valSearchVD: string = 'SVD';
    valSearchVA: string = 'SVA';
    engin: string;
    voyage: string;
    images: any;
    icones: Array<any> = [];
    engins: Engin;
    nbOrange: number = 0;
    nbMobicash: number = 0;
    /****** Recherche ******/
    totalFiltre: number = 0;
    dateDep: boolean = false;
    dateArr: boolean = false;

    /********* pour la gestion des infos supplémentaires *********/
    infs: Array<any> = [];
    infoSup: InformationsSupplementaires[] = new Array();
    infoSupTest: Array<InformationsSupplementaires> = [];
    infoSupR: Array<InformationsSupplementaires> = [];

    infoSups: InformationsSupplementaires[] = [];
    informationsSupplementaires: InformationsSupplementaires;
    infoSupps: InformationsSupplementaires = new InformationsSupplementaires();
    infoSupl: InformationsSupplementaires = new InformationsSupplementaires();

    /******* Informations du conducteur *******/
    user: Admin = new Admin();

    /********** pour la gestion des notes *********/
    typeAvi: TypeAvis = new TypeAvis();
    typeAvis: {libelleTypeAvis?: string, note?: number}[] = new Array();
    typeAv = {libelleTypeAvis:'', note: 0};
    typeAs = [];
    typeAvisTotal = [];
    total: number = 0;

    /******* Demande d'un trajet *******/
    infoSupp: number[] = new Array();
    codeBag: number;
    codeSpring: number;
    codeSmoke: number;
    codeAnimal: number;
    showButton: boolean = false;
    errorDate: string;
    errorHeure: string;
    errorDateD: string;
    prixreserv: number = 0;
    prixdu: number = 0;
    prixreservD: number = 0;
    prixduD: number = 0;

    typeEngins: Array<any> = [{id: 1, val: "Auto"}, {id: 2, val: "Moto"}];
    PlaceA: Array<any> = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}, {val: 10}];
    PlaceM: Array<any> = [{val: 1}, {val: 2}];
    place: number;
    dep: String;
    arr: String;
    annonceDetails: any;
    uai: UserAnnonce = new UserAnnonce();
    showIconesInfoSupp: boolean = false;
    showButtons: number;
    dateD: string;
    dateAr: string;
    heureD: string;
    heureAr: string;
    motD: string;
    motA: string;
    prix: number;
    enableRadioD1: boolean = false;
    enableRadioD2: boolean = false;
    enableRadioA1: boolean = false;
    enableRadioA2: boolean = false;
    enableSmoke: boolean;
    enableNSmoke: boolean;
    enableSpring: boolean = false;
    enableNSpring: boolean = false;
    enableAnimal: boolean = false;
    enableNAnimal: boolean = false;
    enableSmokeD: boolean;
    enableNSmokeD: boolean;
    enableSpringD: boolean = false;
    enableNSpringD: boolean = false;
    enableAnimalD: boolean = false;
    enableNAnimalD: boolean = false;
    allAdressCheckD: boolean;
    allAdressCheckA: boolean;
    allDateCheckD: boolean;
    allDateCheckA: boolean;
    /******** Paiement ***********/
    showBtn: boolean = false;
    errorCustomer: string;
    errorOtp: string;
    checkO: boolean = false;
    checkM: boolean = false;
    checkedO: boolean = false;
    checkedM: boolean = false;
    modePaiement: number = 0;

    photo: any;
    showError: boolean = false;
    existReserv: boolean;
    errorDemande: string;

    /******** Notification ******/
    push: OneSignalPushNotification = new OneSignalPushNotification();
    pushData: any;

    /***** Pour la carte ******/
    map: GoogleMap;
    public lat: number;
    public lng: number;
    public posD: {
        lat: number,
        lng: number
    };
    public posA: {
        lat: number,
        lng: number
    }
    position: any;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;

    /******** Pour afficher la taille du tableau (objet) *******/
    objectKeys = Object.keys;
    buttonSaveClicked: boolean;
    days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sept', 'Oct', 'Nov', 'Dec'];
    hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 0];
    doneBtn = 'Ok';
    backBtn = 'Retour';
    reservationNumber: number;
    totalNote: number;
    avisNumber: number;


    constructor(
        private alertCtrl: AlertController,
        private toastCtrl: ToastController,
        private popCtrl: PopoverController,
        private loadingCtrl: LoadingController,
        private itineraireService: ItineraireService,
        private demandeService: DemandeService,
        private reservationService: ReservationService,
        private annonceService: AnnonceService,
        private utilisateurService: UtilisateurService,
        private rechercheService: RechercheService,
        private enginService: EnginService,
        private typeAvisService: TypeAvisService,
        private avisService: AvisService,
        private loginService: LoginService,
        private paiementService: PaiementService,
        private decompteService: DecompteService,
        private informationsSuppService: InformationsSupplementairesService,
        private userService: AdminService,
        private navCtrl: NavController,
        private sanitizer: DomSanitizer,
        private datePipe: DatePipe,
        private authService: AuthenticationService,
        private notificationService: NotificationsService,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        private router: Router,
        private route: ActivatedRoute,
        public platform: Platform
    ) {
    }


    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.getActualPosition();
        this.clearLocalP();
        this.infoSups = this.informationsSuppService.infoSupplementaires;
        this.totalFiltre = 0;
        this.subscription = this.route.params.subscribe((params) => {
            if (params['id'] != null && params['d'] != null) {
                this.engin = params['id'];
                this.voyage = params['d'];
            }
        });
        this.val = this.route.snapshot.paramMap.get('id');
        this.recherche = new Recherche();
        this.demande = new Demande();
        // console.log('Val: '+this.val);


        /*********************************** Recherche venant du composant recherche ou du trajet-carte ******************************************/
        if (this.router.getCurrentNavigation().extras.state) {
            this.annoncesWUAIAv = this.router.getCurrentNavigation().extras.state.annoncesWUAIAv;
            if (this.annoncesWUAIAv !== null && this.annoncesWUAIAv !== undefined && this.annoncesWUAIAv.length > 0) {
                console.log('******** Résultat venant du composant trajet-carte ******');
                this.mode = 1;
                for (let a of this.annoncesWUAIAv) {
                    this.annonces = a[0];
                    this.showInfoS(a);
                }
                if ((localStorage.getItem('showU').indexOf('false')) >= 0) {
                    this.showV = true;
                    console.log('***** Retour carte Voyage ******');
                } else { // if (this.annonces && this.annonces.lieuDepart !== null) {
                    this.showU = true;
                    console.log('***** Retour carte Urbain ******');
                }
                if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                    this.showA = true;
                    console.log('***** Retour carte Auto ******');
                } else {
                    this.showM = true;
                    console.log('***** Retour carte Moto ******');
                }
            }
            else if (this.router.getCurrentNavigation().extras.state.detailT) {
                console.log('***************** cas de la notification ************');
                this.annoncesWUAIAvObj = this.router.getCurrentNavigation().extras.state.detailT;
                if (this.annoncesWUAIAvObj !== null) {
                    console.log(this.annoncesWUAIAvObj);
                    this.mode = 6;
                    /********************** Récupération des données des différents objets *************************/
                    this.utilisateurService.getOne(this.annoncesWUAIAvObj[0]).subscribe(data => {
                        this.utilisateurs = data;
                        this.photo = this.utilisateurService.fileUrl + this.utilisateurs.photo;
                    });
                    this.annonces = this.annoncesWUAIAvObj[1];
                    console.log(this.annonces);
                    this.prixreserv = (this.annonces.prix * 1) / 4;
                    this.prixdu = (this.annonces.prix * 3) / 4;
                    this.itineraires = this.annoncesWUAIAvObj[2];
                    console.log(this.itineraires);
                    this.avis = this.annoncesWUAIAvObj[3];
                    console.log(this.avis);

                    this.paiement.idUtilisateur = this.id;
                    this.paiement.montantPaiement = this.prixreserv; // a.prix;
                    this.push.idU = this.annonces.idUtilisateur;

                    this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
                    this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
                    this.reservation.idUtilisateur = this.id;
                    this.reservation.idItineraire = this.itineraires.idItineraire;
                    this.reservation.idDriver = this.annonces.idUtilisateur;
                    this.reservation.destination = this.annonces.destination;
                    this.reservation.destination = this.annonces.lieuArrivee;
                    this.decompte.montantDecompte = this.prixreserv;
                    this.decompte.idUtilisateur = this.annonces.idUtilisateur;
                }
            }
            else {
                if (this.router.getCurrentNavigation().extras.state && this.val === this.valTC) {
                    console.log('******** Résultat venant du composant trajet carte ******');
                    this.annoncesWUAIAvObj = this.router.getCurrentNavigation().extras.state.data;
                    this.showTrajetForSave(this.annoncesWUAIAvObj);
                    this.annoncesWUAIAv = this.router.getCurrentNavigation().extras.state.items;
                    if (this.annoncesWUAIAvObj[0] && this.annoncesWUAIAvObj[0].depart !== null) {
                        this.showV = true;
                        console.log('***** Retour carte Voyage ******');
                    } else if (this.annoncesWUAIAvObj[0] && this.annoncesWUAIAvObj[0].lieuDepart !== null) {
                        this.showU = true;
                        console.log('***** Retour carte Urbain ******');
                    }
                    if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                        this.showA = true;
                        console.log('***** Retour carte Auto ******');
                    } else {
                        this.showM = true;
                        console.log('***** Retour carte Moto ******');
                    }
                }
                else {
                    /*************==== Résultat venant de la recherche dune localité de départ sur la carte (Urbain) ====************/

                    if (this.router.getCurrentNavigation().extras.state && this.val === this.valSearchUD) {
                        console.log('******** Résultat venant de la recherche dune localité de départ sur la carte ******');
                        this.showU = true;
                        this.itineraire.typeVoyage = 'urbain';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                        /************* Urbain Départ Recherche *********/
                        this.position = this.router.getCurrentNavigation().extras.state.result;
                            // console.log(this.position);
                            this.mode = 2;
                            console.log('======== Retour Recherche urbain départ ======');

                            if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.recherche.lieuDepart = localStorage.getItem('placeD');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeD');
                                localStorage.removeItem('positionD');
                                this.recherche.lieuDepart = this.position.split('(')[0];
                            }
                            this.recherche.lieuArrivee = localStorage?.getItem('placeA');
                            console.log(this.recherche.lieuDepart);
                            this.recherche.dateDepart = localStorage?.getItem('dateD');
                            this.recherche.heureDepart = localStorage?.getItem('heureD');
                            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                            this.recherche.heureArrivee = localStorage?.getItem('heureAr');

                        /************* Urbain Départ Demande *********/
                    }
                    else if (this.router.getCurrentNavigation().extras.state && this.val === 'SUDD') {
                        console.log('******** Résultat venant de la recherche dune localité de départ sur la carte ******');
                        this.showU = true;
                        this.itineraire.typeVoyage = 'urbain';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                        /************* Urbain Départ Recherche *********/
                        this.position = this.router.getCurrentNavigation().extras.state.result;
                            console.log(this.position);
                            let pos = this.position.split('(', 2)[1];
                            this.mode = 11;
                            console.log('======== Retour Demande urbain départ ======');

                            if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.demande.lieuDepart = localStorage.getItem('placeD');
                                this.annonce.lieuDepart = localStorage.getItem('placeD');
                                this.itineraire.positionDepart = localStorage.getItem('positionD');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeD');
                                localStorage.removeItem('positionD');
                                this.demande.lieuDepart = this.position.split('(')[0];
                                this.annonce.lieuDepart = this.position.split('(')[0];
                                this.itineraire.positionDepart = pos.split(')',)[0];
                            }
                            this.demande.lieuArrivee = localStorage?.getItem('placeA');
                            this.annonce.lieuArrivee = localStorage?.getItem('placeA');
                            this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                            console.log(this.demande.depart);
                            console.log(this.itineraire.positionDepart);
                            this.itineraire.dateDepart = localStorage?.getItem('dateD');
                            this.itineraire.heureDepart = localStorage?.getItem('heureD');
                            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');

                    }
                    /***************==== Résultat d'une localité d'arrivée sur la carte (Urbain) ====***************/
                    else if (this.router.getCurrentNavigation().extras.state && this.val === this.valSearchUA) {
                        this.showU = true;
                        this.itineraire.typeVoyage = 'urbain';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                        /************* Urbain Arrivée Recherche *********/
                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            this.mode = 2;
                            console.log('======== Retour Recherche urbain arrivée ======');

                            if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.recherche.lieuArrivee = localStorage.getItem('placeA');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeA');
                                localStorage.removeItem('positionA');
                                this.recherche.lieuArrivee = this.position.split('(')[0];
                            }
                            this.recherche.lieuDepart = localStorage?.getItem('placeD');
                            this.recherche.dateDepart = localStorage?.getItem('dateD');
                            this.recherche.heureDepart = localStorage?.getItem('heureD');
                            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                            this.recherche.heureArrivee = localStorage?.getItem('heureAr');
                        /************* Urbain Arrivée Demande *********/
                    }

                    else if (this.router.getCurrentNavigation().extras.state && this.val === 'SUAD') {
                        this.showU = true;
                        this.itineraire.typeVoyage = 'urbain';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            let pos = this.position.split('(', 2)[1];
                            // console.log(this.position);
                            this.mode = 11;
                            console.log('======== Retour Demande urbain arrivée ======');

                            if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.demande.lieuArrivee = localStorage.getItem('placeA');
                                this.annonce.lieuArrivee = localStorage.getItem('placeA');
                                this.itineraire.positionArrivee = localStorage.getItem('positionA');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeA');
                                localStorage.removeItem('positionA');
                                this.demande.lieuArrivee = this.position.split('(')[0];
                                this.annonce.lieuArrivee = this.position.split('(')[0];
                                this.itineraire.positionArrivee = pos.split(')',)[0];
                            }
                            this.demande.lieuDepart = localStorage?.getItem('placeD');
                            this.annonce.lieuDepart = localStorage?.getItem('placeD');
                            this.itineraire.positionDepart = localStorage?.getItem('positionD');
                            console.log(this.demande.lieuArrivee);
                            console.log(this.itineraire.positionArrivee);
                            this.itineraire.dateDepart = localStorage?.getItem('dateD');
                            this.itineraire.heureDepart = localStorage?.getItem('heureD');
                            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');

                    }
                    /************==== Résultat d'une localité de départ sur la carte (Voyage) ====************/
                    else if (this.router.getCurrentNavigation().extras.state && this.val === this.valSearchVD) {
                        this.showV = true;
                        this.itineraire.typeVoyage = 'voyage';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                        /************* Voyage Départ Recherche *********/
                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            // console.log(this.position);
                            this.mode = 2;
                            console.log('======== Retour Recherche voyage départ ======');

                            if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.recherche.depart = localStorage.getItem('placeD');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeD');
                                localStorage.removeItem('positionD');
                                this.recherche.depart = this.position.split('(')[0];
                            }
                            this.recherche.destination = localStorage?.getItem('placeA');
                            this.recherche.dateDepart = localStorage?.getItem('dateD');
                            this.recherche.heureDepart = localStorage?.getItem('heureD');
                            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                            this.recherche.heureArrivee = localStorage?.getItem('heureAr');
                        /************* Voyage Départ Demande *********/
                    }

                    else if (this.router.getCurrentNavigation().extras.state && this.val === 'SVDD') {
                        this.showV = true;
                        this.itineraire.typeVoyage = 'voyage';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            let pos = this.position.split('(', 2)[1];
                            // console.log(this.position);
                            this.mode = 11;
                            console.log('======== Retour Demande voyage départ ======');

                            if (localStorage.getItem('placeD') !== null && !(localStorage.getItem('placeD').indexOf(undefined) >= 0) && localStorage.getItem('placeD')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.demande.depart = localStorage.getItem('placeD');
                                this.annonce.depart = localStorage.getItem('placeD');
                                this.itineraire.positionDepart = localStorage.getItem('positionD');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeD');
                                localStorage.removeItem('positionD');
                                this.demande.depart = this.position.split('(')[0];
                                this.annonce.depart = this.position.split('(')[0];
                                this.itineraire.positionDepart = pos.split(')',)[0];
                            }
                            this.demande.destination = localStorage?.getItem('placeA');
                            this.annonce.destination = localStorage?.getItem('placeA');
                            this.itineraire.positionArrivee = localStorage?.getItem('positionA');
                            console.log(this.demande.depart);
                            console.log(this.itineraire.positionDepart);
                            this.itineraire.dateDepart = localStorage?.getItem('dateD');
                            this.itineraire.heureDepart = localStorage?.getItem('heureD');
                            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');

                    }
                    /***************==== Résultat d'une localité d'arrivée sur la carte (Voyage) ====**********/
                    else if (this.router.getCurrentNavigation().extras.state && this.val === this.valSearchVA) {
                        this.showV = true;
                        this.itineraire.typeVoyage = 'voyage';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                        /************* Voyage Arrivée Recherche *********/
                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            // console.log(this.position);
                            this.mode = 2;
                            console.log('======== Retour Recherche voyage arrivée ======');

                            if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.recherche.destination = localStorage.getItem('placeA');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeA');
                                localStorage.removeItem('positionA');
                                this.recherche.destination = this.position.split('(')[0];
                            }
                            this.recherche.depart = localStorage?.getItem('placeD');
                            this.recherche.dateDepart = localStorage?.getItem('dateD');
                            this.recherche.heureDepart = localStorage?.getItem('heureD');
                            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                            this.recherche.heureArrivee = localStorage?.getItem('heureAr');
                        /************* Voyage Arrivée Demande *********/
                    }
                    else if (this.router.getCurrentNavigation().extras.state && this.val === 'SVAD') {
                        this.showV = true;
                        this.itineraire.typeVoyage = 'voyage';
                        if ((localStorage.getItem('showA').indexOf('true')) >= 0) {
                            this.showA = true;
                            this.itineraire.typeLocalite = 'Auto';
                            this.recherche.typeEngin = 'Auto';
                        } else {
                            this.showM = true;
                            this.itineraire.typeLocalite = 'Moto';
                            this.recherche.typeEngin = 'Moto';
                        }

                            this.position = this.router.getCurrentNavigation().extras.state.result;
                            let pos = this.position.split('(', 2)[1];
                            // console.log(this.position);
                            this.mode = 11;
                            console.log('======== Retour Demande voyage arrivée ======');

                            if (localStorage.getItem('placeA') !== null && !(localStorage.getItem('placeA').indexOf(undefined) >= 0) && localStorage.getItem('placeA')?.length > 0) {
                                console.log('****** Récupération du stockage local *******');
                                this.demande.destination = localStorage.getItem('placeA');
                                this.annonce.destination = localStorage.getItem('placeA');
                                this.itineraire.positionArrivee = localStorage.getItem('positionA');
                            } else {
                                console.log('****** Récupération direct *******');
                                localStorage.removeItem('placeA');
                                localStorage.removeItem('positionA');
                                this.demande.destination = this.position.split('(')[0];
                                this.annonce.destination = this.position.split('(')[0];
                                this.itineraire.positionArrivee = pos.split(')',)[0];
                            }
                            this.demande.depart = localStorage?.getItem('placeD');
                            this.annonce.depart = localStorage?.getItem('placeD');
                            this.itineraire.positionDepart = localStorage?.getItem('positionD');
                            console.log(this.demande.destination);
                            console.log(this.itineraire.positionArrivee);
                            this.itineraire.dateDepart = localStorage?.getItem('dateD');
                            this.itineraire.heureDepart = localStorage?.getItem('heureD');
                            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');

                    }
                }
            }
        }
        /********************* Retour simple du composant recherche-carte lors dune recherche *****************/
        else if (this.val === 'SUD') {
            console.log('******** Retour simple dune recherche pour une recherche UD ******');
            this.showU = true;
            this.itineraire.typeVoyage = 'urbain';
            this.mode = 2;
            if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                this.showA = true;
                this.itineraire.typeLocalite = 'Auto';
                this.recherche.typeEngin = 'Auto';
            } else {
                this.showM = true;
                this.itineraire.typeLocalite = 'Moto';
                this.recherche.typeEngin = 'Moto';
            }
            this.recherche.lieuArrivee = localStorage?.getItem('placeA');
            this.recherche.dateDepart = localStorage?.getItem('dateD');
            this.recherche.heureDepart = localStorage?.getItem('heureD');
            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
            this.recherche.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SUA') {
                     console.log('******** Retour simple dune recherche pour une recherche UA ******');
                     this.showU = true;
                     this.itineraire.typeVoyage = 'urbain';
                     this.mode = 2;
                     if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                         this.showA = true;
                         this.itineraire.typeLocalite = 'Auto';
                         this.recherche.typeEngin = 'Auto';
                     } else {
                         this.showM = true;
                         this.itineraire.typeLocalite = 'Moto';
                         this.recherche.typeEngin = 'Moto';
                     }
                     this.recherche.lieuDepart = localStorage?.getItem('placeD');
                     this.recherche.dateDepart = localStorage?.getItem('dateD');
                     this.recherche.heureDepart = localStorage?.getItem('heureD');
                     this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                     this.recherche.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SVD') {
            console.log('******** Retour simple dune recherche pour une recherche VD ******');
            this.showV = true;
            this.itineraire.typeVoyage = 'voyage';
            this.mode = 2;
            if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                this.showA = true;
                this.itineraire.typeLocalite = 'Auto';
                this.recherche.typeEngin = 'Auto';
            } else {
                this.showM = true;
                this.itineraire.typeLocalite = 'Moto';
                this.recherche.typeEngin = 'Moto';
            }
            this.recherche.destination = localStorage?.getItem('placeA');
            this.recherche.dateDepart = localStorage?.getItem('dateD');
            this.recherche.heureDepart = localStorage?.getItem('heureD');
            this.recherche.dateArrivee = localStorage?.getItem('dateAr');
            this.recherche.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SVA') {
                      console.log('******** Retour simple dune recherche pour une recherche VA ******');
                      this.showV = true;
                      this.itineraire.typeVoyage = 'voyage';
                      this.mode = 2;
                      if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                          this.showA = true;
                          this.itineraire.typeLocalite = 'Auto';
                          this.recherche.typeEngin = 'Auto';
                      } else {
                          this.showM = true;
                          this.itineraire.typeLocalite = 'Moto';
                          this.recherche.typeEngin = 'Moto';
                      }
                      this.recherche.depart = localStorage?.getItem('placeD');
                      this.recherche.dateDepart = localStorage?.getItem('dateD');
                      this.recherche.heureDepart = localStorage?.getItem('heureD');
                      this.recherche.dateArrivee = localStorage?.getItem('dateAr');
                      this.recherche.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SUDD') {
            console.log('******** Retour simple dune Demande UD ******');
            this.showU = true;
            this.itineraire.typeVoyage = 'urbain';
            this.mode = 11;
            if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                this.showA = true;
                this.itineraire.typeLocalite = 'Auto';
                this.recherche.typeEngin = 'Auto';
            } else {
                this.showM = true;
                this.itineraire.typeLocalite = 'Moto';
                this.recherche.typeEngin = 'Moto';
            }
            this.itineraire.positionArrivee = localStorage?.getItem('positionA');
            this.demande.lieuArrivee = localStorage?.getItem('placeA');
            this.annonce.lieuArrivee = localStorage?.getItem('placeA');
            this.itineraire.dateDepart = localStorage?.getItem('dateD');
            this.itineraire.heureDepart = localStorage?.getItem('heureD');
            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SUAD') {
                      console.log('******** Retour simple dune Demande UA ******');
                      this.showU = true;
                      this.itineraire.typeVoyage = 'urbain';
                      this.mode = 11;
                      if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                          this.showA = true;
                          this.itineraire.typeLocalite = 'Auto';
                          this.recherche.typeEngin = 'Auto';
                      } else {
                          this.showM = true;
                          this.itineraire.typeLocalite = 'Moto';
                          this.recherche.typeEngin = 'Moto';
                      }
                      this.itineraire.positionDepart = localStorage?.getItem('positionD');
                      this.demande.lieuDepart = localStorage?.getItem('placeD');
                        this.annonce.lieuDepart = localStorage?.getItem('placeD');
                      this.itineraire.dateDepart = localStorage?.getItem('dateD');
                      this.itineraire.heureDepart = localStorage?.getItem('heureD');
                      this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                      this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SVDD') {
            console.log('******** Retour simple dune Demande VD ******');
            this.showV = true;
            this.itineraire.typeVoyage = 'voyage';
            this.mode = 11;
            if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                this.showA = true;
                this.itineraire.typeLocalite = 'Auto';
                this.recherche.typeEngin = 'Auto';
            } else {
                this.showM = true;
                this.itineraire.typeLocalite = 'Moto';
                this.recherche.typeEngin = 'Moto';
            }
            this.demande.destination = localStorage?.getItem('placeA');
            this.annonce.destination = localStorage?.getItem('placeA');
            this.itineraire.positionArrivee = localStorage?.getItem('positionA');
            this.itineraire.dateDepart = localStorage?.getItem('dateD');
            this.itineraire.heureDepart = localStorage?.getItem('heureD');
            this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
            this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (this.val === 'SVAD') {
                      console.log('******** Retour simple dune Demande VA ******');
                      this.showV = true;
                      this.itineraire.typeVoyage = 'voyage';
                      this.mode = 11;
                      if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                          this.showA = true;
                          this.itineraire.typeLocalite = 'Auto';
                          this.recherche.typeEngin = 'Auto';
                      } else {
                          this.showM = true;
                          this.itineraire.typeLocalite = 'Moto';
                          this.recherche.typeEngin = 'Moto';
                      }
                      this.demande.depart = localStorage?.getItem('placeD');
                      this.annonce.depart = localStorage?.getItem('placeD');
                      this.itineraire.positionDepart = localStorage?.getItem('positionD');
                      this.itineraire.dateDepart = localStorage?.getItem('dateD');
                      this.itineraire.heureDepart = localStorage?.getItem('heureD');
                      this.itineraire.dateArrivee = localStorage?.getItem('dateAr');
                      this.itineraire.heureArrivee = localStorage?.getItem('heureAr');
        }
        else if (localStorage?.getItem('showA')?.length > 0 && localStorage?.getItem('showU')?.length > 0) {
            console.log('******* Retour simple du composant trajet-carte ******');
            if ((localStorage?.getItem('showA').indexOf('true')) >= 0) {
                this.showA = true;
                this.recherche.typeEngin = 'Auto';
                console.log('***** Retour simple carte Auto ******');
            } else {
                this.showM = true;
                this.recherche.typeEngin = 'Moto';
                console.log('***** Retour simple carte Moto ******');
            }
            if ((localStorage?.getItem('showU').indexOf('true')) >= 0) {
                this.showU = true;
                this.itineraire.typeVoyage = 'urbain';
                console.log('***** Retour simple carte Urbain ******');
            } else {
                this.showV = true;
                this.itineraire.typeVoyage = 'voyage';
                console.log('***** Retour simple carte Voyage ******');
            }
            this.failSearch();
        }
        /*********************************** Liste des trajets auto urbain ******************************************/
        else if (this.engin.match(this.choixA) && this.voyage.match(this.choixU)) {
            console.log('********** Urbain Auto **********');
            this.mode = 1;
            this.showA = true;
            this.itineraire.typeLocalite = 'Auto';
            this.recherche.typeEngin = 'Auto';
            localStorage.setItem('showA', 'true');
            this.showU = true;
            localStorage.setItem('showU', 'true');
            this.itineraire.typeVoyage = 'urbain';
            this.recherche.typeVoyage = 'urbain';
            this.annonceService.getAllAU().subscribe(data => {
                console.log('********** Résultat **********');
                console.log(data);
                if (data.length > 0) {
                    this.annoncesWUAIAv = data;
                    // console.log(this.annoncesWUAIAv);
                    for (let a of this.annoncesWUAIAv) {
                        this.showInfoS(a);
                    }

                } else {
                    /*********************************** Liste de tous les trajets disponibles ******************************************/
                    console.log('******** Aucun résultat ******');
                    this.showA = true;
                    this.itineraire.typeLocalite = 'Auto';
                    this.showU = true;
                    this.recherche.typeEngin = 'Auto';
                    this.itineraire.typeVoyage = 'urbain';
                    this.failSearchAlert();
                }
            });
        }
        /*********************************** Liste des trajets auto voyage ******************************************/
        else {
            if (this.engin.match(this.choixA) && this.voyage.match(this.choixV)) {
                console.log('********** Voyage Auto ************');
                this.mode = 1;
                this.showA = true;
                this.itineraire.typeLocalite = 'Auto';
                this.recherche.typeEngin = 'Auto';
                localStorage.setItem('showA', 'true');
                this.showV = true;
                localStorage.setItem('showU', 'false');
                this.itineraire.typeVoyage = 'voyage';
                this.recherche.typeVoyage = 'voyage';
                this.annonceService.getAllAV().subscribe(data => {
                    if (data.length > 0) {
                        this.annoncesWUAIAv= data;
                        for (let a of this.annoncesWUAIAv) {
                            this.showInfoS(a);
                        }
                    } else {
                        /*********************************** Liste de tous les trajets disponibles ******************************************/
                        console.log('******** Aucun résultat ******');
                        this.showA = true;
                        this.itineraire.typeLocalite = 'Auto';
                        this.showV = true;
                        this.recherche.typeEngin = 'Auto';
                        this.itineraire.typeVoyage = 'voyage';
                        this.failSearchAlert();
                    }
                });
            } else {
                /*********************************** Liste des trajets moto urbain ******************************************/
                if ((this.engin.match(this.choixM)) && (this.voyage.match(this.choixU))) {
                    console.log('********* Urbain Moto *********');
                    this.mode = 1;
                    this.showU = true;
                    this.showM = true;
                    localStorage.setItem('showA', 'false');
                    localStorage.setItem('showU', 'true');
                    this.itineraire.typeLocalite = 'Moto';
                    this.itineraire.typeVoyage = 'urbain';
                    this.recherche.typeEngin = 'Moto';
                    this.recherche.typeVoyage = 'urbain';
                    this.annonceService.getAllMU().subscribe(data => {
                        if (data.length > 0) {
                            this.annoncesWUAIAv = data;
                            for (let a of this.annoncesWUAIAv) {
                                this.showInfoS(a);
                            }
                        } else {
                            /*********************************** Liste de tous les trajets disponibles ******************************************/
                            console.log('******** Aucun résultat ******');
                            this.showU = true;
                            this.showM = true;
                            this.recherche.typeEngin = 'Moto';
                            this.itineraire.typeVoyage = 'urbain';
                            this.itineraire.typeLocalite = 'Moto';
                            this.failSearchAlert();
                        }
                    });
                }
                /*********************************** Liste des trajets moto voyage ******************************************/
                else if ((this.engin.match(this.choixM)) && (this.voyage.match(this.choixV))) {
                    console.log('********** Voyage Moto ***********');
                    this.mode = 1;
                    this.showV = true;
                    this.showM = true;
                    localStorage.setItem('showA', 'false');
                    localStorage.setItem('showU', 'false');
                    this.itineraire.typeLocalite = 'Moto';
                    this.itineraire.typeVoyage = 'voyage';
                    this.recherche.typeEngin = 'Moto';
                    this.recherche.typeVoyage = 'voyage';
                    this.annonceService.getAllMV().subscribe(data => {
                        if (data.length > 0) {
                            this.annoncesWUAIAv = data;
                            for (let a of this.annoncesWUAIAv) {
                                this.showInfoS(a);
                            }
                        } else {
                            /*********************************** Liste de tous les trajets disponibles ******************************************/
                            console.log('******** Aucun résultat ******');
                            this.showV = true;
                            this.showM = true;
                            this.recherche.typeEngin = 'Moto';
                            this.itineraire.typeVoyage = 'voyage';
                            this.itineraire.typeLocalite = 'Moto';
                            this.failSearchAlert();
                        }
                    });
                } else {

                }
            }
        }
    }

    ngAfterViewInit() {
        this.getLocation();
    }

    prec() {
        console.log('Initialisation du localStorage');
        localStorage.removeItem('lat');
        localStorage.removeItem('lng');
        localStorage.removeItem('showA');
        if (this.idTF == 1) {
            if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixU)) || (this.showA && this.showU)) {
                console.log('******* Retour Conducteur Auto Urbain (Recherche) ******');
                this.router.navigate(['engin', 'U', 'p']);
            } else if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixV)) || (this.showA && this.showV)) {
                console.log('******* Retour Conducteur Auto Voyage (Recherche) ******');
                this.router.navigate(['engin', 'V', 'p']);
            } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixU)) || (this.showM && this.showU)) {
                console.log('******* Retour Conducteur Moto Urbain (Recherche) ******');
                this.router.navigate(['engin', 'U', 'p']);
            } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixV)) || (this.showM && this.showV)) {
                console.log('******* Retour Conducteur Moto Voyage (Recherche) ******');
                this.router.navigate(['engin', 'V', 'p']);
            }
        } else {
            if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixU)) || (this.showA && this.showU)) {
                console.log('******* Retour Passager Auto Urbain ******');
                this.router.navigate(['engin', 'U']);
            } else if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixV)) || (this.showA && this.showV)) {
                console.log('******* Retour Passager Auto Voyage ******');
                this.router.navigate(['engin', 'V']);
            } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixU)) || (this.showM && this.showU)) {
                console.log('******* Retour Passager Moto Urbain ******');
                this.router.navigate(['engin', 'U']);
            } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixV)) || (this.showM && this.showV)) {
                console.log('******* Retour Passager Moto Voyage ******');
                this.router.navigate(['engin', 'V']);
            }
        }

    }


    trustImage(item: any) {
        return this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + item);
    }

    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Notification envoyé au conducteur pour confirmation',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastFailed () {
        const toast = await this.toastCtrl.create({
            message: 'Tentative échouée',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    trackById(index, inf) {
        return inf.id;
    }

    showInfoS(a: object) {
        let dataTest: any;
        this.informationsSuppService.getAllByUAn(a[0].idUtilisateur, a[0].idAnnonce).subscribe(data => {
            dataTest = data;
            if (Object.keys(data).length) {
                this.showIconesInfoSupp = true;
                dataTest.forEach(info => {
                    if (Object.keys(info).length && info.valueOf().idAnnonce) {
                        for (let inf of this.infoSups) {
                            if ((info.valueOf().idAnnonce == a[0].idAnnonce) && info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                                let ico = {
                                    id: info.valueOf().idAnnonce,
                                    val: {val2: inf.iconeInformationsSupplementaires,}
                                };
                                this.icones.push(ico);
                                a[4] = this.icones;
                            }
                        }
                    } else {
                        a[4] = [];
                    }
                });
            } else {
                this.showIconesInfoSupp = false;
            }
        });
        this.icones = [];

    }

    transformHour(h) {
      let hString = new Date(h);
      let hFinal = this.datePipe.transform(hString, 'HH:mm');
      console.log(hFinal);

    }

    getAll() {
        this.demandeService.getAll().subscribe(data => {
            this.demandes = data;
        });
        this.annonceService.getAllWUAIAv().subscribe(data => {
            if (data.length > 0) {
                this.annoncesWUAIAv= data;
                for (let a of this.annoncesWUAIAv) {
                    this.annonces = a[0];
                    let p = a[1].photo;
                    if (p != null) {
                        let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                        this.images = sanitizedUrl;
                    }
                    this.utilisateurs = a[1];
                    this.itineraires = a[2];
                    this.showInfoS(a);
                }
            } else {
                this.failSearch();
            }
        });


    }

    async failSearch() {
        let alert = await this.alertCtrl.create({
            header: 'Aucun résultat',
            message: 'Aucun résultat disponible, veuillez faire une demande de covoiturage!',
            translucent: true,
            animated: true,
            buttons: [{
                text: 'Ok',
                handler: (data) => {
                    this.mode = 1;
                }
            }]
        });
        await alert.present();
    }

    async failSearchAlert() {
        let alert = await this.alertCtrl.create({
            header: 'Résultat',
            message: 'Aucun résultat ne correspond à votre demande, ' +
                'veuillez donc consulter la liste des trajets disponible ou' +
                ' effectuer une recherche!',
            translucent: true,
            animated: true,
            buttons: [{
                text: 'Ok',
                handler: (data) => {
                    this.mode = 1;
                    this.getAll();
                }
            }]
        });
        await alert.present();
    }

    async failRechercheAlert() {
        let alert = await this.alertCtrl.create({
            header: 'Alerte',
            message: 'Aucun résultat ne correspond à votre demande, veuillez consulter la liste des trajets disponibles ',
            translucent: true,
            animated: true,
            buttons: [{
                text: 'Ok',
                handler: (data) => {
                     this.mode = 2;
                }
            }]
        });
        await alert.present();
    }

    /****************************************** Recherche en fonction des filtres ********************************/

    rechercher() {
        if(this.showA) {
            this.recherche.typeEngin = 'Auto';
        } else {
            this.recherche.typeEngin = 'Moto';
        }
        if(this.showU) {
            this.recherche.typeVoyage = 'urbain';
        } else {
            this.recherche.typeVoyage = 'voyage';
        }
        console.log(this.recherche);
        this.rechercheService.getAllWFilters(this.recherche).subscribe(data => {
            console.log(data);
            if (data !== null && Object.keys(data).length > 0) {
                this.mode = 1;
                this.annoncesWUAIAv = data;
                this.initialise();
            } else {
                this.failRechercheAlert();
            }
        });
    }

    backRechercher() {
        this.ngOnInit();
    }

    backInfo() {
        this.mode = 3;
        if (this.itineraires.positionDepart !== null && this.itineraires.positionArrivee !== null) {
            this.loadMap(this.itineraires.positionDepart, this.itineraires.positionArrivee);
        } else if (this.annonces.lieuDepart !== null && this.annonces.lieuArrivee) {
                this.loadMapWGeocode(this.annonces.lieuDepart, this.annonces.lieuArrivee);
        } else if (this.annonces.depart !== null && this.annonces.destination) {
                this.loadMapWGeocode(this.annonces.depart, this.annonces.destination);
        } else {
          console.log('===========Affichage de la carte sans direction=======');
          this.loadMapS();
        }
    }

    selectRDep(e: any) {
        console.log(e);
    }

    /******************************************* Gestion de la liste ordonnée *******************************/
    async filtreView(e: MouseEvent) {
        const popover = await this.popCtrl.create({
            cssClass: 'my-popover-class',
            component: PopoverPage,
            backdropDismiss: true,
            event: e,
            translucent: true
        });
        popover.present();
        /******************************** Clique d'un élément du popover(liste déroulante) ************************************/
        return popover.onDidDismiss().then((res: any) => {
            let id = null;
            if (res.data != undefined) {
                id = res.data;
                if (id == 1) {
                    console.log('************* Par prix ascendant ************');
                    this.trajetPrA();
                } else if (id == 2) {
                    console.log('************* Par prix descendant ************');
                    this.trajetPrD();
                } else {
                    if (id == 3) {
                        console.log('************* Par place ascendante ************');
                        this.trajetPlA();
                    } else if (id == 4) {
                        console.log('************* Par place descendante ************');
                        this.trajetPlD()
                    } else {
                        if (id == 5) {
                            console.log('************* Par date ascendante ************');
                            this.trajetDA();
                        } else {
                            console.log('************* Par date descendante ************');
                            this.trajetDD();
                        }
                    }
                }
            }
        });
    }

    trajetPrA() {
        this.annonceService.getAllByPriceAsc().subscribe(data => {
            this.annoncesWUAIAv = data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a;
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a.utilisateur;
                this.itineraires = a.itineraire;

                this.showInfoS(a);
            }
        });
    }

    trajetPrD() {
        this.annonceService.getAllByPriceDesc().subscribe(data => {
            this.annoncesWUAIAv= data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];

                this.showInfoS(a);
            }
        });
    }

    trajetPlA() {
        this.annonceService.getAllByPlaceAsc().subscribe(data => {
            this.annoncesWUAIAv= data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];

                this.showInfoS(a);
            }
        });
    }

    trajetPlD() {
        this.annonceService.getAllByPlaceDesc().subscribe(data => {
            this.annoncesWUAIAv= data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                let p = a[1].photo;
                if (p != null) {
                    console.log(this.images);
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];

                this.showInfoS(a);
            }
        });
    }

    trajetDA() {
        this.annonceService.getAllByDateAsc().subscribe(data => {
            this.annoncesWUAIAv= data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                let p = a[1].photo;
                if (p != null) {
                    console.log(this.images);
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];

                this.showInfoS(a);
            }

        });
    }

    trajetDD() {
        this.annonceService.getAllByDateDesc().subscribe(data => {
            this.annoncesWUAIAv= data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                let p = a[1].photo;
                if (p != null) {
                    console.log(this.images);
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];

                this.showInfoS(a);
            }
        });
    }

    /* ========================== Pour récupérer la sélection du  type d'engin =========================== */
    selectRTE(e: any) {
        if (e.detail.value.match('Auto')) {
            this.place = 1;
            this.showIconesInfoSupp = true;
        } else {
            this.place = 2;
            this.showIconesInfoSupp = false;
        }
        this.recherche.typeEngin = e.detail.value;
    }

    /*************************************************==== Recherche ====*********************************************/

    /***************** Pour ré-initialiser les champs ************/
    initialise() {
      // console.log('********** Initialisation *************');
      this.totalFiltre = 0;
      console.log(this.totalFiltre);
      this.allAdressCheckD = false;
      this.allAdressCheckA = false;
      this.allDateCheckD = false;
      this.allDateCheckA = false;
        localStorage.removeItem('placeD');
        localStorage.removeItem('positionD');
        localStorage.removeItem('placeA');
        localStorage.removeItem('positionA');
        localStorage.removeItem('dateD');
        localStorage.removeItem('heureD');
        localStorage.removeItem('dateAr');
        localStorage.removeItem('heureAr');
        this.recherche = new Recherche();
        this.errorDate = '';
        this.showButton = false;
        this.dateD = '';
        this.dateAr = '';
        this.heureD = '';
        this.heureAr = '';
        this.motD = null;
        this.motA = null;
        this.prix = null;
        this.enableRadioD1 = false;
        this.enableRadioA1 = false;
        this.enableSpring = false;
        this.enableNSpring = false;
        this.enableSmoke = false;
        this.enableNSmoke = false;
        this.enableAnimal = false;
        this.enableNAnimal = false;
        this.dateDep = false;
        this.dateArr = false;


    }

    selectRP(e: any) {
        this.recherche.nombrePersonne = e.detail.value;
        if (e.detail.value > 0) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
    }

    clearLocalP() {
        console.log('******** Suppression des données non définies dans localStorage ********');
        if (localStorage.getItem('placeD') !== null && localStorage?.getItem('placeD').indexOf(undefined) >= 0) {
            console.log('********* Suppression départ *********');
            localStorage.removeItem('placeD');
            localStorage.removeItem('positionD');
        } else if (localStorage.getItem('placeA') !== null && localStorage?.getItem('placeA').indexOf(undefined) >= 0) {
            console.log('********* Suppression arrivée *********');
            localStorage.removeItem('placeA');
            localStorage.removeItem('positionA');
        } else {

        }
    }

    searchPlaceVD() {
        console.log('Destination: ' + this.demande.destination);
        if (this.demande.destination !== null || this.annonce.destination !== null) {
            localStorage.setItem('placeA', this.recherche.destination);
        }
        this.router.navigate(['recherche-carte', 'VD']);
    }

    searchPlaceUD() {
        console.log('LieuArrivée: ' + this.demande.lieuArrivee);
        if (this.demande.lieuArrivee !== null || this.annonce.lieuArrivee !== null) {
            localStorage.setItem('placeA', this.recherche.lieuArrivee);
        }
        this.router.navigate(['recherche-carte', 'UD']);
    }

    searchPlaceVA() {
        console.log('Départ: ' + this.demande.depart);
        if (this.demande.depart !== null || this.annonce.depart !== null) {
            localStorage.setItem('placeD', this.recherche.depart);
        }
        this.router.navigate(['recherche-carte', 'VA']);
    }

    searchPlaceUA() {
        console.log('LieuDépart: ' + this.demande.lieuDepart);
        if (this.demande.lieuDepart !== null || this.annonce.lieuDepart !== null) {
            localStorage.setItem('placeD', this.recherche.lieuDepart);
        }
        this.router.navigate(['recherche-carte', 'UA']);
    }

    searchPlaceVDD() {
        console.log('Destination: ' + this.demande.destination);
        if (this.demande.destination !== null || this.annonce.destination !== null) {
            localStorage.setItem('placeA', this.demande.destination);
            localStorage.setItem('placeA', this.annonce.destination);
            localStorage.setItem('positionA', this.itineraire.positionArrivee);
        }
        this.router.navigate(['recherche-carte', 'VDD']);
    }

    searchPlaceUDD() {
        console.log('LieuArrivée: ' + this.demande.lieuArrivee);
        if (this.demande.lieuArrivee !== null || this.annonce.lieuArrivee !== null) {
            localStorage.setItem('placeA', this.demande.lieuArrivee);
            localStorage.setItem('placeA', this.annonce.lieuArrivee);
            localStorage.setItem('positionA', this.itineraire.positionArrivee);
        }
        this.router.navigate(['recherche-carte', 'UDD']);
    }

    searchPlaceVAD() {
        console.log('Départ: ' + this.demande.depart);
        if (this.demande.depart !== null || this.annonce.depart !== null) {
            localStorage.setItem('placeD', this.demande.depart);
            localStorage.setItem('placeD', this.annonce.depart);
            localStorage.setItem('positionD', this.itineraire.positionDepart);
        }
        this.router.navigate(['recherche-carte', 'VAD']);
    }

    searchPlaceUAD() {
        console.log('LieuDépart: ' + this.demande.lieuDepart);
        if (this.demande.lieuDepart !== null || this.annonce.lieuDepart !== null) {
            localStorage.setItem('placeD', this.demande.lieuDepart);
            localStorage.setItem('placeD', this.annonce.lieuDepart);
            localStorage.setItem('positionD', this.itineraire.positionDepart);
        }
        this.router.navigate(['recherche-carte', 'UAD']);
    }

    getCityD(e: any) {
        if (e.target.value == 1) {
            this.enableRadioD1 = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            if (e.target.value == 2) {
                this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
                this.enableRadioD1 = true;
            }
        }
    }


    getCityA(e: any) {
        if (e.target.value == 1) {
            this.enableRadioA1 = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.enableRadioA1 = true;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
    }

    getPrice(e: any) {
        if (e.target.value > 0) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        this.recherche.prix = e.target.value;
        this.prix = e.target.value;
    }

    getBag(e: any) {
        if (e.target.value === 2) {
            this.recherche.codeInformationsSupplementaires1 = 3;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.recherche.codeInformationsSupplementaires1 = 4;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        return this.recherche.codeInformationsSupplementaires1;
    }

    getSmoke(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('smoke')) {
            this.recherche.codeInformationsSupplementaires2 = 7;
            this.enableSmoke = true;
            this.enableNSmoke = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.enableNSmoke = true;
            this.enableSmoke = false;
            this.recherche.codeInformationsSupplementaires2 = 8;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        return this.recherche.codeInformationsSupplementaires2;
    }

    getSpring(e: any) {
        if (e.target.name.match('spring')) {
            this.recherche.codeInformationsSupplementaires3 = 15;
            this.enableSpring = true;
            this.enableNSpring = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.enableNSpring = true;
            this.enableSpring = false;
            this.recherche.codeInformationsSupplementaires3 = 16;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        return this.recherche.codeInformationsSupplementaires3;
    }

    getAnimal(e: any) {
        if (e.target.name.match('animal')) {
            this.recherche.codeInformationsSupplementaires3 = 5;
            this.enableNAnimal = false;
            this.enableAnimal = true;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.recherche.codeInformationsSupplementaires3 = 6;
            this.enableNAnimal = true;
            this.enableAnimal = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        return this.recherche.codeInformationsSupplementaires3;
    }

    getWordD(e: any) {
        this.motD = e.target.value;
    }

    getWordA(e: any) {
        this.motA = e.target.value;
    }

    getDateDep(e: any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateDep = true;
        }
        this.recherche.dateDepart = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        console.log('********** Sauvegarde Date *************');
        localStorage.setItem('dateD', this.recherche.dateDepart);
        return this.dateD = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
    }

    getDateAr(e: any) {
        if (e.target.value != null) {
            this.dateArr = true;
        }
        if (e.target.value != null && e.target.value < this.recherche.dateDepart) {
            this.errorDate = "La date d'arrivée est inférieure à celle de départ";
            this.showButton = true;
        } else {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.showButton = false;
            this.errorDate = "";
            this.recherche.dateArrivee = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
            localStorage.setItem('dateAr', this.recherche.dateArrivee);
        }
        return this.dateAr = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
    }

    allAdresseD(e: any) {
        console.log(e.target.value);
        if (e.checked) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateDep = false;
            this.recherche.dateDepart = null;
            this.dateD = null;
        }
    }

    allAdresseA(e: any) {
        console.log(e.target.value);
        if (e.target.value == 2) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateArr = false;
            this.recherche.dateArrivee = null;
            this.dateAr = null;
        }
    }

    getTimeFromDate(t) {
        const d = t.target.value.split('T')[1];
        const m = d.split(':')[0];
        const n = d.split(':')[1];
        const tm = m + ":" + n;
        console.log('test: '+tm);
        return tm;
    }

    getHeureDep(e:any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        let d = this.recherche.heureDepart?.split('T')[1];
        let m = d.split(':')[0];
        let n = d.split(':')[1];
        var tm = m + ":" + n;
        console.log('****************** Sauvegarde Heure *****************');
        console.log('Recherche: '+tm);
        localStorage.setItem('heureD', tm);
        this.heureD = tm;
      }
    }

    getHeureAr(e: any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            if (this.recherche.dateDepart !== null && this.recherche.dateDepart === this.recherche.dateArrivee && this.datePipe.transform(e.target.value, 'HH:mm') === this.datePipe.transform(this.recherche.heureDepart, 'HH:mm')) {
                this.errorDate = "Veuillez vérifier les dates et heures saisies(elles sont similaires)";
                this.showButton = true;
            } else if (this.recherche.dateDepart !== null && this.recherche.dateDepart === this.recherche.dateArrivee && this.datePipe.transform(e.target.value, 'HH:mm') <= this.datePipe.transform(this.recherche.heureDepart, 'HH:mm')) {
                this.errorDate = "L'heure d'arrivée est inférieure à celle de départ";
                this.showButton = true;
            } else {
                this.showButton = false;
                this.errorDate = '';
            }
         let d = this.recherche.heureArrivee?.split('T')[1];
         let m = d.split(':')[0];
         let n = d.split(':')[1];
         var tm = m + ":" + n;
         localStorage.setItem('heureAr', tm);
        this.heureAr = tm;
      }
    }


    /**************************************** Fin ***************************************/

    add() {
        this.mode = 3;
        this.demande = new Demande();
        this.annonce = new AnnonceDto();
        this.itineraire = new Itineraire();
    }

    back() {
        this.mode = 1;
        if (localStorage.getItem('posD') !== null && !(localStorage.getItem('posD').indexOf(undefined) >= 0)) {
            localStorage.removeItem('posD');
            localStorage.removeItem('posA');
        }
        if (this.showA && this.showU) {
            console.log('****** Auto Urbain ******');
            this.showA = true;
            this.showU = true;
            this.itineraire.typeVoyage = 'urbain';
            this.annonceService.getAllAU().subscribe((data) => {
                if (data.length > 0) {
                    this.annoncesWUAIAv= data;
                    for (let a of this.annoncesWUAIAv) {
                        this.showInfoS(a);
                    }
                } else {
                    this.getAll();
                }
            });
        } else if (this.showA && this.showV) {
            console.log('****** Auto Voyage ******');
            this.showA = true;
            this.showV = true;
            this.itineraire.typeVoyage = 'voyage';
            this.annonceService.getAllAV().subscribe(data => {
                if (data.length > 0) {
                    this.annoncesWUAIAv= data;
                    for (let a of this.annoncesWUAIAv) {
                        this.showInfoS(a);
                    }
                } else {
                    this.getAll();
                }
            });

        } else if (!this.showA && this.showU) {
            console.log('****** Moto Urbain ******');
            this.showM = true;
            this.showU = true;
            this.itineraire.typeVoyage = 'urbain';
            this.annonceService.getAllMU().subscribe(data => {
                if (data.length > 0) {
                    this.annoncesWUAIAv = data;
                    console.log(this.annoncesWUAIAv);
                    for (let a of this.annoncesWUAIAv) {
                        this.showInfoS(a);
                    }
                } else {
                    this.getAll();
                }
            });

        } else if (!this.showA && !this.showU) {
            console.log('****** Moto Voyage ******');
            this.showM = true;
            this.showV = true;
            this.itineraire.typeVoyage = 'voyage';
            this.annonceService.getAllMV().subscribe(data => {
                if (data.length > 0) {
                    this.annoncesWUAIAv= data;
                    for (let a of this.annoncesWUAIAv) {
                        this.showInfoS(a);
                    }
                } else {
                    this.getAll();
                }
            });
        }

    }

    backReservation() {
        this.mode = 3;
        this.platform.ready().then(() => {
            if (this.itineraires.positionDepart !== null && this.itineraires.positionArrivee !== null) {
                this.loadMap(this.itineraires.positionDepart, this.itineraires.positionArrivee);
            } else if (this.annonces.lieuDepart !== null && this.annonces.lieuArrivee !== null) {
                this.loadMapWGeocode(this.annonces.lieuDepart, this.annonces.lieuArrivee);
            } else if (this.annonces.depart !== null && this.annonces.destination !== null) {
                this.loadMapWGeocode(this.annonces.depart, this.annonces.destination);
            } else {
              console.log('===========Affichage de la carte sans direction=======');
              this.loadMapS();
            }
        });
    }

    showRechercher() {
        this.mode = 2;
        this.initialise();
    }

    backRecherche() {
        this.mode = 2;
    }

    nextRecherche() {
        this.mode = 12;
    }

    showInfoSupp() {
        this.mode = 5;
    }


    /************* Carte ***********/
    addMarker(map: any, lat: number, lng: number) {

        let content = '';
        var location = new google.maps.LatLng(lat, lng);
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            clickable: true,
            visible: true
        });
        marker.setMap(map);
        marker.info = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(marker, 'click', function () {
            marker.info.open(map, marker);

        });

    }

    /*************** Pour la carte  *************/

    getActualPosition() {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
        });
        // console.log('Position:{lat:' + this.lat + ', lng:' + this.lng + '}');
    }

    separartor(val: string) {
        return val?.split(",");
    }

    geocodeAddress(val) {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };

        let p: string = val;

        this.nativeGeocoder.forwardGeocode(val, options).then((result: NativeGeocoderResult[]) => {
            if (result !== null && result.length > 0) {
                switch (p) {
                    case 'depart':
                        localStorage.setItem('posD', result[0].latitude + ', ' + result[0].longitude);
                        console.log(('Enregistrement local de depart'));
                        this.posD.lat = +result[0].latitude;
                        this.posD.lng = +result[0].longitude;
                        console.log(this.posD);
                        break;
                    case 'destination':
                        localStorage.setItem('posA', result[0].latitude + ', ' + result[0].longitude);
                        console.log(('Enregistrement local de destination'));
                        this.posA.lat = +result[0].latitude;
                        this.posA.lng = +result[0].longitude;
                        console.log(this.posA);
                        break;
                    default:
                        console.log("Aucune direction");
                        break;
                }
            }
        }).catch((error: any) => {
            console.log(error);
            alert("Direction introuvable");
        });

    }

    checkMode() {
        // console.log(this.mode);
        if(this.mode == 3) {
            return false;
        } else {
            return true;
        }
    }

    ionViewWillEnter() {
        this.platform.ready().then(() => {
             this.map = new google.maps.Map(document.getElementById('mapD'), {
                center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
                zoom: 13
            });
        });
    }


    ionViewDidLeave() {
        if (this.map) {
        this.map = null;
        }
    }


    loadMapS() {
      console.log('lat: '+localStorage?.getItem('lat')+', lng: '+localStorage?.getItem('lng'));
      const map = new google.maps.Map(document.getElementById('mapD'), {
        center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
          zoom: 13
      });
    }

    loadMap(depart, destination) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        const map = new google.maps.Map(document.getElementById('mapD'), {
            center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
            zoom: 13
        })

        directionsDisplay.setMap(map);


        let request = {
            origin: {lat: parseFloat(this.separartor(depart)[0]), lng: parseFloat(this.separartor(depart)[1])},
            destination: {
                lat: parseFloat(this.separartor(destination)[0]),
                lng: parseFloat(this.separartor(destination)[1])
            },
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, (response, status) => {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            }
        });
    }

    loadMapWGeocode(depart: string, destination: string) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);
        this.geocodeAddress(depart);
        this.geocodeAddress(destination);

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        const map = new google.maps.Map(document.getElementById('mapD'), {
            center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
            zoom: 13
        });

        let request = {
            origin: {
                lat: 0,
                lng: 0
            },
            destination: {
                lat: 0,
                lng: 0
            },
            travelMode: google.maps.TravelMode.DRIVING
        };
        request.origin = this.posD;
        request.destination = this.posA;

        directionsDisplay.setMap(map);

        directionsService.route(request, (response, status) => {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
            }
        });
    }

    geocodeLatLng(geocoder, map, infowindow, pos) {
        const latlngStr = pos.split(",", 2);
        const latlng = {
            lat: parseFloat(latlngStr[0]),
            lng: parseFloat(latlngStr[1]),
        };
        geocoder.geocode(
            {location: latlng},
            (results, status) => {
                if (status === "OK") {
                    if (results[0]) {
                        map.setZoom(11);
                        const marker = new google.maps.Marker({
                            position: latlng,
                            map: map,
                        });
                        infowindow.setContent(results[0].formatted_address);
                        infowindow.open(map, marker);
                    } else {
                        alert("Aucun résultat trouvé");
                    }
                } else {
                    alert("Echec Geocoder dû à: " + status);
                }
            }
        );
    }

    /**************** Fin carte ************/

    showTrajetForSave(d: any) {

        this.mode = 3;
        this.infoSup = [];
        this.annonces = d[0];
        this.prixreserv = (this.annonces.prix * 1) / 4;
        this.prixdu = (this.annonces.prix * 3) / 4;

        this.utilisateurs = d[1];
        let p = this.utilisateurs.photo;
        if (p != null) {
            this.photo = this.utilisateurService.fileUrl + this.utilisateurs.photo;
        }
        this.itineraires = d[2];
        /********** Pour afficher la carte ********/
        this.platform.ready().then(() => {
            if (this.itineraires.positionDepart !== null && this.itineraires.positionArrivee !== null) {
                this.loadMap(this.itineraires.positionDepart, this.itineraires.positionArrivee);
            } else if (this.annonces.lieuDepart !== null && this.annonces.lieuArrivee !== null) {
                this.loadMapWGeocode(this.annonces.lieuDepart, this.annonces.lieuArrivee);
            } else if (this.annonces.depart !== null && this.annonces.destination !== null) {
                this.loadMapWGeocode(this.annonces.depart, this.annonces.destination);
            } else {
              console.log('===========Affichage de la carte sans direction=======');
              this.loadMapS();
            }
        });


        this.avis = d[3];
        this.uai.idU = +this.annonces.idUtilisateur;
        this.uai.idI = this.annonces.idItineraire;
        this.uai.idA = this.annonces.idAnnonce;


        this.avisService.getTotalAvisByU(this.annonces.idUtilisateur).subscribe(data => {
            this.avisNumber = data;
        });

        this.reservationService.getReservationNumberByU(this.annonces.idUtilisateur).subscribe(data =>{
            this.reservationNumber = data;
        });

        this.typeAvisService.getAvgByNoteAndU(this.annonces.idUtilisateur).subscribe(data => {
            let typeTotal = 0;
            // console.log(data);
            for(let t of data) {
                typeTotal += t[1];
                this.typeAv = {libelleTypeAvis: '', note: 0};
                this.typeAv.libelleTypeAvis = t[0];
                this.typeAv.note = t[1];
                /*console.log(this.typeAv.libelleTypeAvis);
                console.log(this.typeAv.note);*/
                console.log(this.typeAv);
                this.typeAvis.push(this.typeAv);
            }
            console.log(this.typeAvis);
            this.total = typeTotal/5;
        });
        /****** Pour vérifier la validation des informations du conducteur ******/
        this.userService.getByEmail(this.utilisateurs.email).subscribe(data => {
            this.user = data;
        });
        this.informationsSuppService.getAllByUAn(this.annonces.idUtilisateur, this.annonces.idAnnonce).subscribe((data: any) => {
            data.forEach(info => {
                if (Object.keys(info).length) {
                    for (let inf of this.infoSups) {
                        if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                            let n = {iconeInformationsSupplementaires: inf.iconeInformationsSupplementaires};
                            this.infoSup.push(n);
                        }
                    }
                }
            })
        });
    }

    goTrajetsCarte(d: any) {
        this.reservation.idUtilisateur = this.id;
        if (this.showU) {
            localStorage.setItem('showU', 'true');
        } else {
            localStorage.setItem('showU', 'false');
        }
        this.router.navigate(['trajet-carte'], {state: {data: d}});
    }

    async showNotifTrajet() {
        const alert = await this.alertCtrl.create({
            header: 'Notification',
            subHeader: 'Vous avez reçu une nouvelle note',
            buttons: ['OK']
        });
        await alert.present();
    }

    async showToastExist() {
        const toast = await this.toastCtrl.create({
            message: 'Trajet déjà réservé',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    reserver(u: UtilisateurDto, a: AnnonceDto, i: Itineraire) {
        let ui = new UserItin();
        ui.idU = this.id;
        ui.idI = i.idItineraire;
        let data: any;
        this.reservationService.getOneByUI(ui).subscribe((res) => {
            console.log(res);
            data = res.status
        });
        if (data === 200) {
            this.back();
            this.showToastExist();
        } else {
            console.log('******** Acceptation de loffre de covoiturage par le passager ********');
            this.buttonSaveClicked = true;
            this.push.idU = u.idUtilisateur;
            if (a.depart !== null) {
                this.push.message = 'Un passager est intéressé par votre offre de trajet ' + a.depart;
            } else {
                this.push.message = 'Un passager est intéressé par votre offre de trajet ' + a.lieuDepart;
            }
            this.push.action = 'Confirmer?';

            this.pushData = {0: this.id, 1: a, 2: i, 3: this.avis};
            this.push.data = JSON.stringify(this.pushData);
            this.notificationService.sendNotifToOne(this.push).subscribe(res => {
                if (res.status == 200) {
                    this.mode = 1;
                    this.showToast();
                } else {
                    this.showToastFailed();
                }
            });
        }
    }

    backTransaction() {
        this.mode = 6;
    }

    backPaiement() {
        this.mode = 7;
        this.showBtn = true;
        if (this.modePaiement == 1) {
            this.checkO = true;
            this.checkedM = true;
        } else {
            this.checkM = true;
            this.checkedO = true;
        }
    }

    backValidationPaiement() {
        this.mode = 8;
    }


    nextChoixPaiement() {
        console.log(this.reservation);
        this.mode = 7;
        this.touchCustom.additionnalInfos = new AdditionnalInfos();
        this.utilisateurService.getOne(this.id).subscribe(res=>{
            this.utilisateurRecipient = res;
            this.touchCustom.additionnalInfos.recipientEmail = this.utilisateurRecipient.email;
            this.touchCustom.additionnalInfos.recipientFirstName = this.utilisateurRecipient.prenom;
            this.touchCustom.additionnalInfos.recipientLastName = this.utilisateurRecipient.nom;
        });
    }

    getNumberOrange(e: any) {
        if (e.target.value.length != 8) {
            this.showBtn = false;
            this.errorCustomer = 'Le numéro est incorrecte';
        } else {
            this.showBtn = true;
        }
    }

    nextPaiement() {
        console.log(this.paiement.numeroClient);
        if (this.modePaiement == 1) {
            this.mode = 8;
        } else if(this.modePaiement == 2) {
            this.saveMoov();
        }
    }

    getOtp(e: any) {
        if (e.target.value.length != 6) {
            this.showBtn = true;
            this.errorOtp = 'Le champ doit comporter 6 caractères';
        } else {
            this.showBtn = false;
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
        console.log(e.target.value);
        if (e.target.checked) {
            this.checkM = true;
            this.checkedO = true;
        } else {
            this.checkM = false;
            this.checkedO = false;
        }
        return this.modePaiement = e.target.value;
    }

    async showToastReservation() {
        const toast = await this.toastCtrl.create({
            message: 'Réservation enregistrée avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastDemande() {
        const toast = await this.toastCtrl.create({
            message: 'Demande enregistrée avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastDemandeFail() {
        const toast = await this.toastCtrl.create({
            message: 'Demande non enregistrée, veuillez ré-essayer',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    loadData() {
        this.touchCustom.recipientNumber = this.paiement.numeroClient.toString();
        this.touchCustom.amount = this.paiement.montantPaiement;
        this.touchCustom.idUtilisateur = this.id;
        this.touchCustom.additionnalInfos.destinataire = this.paiement.numeroClient.toString();
    }

    async saveMoov() {
        console.log(this.modePaiement);
        console.log(this.reservation);
        this.loadData();
        console.log(this.touchCustom);
            const loading = await this.loadingCtrl.create({
                cssClass: 'my-custom-class',
                message: 'Veuillez patienter svp...',
            })
            await loading.present();
            console.log('******* Paiement par Moov ********');

            this.paiementService.touchMoov(this.touchCustom).subscribe(res => {
                console.log(res);
                if (res.status == 200 && res.body.status.includes('INITIATED')) {
                    this.customMoov.amount = res.body.amount;
                    this.customMoov.partnerTransactionId = res.body.idFromClient;
                        loading.dismiss();
                        this.mode = 81;
                } else {
                    loading.dismiss();
                    console.log(res.status);
                    this.mode = 10;
                }

            }, error => {
                loading.dismiss();
                this.mode = 10;
            });

    }

    async finaliserMoovTransaction() {
        this.customMoov.idUtilisateur = this.touchCustom.idUtilisateur;
        console.log(this.customMoov);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Veuillez patienter svp...',
        });
        await loading.present();
        console.log('******* Finalisation paiement par Moov ********');
        this.paiementService.touchMoovCallBack(this.customMoov).subscribe(res => {
            if (res.status == 200 && res.body.status.includes('SUCCESSFUL')) {
                this.reservationService.create(this.reservation).subscribe(res => {
                    // console.log(res);
                    /********** Enregistrement du paiement **********/
                    this.paiementService.create(this.paiement).subscribe(res => {
                        // console.log(res);
                        if (res.status == 200) {
                            /*********** Envoi de la notification **********/
                            this.push.message = 'Un nouveau passager a été ajouté à un de vos trajets';
                            // this.push.action = 'Le noter';
                            this.notificationService.sendNotifToOne(this.push).subscribe((data) => {
                                loading.dismiss();
                                this.mode = 9;
                                this.touchCustom = new TouchCustomDto();
                                this.paiement = new Paiement();
                                this.infoSup = new Array();
                                this.showToastReservation();
                            }, error => {
                                loading.dismiss();
                                this.mode = 10;
                            });
                        } else {
                            loading.dismiss();
                            console.log(res.status);
                            this.mode = 10;
                        }
                    }, error => {
                        loading.dismiss();
                        this.mode = 10;
                    });
                }, error => {
                    loading.dismiss();
                    this.mode = 10;
                });
            } else {
                loading.dismiss();
                console.log(res.status);
                this.mode = 10;
            }
        }, error => {
            loading.dismiss();
            this.mode = 10;
        })
    }

    loadDataOrange() {
        /*this.touchCustom.additionnalInfos = new AdditionnalInfos();
        this.utilisateurService.getOne(this.id).subscribe(res=>{
            this.utilisateurRecipient = res;
            this.touchCustom.additionnalInfos.recipientEmail = this.utilisateurRecipient.email;
            this.touchCustom.additionnalInfos.recipientFirstName = this.utilisateurRecipient.prenom;
            this.touchCustom.additionnalInfos.recipientLastName = this.utilisateurRecipient.nom;
        });
        this.touchCustom.recipientNumber = this.paiement.numeroClient.toString();
        this.touchCustom.amount = this.paiement.montantPaiement;
        this.touchCustom.idUtilisateur = this.id;
        this.touchCustom.additionnalInfos.destinataire = this.paiement.numeroClient.toString();
        this.touchCustom.additionnalInfos.otp = this.paiement.codeOtp.toString();*/

        this.customer.customer_msisdn = this.paiement.numeroClient.toString();
        this.customer.amount = this.paiement.montantPaiement;
        this.customer.otp = this.paiement.codeOtp;
        this.customer.idUtilisateur = this.id;
        console.log(this.customer);
    }

     saveTest() {
        this.loadDataOrange();
            this.paiementService.createOrange(this.customer).subscribe(res => {
                console.log('******* $$$$$ Corps du résultat $$$$$$$$ ********');
                console.log(res.body);
                let resp = res.body.toString().substring(0, res.body.toString().indexOf('>'));
                console.log('******* $$$$$ Découpage du résultat $$$$$$$$ ********');
                console.log(resp.substring(resp.indexOf('<')));
                if (res.status == 200 && res.body === '200') {
                    /********** Enregistrement de la réservation **********/
                    this.reservationService.create(this.reservation).subscribe(res => {
                        if (res.status == 200) {
                            /********** Enregistrement du paiement **********/
                            this.paiementService.create(this.paiement).subscribe(res => {
                                if (res.status == 200) {
                                    /*********** Envoi de la notification **********/
                                    this.push.message = 'Un nouveau passager a été ajouté à un de vos trajets';
                                    this.notificationService.sendNotifToOne(this.push).subscribe((res) => {
                                        if (res.status == 200) {
                                            this.mode = 9;
                                            this.touchCustom = new TouchCustomDto();
                                            this.paiement = new Paiement();
                                            this.infoSup = new Array();
                                            this.showToastReservation();
                                        } else {
                                            this.mode = 10;
                                        }
                                    }, error => {
                                        this.mode = 10;
                                    });
                                } else {
                                    this.mode = 10;
                                }
                            }, error => {
                                this.mode = 10;
                            });
                        } else {
                            this.mode = 10;
                        }
                    }, error => {
                        this.mode = 10;
                    });

                } else {
                    console.log(res.status);
                    this.mode = 10;
                }

            }, error => {
                this.mode = 10;
            });

    }

    async save() {
        // console.log(this.paiement);
        console.log(this.reservation);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Veuillez patienter svp...',
        })
        await loading.present();
        this.loadDataOrange();
        /*console.log(this.modePaiement);
        console.log(this.touchCustom);*/
        if (this.modePaiement == 1) {
            // this.mode = 9;
            console.log('******* Paiement par orange ********');
            console.log(this.customer);
            /*this.customer.customer_msisdn = this.paiement.numeroClient;
            this.customer.amount = this.paiement.montantPaiement;
            this.customer.otp = this.paiement.codeOtp;
            this.customer.idUtilisateur = this.id;*/

            this.paiementService.createOrange(this.customer).subscribe(res => {
                console.log('*******=========== Réponse du serveur ===========********');
                console.log(res.body);
                console.log(typeof res.body);
                if (res.status == 200 && res.body == 200) {
                    /********** Enregistrement de la réservation **********/
                    this.reservationService.create(this.reservation).subscribe(res => {
                        if (res.status == 200) {
                            /********** Enregistrement du paiement **********/
                            this.paiementService.create(this.paiement).subscribe(res => {
                                if (res.status == 200) {
                                    /*********** Envoi de la notification **********/
                                    this.push.message = 'Un nouveau passager a été ajouté à un de vos trajets';
                                    this.notificationService.sendNotifToOne(this.push).subscribe((res) => {
                                        if (res.status == 200) {
                                            loading.dismiss();
                                            this.mode = 9;
                                            this.customer = new CommandDto();
                                            this.paiement = new Paiement();
                                            this.infoSup = new Array();
                                            this.showToastReservation();
                                        } else {
                                            loading.dismiss();
                                            this.mode = 10;
                                        }
                                    }, error => {
                                        loading.dismiss();
                                        this.mode = 10;
                                    });
                                } else {
                                    loading.dismiss();
                                    this.mode = 10;
                                }
                            }, error => {
                                loading.dismiss();
                                this.mode = 10;
                            });
                        } else {
                            loading.dismiss();
                            this.mode = 10;
                        }
                    }, error => {
                        loading.dismiss();
                        this.mode = 10;
                    });

                } else {
                    loading.dismiss();
                    console.log(res.status);
                    this.mode = 10;
                }

            }, error => {
                loading.dismiss();
                this.mode = 10;
            });

        }
        else {
            const loading = await this.loadingCtrl.create({
                    cssClass: 'my-custom-class',
                    message: 'Veuillez patienter svp...',
            })
            await loading.present();
            console.log('******* Paiement par Moov ********');

            this.paiementService.touchMoov(this.touchCustom).subscribe(res => {
                console.log(res);
                if (res.status == 200 && res.body.status.includes('INITIATED')) {
                    this.customMoov.amount = res.body.amount;
                    this.customMoov.partnerTransactionId = res.body.idFromClient;
                    this.customMoov.idUtilisateur = this.touchCustom.idUtilisateur;
                    this.paiementService.touchMoovCallBack(this.customMoov).subscribe(res => {
                        if (res.status == 200 && res.body.status.includes('SUCCESSFUL')) {
                            this.reservationService.create(this.reservation).subscribe(res => {
                                // console.log(res);
                                /********** Enregistrement du paiement **********/
                                this.paiementService.create(this.paiement).subscribe(res => {
                                    // console.log(res);
                                    if (res.status == 200) {
                                        /*********** Envoi de la notification **********/
                                        this.push.message = 'Un nouveau passager a été ajouté à un de vos trajets';
                                        // this.push.action = 'Le noter';
                                        this.notificationService.sendNotifToOne(this.push).subscribe((data) => {
                                            loading.dismiss();
                                            this.mode = 9;
                                            this.touchCustom = new TouchCustomDto();
                                            this.paiement = new Paiement();
                                            this.infoSup = new Array();
                                            this.buttonSaveClicked = false;
                                        }, error => {
                                            this.mode = 10;
                                        });
                                    } else {
                                        loading.dismiss();
                                        console.log(res.status);
                                        this.mode = 10;
                                    }
                                }, error => {
                                    loading.dismiss();
                                    this.mode = 10;
                                });
                            }, error => {
                                loading.dismiss();
                                this.mode = 10;
                            });
                        } else {
                            loading.dismiss();
                            console.log(res.status);
                            this.mode = 10;
                        }
                    }, error => {
                        loading.dismiss();
                        this.mode = 10;
                    })
                } else {
                    loading.dismiss();
                    console.log(res.status);
                    this.mode = 10;
                }

            }, error => {
                loading.dismiss();
                this.mode = 10;
            });

        }

    }

    edit(d: Demande) {
        this.mode = 4;
        this.demandeService.getOne(d.idDemande).subscribe(data => {
            this.demande = data;
            this.itineraireService.getOne(this.demande.idItineraire).subscribe(result => {
                this.itineraire = result;
            })
        });

        this.annonceService.getOne(this.annonce.idAnnonce).subscribe(data => {
            this.annonce = data;
            this.itineraireService.getOne(this.annonce.idItineraire).subscribe(result => {
                this.itineraire = result;
            })
        });
    }

    update() {
        this.annonceService.updateP(this.annonce).subscribe(data => {
            this.itineraireService.update(this.itineraire).subscribe(data => {
                this.ngOnInit();
            })
        });

        this.annonceService.update(this.annonce).subscribe(data => {
            this.itineraireService.update(this.itineraire).subscribe(data => {
                this.ngOnInit();
            })
        })
    }

    async delete(d: Demande) {
        let alert = await this.alertCtrl.create({
            header: 'Confirmer la suppression',
            message: 'Voulez-vous supprimer cette demande?',
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
                        this.demandeService.delete(d.idDemande).subscribe(res => {
                            this.ngOnInit();
                        });
                    }
                }
            ]
        });
        await alert.present();
    }

    /***************** Informations du conducteur **************/

    showInfoConducteur(u: UtilisateurDto, a: AnnonceDto) {
        this.mode = 4;
        this.photo = this.utilisateurService.fileUrl + u.photo;
        this.enginService.getAllByUAndA(u.idUtilisateur, a.idAnnonce).subscribe(data => {
            this.engins = data;
        });

    }

    /*********************** Fin ******************/

    /************************* Faire une demande de covoiturage ********************/

    ajouter() {
        this.mode = 11;
        this.initialiseObject();
        if (this.showA) {
            this.itineraire.typeLocalite = 'Auto';
        } else if (this.showM) {
            this.itineraire.typeLocalite = 'Moto';
        }
        if(this.showU) {
            this.itineraire.typeVoyage = 'urbain';
        } else if (this.showV) {
            this.itineraire.typeVoyage = 'voyage';
        }
    }

    initialiseObject() {
        localStorage.removeItem('placeD');
        localStorage.removeItem('positionD');
        localStorage.removeItem('placeA');
        localStorage.removeItem('positionA');
        localStorage.removeItem('dateD');
        localStorage.removeItem('heureD');
        localStorage.removeItem('dateAr');
        localStorage.removeItem('heureAr');
        this.demande = new Demande();
        this.annonce = new AnnonceDto();
        this.itineraire = new Itineraire();
        this.codeBag = 0;
        this.codeSmoke = 0;
        this.codeSpring = 0;
        this.codeAnimal = 0;
        this.infoSup = [];
        this.enableAnimalD = false;
        this.enableNAnimalD = false;
        this.enableSmokeD = false;
        this.enableNSmokeD = false;
        this.enableSpringD = false;
        this.enableNSpringD = false;
        this.prixreservD = 0;
        this.prixduD = 0;
        this.buttonSaveClicked = false;
        this.errorDateD = '';
        this.errorHeure = '';
        this.showButton = false;
    }

    selectRPD(e: any) {
        this.demande.nbrePlace = e.detail.value;
        this.annonce.nbrePersonne = e.detail.value;
    }

    loadPrixReserv(e) {
        if (e.target.value != 0) {
            this.prixreservD = (e.target.value * 1) / 4;
            this.prixduD = (e.target.value * 3) / 4;
        }
        else {
          this.prixreservD = 0;
           this.prixduD = 0;
        }
    }

    getCityDD(e: any) {
        if (e.target.value == 1) {
            this.enableRadioD2 = true;
        } else {
            if (e.target.value == 2) {
                this.demande.lieuDepart = null;
                this.annonce.lieuDepart = null;
                this.enableRadioD1 = true;
            }
        }
    }

    getCityAD(e: any) {
        if (e.target.value == 1) {
            this.enableRadioA1 = false;
            this.enableRadioA2 = true;
        } else {
            this.demande.lieuArrivee = null;
            this.annonce.lieuArrivee = null;
            this.enableRadioA1 = true;
            this.enableRadioA2 = false;
        }
    }

    getPriceD(e: any) {
        this.demande.prix = e.target.value;
        this.annonce.prix = e.target.value;
    }

    getBagD(e: any) {
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

    getSmokeD(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('smoke')) {
            this.codeSmoke = 7;
            this.enableSmokeD = true;
            this.enableNSmokeD = false;
        } else {
            this.enableSmokeD = false;
            this.enableNSmokeD = true;
            this.codeSmoke = 8;
        }
        return this.infoSupp.push(this.codeSmoke);
    }

    getSpringD(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('spring')) {
            this.codeSpring = 15;
            this.enableSpringD = true;
            this.enableNSpringD = false;
        } else {
            this.enableNSpringD = true;
            this.enableSpringD = false;
            this.codeSpring = 16;
        }
        return this.infoSupp.push(this.codeSpring);
    }

    getAnimalD(e: any) {
        console.log(e.target.name);
        if (e.target.name.match('animal')) {
            this.codeAnimal = 5;
            this.enableAnimalD = true;
            this.enableNAnimalD = false;
        } else {
            this.codeAnimal = 6;
            this.enableAnimalD = false;
            this.enableNAnimalD = true;
        }
        return this.infoSupp.push(this.codeAnimal);
    }

    getDateDepD(e: any) {
        this.itineraire.dateDepart = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        console.log(this.itineraire.dateDepart);
        console.log('********** Sauvegarde Date *************');
        localStorage.setItem('dateD', this.itineraire.dateDepart);
    }

    getDateArD(e: any) {
        if (e.target.value != null && e.target.value < this.itineraire.dateDepart) {
            this.errorDateD = "La date d'arrivée est inférieure à celle de départ";
            this.showButton = true;
        } else {
            this.showButton = false;
            this.errorDateD = "";
            this.itineraire.dateArrivee = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
            console.log(this.itineraire.dateArrivee);
            localStorage.setItem('dateAr', this.itineraire.dateArrivee);
        }
    }

    getHeureDepD(e: any) {
    var d = e.target.value?.split('T')[1];
             let m = d.split(':')[0];
             let n = d.split(':')[1];
             var tm = m + ":" + n;
        console.log(this.itineraire.heureDepart);
        console.log('****************** Sauvegarde Heure *****************');
        localStorage.setItem('heureD', tm);
        this.itineraire.heureDepart = tm;
        console.log(this.itineraire.heureDepart);
    }

    getHeureArD(e: any) {
        let h = this.datePipe.transform(e.target.value, 'HH:mm');
        let hD = this.itineraire.heureDepart;
        console.log(this.itineraire.heureArrivee);
        if (e.target.value !== null) {
            if (this.itineraire.dateDepart === this.itineraire.dateArrivee && h === hD) {
                this.errorHeure = "Veuillez vérifier les dates et heures saisies(elles sont égales)";
                this.showButton = true;
            } else if (this.itineraire.dateDepart === this.itineraire.dateArrivee && h <= hD) {
                this.errorHeure = "L'heure d'arrivée est inférieure à celle de départ";
                this.showButton = true;
            } else {
                this.showButton = false;
                this.errorHeure = '';
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

    getLocation() {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            if (resp !== null) {
                localStorage.setItem('lat', resp.coords.latitude.toString());
                localStorage.setItem('lng', resp.coords.longitude.toString());
            }
        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
            this.itineraire.latitude = 0;
            this.itineraire.longitude = 0;
        });
    }

    async enregistrerDemande() {
        this.itineraire.latitude = +localStorage.getItem('lat');
        this.itineraire.longitude = +localStorage.getItem('lng');
        this.infoSupp.push(this.codeBag);
        console.log('Latitude: ' + this.itineraire.latitude);
        console.log('Longitude: ' + this.itineraire.longitude);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Enregistrement en cours...',
        });
        await loading.present();
        console.log('******** Enregistrement de la demande de covoiturage ********');
        console.log(this.demande);
        if (this.itineraire.dateDepart == null) {
            loading.dismiss();
            this.showError = true;
            this.errorDemande = 'Ce champ est obligatoire';

        } else {
            this.showError = false;
            this.errorDemande = '';
            /******** Enregistrement de la demande de covoiturage du passager *******/
            this.itineraireService.create(this.itineraire).subscribe(res => {
                if (res.status == 200) {
                    console.log(res.body);
                    this.annonce.dateDepart = res.body.dateDepart;
                    this.annonce.idUtilisateur = this.id;
                    this.annonce.idItineraire = res.body.idItineraire;
                    console.log(this.annonce);
                    this.annonceService.createP(this.annonce).subscribe(result => {
                        if (result.status == 200) {
                            loading.dismiss();
                            this.initialiseObject();
                            this.back();
                            this.showToastDemande();
                        } else {
                            loading.dismiss();
                            this.showToastDemandeFail();
                        }
                        /********** Enregistrement des infos supp *********/
                        for (let i of this.infoSupp) {
                            this.infoSupps = this.infoSups.find(x => x.idInformationsSupplementaires == i);
                            console.log(this.infoSupps);
                            this.infoSupl.libelleInformationsSupplementaires = this.infoSupps.libelleInformationsSupplementaires;
                            this.infoSupl.idDemande = result.body.idAnnonce;
                            this.infoSupl.idUtilisateur = result.body.idUtilisateur;
                            this.informationsSuppService.create(this.infoSupl).subscribe(resp => {
                                console.log(resp);
                            });
                        }
                    }, (error) => {
                        loading.dismiss();
                        this.showToastDemandeFail();
                    });
                } else {
                    loading.dismiss();
                    this.showToastDemandeFail();
                }
            }, (error) => {
                loading.dismiss();
                this.showToastDemandeFail();
            });

        }

    }


}


@Component({
    selector: 'app-demande',
    template: `
        <ion-content style="--ion-background-color: #3880ff">
            <ion-list *ngFor="let t of typeFiltre">
                <ion-item class="popItems" [id]="t?.id" (click)="getFilter($event)">{{t?.val}}</ion-item>
            </ion-list>
        </ion-content>`,
    styleUrls: ['./demande.page.scss'],

})
export class PopoverPage {
    typeFiltre = [{id: 1, val: 'Par prix ascendant'}, {id: 2, val: 'Par prix descendant'},
        {id: 3, val: 'Par nombre de place ascendant'}, {id: 4, val: 'Par nombre de place descendant'},
        {id: 5, val: 'Par date: du plus récent au plus ancien'}, {
            id: 6,
            val: 'Par date: du plus ancien au plus récent'
        }];


    constructor(
        private popover: PopoverController
    ) {
    }

    getFilter(e) {
        this.popover.dismiss(e.target.id);
    }

}
