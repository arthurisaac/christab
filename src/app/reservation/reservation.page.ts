import {Component, OnInit} from '@angular/core';
import {Paiement} from "../paiement/paiement.model";
import {Demande} from "../demande/demande.model";
import {AlertController, LoadingController, Platform, ToastController} from "@ionic/angular";
import {DemandeService} from "../demande/demande.service";
import {Itineraire} from "../itineraire/itineraire.model";
import {ItineraireService} from "../itineraire/itineraire.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {LoginService} from "../login/login.service";
import {AuthenticationService} from "../authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Annonce, UserAnnonce} from "../annonce/annonce.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {AvisDto} from "../avis/avis.model";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnonceService} from "../annonce/annonce.service";
import {
    GoogleMap,
    GoogleMaps,
    GoogleMapsAnimation,
    GoogleMapsEvent,
    HtmlInfoWindow,
    Marker
} from "@ionic-native/google-maps";
import {
    AdditionnalInfos,
    COMMAND, CommandDto,
    PaiementService,
    TouchCustomDto,
    TouchMoovCallBackRequestDto
} from "../paiement/paiement.service";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import {Reservation, UserItin} from "./reservation.model";
import {Decompte} from "../decompte/decompte.model";
import {DecompteService} from "../decompte/decompte.service";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {DatePipe} from "@angular/common";
import {ReservationService} from "./reservation.service";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {Engin} from "../engin/engin.model";
import {Admin} from "../admin/admin.model";
import {TypeAvis} from "../type-avis/type-avis.model";
import {EnginService} from "../engin/engin.service";
import {AvisService} from "../avis/avis.service";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";

/******** Pour la carte ******/
declare var google;

