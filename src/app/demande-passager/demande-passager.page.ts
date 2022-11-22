import {Component, OnInit} from '@angular/core';
import {PopoverPage} from "../demande/demande.page";
import {AlertController, Platform, PopoverController, ToastController} from "@ionic/angular";
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Demande} from "../demande/demande.model";
import {Reservation} from "../reservation/reservation.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {Annonce} from "../annonce/annonce.model";
import {AvisDto} from "../avis/avis.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {Recherche} from "../recherche/recherche.model";
import {DemandeService} from "../demande/demande.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {DomSanitizer} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {RechercheService} from "../recherche/recherche.service";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {ReservationService} from "../reservation/reservation.service";
import {TypeAvis} from "../type-avis/type-avis.model";
import {Engin} from "../engin/engin.model";
import {Admin} from "../admin/admin.model";
import {EnginService} from "../engin/engin.service";
import {AvisService} from "../avis/avis.service";
import {TypeAvisService} from "../type-avis/type-avis.service";
import {AdminService} from "../admin/admin.service";
import {NotificationsService, OneSignalPushNotification} from "../notifications.service";
import {NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult} from "@ionic-native/native-geocoder/ngx";
import {Geolocation} from "@ionic-native/geolocation/ngx";

/******** Pour la carte ******/
declare var google;


@Component({
    selector: 'app-demande-passager',
    templateUrl: './demande-passager.page.html',
    styleUrls: ['../demande/demande.page.scss'],
})
export class DemandePassagerPage implements OnInit {

    subscription: Subscription;
    val1: string;
    val2: string;
    demandes: Demande;
    demande: Demande = new Demande();
    annonces: Annonce;
    annonce: Annonce = new Annonce();
    reservations: Reservation;
    reservation: Reservation = new Reservation();
    itineraires: Itineraire;
    itineraire: Itineraire = new Itineraire();
    avis: AvisDto;
    avi: AvisDto = new AvisDto();
    utilisateurs: UtilisateurDto;
    utilisateur: UtilisateurDto = new UtilisateurDto();
    infoConducteurs: UtilisateurDto;
    demandesWUAIAv: Array<any> = [];
    recherche: Recherche = new Recherche();
    engins: Engin;
    user: Admin = new Admin();
    id: number = 0;
    idTF: number = 0;
    pushData: any;
    choixA: string = 'A';
    showA: boolean = false;
    choixM: string = 'M';
    showM: boolean = false;
    choixU: string = 'U';
    showU: boolean = false;
    choixV: string = 'V';
    showV: boolean = false;
    mode: number;
    engin: string;
    voyage: string;
    images: any;
    icones: any;
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
    PlaceA: Array<any> = [{val: 1}, {val: 2}, {val: 3}, {val: 4}, {val: 5}, {val: 6}, {val: 7}, {val: 8}, {val: 9}, {val: 10}];
    PlaceM: Array<any> = [{val: 1}, {val: 2}];
    photo: any;
    push: OneSignalPushNotification = new OneSignalPushNotification();

    /****** Recherche ******/
    totalFiltre: number = 0;
    dateDep: boolean = false;
    dateArr: boolean = false;
    showButton: boolean = false;
    errorDate: string;
    buttonSaveClicked: boolean;

    /********* pour la gestion des infos supplémentaires *********/
    infoSup: InformationsSupplementaires[] = new Array();
    infoSups: InformationsSupplementaires[] = [];

    /********** pour la gestion des notes *********/
    typeAvi: TypeAvis = new TypeAvis();
    typeAvis: TypeAvis[] = new Array();
    typeAs = [];
    typeAvisTotal = [];
    total: number = 0;

    /******** Pour afficher la taille du tableau *******/
    objectKeys = Object.keys;

    /******** Pour la carte *******/
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
        private route: ActivatedRoute,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private popCtrl: PopoverController,
        private sanitizer: DomSanitizer,
        private informationsSuppService: InformationsSupplementairesService,
        private demandeService: DemandeService,
        private utilisateurService: UtilisateurService,
        private rechercheService: RechercheService,
        private reservationService: ReservationService,
        private notificationService: NotificationsService,
        private enginService: EnginService,
        private avisService: AvisService,
        private typeAvisService: TypeAvisService,
        private userService: AdminService,
        private datePipe: DatePipe,
        private platform: Platform,
        private geolocation: Geolocation,
        private nativeGeocoder: NativeGeocoder,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.id = +localStorage.getItem('ID_User');
        // console.log(this.id);
        this.idTF = +localStorage.getItem('Role');
        this.mode = 1;
        this.totalFiltre = 0;
        this.infoSups = this.informationsSuppService.infoSupplementaires;
        this.subscription = this.route.params.subscribe((params) => {
            if (params['a'] != null && params['d'] != null) {
                this.engin = params['a'];
                this.voyage = params['d'];
            }
        });

