import {Component, OnInit} from '@angular/core';
import {Geolocation} from "@ionic-native/geolocation/ngx";
import {Router} from "@angular/router";
import {Annonce} from "../annonce/annonce.model";
import {UtilisateurDto} from "../utilisateur/utilisateur.model";
import {Itineraire} from "../itineraire/itineraire.model";
import {InformationsSupplementaires} from "../informations-supplementaires/informations-supplementaires.model";
import {DomSanitizer} from "@angular/platform-browser";
import {AnnonceService} from "../annonce/annonce.service";
import {UtilisateurService} from "../utilisateur/utilisateur.service";
import {ItineraireService} from "../itineraire/itineraire.service";
import {InformationsSupplementairesService} from "../informations-supplementaires/informations-supplementaires.service";
import {NavController, Platform} from "@ionic/angular";
import {
    GoogleMap,
    GoogleMaps, GoogleMapsAnimation,
    GoogleMapsEvent,
    HtmlInfoWindow,
    Marker
} from "@ionic-native/google-maps";


/******** Pour la carte ******/
declare var google;

@Component({
    selector: 'app-trajet-carte',
    templateUrl: './trajet-carte.page.html',
    styleUrls: ['./trajet-carte.page.scss'],
})
export class TrajetCartePage implements OnInit {

    lat: number;
    long: number;
    showDetails: boolean = false;
    id: number = 0;
    idTF: number = 0;
    dateA: string;
    images: any;
    icones: any;
    photo: any;

    annoncesWUAIAv: any;
    annoncesWUAIAvObj: any;
    annonces: Annonce;
    utilisateurs: UtilisateurDto;
    itineraires: Itineraire;

    annonce: Annonce;
    utilisateur: UtilisateurDto;
    itineraire: Itineraire;

    infoSupps: InformationsSupplementaires;
    infoSups: InformationsSupplementaires[] = [];
    infoSup: InformationsSupplementaires[] = new Array();

    map: GoogleMap;


    constructor(
        private navCtrl: NavController,
        private annonceService: AnnonceService,
        private utilisateurService: UtilisateurService,
        private itineraireService: ItineraireService,
        private informationsSuppService: InformationsSupplementairesService,
        private geolocation: Geolocation,
        private router: Router,
        private sanitizer: DomSanitizer,
        public platform: Platform
    ) {
    }


    ngOnInit() {
        this.getLocation();
        this.infoSups = this.informationsSuppService.infoSupplementaires;
        if (this.router.getCurrentNavigation().extras.state) {
            this.annoncesWUAIAv = this.router.getCurrentNavigation().extras.state.data;
            this.platform.ready().then(() => this.loadMapT(this.annoncesWUAIAv));
        } else {
        }
    }

    /************** Test  avec les marqueurs et fenêtre ************/
    showReservation(d: any) {
        this.router.navigate(['reservation'], {state: {data: d}});
    }

    loadMapT(data: any) {
        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            const map = new google.maps.Map(document.getElementById('mapL'), {
                center: {lat: resp.coords.latitude, lng: resp.coords.longitude},
                zoom: 5
            });

            for (let a of data) {
                const marker = new google.maps.Marker({
                    'position': {lat: a[2].latitude, lng: a[2].longitude},
                    map,
                });
                let contentString = '';
                if (a[0].depart != null) {
                    contentString = `
        <div>
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].depart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].destination + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
                } else {
                    contentString = `
        <div>
        <p class="name h6">Conducteur: <strong>` + a[1].nom + ` ` + a[1].prenom + `</strong></p>
        <label class="depart h6">Départ: <strong>` + a[0].lieuDepart + `</strong></label> <br>
        <label class="depart h6">Arrivée: <strong>` + a[0].lieuArrivee + `</strong></label> <br>
        <label class="date h6">Date: <strong>` + a[0].dateDepart + `</strong></label> <br>
        <p class="prix h6">Prix: <strong>` + a[0].prix + ` FCFA</strong></p>
        </div>`;
                }
                ;
                const infowindow = new google.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 200,
                });
                infowindow.open(map, marker);

                marker.addListener("click", () => {
                    infowindow.open(map, marker);
                    this.router.navigate(['demande', 'TC'], {state: {data: a, items: data}});
                });
            }

        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
        });


    }

    loadMap(data: any) {

        var options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
        this.geolocation.getCurrentPosition(options).then((resp) => {
            this.map = GoogleMaps.create('mapL', {
                camera: {
                    target: {lat: resp.coords.latitude, lng: resp.coords.longitude},
                    zoom: 16
                },
                'gestures': {
                    'scroll': true,
                    'tilt': true,
                    'rotate': true,
                    'zoom': true
                }

            });
        }).catch((error) => {
            console.log('Error getting location', error);
            alert("Impossible de récupérer les coordonnées géographiques");
        });

        let htmlInfoWindow = new HtmlInfoWindow();

        for (let a of data) {
            let frame: HTMLElement = document.createElement('div');
            if (a[0].depart !== null || a[0].destination !== null) {
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

    onMarkerClick(params: any) {
        let marker: Marker = <Marker>params[1];
        let iconData: any = marker.get('iconData');
        marker.setIcon(iconData);
    }


    back() {
        if (this.annoncesWUAIAv.length > 0) {
            this.router.navigate(['/demande'], {state: {annoncesWUAIAv: this.annoncesWUAIAv}});
        } else {
            this.router.navigate(['/demande']);
        }
    }

    showInfoSupps(idU: number, idA: number) {
        let dataTest: any;
        this.informationsSuppService.getAllByUAn(idU, idA).subscribe(data => {
            dataTest = data;
            dataTest.forEach(info => {
                for (let inf of this.infoSups) {
                    if (info.valueOf().libelleInformationsSupplementaires.match(inf.libelleInformationsSupplementaires)) {
                        this.icones.push(inf.iconeInformationsSupplementaires);
                    }
                }
            })
        });
        console.log(this.icones);
    }

    getLocation() {
        this.annoncesWUAIAv = this.router.getCurrentNavigation().extras.state.data;
        for (let a of this.annoncesWUAIAv) {
            this.annonces = a[0];
            let p = a[1].photo;
            if (p != null) {
                let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.images = sanitizedUrl;
            }
            this.utilisateurs = a[1];
            this.itineraires = a[2];
        }
    }

    showTrajetDetails(d: any) {
        this.showDetails = true;
        this.annoncesWUAIAvObj = d;
        if (this.annoncesWUAIAvObj != null) {
            this.annonce = this.annoncesWUAIAvObj[0];
            let p = this.annoncesWUAIAvObj[1].photo;
            if (p != null) {
                let sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(this.utilisateurService.fileUrl + p);
                this.images = sanitizedUrl;
            }
            this.utilisateur = this.annoncesWUAIAvObj[1];
            this.itineraire = this.annoncesWUAIAvObj[2];
        }
    }


}
