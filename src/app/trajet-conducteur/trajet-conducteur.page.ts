import {Component, OnInit} from '@angular/core';
import {Annonce} from "../annonce/annonce.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {Paiement} from "../paiement/paiement.model";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {AvisDto} from "../avis/avis.model";
import {AnnonceService} from "../annonce/annonce.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {ItineraireService} from "../itineraire/itineraire.service";
import {AvisService} from "../avis/avis.service";
import {PaiementService} from "../paiement/paiement.service";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {DatePipe} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {Alerte} from "../alerte/alerte.model";
import {AlerteService} from "../alerte/alerte.service";
import {AlertController, LoadingController, NavController, Platform} from "@ionic/angular";
import {TypeAvis} from "../type-avis/type-avis.model";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {DemandeService} from "../demande/demande.service";
import {Reservation} from "../reservation/reservation.model";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import {GoogleMap} from "@ionic-native/google-maps";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {Demande} from "../demande/demande.model";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";
import {ReservationService} from "../reservation/reservation.service";

/******** Pour la carte ******/
declare var google;

@Component({
    selector: 'app-trajet-conducteur',
    templateUrl: './trajet-conducteur.page.html',
    styleUrls: ['../trajet/trajet.page.scss'],
})
export class TrajetConducteurPage implements OnInit {

    mode: number;
    annonces: Annonce;
    annoncesEC: Annonce;
    annonce: Annonce = new Annonce();
    demande: Demande = new Demande();
    demandesWUIAv: Array<any> = [];
    annoncesWUAIAv: Array<any> = [];
    annoncesWUAIAvEC: Array<any> = [];
    annoncesWUAIAvObj: any;
    itineraires: Itineraire;
    itinerairesEC: Itineraire;
    itineraire: Itineraire = new Itineraire();
    itiner: Itineraire = new Itineraire();
    utilisateurs: UtilisateurDto;
    utilisateursEC: UtilisateurDto;
    utilisateursP: Array<any>;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    paiement: Paiement = new Paiement();
    alerte: Alerte = new Alerte();
    alertes: Alerte;
    avisEC: AvisDto;
    reservations: Reservation;
    reservation: Reservation = new Reservation();
    id: number = 0;
    idTF: number = 0;
    dateA: string;
    images: any;
    icones: any;
    notif: boolean = false;
    showA: boolean = false;
    showD: boolean = false;
    show: boolean = false;

    /********* pour la gestion des infos supplémentaires *********/
    infoSup: InformationsSupplementaires[] = new Array();
    infoSups: InformationsSupplementaires[] = [];

    /************ Gestion de la notation  *********/
    avi: AvisDto = new AvisDto();
    avis: AvisDto;
    typeAvi: TypeAvis = new TypeAvis();
    typeAvis: TypeAvis;
    typeAs = [];
    typeAvs: TypeAvis[] = [];
    rateP: number = 0;
    rateS: number = 0;
    rateF: number = 0;
    rateCo: number = 0;
    rateC: number = 0;

