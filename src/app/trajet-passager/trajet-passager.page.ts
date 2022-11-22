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
import {NavigationExtras, Router} from "@angular/router";
import {Alerte} from "../alerte/alerte.model";
import {AlerteService} from "../alerte/alerte.service";
import {DemandeService} from "../demande/demande.service";
import {TypeAvis} from "../type-avis/type-avis.model";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {AlertController, LoadingController, NavController, Platform} from "@ionic/angular";
import {DecompteService} from "../decompte/decompte.service";
import {Decompte} from "../decompte/decompte.model";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import {GoogleMap} from "@ionic-native/google-maps";
import {Reservation, UserItin} from "../reservation/reservation.model";
import {ReservationService} from "../reservation/reservation.service";
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";

/******** Pour la carte ******/
declare var google;

@Component({
    selector: 'app-trajet-passager',
    templateUrl: './trajet-passager.page.html',
    styleUrls: ['../trajet/trajet.page.scss'],
})
export class TrajetPassagerPage implements OnInit {

    mode: number;
    annonces: Annonce;
    annoncesEC: Annonce;
    annonce: Annonce = new Annonce();
    reservations: Reservation;
    reservation: Reservation = new Reservation();
    utilI: UserItin = new UserItin();

    showAD: boolean = false;
    showA: boolean = false;
    showD: boolean = false;
    annoncesWUAIAvObject: any;
    annoncesWUAIAv: Array<any> = [];
    demandesWUAIAv: Array<any> = [];
    annonceWUAIAv: Array<any> = [];
    demandeWUAIAv: Array<any> = [];
    demandesWUAIAvEC: Array<any> = [];
    itineraires: Itineraire;
    itinerairesEC: Itineraire;
    itineraire: Itineraire = new Itineraire();
    itiner: Itineraire = new Itineraire();
    utilisateurs: UtilisateurDto;
    utilisateursEC: UtilisateurDto;
    utilisateursC: Array<any>;
    photo: any;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    paiement: Paiement = new Paiement();
    avisEC: AvisDto;
    alerte: Alerte = new Alerte();
    alertes: Alerte;
    decompte: Decompte = new Decompte();
    id: number;
    idTF: number;
    dateA: string;
    images: any;
    icones: any;
    notif: boolean = false;

    push: OneSignalPushNotification = new OneSignalPushNotification();

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

    buttonSaveClicked: boolean;

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

    constructor(
        private navCtrl: NavController,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private decompteService: DecompteService,
        private demandeService: DemandeService,
        private annonceService: AnnonceService,
        private utilisateurService: UtilisateurService,
        private itineraireService: ItineraireService,
        private aviService: AvisService,
        private paiementService: PaiementService,
        private infoSupService: InformationsSupplementairesService,
        private alerteService: AlerteService,
        private avisService: AvisService,
        private informationsSuppService: InformationsSupplementairesService,
        private reservationService: ReservationService,
        private typeAvisService: TypeAvisService,
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
        this.getActualPosition();
        this.mode = 1;
        this.getAll();
        this.typeAvs = this.typeAvisService.typeavis;
        this.infoSups = this.informationsSuppService.infoSupplementaires;
    }

    back() {
        this.mode = 1;
        this.getAll();
        if (localStorage.getItem('posD') !== null && !(localStorage.getItem('posD').indexOf(undefined) >= 0)) {
            localStorage.removeItem('posD');
            localStorage.removeItem('posA');
        }
    }

    prec() {
        console.log('******* Retour choix gérer mes trajets ******');
        this.router.navigate(['/trajet']);
    }

    getAll() {
        this.trajetP();
        this.trajetPEC();
    }

    isAuthorised() {
        if (this.idTF == 1) {
            this.navCtrl.navigateForward('/home-conducteur');
        } else {
            this.navCtrl.navigateForward('/itineraire');
        }
    }

    showInfoSupps(idU: number, idD: number) {
        let dataTest: any = null;
        this.informationsSuppService.getAllByUD(idU, idD).subscribe(data => {
            dataTest = data;
            dataTest.forEach(info => {
                if (Object.keys(info).length) {
                    for (let inf of this.infoSups) {
                        if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                            this.icones.push(inf.iconeInformationsSupplementaires);
                        }
                    }
                }
            })
        });
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

    /******** ********/

    /*********************** Notifications dans la boîte de dialogue *************/

    async showNotifTerminer(title, msg, d: any) {
        const alert = await this.alertCtrl.create({
            header: title,
            subHeader: msg,
            buttons: [
                {
                    text: 'Le Noter',
                    handler: () => {
                        this.router.navigate(['trajet-conducteur'], {state: {note: d}});

                    }
                }
            ]
        });
        await alert.present();
    }

    async showNotifAnnuler(d: any) {
        const alert = await this.alertCtrl.create({
            header: 'Notification',
            subHeader: 'Un passager a demandé à annuler un de vos trajets',
            buttons: [
                {
                    text: 'Voir',
                    handler: () => {
                        let navigationExtras: NavigationExtras = {state: {detail: d}};
                        this.router.navigate(['trajet-conducteur'], navigationExtras);

                    }
                }
            ]
        });
        await alert.present();
    }