@Component({
    selector: 'app-reservation',
    templateUrl: './reservation.page.html',
    styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {

    id: number = 0;
    idTF: number = 0;
    mode: number;
    demande: Demande;
    demandes: Demande;
    itineraire: Itineraire = new Itineraire();
    reservation: Reservation = new Reservation();
    decompte: Decompte = new Decompte();
    paiement: Paiement = new Paiement();
    customer: CommandDto = new CommandDto();
    callBack = "https://christabpaie.ew.r.appspot.com/api/touchMoovCallback";
    moovServiceCode = "BF_PAIEMENTMARCHAND_MOBICASH_TP";
    orangeServiceCode = "BF_PAIEMENTMARCHAND_OM_TP";
    touchCustom: TouchCustomDto = new TouchCustomDto();
    customMoov: TouchMoovCallBackRequestDto = new TouchMoovCallBackRequestDto();
    itineraires: Itineraire;
    engins: Engin;
    lat: number;
    long: number;
    demandeWUAIAvObj: any;
    annoncesWUAI: Array<any> = new Array<any>();
    subscription: Subscription;
    annonces: Annonce;
    annonce: Annonce = new Annonce();
    utilisateurs: UtilisateurDto;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    utilisateurRecipient: UtilisateurDto;
    uai: UserAnnonce = new UserAnnonce();
    avis: AvisDto = new AvisDto();
    avisArray: AvisDto[];
    data: any;
    image: any = null;
    dateDep: Date;
    prixreserv: number = 0;
    prixdu: number = 0;
    photo: any;
    map: GoogleMap;
    existReserv: boolean;
    buttonSaveClicked: boolean;
    infoSup: InformationsSupplementaires[] = new Array();
    infoSups: InformationsSupplementaires[] = [];

    /******** Paiement ***********/
    showBtn: boolean = false;
    errorCustomer: string;
    errorOtp: string;
    checkO: boolean = false;
    checkM: boolean = false;
    checkedO: boolean = false;
    checkedM: boolean = false;
    modePaiement: number = 0;

    /******** Notification ******/
    push: OneSignalPushNotification = new OneSignalPushNotification();
    /******** Pour afficher la taille du tableau (objet) *******/
    objectKeys = Object.keys;

    /******* Informations du conducteur *******/
    user: Admin = new Admin();

    /********** pour la gestion des notes *********/
    typeAvi: TypeAvis = new TypeAvis();
    typeAvis: TypeAvis[] = new Array();
    typeAs = [];
    typeAvisTotal = [];
    total: number = 0;
    showBtnCheck: boolean;
    champOtp: string;

    constructor(
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private demandeService: DemandeService,
        private annonceService: AnnonceService,
        private itineraireService: ItineraireService,
        private sanitizer: DomSanitizer,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        private loginService: LoginService,
        private paiementService: PaiementService,
        private decompteService: DecompteService,
        private utilisateurService: UtilisateurService,
        private informationsSuppService: InformationsSupplementairesService,
        private enginService: EnginService,
        private avisService: AvisService,
        private typeAvisService: TypeAvisService,
        private notificationService: NotificationsService,
        private reservationService: ReservationService,
        private authService: AuthenticationService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private router: Router,
        public platform: Platform
    ) {
    }

    ngOnInit() {
        this.isAuthenticated();
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.mode = 1;

        this.infoSups = this.informationsSuppService.infoSupplementaires;
        /********** Affichage de la carte ************/
        this.getActualPosition();
        if (this.router.getCurrentNavigation().extras?.state.detailT) {
            this.demandeWUAIAvObj = this.router.getCurrentNavigation().extras.state.detailT;
            if (this.demandeWUAIAvObj !== null) {
                console.log(this.demandeWUAIAvObj);
                this.mode = 1;
                /********************** Récupération des données des différents objets *************************/
                this.utilisateurService.getOne(this.demandeWUAIAvObj[0]).subscribe(data => {
                    this.utilisateur = data;
                    this.photo = this.utilisateurService.fileUrl + this.utilisateur.photo;
                });
                this.demande = this.demandeWUAIAvObj[1];
                console.log(this.demande);
                this.prixreserv = (this.demande.prix * 1) / 4;
                this.prixdu = (this.demande.prix * 3) / 4;
                this.itineraire = this.demandeWUAIAvObj[2];
                console.log(this.itineraire);
                this.avis = this.demandeWUAIAvObj[3];
                console.log(this.avis);
                /********** Pour afficher la carte ********/
                this.platform.ready().then(() => {
                    if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
                        this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
                    } else {
                        if (this.demande.lieuDepart !== null || this.demande.lieuArrivee) {
                            this.loadMapWGeocode(this.demande.lieuDepart, this.demande.lieuArrivee);
                        } else if (this.demande.depart !== null || this.demande.destination) {
                            this.loadMapWGeocode(this.demande.depart, this.demande.destination);
                        }
                    }

                });
                this.informationsSuppService.getAllByUD(this.demandeWUAIAvObj[1].idUtilisateur, this.demandeWUAIAvObj[1].idAnnonce).subscribe((data: any) => {
                    data.forEach(info => {
                        if (Object.keys(info).length) {
                            for (let inf of this.infoSups) {
                                if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                                    let n = {iconeInformationsSupplementaires: inf.iconeInformationsSupplementaires};
                                    this.infoSup.push(n);
                                }
                            }
                        }
                    });
                    // console.log(this.infoSup);
                  });
            }
        }
    }

    getActualPosition() {
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
        });
        // console.log('Position:{lat:' + this.lat + ', lng:' + this.lng + '}');
    }

    isAuthenticated() {
        return this.authService.isAuthenticated();
    }

    async showToastExist() {
        const toast = await this.toastCtrl.create({
            message: 'Trajet déjà enregistré',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    confirmer(u: UtilisateurDto, d: Demande, i: Itineraire) {
        let ui = new UserItin();
        ui.idU = u.idUtilisateur; //id du conducteur qui a accepté la demande
        ui.idI = i.idItineraire;
        let dataRes: number;
        this.reservationService.getOneByUI(ui).subscribe((res) => {
            console.log(res);
            dataRes = res.status;
        });
        if (dataRes == 200) {
            console.log("Réservation déjà enregistrée");
            this.back();
            this.showToastExist();
        } else {
            this.mode = 2;
            this.paiement.idUtilisateur = this.id;
            this.prixreserv = (d.prix * 1) / 4;
            this.paiement.montantPaiement = this.prixreserv;
            this.push.idU = u.idUtilisateur;
            this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
            this.decompte.montantDecompte = d.prix;
            this.decompte.idUtilisateur = d.idUtilisateur;
            this.reservation.idUtilisateur = this.id; //id du conducteur qui a accepté la demande // this.id;
            this.reservation.idItineraire = i.idItineraire;
            this.reservation.idDriver = u.idUtilisateur;
            this.reservation.destination = d.destination;
            this.reservation.destination = d.lieuArrivee;



        }

    }

    reserver(u: UtilisateurDto, d: Demande, i: Itineraire) {
        this.paiement.idUtilisateur = this.id;
        this.paiement.montantPaiement = this.prixreserv;
        this.push.idU = d.idUtilisateur;
        this.paiement.datePaiement = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        this.paiement.heurePaiement = this.datePipe.transform(new Date(), 'HH:mm:ss');
        this.reservation.idUtilisateur = this.id;
        this.reservation.idItineraire = i.idItineraire;
        this.decompte.montantDecompte = d.prix;
        this.decompte.idUtilisateur = d.idUtilisateur;

        this.touchCustom.additionnalInfos = new AdditionnalInfos();
        this.utilisateurService.getOne(this.id).subscribe(res=>{
            this.utilisateurRecipient = res;
            this.touchCustom.additionnalInfos.recipientEmail = this.utilisateurRecipient.email;
            this.touchCustom.additionnalInfos.recipientFirstName = this.utilisateurRecipient.prenom;
            this.touchCustom.additionnalInfos.recipientLastName = this.utilisateurRecipient.nom;
        });
        this.loadData();
        this.reservation.idDriver = d.idUtilisateur;
        this.reservation.destination = d.destination;
        this.reservation.destination = d.lieuArrivee;
        this.reservation.idItineraire = i.idItineraire;

    }

    backTransaction() {
        this.mode = 6;
        if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
            this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
        } else {
            if (this.demande.lieuDepart !== null || this.demande.lieuArrivee) {
                this.loadMapWGeocode(this.demande.lieuDepart, this.demande.lieuArrivee);
            } else if (this.demande.depart !== null || this.demande.destination) {
                this.loadMapWGeocode(this.demande.depart, this.demande.destination);
            }
        }
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
        this.mode = 3;
        console.log(this.reservation);
    }

    getNumberOrange(e: any) {
        if (e.target.value.length != 8) {
            this.showBtnCheck = true;
            this.errorCustomer = 'Le numéro est incorrecte';
        } else {
            console.log('Numero correct');
            this.showBtnCheck = false;
        }
    }

    nextPaiement() {
        if (this.paiement.numeroClient == null) {
            this.showBtnCheck = true;
        } else {
            if(this.modePaiement == 2) {
                this.showBtnCheck = false;
                this.saveMoovTransaction();
            }
            else {
                this.mode = 4;
                this.showBtnCheck = false;
            }
        }
    }

    getOtp(e: any) {
        if (e.target.value.length != 6) {
            this.showBtnCheck = true;
            this.errorOtp = 'Le champ doit comporter 6 caractères';
            this.champOtp = '';
        } else {
            this.showBtnCheck = false;
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
        this.touchCustom.additionnalInfos = new AdditionnalInfos();
        this.utilisateurService.getOne(this.id).subscribe(res=>{
            this.utilisateurRecipient = res;
            this.touchCustom.additionnalInfos.recipientEmail = this.utilisateurRecipient.email;
            this.touchCustom.additionnalInfos.recipientFirstName = this.utilisateurRecipient.prenom;
            this.touchCustom.additionnalInfos.recipientLastName = this.utilisateurRecipient.nom;
        });
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

    loadData() {
        this.customer.customer_msisdn = this.paiement.numeroClient.toString();
        this.customer.amount = this.paiement.montantPaiement;
        this.customer.otp = this.paiement.codeOtp;
        this.customer.idUtilisateur = this.id;
    }

    loadMoovData() {
        this.touchCustom.recipientNumber = this.paiement.numeroClient.toString();
        this.touchCustom.amount = this.paiement.montantPaiement;
        this.touchCustom.idUtilisateur = this.id;
        this.touchCustom.additionnalInfos.destinataire = this.paiement.numeroClient.toString();
    }

    async saveMoovTransaction() {
        console.log(this.modePaiement);
        console.log(this.reservation);
        this.loadMoovData();
        console.log(this.touchCustom);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Veuillez patienter svp...',
            // duration: 2000,
        })
        await loading.present();
        console.log('******* Paiement par Moov ********');
        this.paiementService.touchMoov(this.touchCustom).subscribe(res => {
            console.log(res);
            if (res.status == 200 && res.body.status.includes('INITIATED')) {
                this.customMoov.amount = res.body.amount;
                this.customMoov.partnerTransactionId = res.body.idFromClient;
                loading.dismiss();
                this.mode = 41;
            } else {
                loading.dismiss();
                this.showToastFail();
            }

        }, error => {
            loading.dismiss();
            this.showToastFail();
            console.log(error);
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
        this.back();
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
                            this.push.message = 'Le passager ' + this.utilisateur.nom + ' ' + this.utilisateur.prenom + ' a confirmé votre acceptation';
                            this.notificationService.sendNotifToOne(this.push).subscribe((data) => {
                                loading.dismiss();
                                this.back();
                                this.paiement = new Paiement();
                                this.infoSup = new Array();
                                this.buttonSaveClicked = false;
                                this.showToastReservation();
                            }, error => {
                                loading.dismiss();
                                this.showToastFail();
                                console.log(error);
                            });
                        } else {
                            loading.dismiss();
                            this.showToastFail();
                        }
                    }, error => {
                        loading.dismiss();
                        this.showToastFail();
                        console.log(error);
                    });
                }, error => {
                    loading.dismiss();
                    this.showToastFail();
                    console.log(error);
                });
            } else {
                loading.dismiss();
                this.showToastFail();
            }
        }, error => {
            loading.dismiss();
            this.showToastFail();
            console.log(error);
        })
    }

    async save() {
        console.log(this.customer);
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Veuillez patienter svp...',
        });
        await loading.present();
        this.loadData();
        // console.log(this.customer);
        if (this.paiement.codeOtp == null) {
            // loading.dismiss();
            this.showBtnCheck = true;
            this.errorOtp = '';
            this.champOtp = 'Champ obligatoire';
        } else {
            console.log(this.customer);
            this.champOtp = '';
            this.showBtnCheck = false;
            this.buttonSaveClicked = true;
            console.log(this.paiement);
            console.log(this.reservation);
                console.log('******* Paiement par orange ********');
                this.paiementService.createOrange(this.customer).subscribe(res => {
                    console.log(res);
                if (res.status == 200 && res.body == 200) {
                        /********** Enregistrement de la réservation **********/
                        this.reservationService.create(this.reservation).subscribe(res => {
                            if (res.status == 200) {
                                /********** Enregistrement du paiement **********/
                                this.paiementService.create(this.paiement).subscribe(res => {
                                    if (res.status == 200) {

                                        /*********** Envoi de la notification **********/
                                        this.push.message = 'Le passager ' + this.utilisateur.nom + ' ' + this.utilisateur.prenom + ' a confirmé votre acceptation';
                                        this.notificationService.sendNotifToOne(this.push).subscribe((res) => {
                                            if (res.status == 200) {
                                                loading.dismiss();
                                                this.back();
                                                this.customer = new CommandDto();
                                                this.paiement = new Paiement();
                                                this.infoSup = new Array();
                                                this.showToastReservation();
                                            } else {
                                                loading.dismiss();
                                                this.showToastFail();
                                            }
                                        }, error => {
                                            loading.dismiss();
                                            this.showToastFail();
                                        });
                                    } else {
                                        loading.dismiss();
                                        this.showToastFail();
                                    }
                                }, error => {
                                    loading.dismiss();
                                    this.showToastFail();
                                });
                            } else {
                                loading.dismiss();
                                this.showToastFail();
                            }
                        }, error => {
                            loading.dismiss();
                            this.showToastFail();
                        });

                    } else {
                        loading.dismiss();
                        console.log(res.status);
                        this.showToastFail();
                    }

                }, error => {
                    loading.dismiss();
                    this.showToastFail();
                });
        }


    }

    /******** Pour la carte *******/

    separartor(val: string) {
        return val.split(",");
    }

    loadMap(depart, destination) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
                zoom: 13
            });

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

    loadMapWGeocode(depart, destination) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };

            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
                zoom: 13
            });

            directionsDisplay.setMap(map);

        this.nativeGeocoder.forwardGeocode(depart, options).then((result: NativeGeocoderResult[]) => {
            if (result !== null && result.length > 0) {
                localStorage.setItem('posD', result[0].latitude + ', ' + result[0].longitude);
            }
        }).catch((error: any) => {
            console.log(error)
        });

        this.nativeGeocoder.forwardGeocode(destination, options).then((result: NativeGeocoderResult[]) => {
            if (result !== null && result.length > 0) {
                localStorage.setItem('posA', result[0].latitude + ', ' + result[0].longitude);
            }
        }).catch((error: any) => {
            console.log(error)
        });
        if (localStorage.getItem('posD') !== null && !(localStorage.getItem('posD').indexOf(undefined) >= 0)) {
            console.log('LocalStorage non vide');
            let request = {
                origin: {
                    lat: parseFloat(localStorage.getItem('posD').split(",")[0]),
                    lng: parseFloat(localStorage.getItem('posD').split(",")[1])
                },
                destination: {
                    lat: parseFloat(localStorage.getItem('posA').split(",")[0]),
                    lng: parseFloat(localStorage.getItem('posA').split(",")[1])
                },
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, (response, status) => {
                if (status == 'OK') {
                    directionsDisplay.setDirections(response);
                }
            });
        } else {
            console.log('LocalStorage vide');
        }
    }

    /******************************* Carte **************************/
    loadMapWithWindow(lat: number, lng: number, data: any) {
        this.map = GoogleMaps.create('map', {
            camera: {
                target: {lat: lat, lng: lng},
                zoom: 16
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true,
                'zoom': true
            }
        });
        let htmlInfoWindow = new HtmlInfoWindow();

        for (let a of data) {
            let frame: HTMLElement = document.createElement('div');
            if (a[0].depart != null) {
                frame.innerHTML = `
        <div id="flip-container">
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].depart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].destination + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
            } else {
                frame.innerHTML = `
        <div id="flip-container">
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].lieuDepart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].lieuArrivee + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
            }


            frame.addEventListener("click", (evt) => {
                console.log(evt.target);
                let root: any = evt.target;
                while (root.parentNode) {
                    root = root.parentNode;
                }
                this.router.navigate(['demande', 'TC'], {state: {data: a, items: data}});
                let container = root.getElementById('flip-container');
                if (container.className.indexOf(' hover') > -1) {
                    container.className = container.className.replace(" hover", "");
                } else {
                    container.className += " hover";
                }
            });
            htmlInfoWindow.setContent(frame, {
                width: "auto"
            });

            const marker: Marker = this.map.addMarkerSync({
                'position': {lat: a[2].latitude, lng: a[2].longitude},
                'draggable': true,
                'disableAutoPan': true,
                'animation': GoogleMapsAnimation.DROP
            });

            marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
                htmlInfoWindow.open(marker);
            });

            marker.trigger(GoogleMapsEvent.MARKER_CLICK);
        }
    }

    /* ============================== Liste ou affichage ============================== */
    getAll() {
        this.demandeService.getAll().subscribe(data => {
            if (data) {
                this.demandes = data;
            }
        });
    }

    getUserAnnonce(idU: number, idA: number, idI: number) {
        this.uai.idA = idA;
        this.uai.idI = idI;
        this.uai.idU = idU;
        this.annonceService.getAllWAIByU(this.uai).subscribe(data => {
            if (data != null) {
                this.annoncesWUAI = data;
                for (let a of this.annoncesWUAI) {
                    this.annonce = a[0];
                    this.utilisateur = a[1];
                    let p = this.utilisateur.photo;
                    /*================ Conversion de la photo pour l'affichage ==============*/
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(p);
                    this.image = sanitizedUrl;
                    // console.log(this.image);
                    this.itineraire = a[2];
                    /*================ Conversion de la date pour personnaliser l'affichage ==============*/
                    let newDate = new Date(Date.parse(this.itineraire.dateDepart));
                    this.dateDep = newDate;
                    /*================ Données de géolocalisation ==============*/
                    this.lat = this.itineraire.latitude;
                    this.long = this.itineraire.longitude;
                    this.avis = a[3];
                }
            }

        })
    }

    getAllByU(id: number) {
        this.demandeService.getOne(id).subscribe(data => {
            this.demandes = data;
        });
    }

    back() {
        this.router.navigate(['/itineraire']);
    }

    /* ============================ Création =============================== */
    add() {
        this.mode = 2;
    }

    backConfirmer() {
      this.mode = 2;
      if (this.demandeWUAIAvObj !== null) {
        this.utilisateurService.getOne(this.demandeWUAIAvObj[0]).subscribe(data => {
            this.utilisateur = data;
            this.photo = this.utilisateurService.fileUrl + this.utilisateur.photo;
        });
        this.demande = this.demandeWUAIAvObj[1];
        this.prixreserv = (this.demande.prix * 1) / 4;
        this.prixdu = (this.demande.prix * 3) / 4;
        this.itineraire = this.demandeWUAIAvObj[2];
        this.avis = this.demandeWUAIAvObj[3];
      }
      this.getNumberOrange(null);
    }

    backPayer() {
      console.log('*******Back payer ******');
      this.mode = 1;
          /********** Pour afficher la carte ********/
          this.platform.ready().then(() => {
              if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
                  this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
              } else {
                  if (this.demande.lieuDepart !== null || this.demande.lieuArrivee) {
                      this.loadMapWGeocode(this.demande.lieuDepart, this.demande.lieuArrivee);
                  } else if (this.demande.depart !== null || this.demande.destination) {
                      this.loadMapWGeocode(this.demande.depart, this.demande.destination);
                  }
              }

          });
    }

    backInfo() {
        this.mode = 1;
            /********** Pour afficher la carte ********/
            this.platform.ready().then(() => {
                if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
                    this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
                } else {
                    if (this.demande.lieuDepart !== null || this.demande.lieuArrivee) {
                        this.loadMapWGeocode(this.demande.lieuDepart, this.demande.lieuArrivee);
                    } else if (this.demande.depart !== null || this.demande.destination) {
                        this.loadMapWGeocode(this.demande.depart, this.demande.destination);
                    }
                }

            });
    }

    showInfoS(d: object) {
      this.informationsSuppService.getAllByUD(d[0], d[1].idDemande).subscribe((data: any) => {
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

    backReservation() {
        this.mode = 3;
    }

    showInfoConducteur(u: UtilisateurDto) {
        this.mode = 5;
        this.photo = this.utilisateurService.fileUrl + u.photo;
        this.enginService.getAllByUser(u.idUtilisateur).subscribe(data => {
            this.engins = data;
        });
        this.avisService.getAllByU(u.idUtilisateur).subscribe(data => {
            this.avis = data;
        });

        this.typeAvisService.getAllByU(u.idUtilisateur).subscribe(data => {
            this.typeAvis.push(data);
            console.log(data);
        });

        this.typeAvisService.getAllNoteByU(u.idUtilisateur).subscribe(data => {
            // console.log(data);
            let t = +data/5;
            this.typeAvisTotal.push(t);
            this.total = t;
            // console.log(this.typeAvisTotal);
        });
    }

    showInfoSupp() {
        this.mode = 6;
        // this.router.navigate(['/informations-supplementaires']);
    }

    avisUtilisateur(a: any) {
        this.router.navigate(['/avis', {data: btoa(a)}]);
    }

    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Réservation effectuée avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastFail() {
        const toast = await this.toastCtrl.create({
            message: 'Réservation échouée',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async reserverOld() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Création en cours...'
        });
        await loading.present();
        this.itineraireService.create(this.itineraire).subscribe(res => {
            this.demande.idUtilisateur = this.annonces.idUtilisateur;
            this.demande.idItineraire = res.body.idItineraire;
            if (this.annonces) {
                this.demande.dateDemande = this.annonces.dateAnnonce;
                this.demande.destination = this.annonces.destination;
            }
            this.demandeService.create(this.demande).subscribe(result => {
                loading.dismiss();
                console.log(result);
                if (result.status == 200) {
                    loading.dismiss();
                    this.ngOnInit();
                    this.showToast();
                }
            }, error => {
                loading.dismiss();
                console.log(error);
            });
        });
    }

    /* ============================ Edition ============================ */
    edit(d: Demande) {
        this.mode = 3;
        this.demandeService.getOne(d.idDemande).subscribe(data => {
            this.demande = data;
            this.itineraireService.getOne(this.demande.idItineraire).subscribe(result => {
                this.itineraire = result;
            })
        });
    }

    async update() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Modification en cours...'
        });
        await loading.present();
        this.demandeService.update(this.demande).subscribe(async res => {
            this.itineraireService.update(this.itineraire).subscribe(async data => {
                await loading.dismiss();
                this.ngOnInit();
            })
        }, async error => {
            await loading.dismiss();
            console.log(error)
        });
    }

    /* ================================= Suppression ===================== */
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

}