    /********* Notification *******/
    push: OneSignalPushNotification = new OneSignalPushNotification();

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
    photo: any;

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private annonceService: AnnonceService,
        private demandeService: DemandeService,
        private utilisateurService: UtilisateurService,
        private itineraireService: ItineraireService,
        private aviService: AvisService,
        private alerteService: AlerteService,
        private paiementService: PaiementService,
        private typeAvisService: TypeAvisService,
        private reservationService: ReservationService,
        private informationsSuppService: InformationsSupplementairesService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer,
        private notificationService: NotificationsService,
        private router: Router,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        public platform: Platform
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        this.idTF = +localStorage.getItem('Role');
        this.mode = 1;
        this.typeAvs = this.typeAvisService.typeavis;
        this.infoSups = this.informationsSuppService.infoSupplementaires;
        this.getActualPosition();
        this.getAll();
        if (this.router.getCurrentNavigation().extras.state) {
            this.annoncesWUAIAvObj = this.router.getCurrentNavigation().extras.state.note;
            if (this.annoncesWUAIAvObj != null) {
                this.utilisateur = this.annoncesWUAIAvObj;
                this.noter(this.utilisateur);
            } else {
                this.details(this.router.getCurrentNavigation().extras.state.detail);
            }
        } else {
            this.mode = 1;
            this.getAll();
        }
    }

    prec() {
        console.log('******* Retour choix gérer mes trajets ******');
        this.router.navigate(['/trajet']);
    }

    trustImage(item: any) {
        return this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + item);
    }

    back() {
        this.mode = 1;
        if (localStorage.getItem('posD') !== null && !(localStorage.getItem('posD').indexOf(undefined) >= 0)) {
            localStorage.removeItem('posD');
            localStorage.removeItem('posA');
        }
        this.getAll();
    }

    getLocation() {
        this.geolocation.getCurrentPosition().then((resp) => {
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

    backNoter() {
        this.mode = 6;
    }

    getAll() {
        this.trajetC();
        this.trajetCEC();
    }

    isAuthorised() {
        if (this.idTF == 1) {
            this.navCtrl.navigateForward('/home-conducteur');
        } else {
            this.navCtrl.navigateForward('/itineraire');
        }
    }

    showInfoSupps(idU: number, idA: number) {
        let dataTest: any;
        this.informationsSuppService.getAllByUAn(idU, idA).subscribe(data => {
            dataTest = data;
            for (let a of this.annoncesWUAIAv) {
                dataTest.forEach(info => {
                    if (Object.keys(info).length) {
                        for (let inf of this.infoSups) {
                            if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                                this.icones.push(inf.iconeInformationsSupplementaires);
                                a[4] = this.icones;
                            }
                        }
                    }
                })
            }
        });
    }

    /*********** Historique des trajets *********/
    trajetC() {
        this.annonceService.getAllWUAIAvFC(this.id).subscribe(data => {
            this.annoncesWUAIAv = data;
            for (let a of this.annoncesWUAIAv) {
                this.annonces = a[0];
                if (this.annonces.dateAnnonce) {
                    this.dateA = this.datePipe.transform(this.annonces.dateAnnonce, 'EEEE d MMMM ');
                }
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = a[1];
                this.itineraires = a[2];
            }
        });
    }

    /*********** Trajets en cours *********/
    trajetCEC() {
        this.annonceService.getAllWUAIAvFCEC(this.id).subscribe(data => {
            this.annoncesWUAIAvEC = data;
            console.log(this.annoncesWUAIAvEC);
            if (this.annoncesWUAIAvEC) {
                this.getTrajets(this.annoncesWUAIAvEC);
            }
        });
    }

    /**************** ****************/
    getTrajets(d: any) {
        for (let a of d) {
            this.annoncesEC = a[0];
            if (this.annoncesEC.dateAnnonce) {
                this.dateA = this.datePipe.transform(this.annoncesEC.dateAnnonce, 'EEEE d MMMM ');
            }
            let p = a[1].photo;
            if (p != null) {
                let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.images = sanitizedUrl;
            }
            this.utilisateursEC = a[1];
            this.itinerairesEC = a[2];
            this.avisEC = a[3];
            this.reservations = a[4];
        }
    }

    /**************** Affichage d'un seul trajet ****************/
    getTrajet(d: any) {
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        this.utilisateur = d[1];
        let p = this.utilisateur.photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.avi = d[3];
        this.showInfoSupps(this.annonce.idUtilisateur, this.annonce.idAnnonce);
    }

    /*********************** Annuler trajet *************/

    async echecSaveAnnulation() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Echec',
            subHeader: "Annulation échouée",
            message: "Votre annulation n'a pas pu être enregistrée, veuillez re-essayer svp!",
            buttons: ['OK']
        });

        await alert.present();
    }

    annuler(d: any) {
        // console.log(d);
        this.mode = 2;
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        this.utilisateur = d[1];
        let p = this.utilisateur.photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];

        this.reservationService.getOne(d[4]?.idReservation).subscribe(data =>{
            this.reservation = data;
        });
        /********* Pour l'envoi de la notification *******/
        this.push.idU = this.reservation.idUtilisateur;
        /*********** **********/

        this.avi = d[3];
        this.showInfoSupps(this.annonce.idUtilisateur, this.annonce.idAnnonce);
    }

    async validerAnnulation() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Annulation en cours...',
        });

        await loading.present();

        this.alerte.idAnnonce = this.annonce.idAnnonce;
        this.alerte.idUtilisateur = this.id;
        this.alerteService.create(this.alerte).subscribe(res => {
            if (res.status == 200) {
                this.reservation.annuler = true;
                this.reservationService.update(this.reservation).subscribe(res => {
                    if (res != null) {
                        loading.dismiss();
                        this.mode = 3;
                        if(this.annonce?.depart !== null)
                        {
                            this.push.message = 'Le conducteur a demandé à annuler le trajet: '+this.annonce?.depart;
                        } else {
                            this.push.message = 'Le conducteur a demandé à annuler le trajet: '+this.annonce?.lieuDepart;
                        }
                        this.notificationService.sendNotifToOne(this.push).subscribe((data) => {
                        });
                    } else {
                        loading.dismiss();
                        this.echecSaveAnnulation();
                    }
                }, error => {
                    loading.dismiss();
                    this.echecSaveAnnulation();
                });
            } else {
                loading.dismiss();
                this.echecSaveAnnulation();
            }
        }, error => {
            loading.dismiss();
            this.echecSaveAnnulation();
        });

    }

    getRembourser(e: any) {
        if (e.target.checked) {
            this.alerte.rembourser = true;
        } else {
            this.alerte.rembourser = false;
        }
        return this.alerte.rembourser;
    }

    /*********************** Notifications dans la boîte de dialogue *************/

    async showNotifTerminer() {
        const alert = await this.alertCtrl.create({
            header: 'Notification',
            subHeader: 'Veuillez confirmer que vous êtes bien arrivé à destination',
            buttons: ['OK']
        });
        await alert.present();
    }

    /*********************** Terminer trajet *************/
    terminer(d: any) {
        this.utilisateur = d[1];
        this.reservation = d[4];
        this.avi.idUtilisateur = d[0].idUtilisateur;
        this.avi.idRecipient = this.reservation.idDriver;

        /********* Pour l'envoi de la notification *******/
        this.push.idU = this.reservation.idUtilisateur;
        this.push.message = 'Veuilez confirmer la fin du trajet';
        this.notificationService.sendNotifToOne(this.push).subscribe(data => {
        });

        /********** Pour l'envoi du mail ********/
        this.utilisateurService.finalise(this.utilisateur.idUtilisateur).subscribe(res => {
            console.log()
        });

    }

    /*********************** Détails d'un trajet *************/

    /******** Pour la carte *******/

    separartor(val: string) {
        return val.split(",");
    }

    getActualPosition() {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            this.lat = resp.coords.latitude;
            this.lng = resp.coords.longitude;
            localStorage.setItem('lat', resp.coords.latitude.toString());
            localStorage.setItem('lng', resp.coords.longitude.toString());
        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
        });
        // console.log('Position:{lat:' + this.lat + ', lng:' + this.lng + '}');
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

    geocodeAddressD(depart) {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.forwardGeocode(depart, options).then((result: NativeGeocoderResult[]) => {
            if (result !== null && result.length > 0) {
                localStorage.setItem('posD', result[0].latitude + ', ' + result[0].longitude);
                console.log(('Enregistrement local de depart'));
                this.posD.lat = +result[0].latitude;
                this.posD.lng = +result[0].longitude;
            }
        }).catch((error: any) => {
            console.log(error);
            alert("Direction introuvable");
        });

    }

    geocodeAddressA(destination) {
        let options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
        };
        this.nativeGeocoder.forwardGeocode(destination, options).then((result: NativeGeocoderResult[]) => {
            if (result !== null && result.length > 0) {
                localStorage.setItem('posA', result[0].latitude + ', ' + result[0].longitude);
                console.log(('Enregistrement local darrivée'));
                this.posA.lat = +result[0].latitude;
                this.posA.lng = +result[0].longitude;
            }
        }).catch((error: any) => {
            console.log(error);
            // alert("Direction introuvable");
        });

    }

    checkMode() {
            // console.log(this.mode);
            if(this.mode == 6) {
                return false;
            } else {
                return true;
            }
        }

        loadMapS() {
          const map = new google.maps.Map(document.getElementById('mapC'), {
            center: {lat: +localStorage?.getItem('lat'), lng: +localStorage?.getItem('lng')},
              zoom: 13
          });
        }

    loadMap(depart, destination) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);
        // console.log(document.getElementById('map'));

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        // console.log(resp);

        // récupération des coordonnées géographiques(latitude et longitude) de la position actuelle

        const map = new google.maps.Map(document.getElementById('mapC'), {
            // center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
            // center: {lat: this.lat, lng: this.lng},
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
            travelMode: google.maps.TravelMode.DRIVING // 'DRIVING'
        };
        directionsService.route(request, (response, status) => {
            if (status == 'OK') {
                directionsDisplay.setDirections(response);
                /*var leg = response.routes[ 0 ].legs[ 0 ];
                new google.maps.Marker({
                  position: leg.start_location,
                  map: map,
                  icon: '/assets/icons/car_red.png'});
                new google.maps.Marker({
                  position: leg.end_location,
                  map: map,
                  icon: '/assets/icons/car.png'});*/
            }
        });
    }

    loadMapWGeocode(depart: string, destination: string) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);
        this.geocodeAddressD(depart);
        this.geocodeAddressA(destination);

        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        // récupération des coordonnées géographiques(latitude et longitude) de la position actuelle

        const map = new google.maps.Map(document.getElementById('mapC'), {
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
            travelMode: google.maps.TravelMode.DRIVING // 'DRIVING'
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

    details(d: any) {
        // console.log(d);
        this.utilisateursP = new Array<UtilisateurDto>();
        this.mode = 6;
        this.annoncesWUAIAv = [];
        this.annoncesWUAIAvEC = [];
        let idI = d[2].idItineraire;
        this.demandeService.getAllByIAn(d[2].idItineraire).subscribe(data => {
            this.demandesWUIAv = data;
            if (this.annonce.dateAnnonce) {
                this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
            }

            this.reservationService.getAllByItin(idI).subscribe(data => {
                this.reservation = data;
                let dataArray=[];
                dataArray.push(data);
                if (dataArray.length>0) {
                    // console.log(data);
                    for(let dt of dataArray) {
                        this.utilisateurService.getOne(dt[0].idUtilisateur).subscribe(data=> {
                            this.utilisateursP.push(data);
                            console.log(this.utilisateursP);
                            this.photo = this.utilisateurService.fileUrl + data.photo;
                        });
                    }
                } else {
                    this.show = false;
                }
            });
            /********* Informations de l'utilisateur qui a publié ou demandé le trajet *******/

            /*if (Object.keys(d[0]).length > 0) {
                this.annonce = d[0];
                this.utilisateurService.getOne(d[0].idUtilisateur).subscribe(data => {
                    this.utilisateur = data;
                    let p = data.photo;
                    if (p != null) {
                        this.utilisateur.photo = this.utilisateurService.fileUrl + p;
                    }
                });*/
                /********** Pour afficher la carte ********/
                this.platform.ready().then(() => {
                    if (this.itineraire.positionDepart !== null && this.itineraire.positionArrivee) {
                        this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
                    } else if (this.annonce.depart !== null && this.annonce.destination !== null) {
                            this.loadMapWGeocode(this.annonce.depart, this.annonce.destination);
                    } else if (this.annonce.lieuDepart !== null && this.annonce.lieuArrivee !== null) {
                            this.loadMapWGeocode(this.annonce.lieuDepart, this.annonce.lieuArrivee);
                    } else {
                      this.loadMapS();
                    }

                });
            /*} else {
                this.demande = d[4];
                this.utilisateurService.getOne(d[4].idUtilisateur).subscribe(data => {
                    this.utilisateur = data;
                    let p = data.photo;
                    if (p != null) {
                        this.utilisateur.photo = this.utilisateurService.fileUrl + p;
                    }
                });*/
                /********** Pour afficher la carte ********/
                this.platform.ready().then(() => {
                    if (this.itineraire.positionDepart !== null && this.itineraire.positionArrivee !== null) {
                        this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
                    } else if (this.demande.depart !== null && this.demande.destination !== null) {
                            this.loadMapWGeocode(this.demande.depart, this.demande.destination);
                    } else if (this.demande.lieuDepart !== null && this.demande.lieuArrivee !== null) {
                            this.loadMapWGeocode(this.demande.lieuDepart, this.demande.lieuArrivee);
                    } else {
                      this.loadMapS();
                    }

                });
            //}

            this.itineraire = d[2];
            this.avi = d[3];
            this.alerteService.getOnebyAnUser(this.annonce.idAnnonce, this.annonce.idUtilisateur).subscribe(data =>{
                this.alerte = data;
                // console.log(this.alerte);
            });

        });


        this.showInfoSupps(this.annonce.idUtilisateur, this.annonce.idAnnonce);
    }

    async echecSaveAvis() {
        const alert = await this.alertCtrl.create({
            cssClass: 'my-custom-class',
            header: 'Echec',
            subHeader: "Enregistrement échouée",
            message: "Votre avis n'a pas pu être enregistré, veuillez re-essayer svp!",
            buttons: ['OK']
        });

        await alert.present();
    }

    /****************** Noter passager ***********/
    noter(u: UtilisateurDto) {
        this.mode = 4;
        this.utilisateur = u;
        this.avi.idUtilisateur = this.id;
        this.avi.idRecipient = u.idUtilisateur;
    }

    /********************** Get stars *****************/

    onRateP(e: any, r, note) {
        if (note != 0) {
            this.rateP = note;
        } else {
            this.rateP = 0;
        }
        let t = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    onRateS(e: any, r, note) {
        if (note != 0) {
            this.rateS = note;
        } else {
            this.rateS = 0;
        }
        let t = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    onRateF(e: any, r, note) {
        if (note != 0) {
            this.rateF = note;
        } else {
            this.rateF = 0;
        }
        let t = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    onRateCo(e: any, r, note) {
        if (note != 0) {
            this.rateCo = note;
        } else {
            this.rateCo = 0;
        }
        let t = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    onRateC(e: any, r, note) {
        if (note != 0) {
            this.rateC = note;
        } else {
            this.rateC = 0;
        }
        let t = {val1: r, val2: note};
        return this.typeAs.push(t);
    }

    initialize() {
        this.rateF = 0;
        this.rateS = 0;
        this.rateC = 0;
        this.rateCo = 0;
        this.rateP = 0;
        this.avi = new AvisDto();
        this.typeAvi = new TypeAvis();
    }


    async validerNote() {
        // this.buttonSaveClicked = true;
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Enregistrement en cours...',
            // duration: 2000
        });

        await loading.present();
        /********** Enregistrement des avis *********/
        this.aviService.create(this.avi).subscribe(result => {
            if(result.status == 200) {
                /******** Enregistrement des libellés concernant les avis **********/
                for (let t of this.typeAs) {
                    let res = this.typeAvs.find(ta => ta.idTypeAvis == t.val1);
                    this.typeAvi.libelleTypeAvis = res.libelleTypeAvis;
                    this.typeAvi.idAvis = result.body.idAvis;
                    this.typeAvi.note = t.val2;
                    console.log(this.typeAvi);
                    this.typeAvisService.create(this.typeAvi).subscribe(resp => {
                        console.log(resp);
                        loading.dismiss();
                        this.ngOnInit();
                        this.initialize();
                    }, error => {
                        loading.dismiss();
                        this.echecSaveAvis();
                        console.log(error);
                    });
                }
            } else {
                loading.dismiss();
                this.echecSaveAvis();
            }

        }, error => {
            loading.dismiss();
            this.echecSaveAvis();
            console.log(error);
        });
    }

    isC() {
        if (this.idTF && this.idTF == 1) {
            return true;
        } else {
            return false;
        }
    }

    isP() {
        if (this.idTF && this.idTF == 2) {
            return true;
        } else {
            return false;
        }
    }

}