        this.getActualPosition();

        /*********************************** Recherche venant du composant recherche ******************************************/

        if (this.router.getCurrentNavigation().extras.state) {
            console.log('******** Résultat venant du composant ******');
            this.mode = 1;
            this.demandesWUAIAv = this.router.getCurrentNavigation().extras.state.demandesWUAIAv;
            console.log(this.demandesWUAIAv);
            this.getAll();
        }
        /*********************************** Liste des trajets auto urbain ******************************************/
        else if (this.engin.match(this.choixA) && this.voyage.match(this.choixU)) {
            console.log('********** Urbain Auto **********');
            this.mode = 1;
            this.showA = true;
            this.showU = true;
            this.trajetAU();
        }
        /*********************************** Liste des trajets auto voyage ******************************************/
        else {
            if (this.engin.match(this.choixA) && this.voyage.match(this.choixV)) {
                console.log('********** Voyage Auto ************');
                this.mode = 1;
                this.showA = true;
                this.showV = true;
                this.trajetAV()
            } else {
                /*********************************** Liste des trajets moto urbain ******************************************/
                if ((this.engin.match(this.choixM)) && (this.voyage.match(this.choixU))) {
                    console.log('********* Urbain Moto *********');
                    this.mode = 1;
                    this.showU = true;
                    this.showM = true;
                    this.trajetMU();
                }
                /*********************************** Liste des trajets moto voyage ******************************************/
                else if ((this.engin.match(this.choixM)) && (this.voyage.match(this.choixV))) {
                    console.log('********** Voyage Moto ***********');
                    this.mode = 1;
                    this.showV = true;
                    this.showM = true;
                    this.trajetMV();
                } else {
                    console.log('********** Trajets disponibles ***********');
                    this.showA = true;
                    this.showV = true;
                    this.failSearchAlert();
                }
            }
        }

    }

    showInfoS(d: object) {
        let dataTest: any;
        this.informationsSuppService.getAllByUD(d[0].idUtilisateur, d[0].idAnnonce).subscribe(data => {
            dataTest = data;
            if (Object.keys(data).length) {
                dataTest.forEach(info => {
                    if (Object.keys(info).length) {
                        for (let inf of this.infoSups) {
                            if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                                let ico = {
                                    id: info.valueOf().idDemande,
                                    val: {val2: inf.iconeInformationsSupplementaires,}
                                };
                                this.icones.push(ico);
                                d[4] = this.icones;
                            }
                        }

                    } else {
                        d[4] = [];
                    }
                });
            } else {
            }
        });
        this.icones = [];

    }

    async failSearchAlert() {
        let alert = await this.alertCtrl.create({
            header: 'Résultat',
            message: 'Aucun résultat ne correspond à votre recherche, ' +
                'veuillez donc consulter la liste des demandes disponibles!',
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

    async failSearch() {
        let alert = await this.alertCtrl.create({
            header: 'Aucun résultat',
            message: 'Aucune demande de covoiturage disponiblee!',
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

    getAll() {
        this.demandeService.getAllWUAIAv().subscribe(data => {
            this.demandesWUAIAv = data;
            if (this.demandesWUAIAv.length > 0) {
                for (let a of this.demandesWUAIAv) {
                    this.demandes = a[0];
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
            }
            else {
                this.failSearch();
            }
        });
    }

    checkMode() {
        // console.log(this.mode);
        if(this.mode == 4) {
            return false;
        } else {
            return true;
        }
    }

    back() {
        this.mode = 1;
        if (localStorage.getItem('posD') !== null && !(localStorage.getItem('posD').indexOf(undefined) >= 0)) {
            localStorage.removeItem('posD');
            localStorage.removeItem('posA');
        }
    }

    backInfo() {
        this.mode = 4;
        if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
            this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
        } else {
            if (this.annonce.lieuDepart !== null || this.annonce.lieuArrivee) {
                this.loadMapWGeocode(this.annonce.lieuDepart, this.annonce.lieuArrivee);
            } else if (this.annonce.depart !== null || this.annonce.destination) {
                this.loadMapWGeocode(this.annonce.depart, this.annonce.destination);
            }
        }
    }

    backRecherche() {
        this.mode = 2;
    }

    prec() {
        if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixU)) || (this.showA && this.showU)) {
            console.log('******* Retour Conducteur Auto Urbain (consultation) ******');
            this.router.navigate(['engin', 'U', 'c']);
        } else if ((this.engin?.match(this.choixA) && this.voyage?.match(this.choixV)) || (this.showA && this.showV)) {
            console.log('******* Retour Conducteur Auto Voyage (consultation) ******');
            this.router.navigate(['engin', 'V', 'c']);
        } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixU)) || (this.showM && this.showU)) {
            console.log('******* Retour Conducteur Moto Urbain (consultation) ******');
            this.router.navigate(['engin', 'U', 'c']);
        } else if ((this.engin?.match(this.choixM) && this.voyage?.match(this.choixV)) || (this.showM && this.showV)) {
            console.log('******* Retour Conducteur Moto Voyage (consultation) ******');
            this.router.navigate(['engin', 'V', 'c']);
        }
    }

    /************************ Trajets ******************/

    trajetAV() {
        this.demandeService.getAllAV().subscribe(data => {
            this.demandesWUAIAv = data;
            if (this.demandesWUAIAv.length > 0) {
                for (let a of this.demandesWUAIAv) {
                    let p = a[1].photo;
                    if (p != null) {
                        this.images = this.utilisateurService.fileUrl + p;
                    }
                    this.demandes = a[0];
                    this.annonces = a[0];
                    this.itineraires = a[2];
                    this.showInfoS(a);
                }
            } else {
                this.failSearchAlert();
            }
        });
    }

    trajetAU() {
        this.demandeService.getAllAU().subscribe(data => {
            this.demandesWUAIAv = data;
            if (this.demandesWUAIAv.length > 0) {
                for (let a of this.demandesWUAIAv) {
                    let p = a[1].photo;
                    if (p != null) {
                        this.images = this.utilisateurService.fileUrl + p;
                    }
                    this.demandes = a[0];
                    this.annonces = a[0];
                    this.itineraires = a[2];

                    this.showInfoS(a);
                }
            } else {
                this.failSearchAlert();
            }

        });
    }

    trajetMU() {
        this.demandeService.getAllMU().subscribe(data => {
            this.demandesWUAIAv = data;
            if (this.demandesWUAIAv.length > 0) {
                for (let a of this.demandesWUAIAv) {
                    let p = a[1].photo;
                    if (p != null) {
                        this.images = this.utilisateurService.fileUrl + p;
                    }
                    this.demandes = a[0];
                    this.annonces = a[0];
                    this.itineraires = a[2];
                    this.showInfoS(a);
                }
            } else {
                this.failSearchAlert();
            }
        });
    }

    trajetMV() {
        this.demandeService.getAllMV().subscribe(data => {
            this.demandesWUAIAv = data;
            if (this.demandesWUAIAv.length > 0) {
                for (let a of this.demandesWUAIAv) {
                    let p = a[1].photo;
                    if (p != null) {
                        this.images = this.utilisateurService.fileUrl + p;
                    }
                    this.demandes = a[0];
                    this.annonces = a[0];
                    this.itineraires = a[2];

                    this.showInfoS(a);
                }
            } else {
                this.failSearchAlert();
            }
        });
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
                    this.trajetsBPrA();
                } else if (id == 2) {
                    console.log('************* Par prix descendant ************');
                    this.trajetsBPrD();
                } else {
                    if (id == 3) {
                        console.log('************* Par place ascendante ************');
                        this.trajetsBPlA();
                    } else if (id == 4) {
                        console.log('************* Par place descendante ************');
                        this.trajetsBPlD();
                    } else {
                        if (id == 5) {
                            console.log('************* Par date ascendante ************');
                            this.trajetsBDepA();
                        } else {
                            console.log('************* Par date descendante ************');
                            this.trajetsBDepD();
                        }
                    }
                }
            }
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

    loadMap(depart, destination) {
        console.log('Depart: ' + depart);
        console.log('Destination: ' + destination);
        let directionsService = new google.maps.DirectionsService();
        let directionsDisplay = new google.maps.DirectionsRenderer();

        const map = new google.maps.Map(document.getElementById('mapDP'), {
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

        const map = new google.maps.Map(document.getElementById('mapDP'), {
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

    showTrajetForValidate(d: any) {
        console.log(d);
        this.mode = 4;
        this.demande = d[0];
        this.annonce = d[0];
        this.utilisateur = d[1];
        this.photo = this.utilisateurService.fileUrl + this.utilisateur.photo;
        this.itineraire = d[2];
        this.avi = d[3];
        this.platform.ready().then(() => {
            if (this.itineraire.positionDepart !== null || this.itineraire.positionArrivee !== null) {
                this.loadMap(this.itineraire.positionDepart, this.itineraire.positionArrivee);
            } else {
                if (this.annonce.lieuDepart !== null || this.annonce.lieuArrivee) {
                    this.loadMapWGeocode(this.annonce.lieuDepart, this.annonce.lieuArrivee);
                } else if (this.annonce.depart !== null || this.annonce.destination) {
                    this.loadMapWGeocode(this.annonce.depart, this.annonce.destination);
                }
            }

        });
        this.informationsSuppService.getAllByUD(this.annonce.idUtilisateur, this.annonce.idAnnonce).subscribe((data: any) => {
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
            console.log(this.infoSup);
          });

    }

    /***************** Informations du passager **************/

    showInfoPassager(u: UtilisateurDto, a: Annonce) {
        this.mode = 5;
        this.photo = this.utilisateurService.fileUrl + u.photo;
        this.enginService.getAllByUAndA(u.idUtilisateur, a.idAnnonce).subscribe(data => {
            this.engins = data;
        });
        this.avisService.getAllForU(u.idUtilisateur).subscribe(data => {
            this.avis = data;
        });

        this.typeAvisService.getAllByU(u.idUtilisateur).subscribe(data => {
            this.typeAvis.push(data);
            for (let t of this.typeAvis) {
                let n = {note: t.note};
                this.typeAvisTotal.push(n);
            }
            console.log(this.total);
        });

        for (let t of this.typeAvisTotal) {
            this.total += t.note / 5;
        }
        /****** Pour vérifier la validation des informations du conducteur ******/
        this.userService.getByEmail(u.email).subscribe(data => {
            this.user = data;
        })
    }

    /*********************** Fin ******************/

    async showToast() {
        const toast = await this.toastCtrl.create({
            message: 'Trajet accepté avec succès',
            color: "success",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    async showToastFailed() {
        const toast = await this.toastCtrl.create({
            message: 'Trajet non validé, veuillez ré-essayer',
            color: "danger",
            duration: 2000,
            position: "middle"
        });
        await toast.present();
    }

    valider(u: UtilisateurDto, d: Demande, i: Itineraire) {
        console.log('******** Acceptation de la demande de covoiturage ********');
        /*let a = {0: this.id, 1: d, 2: i, 3: this.avi};
        this.router.navigate(['reservation'], {state: {detailT: a}});*/
        this.buttonSaveClicked = true;
        this.push.idU = this.utilisateur.idUtilisateur;
        this.push.message = 'Un conducteur a accepté votre demande de trajet';
        this.push.action = 'Reserver';

        this.pushData = {0: this.id, 1: d, 2: i, 3: this.avi};
        this.push.data = JSON.stringify(this.pushData);
        this.notificationService.sendNotifToOne(this.push).subscribe(res => {
            if (res.status == 200) {
                this.buttonSaveClicked = false;
                this.mode = 1;
                this.showToast();
            } else {
                this.buttonSaveClicked = false;
                this.showToastFailed();
            }
        });
    }

    trajetsBPrA() {
        this.demandeService.getAllByPriceAsc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];

                this.showInfoS(d);
            }
        });
    }

    trajetsBPrD() {
        this.demandeService.getAllByPriceDesc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];
                ;
                this.showInfoS(d);
            }
        });
    }

    trajetsBPlA() {
        this.demandeService.getAllByPlaceAsc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];

                this.showInfoS(d);
            }
        });
    }

    trajetsBPlD() {
        this.demandeService.getAllByPlaceDesc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];

                this.showInfoS(d);
            }
        });
    }

    trajetsBDepA() {
        this.demandeService.getAllByDateAsc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];

                this.showInfoS(d);
            }
        });
    }

    trajetsBDepD() {
        this.demandeService.getAllByDateDesc().subscribe(data => {
            this.demandesWUAIAv = data;
            for (let d of this.demandesWUAIAv) {
                this.demandes = d[0];
                this.annonces = d[0];
                let p = d[1].photo;
                if (p != null) {
                    let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                    this.images = sanitizedUrl;
                }
                this.utilisateurs = d[1];
                this.itineraires = d[2];

                this.showInfoS(d);
            }
        });
    }

    /*************************************************==== Recherche ====*********************************************/

    showRecherche() {
        this.mode = 2;
    }

    nextRecherche() {
        this.mode = 3;
    }

    rechercher() {
        console.log(this.recherche);
        this.rechercheService.getAllDWFilters(this.recherche).subscribe(data => {
            if (data) {
                this.mode = 1;
                this.demandesWUAIAv = data;
            } else {
                this.failRechercheAlert();
                this.mode = 2;
            }
        });
    }

    async failRechercheAlert() {
        let alert = await this.alertCtrl.create({
            header: 'Alerte',
            message: 'Aucun résultat ne correspond à votre demande, ' +
                'veuillez modifier vos critères de recherche!',
            translucent: true,
            animated: true,
            buttons: [{
                text: 'Ok',
                handler: (data) => {
                    this.getAll();
                }
            }]
        });
        await alert.present();
    }

    /***************** Pour ré-initialiser les champs ************/
    initialise() {
        this.recherche = new Recherche();
        this.dateD = null;
        this.dateAr = null;
        this.heureD = null;
        this.heureAr = null;
        this.motD = null;
        this.motA = null;
        this.prix = null;
        this.enableRadioD1 = false;
        this.enableRadioD2 = false;
        this.enableRadioA1 = false;
        this.enableRadioA2 = false;
        this.enableSpring = false;
        this.enableNSpring = false;
        this.enableSmoke = false;
        this.enableNSmoke = false;
        this.enableAnimal = false;
        this.enableNAnimal = false;
        this.totalFiltre = 0;


    }

    selectRP(e: any) {
        if (e.detail.value > 0) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        this.recherche.nombrePersonne = e.detail.value;
    }

    /********** Pour récupérer les sélections des critères *********/
    getCityD(e: any) {
        if (e.target.value == 1) {
            this.enableRadioD1 = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.recherche.lieuDepart = null;
            this.enableRadioD1 = true;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
    }

    getCityA(e: any) {
        if (e.target.value == 1) {
            this.enableRadioA1 = false;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.recherche.lieuArrivee = null;
            this.enableRadioA1 = true;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
    }

    getPrice(e: any) {
        this.recherche.prix = e.target.value;
        this.prix = e.target.value;
        if (e.target.value > 0) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
    }

    getBag(e: any) {
        if (e.target.value == 2) {
            this.recherche.codeInformationsSupplementaires1 = 3;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        } else {
            this.recherche.codeInformationsSupplementaires1 = 4;
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        return this.recherche.codeInformationsSupplementaires1;
    }

    getSmoke(e: any) {
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

        console.log(this.datePipe.transform(e.target.value, 'yyyy-MM-dd'));
        this.recherche.dateDepart = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        return this.dateD = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
    }

    getDateAr(e: any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateArr = true;
        }
        if (e.target.value != null && e.target.value < this.recherche.dateDepart) {
            this.errorDate = "La date d'arrivée ne peut être inférieure à celle de départ";
            this.showButton = true;
        } else {
            this.showButton = false;
            this.recherche.dateArrivee = this.datePipe.transform(e.target.value, 'yyyy-MM-dd');
        }
        return this.dateAr = this.datePipe.transform(e.target.value, 'EE dd MMM', 'fr-FR');
    }

    allAdresseD(e: any) {
        if (e.target.value == 2) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateDep = false;
            this.recherche.dateDepart = null;
            this.dateD = null;
        }
    }

    allAdresseA(e: any) {
        if (e.target.value == 2) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
            this.dateArr = false;
            this.recherche.dateArrivee = null;
            this.dateAr = null;
        }
    }

    getHeureDep(e: any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        this.recherche.heureDepart = this.datePipe.transform(e.target.value, 'HH:mm');
        return this.heureD = this.datePipe.transform(e.target.value, 'HH:mm');
    }

    getHeureAr(e: any) {
        if (e.target.value != null) {
            this.totalFiltre = this.totalFiltre != 0 ? this.totalFiltre++ : 1;
        }
        this.recherche.heureArrivee = this.datePipe.transform(e.target.value, 'HH:mm');
        return this.heureAr = this.datePipe.transform(e.target.value, 'HH:mm');
    }

    /**************************************** Fin ***************************************/

}