    async showNotifNote() {
        const alert = await this.alertCtrl.create({
            header: 'Notification',
            subHeader: 'Un nouveau passager a été ajouté à un de vos trajets',
            buttons: ['Ok']
        });
        await alert.present();
    }

    /*********************** Fin ***************/

    /*********** Historique des trajets *********/
    trajetP() {
        this.demandeService.getAllWUAIAvFP(this.id).subscribe(data => {
            this.demandesWUAIAv = data;
            for (let a of this.demandesWUAIAv) {
                this.annonces = a[0];
                if (this.annonces.dateAnnonce) {
                    this.dateA = this.datePipe.transform(this.annonces.dateAnnonce, 'EEEE d MMMM ');
                }
                this.utilisateurs = a[1];
                let p = a[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.itineraires = a[2];
                // this.demandes = a[4];
            }
        });
    }

    /*********** Trajets en cours *********/
    trajetPEC() {
        this.demandeService.getAllWUAIAvFPEC(this.id).subscribe(data => {
            this.demandesWUAIAvEC = data;
            // console.log(this.demandesWUAIAvEC);
            if (this.demandesWUAIAvEC) {
                this.getTrajets(this.demandesWUAIAvEC);
            }
        });
    }

    /**************** ****************/
    getTrajets(d: any) {
        for (let a of d) {
            this.annoncesEC = a[0];
            if (this.annoncesEC !== null) {
                this.dateA = this.datePipe.transform(this.annoncesEC.dateAnnonce, 'EEEE d MMMM ');
                this.showA = true;
            }
            let p = a[1].photo;
            if (p != null) {
                let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.images = sanitizedUrl;
            }
            this.utilisateursEC = a[1];
            this.itinerairesEC = a[2];
            this.avisEC = a[3];
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
        console.log(d);
        this.mode = 2;
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        this.utilisateur = d[1];

        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.reservationService.getOne(d[4]?.idReservation).subscribe(data =>{
            this.reservation = data;
        });
        /********* Pour l'envoi de la notification *******/
        this.push.idU = this.reservation.idDriver;
        this.push.data = d;
        /*********** **********/
        this.avi = d[3];
        this.showInfoSupps(this.annonce.idUtilisateur, this.annonce.idAnnonce);
        this.annoncesWUAIAvObject = d;
    }

    async validerAnnulation() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Annulation en cours...',
        });
        this.alerte.idAnnonce = this.annonce.idAnnonce;
        this.alerte.idUtilisateur = this.annonce.idUtilisateur;
        this.alerteService.create(this.alerte).subscribe(res => {
            if (res.status == 200) {
                this.reservation.annuler = true;
                this.reservationService.update(this.reservation).subscribe(res => {
                    if (res != null) {
                        loading.dismiss();
                        this.mode = 3;
                        this.push.message = 'Un passager a demandé à annuler un de vos trajets';
                        this.push.action = 'Voir';
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


    /*********************** Terminer trajet *************/
    terminer(d: any) {
        console.log(d);
        this.mode = 4;
        this.annoncesWUAIAvObject = d;
        console.log(this.annoncesWUAIAvObject);
        this.annonce = d[0];
        if (this.annonce.dateAnnonce) {
            this.dateA = this.datePipe.transform(this.annonce.dateAnnonce, 'EEEE d MMMM ');
        }
        this.utilisateur = d[1];
        let p = d[1].photo;
        if (p != null) {
            let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
            this.utilisateur.photo = sanitizedUrl;
        }
        this.itineraire = d[2];
        this.reservations = d[4];

        this.utilI.idU = this.reservations.idUtilisateur;
        this.utilI.idI = this.reservations.idItineraire;
        this.reservationService.getOneByUI(this.utilI).subscribe(data => {
            this.reservation = data.body;
            console.log(this.reservation);
        });
        this.avi.dateAvis = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
            this.avi.idUtilisateur = d[0].idUtilisateur;
            this.avi.idRecipient = this.reservations.idDriver;

        /********* Pour l'envoi de la notification *******/
            this.push.idU = this.reservations.idDriver;
            this.utilisateurService.getOne(this.id).subscribe(data => {
                this.push.data = JSON.stringify(data);
            });

        this.decompte.montantDecompte = this.annonce.prix;
        this.decompte.idUtilisateur = this.annonce.idUtilisateur;

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

    initialize() {
        this.rateF = 0;
        this.rateS = 0;
        this.rateC = 0;
        this.rateCo = 0;
        this.rateP = 0;
        this.avi = new AvisDto();
        this.typeAvi = new TypeAvis();
        this.demandesWUAIAv = [];
        this.demandesWUAIAvEC = [];
        this.buttonSaveClicked = false;
    }

    async validerNote() {
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Enregistrement en cours...',
            // duration: 2000
        });

        await loading.present();
        /********** Enregistrement des avis *********/
        this.avisService.create(this.avi).subscribe(result => {
            if (result.status == 200) {
                            /******** Enregistrement des libellés concernant les avis **********/
                            for (let t of this.typeAs) {
                                let res = this.typeAvs.find(ta => ta.idTypeAvis == t.val1);
                                this.typeAvi.libelleTypeAvis = res.libelleTypeAvis;
                                this.typeAvi.idAvis = result.body.idAvis;
                                this.typeAvi.note = t.val2;
                                console.log(this.typeAvi);
                                this.typeAvisService.create(this.typeAvi).subscribe(resp => {
                                    loading.dismiss();
                                    console.log(resp);
                                    this.initialize();
                                    this.ngOnInit();
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
        });
    }

    async validerFin() {
        // this.buttonSaveClicked = true;
        const loading = await this.loadingCtrl.create({
            cssClass: 'my-custom-class',
            message: 'Enregistrement en cours...',
            // duration: 2000
        });

        await loading.present();
        /********** Enregistrement des avis *********/
        this.avisService.create(this.avi).subscribe(result => {

            if (result.status == 200) {
                this.reservation.confirmerArrivee = true;
                this.reservationService.update(this.reservation).subscribe(res => {
                    console.log(res);
                    this.push.message = 'Un passager a signalé avoir terminé un de vos trajets puis vous a attribué une note';
                    this.push.action = 'Le noter';
                    this.notificationService.sendNotifToOne(this.push).subscribe((res) => {
                        if (res.status == 200) {
                            this.push.data = null;
                            this.push.action = null;
                            /******** Enregistrement des libellés concernant les avis **********/
                            for (let t of this.typeAs) {
                                let res = this.typeAvs.find(ta => ta.idTypeAvis == t.val1);
                                this.typeAvi.libelleTypeAvis = res.libelleTypeAvis;
                                this.typeAvi.idAvis = result.body.idAvis;
                                this.typeAvi.note = t.val2;
                                console.log(this.typeAvi);
                                this.typeAvisService.create(this.typeAvi).subscribe(resp => {
                                    loading.dismiss();
                                    console.log(resp);
                                    this.initialize();
                                    this.ngOnInit();
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
                }, error => {
                    loading.dismiss();
                    this.echecSaveAvis();
                    console.log(error);
                });
            } else {
                loading.dismiss();
                this.echecSaveAvis();
            }
        }, error => {
            loading.dismiss();
            this.echecSaveAvis();
        });
    }


    /*********************** Détails d'un trajet *************/

    /******** Pour la carte *******/
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
    }

    separartor(val: string) {
        return val.split(",");
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
                if(this.mode == 6) {
                    return false;
                } else {
                    return true;
                }
            }

            loadMapS() {
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

        const map = new google.maps.Map(document.getElementById('mapP'), {
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


        const map = new google.maps.Map(document.getElementById('mapP'), {
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

    details(d: any) {
        // console.log(d);
        this.utilisateursC = new Array<UtilisateurDto>();
        this.utilisateurService.getOne(this.id).subscribe((data) => {
        });
        this.mode = 6;
        this.demandesWUAIAv = [];
        this.demandesWUAIAvEC = [];
        let ui = new UserItin();
        ui.idI = d[2].idItineraire;
        ui.idU = d[0].idUtilisateur;
        this.annonce = d[0];
        this.itineraire = d[2];
        this.avi = d[3];
        this.alerteService.getOnebyAnUser(this.annonce.idAnnonce, this.annonce.idUtilisateur).subscribe(data =>{
            this.alerte = data;
        });

        this.annonceService.getAllByIAn(d[2].idItineraire).subscribe(data => {
            this.annoncesWUAIAv = data;
            /********* Informations de l'utilisateur qui a publié ou demandé le trajet *******/
                 // console.log('************** Demande ***********');
                this.reservationService.getAllByItin(ui.idI).subscribe(data => {
                    this.reservation = data;
                    let dataArray=[];
                    dataArray.push(data);
                    if (dataArray.length>0) {
                      console.log(data);
                        for(let dt of dataArray) {
                          this.utilisateurService.getOne(dt[0]?.idDriver).subscribe(data=> {
                            this.utilisateursC.push(data);
                              this.photo = this.utilisateurService.fileUrl + data.photo;
                          });
                        }
                    } else {

                    }
                });

                /********** Pour afficher la carte ********/
                this.platform.ready().then(() => {
                    if (this.itineraire.positionDepart !== null && this.itineraire.positionArrivee !== null) {
                        this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
                    } else if (this.annonce.depart !== null && this.annonce.destination !== null) {
                            this.loadMapWGeocode(this.annonce.depart, this.annonce.destination);
                    } else if (this.annonce.lieuDepart !== null && this.annonce.lieuArrivee !== null) {
                            this.loadMapWGeocode(this.annonce.lieuDepart, this.annonce.lieuArrivee);
                    } else {
                      this.loadMapS();
                    }

                });
        });
        this.showInfoSupps(this.annonce.idUtilisateur, this.annonce.idAnnonce);

    }

    /****************** Noter connducteur  ***********/
    noter(u: UtilisateurDto) {
        this.mode = 4;
        this.utilisateur = u;
        this.avi.idUtilisateur = this.id;
        this.avi.idRecipient = u.idUtilisateur;
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


}
